import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { isDemoMode } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Razorpay webhook — the source of truth for payment state. Handles the
 * "customer paid but closed the tab" case that the client-side handler misses.
 * Idempotent via the payment_events.event_id unique constraint.
 */
export async function POST(request: NextRequest) {
  if (isDemoMode() || !process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature || !(await verifyWebhookSignature(rawBody, signature))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const eventId = request.headers.get("x-razorpay-event-id") ?? "";
  const event = JSON.parse(rawBody);
  const supabase = createSupabaseAdminClient();

  // Idempotency: a repeated delivery hits the unique constraint and no-ops.
  const { error: insertError } = await supabase
    .from("payment_events")
    .insert({ event_id: eventId, payload: event });
  if (insertError?.code === "23505") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const razorpayOrderId: string | undefined =
    event?.payload?.payment?.entity?.order_id ??
    event?.payload?.order?.entity?.id;

  if (razorpayOrderId) {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "received",
          razorpay_payment_id: event?.payload?.payment?.entity?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpayOrderId)
        .eq("status", "pending_payment");
    } else if (event.event === "payment.failed") {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpayOrderId)
        .eq("payment_status", "unpaid");
    }
  }

  return NextResponse.json({ ok: true });
}
