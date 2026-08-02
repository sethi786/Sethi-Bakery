import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProductBySlug } from "@/lib/catalog";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";
import { ProductImage } from "@/components/storefront/ProductImage";
import { VariantPicker } from "@/components/storefront/VariantPicker";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");

  const product = await getProductBySlug(slug);
  if (!product || product.product_type === "custom_cake") notFound();

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-card shadow-warm">
        <ProductImage product={product} size="hero" />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-2">
          {product.tags.includes("bestseller") && (
            <span className="rounded-full bg-berry px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {t("bestseller")}
            </span>
          )}
          {product.is_eggless === true && (
            <span className="rounded-full bg-pistachio px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {t("eggless")}
            </span>
          )}
        </div>
        <h1 className="font-display mt-3 text-3xl font-bold text-cocoa sm:text-4xl">
          {lt(product.name, locale)}
        </h1>
        {product.unit && (
          <p className="mt-1 text-sm text-cocoa-light">{lt(product.unit, locale)}</p>
        )}
        {product.description && (
          <p className="mt-4 leading-relaxed text-cocoa-light">
            {lt(product.description, locale)}
          </p>
        )}
        <div className="mt-6">
          {product.product_type === "variant" && product.variants.length > 0 ? (
            <VariantPicker
              product={product}
              locale={locale}
              labels={{ add: t("addToCart"), added: t("added"), outOfStock: t("outOfStock") }}
            />
          ) : (
            <div className="flex items-center justify-between rounded-card bg-white p-5 shadow-warm">
              <span className="font-display text-3xl font-bold text-cocoa">
                {product.base_price != null ? formatPaise(product.base_price) : ""}
                {product.compare_at_price != null && (
                  <span className="ml-2 text-base font-normal text-cocoa-light line-through">
                    {formatPaise(product.compare_at_price)}
                  </span>
                )}
              </span>
              <VariantPicker
                product={product}
                locale={locale}
                simple
                labels={{ add: t("addToCart"), added: t("added"), outOfStock: t("outOfStock") }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
