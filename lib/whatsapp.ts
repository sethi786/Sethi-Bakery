import type { PlacedOrder } from "./types";
import { formatPaise } from "./money";

/**
 * wa.me deep link that pre-fills the order summary into the customer's
 * WhatsApp, addressed to the shop — the zero-cost order notification.
 */
export function orderWhatsAppLink(order: PlacedOrder, siteUrl: string): string {
  const phone = process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "";
  const lines = [
    `🧁 *New order — Sethi Bakery*`,
    `Order: ${order.order_number}`,
    `Name: ${order.customer_name} (${order.customer_phone})`,
    order.fulfillment_type === "delivery"
      ? `🛵 Delivery: ${order.address_text ?? ""}`
      : `🏪 Pickup at shop`,
    ``,
    ...order.items.map((i) => {
      const custom = i.customization;
      const extra = custom
        ? ` (${custom.breakdown[0]?.label ?? "custom"}${custom.message ? `, "${custom.message}"` : ""})`
        : "";
      return `• ${i.qty} × ${i.name}${extra} — ${formatPaise(i.line_total)}`;
    }),
    ``,
    `Total: *${formatPaise(order.total)}* (${order.payment_method === "cod" ? "Pay on delivery/pickup" : "Paid online"})`,
    `${siteUrl}/order/${order.order_number}?t=${order.access_token}`,
  ];
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
