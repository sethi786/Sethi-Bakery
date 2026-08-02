import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCategories, getProducts } from "@/lib/catalog";
import { lt } from "@/lib/content";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Reveal } from "@/components/storefront/Reveal";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <a
            key={c.id}
            href={locale === "en" ? `/c/${c.slug}` : `/${locale}/c/${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              c.id === category.id
                ? "bg-cocoa text-cream"
                : "bg-white text-cocoa-light shadow-warm hover:text-cocoa"
            }`}
          >
            {lt(c.name, locale)}
          </a>
        ))}
      </nav>
      <h1 className="font-display mt-8 text-3xl font-bold text-cocoa">
        {lt(category.name, locale)}
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 60}>
            <ProductCard product={product} locale={locale} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
