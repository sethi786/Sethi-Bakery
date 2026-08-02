import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCakeOptionGroups, getProductBySlug } from "@/lib/catalog";
import { lt } from "@/lib/content";
import { CakeBuilder } from "@/components/storefront/CakeBuilder";
import { ProductImage } from "@/components/storefront/ProductImage";

export default async function CakeBuilderPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cake");

  const [product, groups] = await Promise.all([
    getProductBySlug(slug),
    getCakeOptionGroups(),
  ]);
  if (!product || product.product_type !== "custom_cake") notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-36 w-36 shrink-0 overflow-hidden rounded-card shadow-warm">
          <ProductImage product={product} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            {t("title")}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-cocoa sm:text-4xl">
            {lt(product.name, locale)}
          </h1>
          {product.description && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cocoa-light">
              {lt(product.description, locale)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-10">
        <CakeBuilder product={product} groups={groups} />
      </div>
    </div>
  );
}
