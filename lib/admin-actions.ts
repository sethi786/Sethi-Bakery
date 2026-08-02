"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { createSupabaseAdminClient } from "./supabase/admin";
import { isDemoMode } from "./supabase/config";
import type { OrderStatus } from "./types";

/** Throws unless the request comes from a signed-in shop member. */
async function requireMember(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data: membership } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) throw new Error("Not a shop member");
  return membership.shop_id;
}

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin/orders");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export async function advanceOrderStatus(orderId: string) {
  if (isDemoMode()) return;
  await requireMember();
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, fulfillment_type")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const flow =
    order.fulfillment_type === "pickup"
      ? STATUS_FLOW.filter((s) => s !== "out_for_delivery")
      : STATUS_FLOW;
  const index = flow.indexOf(order.status as OrderStatus);
  const next = flow[index + 1];
  if (!next) return;

  await admin
    .from("orders")
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  await admin.from("order_events").insert({
    order_id: orderId,
    from_status: order.status,
    to_status: next,
    actor: "admin",
  });
  revalidatePath("/admin/orders");
}

export async function toggleStock(productId: string, inStock: boolean) {
  if (isDemoMode()) return;
  await requireMember();
  const admin = createSupabaseAdminClient();
  await admin
    .from("products")
    .update({ stock_status: inStock ? "in_stock" : "out_of_stock" })
    .eq("id", productId);
  revalidatePath("/admin/products");
}
