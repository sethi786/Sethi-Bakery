import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./AddToCartButton";

export async function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const t = await getTranslations("product");
  const isCake = product.product_type === "custom_cake";
  const href = isCake ? `/cakes/${product.slug}` : `/p/${product.slug}`;
  const defaultVariant =
    product.variants.find((v) => v.is_default) ?? product.variants[0];
  const price = isCake
    ? product.base_price
    : (defaultVariant?.price ?? product.base_price);
  const outOfStock = product.stock_status === "out_of_stock";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card bg-white shadow-warm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
      <Link href={href} className="relative block aspect-square overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductImage product={product} />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.tags.includes("bestseller") && (
            <span className="rounded-full bg-berry px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
              {t("bestseller")}
            </span>
          )}
          {product.is_eggless === true && (
            <span className="rounded-full bg-pistachio px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
              {t("eggless")}
            </span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-cocoa">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={href}>
          <h3 className="font-display text-base font-semibold leading-snug text-cocoa">
            {lt(product.name, locale)}
          </h3>
        </Link>
        {product.unit && (
          <p className="text-xs text-cocoa-light">{lt(product.unit, locale)}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {isCake && (
              <span className="block text-[0.65rem] uppercase tracking-wide text-cocoa-light">
                {t("from")} / kg
              </span>
            )}
            <span className="font-display text-lg font-bold text-cocoa">
              {price != null ? formatPaise(price) : ""}
            </span>
            {product.compare_at_price != null && (
              <span className="ml-1.5 text-xs text-cocoa-light line-through">
                {formatPaise(product.compare_at_price)}
              </span>
            )}
          </div>
          {!outOfStock &&
            (isCake ? (
              <Link
                href={href}
                className="rounded-full bg-caramel px-3.5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
              >
                {t("customizeCake")}
              </Link>
            ) : (
              <AddToCartButton
                product={product}
                variant={defaultVariant ?? null}
                locale={locale}
                labels={{ add: t("addToCart"), added: t("added") }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
