import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");

  const products = q ? await getProducts({ search: q }) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <form action="" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder={t("placeholder")}
          autoFocus
          className="w-full rounded-full border border-cocoa/15 bg-white px-6 py-4 text-base shadow-warm outline-none transition-colors focus:border-caramel"
        />
      </form>
      {q && (
        <>
          <h1 className="font-display mt-8 text-2xl font-bold text-cocoa">
            {t("results", { query: q })}
          </h1>
          {products.length === 0 ? (
            <p className="mt-6 text-cocoa-light">{t("none")}</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
