"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct, deleteProduct } from "@/lib/admin-actions";
import type { AdminProductRow } from "@/lib/admin-data";
import type { Category } from "@/lib/types";
import { PhotoUploader, type UploadedImage } from "./PhotoUploader";

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-caramel";
const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-light";

function storagePublicUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

export function ProductForm({
  product,
  categories,
  demo,
}: {
  product: AdminProductRow | null;
  categories: Category[];
  demo: boolean;
}) {
  const router = useRouter();
  const [nameEn, setNameEn] = useState(product?.name.en ?? "");
  const [namePa, setNamePa] = useState(product?.name.pa ?? "");
  const [nameHi, setNameHi] = useState(product?.name.hi ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? categories[0]?.id ?? ""
  );
  const [type, setType] = useState<"simple" | "custom_cake">(
    product?.product_type === "custom_cake" ? "custom_cake" : "simple"
  );
  const [price, setPrice] = useState(
    product?.base_price != null ? String(product.base_price / 100) : ""
  );
  const [mrp, setMrp] = useState(
    product?.compare_at_price != null
      ? String(product.compare_at_price / 100)
      : ""
  );
  const [unit, setUnit] = useState(product?.unit?.en ?? "");
  const [eggless, setEggless] = useState(product?.is_eggless ?? false);
  const [featured, setFeatured] = useState(product?.is_featured ?? false);
  const [stock, setStock] = useState<"in_stock" | "out_of_stock" | "hidden">(
    (product?.stock_status as "in_stock") ?? "in_stock"
  );
  const [images, setImages] = useState<UploadedImage[]>(
    (product?.images ?? []).map((img) => ({
      ...img,
      previewUrl: storagePublicUrl(img.thumb_path),
    }))
  );
  const [showTranslations, setShowTranslations] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await saveProduct({
      id: product?.id,
      name_en: nameEn,
      name_pa: namePa || undefined,
      name_hi: nameHi || undefined,
      category_id: categoryId,
      product_type: type,
      price_rupees: Number(price),
      mrp_rupees: mrp ? Number(mrp) : undefined,
      unit: unit || undefined,
      is_eggless: eggless,
      is_featured: featured,
      stock_status: stock,
      images: images
        .filter((i) => i.path)
        .map(({ path, thumb_path }) => ({ path, thumb_path })),
    });
    setBusy(false);
    if (result.ok) {
      // Rapid-entry flow: stay on the page, keep category+unit, clear the rest.
      setMessage({ ok: true, text: "Saved ✓ — add the next item below, or go back." });
      if (!product) {
        setNameEn("");
        setNamePa("");
        setNameHi("");
        setPrice("");
        setMrp("");
        setImages([]);
        setFeatured(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.refresh();
      }
    } else {
      setMessage({ ok: false, text: result.error });
    }
  }

  async function remove() {
    if (!product) return;
    if (!confirm(`Hide "${product.name.en}" from the shop?`)) return;
    const result = await deleteProduct(product.id);
    if (result.ok) router.push("/admin/products");
    else setMessage({ ok: false, text: result.error });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {message && (
        <p
          className={`sticky top-16 z-30 rounded-xl px-4 py-3 text-sm font-semibold shadow-warm ${
            message.ok ? "bg-pistachio/15 text-pistachio" : "bg-berry/10 text-berry"
          }`}
        >
          {message.text}
        </p>
      )}

      <div>
        <span className={labelCls}>Photos (first one is the cover)</span>
        <PhotoUploader images={images} onChange={setImages} demo={demo} />
      </div>

      <div>
        <label className={labelCls} htmlFor="name">Item name</label>
        <input
          id="name"
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="e.g. Coconut Cookies 250 g"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShowTranslations(!showTranslations)}
          className="mt-2 text-xs font-semibold text-caramel"
        >
          {showTranslations ? "− Hide" : "+ Add"} ਪੰਜਾਬੀ / हिंदी name (optional)
        </button>
        {showTranslations && (
          <div className="mt-2 space-y-2">
            <input
              value={namePa}
              onChange={(e) => setNamePa(e.target.value)}
              placeholder="ਪੰਜਾਬੀ ਨਾਮ"
              className={inputCls}
            />
            <input
              value={nameHi}
              onChange={(e) => setNameHi(e.target.value)}
              placeholder="हिंदी नाम"
              className={inputCls}
            />
          </div>
        )}
      </div>

      <div>
        <label className={labelCls} htmlFor="category">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputCls}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.en}
            </option>
          ))}
        </select>
        <a href="/admin/categories" className="mt-1.5 inline-block text-xs font-semibold text-caramel">
          + Manage categories
        </a>
      </div>

      <div>
        <span className={labelCls}>Item type</span>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { v: "simple", label: "Regular item", hint: "Fixed price" },
              { v: "custom_cake", label: "Custom cake", hint: "Price is per kg" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setType(o.v)}
              aria-pressed={type === o.v}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                type === o.v
                  ? "border-caramel bg-white shadow-warm"
                  : "border-cocoa/10 bg-white/60"
              }`}
            >
              <span className="block text-sm font-semibold text-cocoa">{o.label}</span>
              <span className="text-xs text-cocoa-light">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls} htmlFor="price">
            {type === "custom_cake" ? "Price per kg (₹)" : "Price (₹)"}
          </label>
          <input
            id="price"
            required
            type="number"
            min="1"
            step="0.5"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="450"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="mrp">MRP / strike price (optional)</label>
          <input
            id="mrp"
            type="number"
            min="0"
            step="0.5"
            inputMode="decimal"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            placeholder="500"
            className={inputCls}
          />
        </div>
      </div>

      {type === "simple" && (
        <div>
          <label className={labelCls} htmlFor="unit">Unit shown to customers (optional)</label>
          <input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="per piece · 500 g pack · 1 dozen"
            className={inputCls}
          />
        </div>
      )}

      <div className="space-y-2.5 rounded-card bg-white p-4 shadow-warm">
        {(
          [
            { label: "Eggless", value: eggless, set: setEggless },
            { label: "Show in Best Sellers on home page", value: featured, set: setFeatured },
          ] as const
        ).map((toggle) => (
          <label key={toggle.label} className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-cocoa">{toggle.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={toggle.value}
              onClick={() => toggle.set(!toggle.value)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                toggle.value ? "bg-pistachio" : "bg-cocoa/20"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  toggle.value ? "left-6" : "left-1"
                }`}
              />
            </button>
          </label>
        ))}
        <div>
          <span className={labelCls}>Availability</span>
          <div className="flex gap-2">
            {(
              [
                { v: "in_stock", label: "In stock" },
                { v: "out_of_stock", label: "Out of stock" },
                { v: "hidden", label: "Hidden" },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setStock(o.v)}
                aria-pressed={stock === o.v}
                className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                  stock === o.v
                    ? "border-cocoa bg-cocoa text-cream"
                    : "border-cocoa/15 text-cocoa-light"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-full bg-caramel py-4 text-sm font-bold uppercase tracking-widest text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? "Saving…" : product ? "Save changes" : "Save item"}
        </button>
        {product && (
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-berry/40 px-5 text-sm font-bold text-berry transition-colors hover:bg-berry/5"
          >
            Hide
          </button>
        )}
      </div>
    </form>
  );
}
