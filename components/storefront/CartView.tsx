"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cartSubtotal, useCart } from "@/lib/cart";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, setQty, remove } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-6xl">🧺</p>
        <p className="font-display mt-4 text-xl font-semibold text-cocoa">
          {t("empty")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-caramel px-6 py-3 text-sm font-bold text-white transition-transform active:scale-95"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-center gap-4 rounded-card bg-white p-4 shadow-warm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-cocoa">
                {lt(item.name, locale)}
              </p>
              {item.customization?.message && (
                <p className="truncate text-xs text-cocoa-light">
                  ✍️ “{item.customization.message}”
                </p>
              )}
              <p className="mt-0.5 text-sm text-cocoa-light">
                {formatPaise(item.unit_price)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQty(item.key, item.qty - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-deep font-bold text-cocoa transition-transform active:scale-90"
                aria-label="decrease"
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
              <button
                onClick={() => setQty(item.key, item.qty + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-deep font-bold text-cocoa transition-transform active:scale-90"
                aria-label="increase"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-display font-bold text-cocoa">
              {formatPaise(item.unit_price * item.qty)}
            </p>
            <button
              onClick={() => remove(item.key)}
              className="text-cocoa-light transition-colors hover:text-berry"
              aria-label={t("remove")}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="rounded-card bg-white p-5 shadow-warm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-cocoa-light">{t("subtotal")}</span>
          <span className="font-display text-2xl font-bold text-cocoa">
            {formatPaise(subtotal)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block w-full rounded-full bg-caramel py-3.5 text-center text-sm font-bold text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98]"
        >
          {t("checkout")} →
        </Link>
      </div>
    </div>
  );
}
