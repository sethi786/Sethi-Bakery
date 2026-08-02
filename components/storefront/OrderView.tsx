"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPaise } from "@/lib/money";
import { orderWhatsAppLink } from "@/lib/whatsapp";
import type { OrderStatus, PlacedOrder } from "@/lib/types";
import {
  IconCheck,
  IconPencil,
  IconSearch,
  IconWhatsApp,
} from "@/components/icons";

const STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

/**
 * Order confirmation + status. Server-persisted orders come in via props;
 * demo-mode orders are recovered from localStorage.
 */
export function OrderView({
  orderNumber,
  serverOrder,
}: {
  orderNumber: string;
  serverOrder: PlacedOrder | null;
}) {
  const t = useTranslations("order");
  const [order, setOrder] = useState<PlacedOrder | null>(serverOrder);

  useEffect(() => {
    if (serverOrder) return;
    try {
      const all = JSON.parse(localStorage.getItem("sb-orders") ?? "{}");
      if (all[orderNumber]) setOrder(all[orderNumber]);
    } catch {
      // no local copy
    }
  }, [orderNumber, serverOrder]);

  if (!order) {
    return (
      <div className="py-20 text-center text-cocoa-light">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cream-deep text-caramel">
          <IconSearch size={28} strokeWidth={1.4} />
        </span>
        <p className="mt-4 font-mono font-semibold">{orderNumber}</p>
      </div>
    );
  }

  const flow =
    order.fulfillment_type === "pickup"
      ? STATUS_FLOW.filter((s) => s !== "out_for_delivery")
      : STATUS_FLOW;
  const currentIndex = flow.indexOf(order.status);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const waLink = orderWhatsAppLink(order, siteUrl);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-card bg-white p-8 text-center shadow-warm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pistachio/15 text-pistachio">
          <IconCheck size={32} strokeWidth={2.4} />
        </div>
        <h1 className="font-display mt-4 text-2xl font-bold text-cocoa">
          {t("thanks", { name: order.customer_name.split(" ")[0] })}
        </h1>
        <p className="mt-1 text-cocoa-light">{t("confirmed")}</p>
        <p className="mt-4 inline-block rounded-full bg-cream-deep px-4 py-1.5 font-mono text-sm font-bold tracking-wider text-cocoa">
          {order.order_number}
        </p>

        {order.demo && (
          <p className="mt-4 rounded-xl bg-gold-light/60 px-4 py-2.5 text-xs font-medium text-cocoa">
            {t("demoNote")}
          </p>
        )}

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-warm transition-transform active:scale-[0.98]"
        >
          <IconWhatsApp size={18} />
          {t("sendWhatsApp")}
        </a>
        <p className="mt-2 text-xs text-cocoa-light">{t("whatsAppHint")}</p>
      </div>

      {/* Status timeline */}
      <div className="rounded-card bg-white p-6 shadow-warm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cocoa-light">
          {t("status")}
        </h2>
        <ol className="space-y-0">
          {flow.map((status, i) => {
            const done = i <= currentIndex;
            const isLast = i === flow.length - 1;
            return (
              <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute left-[11px] top-6 h-full w-0.5 ${
                      i < currentIndex ? "bg-pistachio" : "bg-cocoa/10"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-pistachio text-white" : "bg-cocoa/10 text-cocoa-light"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm ${done ? "font-semibold text-cocoa" : "text-cocoa-light"}`}
                >
                  {t(`statuses.${status}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Items */}
      <div className="rounded-card bg-white p-6 shadow-warm">
        <ul className="space-y-3 text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              <div className="flex justify-between gap-3">
                <span className="font-medium text-cocoa">
                  {item.qty} × {item.name}
                </span>
                <span className="shrink-0 font-semibold text-cocoa">
                  {formatPaise(item.line_total)}
                </span>
              </div>
              {item.customization?.message && (
                <p className="flex items-center gap-1.5 text-xs text-cocoa-light">
                  <IconPencil size={11} className="shrink-0" />“
                  {item.customization.message}”
                </p>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-cocoa/10 pt-3 text-sm text-cocoa-light">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPaise(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{order.delivery_fee === 0 ? "—" : formatPaise(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between pt-1 font-display text-lg font-bold text-cocoa">
            <span>Total</span>
            <span>{formatPaise(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
