import { img, productEmoji, productGradients } from "@/lib/brand-images";
import type { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";

function storageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

/**
 * Product photo resolution order:
 * 1. real photo uploaded through the admin (Supabase Storage)
 * 2. curated stock photo for this product (lib/brand-images.ts)
 * 3. branded gradient fallback (SmartImage handles broken links too)
 */
export function ProductImage({
  product,
  size = "card",
  className = "",
  priority = false,
}: {
  product: Product;
  size?: "card" | "hero";
  className?: string;
  priority?: boolean;
}) {
  const uploaded = product.images[0];
  const src = uploaded
    ? storageUrl(size === "card" ? uploaded.thumb_path : uploaded.path)
    : (img.products[product.slug] ?? null);

  const hash = [...product.id].reduce((a, c) => a + c.charCodeAt(0), 0);

  return (
    <SmartImage
      src={src}
      alt={product.name.en}
      emoji={productEmoji[product.category_id] ?? "🧁"}
      gradient={productGradients[hash % productGradients.length]}
      className={className}
      priority={priority}
    />
  );
}
