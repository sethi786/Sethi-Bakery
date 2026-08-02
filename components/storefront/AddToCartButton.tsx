"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product, ProductVariant } from "@/lib/types";

export function AddToCartButton({
  product,
  variant,
  locale,
  labels,
  className = "",
}: {
  product: Product;
  variant: ProductVariant | null;
  locale: string;
  labels: { add: string; added: string };
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [flash, setFlash] = useState(false);

  const price = variant?.price ?? product.base_price;
  if (price == null) return null;

  return (
    <button
      onClick={() => {
        add({
          key: variant ? `${product.id}:${variant.id}` : product.id,
          product_id: product.id,
          variant_id: variant?.id,
          name: variant
            ? { en: `${product.name.en} — ${variant.name.en}` }
            : product.name,
          unit_price: price,
          qty: 1,
        });
        setFlash(true);
        setTimeout(() => setFlash(false), 1200);
      }}
      className={`rounded-full px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-95 ${
        flash ? "bg-pistachio" : "bg-cocoa hover:bg-cocoa-light"
      } ${className}`}
    >
      {flash ? `✓ ${labels.added}` : labels.add}
    </button>
  );
}
