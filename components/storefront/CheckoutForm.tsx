"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cartSubtotal, useCart } from "@/lib/cart";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";
import { confirmPayment, placeOrder } from "@/lib/orders";
import type { DeliveryZone, FulfillmentType, PaymentMethod, PlacedOrder } from "@/lib/types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function saveLocalOrder(order: PlacedOrder) {
  try {
    const all = JSON.parse(localStorage.getItem("sb-orders") ?? "{}");
    all[order.order_number] = order;
    localStorage.setItem("sb-orders", JSON.stringify(all));
  } catch {
    // localStorage unavailable — confirmation page will show a fallback
  }
}

export function CheckoutForm({
  zones,
  razorpayEnabled,
}: {
  zones: DeliveryZone[];
  razorpayEnabled: boolean;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return null;
  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const subtotal = cartSubtotal(items);
  const zone = zones.find((z) => z.id === zoneId);
  const deliveryFee =
    fulfillment === "delivery" && zone
      ? zone.free_above != null && subtotal >= zone.free_above
        ? 0
        : zone.fee
      : 0;
  const total = subtotal + deliveryFee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await placeOrder({
      customer_name: name,
      customer_phone: phone,
      locale,
      fulfillment_type: fulfillment,
      delivery_zone_id: fulfillment === "delivery" ? zoneId : undefined,
      address_text: fulfillment === "delivery" ? address : undefined,
      landmark: landmark || undefined,
      payment_method: payment,
      customer_note: note || undefined,
      items: items.map((i) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        qty: i.qty,
        customization: i.customization,
      })),
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const { order } = result;
    saveLocalOrder(order);
    const orderUrl = `/order/${order.order_number}?t=${order.access_token}`;

    if (result.razorpay && window !== undefined) {
      // Load checkout.js only on the online-payment path.
      await new Promise<void>((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Payment library failed to load"));
        document.body.appendChild(script);
      });
      const rzp = new window.Razorpay!({
        key: result.razorpay.key_id,
        order_id: result.razorpay.order_id,
        amount: result.razorpay.amount,
        currency: "INR",
        name: "Sethi Bakery",
        description: order.order_number,
        prefill: { name, contact: `+91${phone}` },
        theme: { color: "#C68A4B" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await confirmPayment(response);
          clear();
          router.push(orderUrl);
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
      return;
    }

    clear();
    router.push(orderUrl);
  }

  const inputCls =
    "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-caramel";

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        {/* Contact */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cocoa-light">
            {t("yourDetails")}
          </h2>
          <div className="space-y-3">
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name")}
              className={inputCls}
            />
            <div>
              <div className="flex">
                <span className="flex items-center rounded-l-xl border border-r-0 border-cocoa/15 bg-cream-deep px-3 text-sm font-semibold text-cocoa-light">
                  +91
                </span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder={t("phone")}
                  className={`${inputCls} rounded-l-none`}
                />
              </div>
              <p className="mt-1.5 text-xs text-cocoa-light">{t("phoneHint")}</p>
            </div>
          </div>
        </section>

        {/* Fulfillment */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cocoa-light">
            {t("fulfillment")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { type: "pickup" as const, title: t("pickup"), text: t("pickupText") },
                { type: "delivery" as const, title: t("delivery"), text: zone ? lt(zone.name, locale) : "" },
              ]
            ).map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setFulfillment(opt.type)}
                className={`rounded-card border p-4 text-left transition-all active:scale-[0.98] ${
                  fulfillment === opt.type
                    ? "border-caramel bg-white shadow-warm"
                    : "border-cocoa/10 bg-white/60"
                }`}
                aria-pressed={fulfillment === opt.type}
              >
                <span className="block font-semibold text-cocoa">
                  {opt.type === "pickup" ? "🏪 " : "🛵 "}
                  {opt.title}
                </span>
                <span className="mt-1 block text-xs text-cocoa-light">{opt.text}</span>
              </button>
            ))}
          </div>

          {fulfillment === "delivery" && (
            <div className="mt-4 space-y-3">
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className={inputCls}
                aria-label={t("zone")}
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {lt(z.name, locale)} — {z.fee === 0 ? t("free") : formatPaise(z.fee)}
                    {z.free_above != null
                      ? ` (${t("free")} > ${formatPaise(z.free_above)})`
                      : ""}
                  </option>
                ))}
              </select>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("address")}
                rows={2}
                className={inputCls}
              />
              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={t("landmark")}
                className={inputCls}
              />
            </div>
          )}
        </section>

        {/* Payment */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cocoa-light">
            {t("payment")}
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPayment("cod")}
              className={`w-full rounded-card border p-4 text-left transition-all ${
                payment === "cod"
                  ? "border-caramel bg-white shadow-warm"
                  : "border-cocoa/10 bg-white/60"
              }`}
              aria-pressed={payment === "cod"}
            >
              <span className="block font-semibold text-cocoa">💵 {t("cod")}</span>
              <span className="mt-1 block text-xs text-cocoa-light">{t("codText")}</span>
            </button>
            {razorpayEnabled && (
              <button
                type="button"
                onClick={() => setPayment("razorpay")}
                className={`w-full rounded-card border p-4 text-left transition-all ${
                  payment === "razorpay"
                    ? "border-caramel bg-white shadow-warm"
                    : "border-cocoa/10 bg-white/60"
                }`}
                aria-pressed={payment === "razorpay"}
              >
                <span className="block font-semibold text-cocoa">📱 {t("online")}</span>
                <span className="mt-1 block text-xs text-cocoa-light">{t("onlineText")}</span>
              </button>
            )}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("note")}
            rows={2}
            className={`${inputCls} mt-4`}
          />
        </section>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-card bg-white p-6 shadow-warm lg:sticky lg:top-24">
        <ul className="space-y-2 text-sm text-cocoa-light">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span className="truncate">
                {i.qty} × {lt(i.name, locale)}
              </span>
              <span className="shrink-0">{formatPaise(i.unit_price * i.qty)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-cocoa/10 pt-2">
            <span>{t("deliveryFee")}</span>
            <span>{deliveryFee === 0 ? t("free") : formatPaise(deliveryFee)}</span>
          </li>
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-cocoa/10 pt-4">
          <span className="font-semibold text-cocoa">{t("total")}</span>
          <span className="font-display text-2xl font-bold text-cocoa">
            {formatPaise(total)}
          </span>
        </div>
        {error && (
          <p className="mt-3 rounded-xl bg-berry/10 px-3 py-2 text-sm font-medium text-berry">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-caramel py-3.5 text-sm font-bold text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? t("placing") : `${t("placeOrder")} · ${formatPaise(total)}`}
        </button>
      </aside>
    </form>
  );
}
