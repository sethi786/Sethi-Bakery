"use client";

import { useState } from "react";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

export function VariantPicker({
  product,
  locale,
  labels,
  simple = false,
}: {
  product: Product;
  locale: string;
  labels: { add: string; added: string; outOfStock: string };
  simple?: boolean;
}) {
  const [variantId, setVariantId] = useState(
    (product.variants.find((v) => v.is_default) ?? product.variants[0])?.id
  );
  const variant = product.variants.find((v) => v.id === variantId) ?? null;

  if (product.stock_status === "out_of_stock") {
    return (
      <span className="rounded-full bg-cocoa/10 px-5 py-2.5 text-sm font-semibold text-cocoa-light">
        {labels.outOfStock}
      </span>
    );
  }

  if (simple) {
    return (
      <AddToCartButton
        product={product}
        variant={null}
        locale={locale}
        labels={labels}
        className="!px-6 !py-3 !text-sm"
      />
    );
  }

  return (
    <div className="rounded-card bg-white p-5 shadow-warm">
      <div className="flex flex-wrap gap-2">
        {product.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariantId(v.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
              v.id === variantId
                ? "border-cocoa bg-cocoa text-cream"
                : "border-cocoa/15 text-cocoa hover:border-caramel"
            }`}
            aria-pressed={v.id === variantId}
          >
            {lt(v.name, locale)} · {formatPaise(v.price)}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-2xl font-bold text-cocoa">
          {variant ? formatPaise(variant.price) : ""}
        </span>
        <AddToCartButton
          product={product}
          variant={variant}
          locale={locale}
          labels={labels}
          className="!px-6 !py-3 !text-sm"
        />
      </div>
    </div>
  );
}
