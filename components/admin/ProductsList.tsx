"use client";

import { useMemo, useState } from "react";
import { formatPaise } from "@/lib/money";
import { toggleStock } from "@/lib/admin-actions";
import type { AdminProductRow } from "@/lib/admin-data";
import type { Category } from "@/lib/types";

function storagePublicUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

export function ProductsList({
  products,
  categories,
  demo,
}: {
  products: AdminProductRow[];
  categories: Category[];
  demo: boolean;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    let items = products.filter((p) => p.stock_status !== "hidden");
    if (categoryId) items = items.filter((p) => p.category_id === categoryId);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((p) =>
        Object.values(p.name).some((n) => n?.toLowerCase().includes(q))
      );
    }
    return items;
  }, [products, categoryId, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items…"
        className="w-full rounded-full border border-cocoa/15 bg-white px-5 py-3 text-sm outline-none transition-colors focus:border-caramel"
      />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryId(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            !categoryId ? "bg-cocoa text-cream" : "bg-white text-cocoa-light shadow-warm"
          }`}
        >
          All ({products.filter((p) => p.stock_status !== "hidden").length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id === categoryId ? null : c.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              categoryId === c.id
                ? "bg-cocoa text-cream"
                : "bg-white text-cocoa-light shadow-warm"
            }`}
          >
            {c.name.en}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {visible.length === 0 && (
          <p className="rounded-card bg-white p-6 text-center text-sm text-cocoa-light shadow-warm">
            No items found.
          </p>
        )}
        {visible.map((product) => {
          const status = optimistic[product.id] ?? product.stock_status;
          const inStock = status === "in_stock";
          const thumb = product.images[0]?.thumb_path;
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-card bg-white p-3 shadow-warm"
            >
              <a
                href={`/admin/products/${product.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                {thumb ? (
                  <img
                    src={storagePublicUrl(thumb)}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-xs font-bold text-caramel">
                    {product.name.en.charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-cocoa">
                    {product.name.en}
                  </span>
                  <span className="text-xs text-cocoa-light">
                    {product.base_price != null
                      ? formatPaise(product.base_price) +
                        (product.product_type === "custom_cake" ? " / kg" : "")
                      : "Variants"}
                    {product.is_featured ? " · Best seller" : ""}
                  </span>
                </span>
              </a>
              <button
                role="switch"
                aria-checked={inStock}
                aria-label={inStock ? "In stock" : "Out of stock"}
                onClick={async () => {
                  if (demo) return;
                  setOptimistic((o) => ({
                    ...o,
                    [product.id]: inStock ? "out_of_stock" : "in_stock",
                  }));
                  await toggleStock(product.id, !inStock);
                }}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                  inStock ? "bg-pistachio" : "bg-cocoa/20"
                } ${demo ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    inStock ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
