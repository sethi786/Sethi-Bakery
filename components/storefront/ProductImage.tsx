import type { Product } from "@/lib/types";

const CATEGORY_EMOJI: Record<string, string> = {
  "cat-cakes": "🎂",
  "cat-pastries": "🍰",
  "cat-snacks": "🥟",
  "cat-breads": "🍞",
  "cat-grocery": "🛒",
};

const PALETTES = [
  ["#F3E3D0", "#E7CBAA"],
  ["#EFE0E2", "#DFC3C8"],
  ["#E8EAD9", "#D3D9BC"],
  ["#F5E8CE", "#EAD4A5"],
];

function storageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

/**
 * Product photo when one exists; otherwise a warm branded placeholder so the
 * site looks intentional before real photos are uploaded.
 */
export function ProductImage({
  product,
  size = "card",
  className = "",
}: {
  product: Product;
  size?: "card" | "hero";
  className?: string;
}) {
  const image = product.images[0];
  if (image) {
    return (
      <img
        src={storageUrl(size === "card" ? image.thumb_path : image.path)}
        alt={product.name.en}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const emoji = CATEGORY_EMOJI[product.category_id] ?? "🧁";
  const hash = [...product.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [from, to] = PALETTES[hash % PALETTES.length];

  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <span
        className={size === "hero" ? "text-8xl" : "text-5xl"}
        style={{ filter: "drop-shadow(0 6px 12px rgb(62 42 32 / 0.25))" }}
      >
        {emoji}
      </span>
    </div>
  );
}
