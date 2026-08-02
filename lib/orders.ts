"use server";

import { z } from "zod";
import {
  getCakeOptionGroups,
  getDeliveryZones,
  getProductsByIds,
} from "./catalog";
import { lt } from "./content";
import {
  MAX_CAKE_MESSAGE_LENGTH,
  priceCake,
  validateCakeSchedule,
} from "./pricing";
import {
  createRazorpayOrder,
  isRazorpayEnabled,
  verifyPaymentSignature,
} from "./razorpay";
import { isDemoMode } from "./supabase/config";
import { createSupabaseAdminClient } from "./supabase/admin";
import type { PlacedOrder } from "./types";

const customizationSchema = z.object({
  selections: z.record(z.string(), z.string()),
  message: z.string().max(MAX_CAKE_MESSAGE_LENGTH).optional(),
  scheduled_for: z.string().optional(),
  reference_image: z.string().optional(),
  breakdown: z.array(z.object({ label: z.string(), amount: z.number() })),
  total: z.number(),
});

const orderInputSchema = z.object({
  customer_name: z.string().min(2).max(80),
  customer_phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  locale: z.string().default("en"),
  fulfillment_type: z.enum(["pickup", "delivery"]),
  delivery_zone_id: z.string().optional(),
  address_text: z.string().max(300).optional(),
  landmark: z.string().max(120).optional(),
  scheduled_date: z.string().optional(),
  scheduled_slot: z.string().optional(),
  payment_method: z.enum(["cod", "razorpay"]),
  customer_note: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        variant_id: z.string().optional(),
        qty: z.number().int().min(1).max(50),
        customization: customizationSchema.optional(),
      })
    )
    .min(1),
});

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder; razorpay?: { order_id: string; key_id: string; amount: number } }
  | { ok: false; error: string };

function randomToken(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

function makeOrderNumber(now: Date): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `SB-${yy}${mm}${dd}-${rand}`;
}

/**
 * Places an order. Everything is re-priced server-side from IDs — client
 * prices are never trusted. Works in three modes:
 *  - demo (no Supabase): returns the order for client-side display only
 *  - COD: order recorded as `received`
 *  - razorpay: order recorded as `pending_payment` + Razorpay order created
 */
export async function placeOrder(raw: unknown): Promise<PlaceOrderResult> {
  const parsed = orderInputSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid order",
    };
  }
  const input = parsed.data;

  if (input.payment_method === "razorpay" && !isRazorpayEnabled()) {
    return { ok: false, error: "Online payment is not available right now. Please choose Cash on Delivery." };
  }
  if (input.fulfillment_type === "delivery" && !input.delivery_zone_id) {
    return { ok: false, error: "Please choose a delivery area." };
  }

  // ── Server-side repricing ────────────────────────────────────────────
  const products = await getProductsByIds(input.items.map((i) => i.product_id));
  const cakeGroups = await getCakeOptionGroups();

  let subtotal = 0;
  const pricedItems: PlacedOrder["items"] = [];

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product || product.stock_status !== "in_stock") {
      return { ok: false, error: "An item in your cart is no longer available." };
    }

    let unitPrice: number;
    let name = lt(product.name, input.locale);
    let customization = item.customization;

    if (product.product_type === "custom_cake") {
      if (!customization) {
        return { ok: false, error: "Cake customization missing." };
      }
      if (
        !customization.scheduled_for ||
        !validateCakeSchedule(customization.scheduled_for)
      ) {
        return {
          ok: false,
          error: "Custom cakes need at least 24 hours notice — please pick a later date.",
        };
      }
      const priced = priceCake(
        product,
        cakeGroups,
        customization.selections,
        input.locale
      );
      unitPrice = priced.total;
      customization = {
        ...customization,
        breakdown: priced.breakdown,
        total: priced.total,
      };
      name = `${name} (${priced.weightKg} kg)`;
    } else if (item.variant_id) {
      const variant = product.variants.find((v) => v.id === item.variant_id);
      if (!variant) return { ok: false, error: "Selected option is unavailable." };
      unitPrice = variant.price;
      name = `${name} — ${lt(variant.name, input.locale)}`;
    } else {
      if (product.base_price == null) {
        return { ok: false, error: "Please choose an option for this product." };
      }
      unitPrice = product.base_price;
    }

    const lineTotal = unitPrice * item.qty;
    subtotal += lineTotal;
    pricedItems.push({
      name,
      qty: item.qty,
      unit_price: unitPrice,
      line_total: lineTotal,
      customization,
    });
  }

  // ── Delivery fee ─────────────────────────────────────────────────────
  let deliveryFee = 0;
  if (input.fulfillment_type === "delivery") {
    const zones = await getDeliveryZones();
    const zone = zones.find((z) => z.id === input.delivery_zone_id);
    if (!zone) return { ok: false, error: "Please choose a valid delivery area." };
    deliveryFee =
      zone.free_above != null && subtotal >= zone.free_above ? 0 : zone.fee;
  }

  const total = subtotal + deliveryFee;
  const now = new Date();
  const order: PlacedOrder = {
    order_number: makeOrderNumber(now),
    access_token: randomToken(),
    status: input.payment_method === "razorpay" ? "pending_payment" : "received",
    payment_method: input.payment_method,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    items: pricedItems,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    fulfillment_type: input.fulfillment_type,
    address_text: input.address_text,
    created_at: now.toISOString(),
  };

  // ── Persist ──────────────────────────────────────────────────────────
  if (isDemoMode()) {
    return { ok: true, order: { ...order, demo: true } };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("create_order", {
    payload: {
      order,
      input: {
        locale: input.locale,
        delivery_zone_id: input.delivery_zone_id ?? null,
        landmark: input.landmark ?? null,
        scheduled_date: input.scheduled_date ?? null,
        scheduled_slot: input.scheduled_slot ?? null,
        customer_note: input.customer_note ?? null,
        items: input.items,
      },
    },
  });
  if (error) {
    console.error("create_order failed", error);
    return { ok: false, error: "Could not place the order. Please try again." };
  }

  if (input.payment_method === "razorpay") {
    const rz = await createRazorpayOrder({
      amountPaise: total,
      receipt: order.order_number,
    });
    await supabase
      .from("orders")
      .update({ razorpay_order_id: rz.id })
      .eq("order_number", order.order_number);
    return {
      ok: true,
      order,
      razorpay: { order_id: rz.id, key_id: rz.key_id, amount: total },
    };
  }

  return { ok: true, order };
}

/**
 * Client-side payment success handler. Marks the order provisionally paid;
 * the Razorpay webhook remains the source of truth.
 */
export async function confirmPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok: boolean }> {
  if (isDemoMode() || !isRazorpayEnabled()) return { ok: false };
  const valid = await verifyPaymentSignature(params);
  if (!valid) return { ok: false };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "received",
      razorpay_payment_id: params.razorpay_payment_id,
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", params.razorpay_order_id)
    .eq("status", "pending_payment");
  return { ok: !error };
}
