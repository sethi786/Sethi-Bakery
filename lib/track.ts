"use server";

import { isDemoMode } from "./supabase/config";
import { createSupabaseAdminClient } from "./supabase/admin";
import type { PlacedOrder } from "./types";

/**
 * Public order lookup for /track: order number + the phone it was placed
 * with. No token needed — the phone number is the shared secret.
 */
export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<PlacedOrder | null> {
  if (isDemoMode()) return null; // demo orders live in the browser only

  const cleanNumber = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!/^SB-\d{6}-\d{3}$/.test(cleanNumber) || cleanPhone.length !== 10) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      `order_number, access_token, status, payment_method, subtotal,
       delivery_fee, total, customer_name, customer_phone, fulfillment_type,
       address_text, created_at,
       order_items ( name_snapshot, qty, unit_price, line_total, customization )`
    )
    .eq("order_number", cleanNumber)
    .eq("customer_phone", cleanPhone)
    .maybeSingle();
  if (!order) return null;

  return {
    ...order,
    items: order.order_items.map(
      (i: {
        name_snapshot: string;
        qty: number;
        unit_price: number;
        line_total: number;
        customization: PlacedOrder["items"][number]["customization"];
      }) => ({
        name: i.name_snapshot,
        qty: i.qty,
        unit_price: i.unit_price,
        line_total: i.line_total,
        customization: i.customization ?? undefined,
      })
    ),
  } as PlacedOrder;
}
