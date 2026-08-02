import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories, getProducts } from "@/lib/catalog";
import { lt } from "@/lib/content";
import { Reveal } from "@/components/storefront/Reveal";
import { ProductCard } from "@/components/storefront/ProductCard";

const CATEGORY_EMOJI: Record<string, string> = {
  cakes: "🎂",
  pastries: "🍰",
  "patties-snacks": "🥟",
  breads: "🍞",
  grocery: "🛒",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const [categories, featured] = await Promise.all([
    getCategories(),
    getProducts({ featured: true }),
  ]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-kenburns"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, #f3e3d0 0%, transparent 55%)," +
              "radial-gradient(ellipse at 80% 10%, #efe0e2 0%, transparent 50%)," +
              "radial-gradient(ellipse at 65% 90%, #e9d9b8 0%, transparent 55%)," +
              "linear-gradient(180deg, #faf6f0 0%, #f3ecdf 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <p
            className="animate-fade-up text-xs font-bold uppercase tracking-[0.35em] text-caramel"
            style={{ animationDelay: "0ms" }}
          >
            🧁 Patti · Punjab
          </p>
          <h1
            className="font-display animate-fade-up mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight text-cocoa sm:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-cocoa-light sm:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            {t("heroSubtitle")}
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href="/c/cakes"
              className="rounded-full bg-caramel px-7 py-3.5 text-sm font-bold text-white shadow-warm-lg transition-all hover:bg-gold active:scale-95"
            >
              {t("orderCake")}
            </Link>
            <Link
              href="/c/pastries"
              className="rounded-full border border-cocoa/20 bg-white/70 px-7 py-3.5 text-sm font-bold text-cocoa backdrop-blur transition-all hover:border-caramel active:scale-95"
            >
              {t("browseMenu")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-cocoa/10 bg-cocoa py-3">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm tracking-[0.15em] text-cream/80">
          {[0, 1].map((n) => (
            <span key={n} aria-hidden={n === 1}>
              {t("marquee").repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-cocoa sm:text-3xl">
            {t("categories")}
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 60}>
              <Link
                href={`/c/${category.slug}`}
                className="group flex flex-col items-center gap-2 rounded-card bg-white px-3 py-6 text-center shadow-warm transition-all hover:-translate-y-1 hover:shadow-warm-lg"
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {CATEGORY_EMOJI[category.slug] ?? "🧁"}
                </span>
                <span className="text-sm font-semibold text-cocoa">
                  {lt(category.name, locale)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-cocoa sm:text-3xl">
            {t("featured")}
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 80}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <section className="bg-cream-deep py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="font-display text-center text-2xl font-bold text-cocoa sm:text-3xl">
              {t("whyTitle")}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(
              [
                { emoji: "🔥", title: t("whyFresh"), text: t("whyFreshText") },
                { emoji: "🎂", title: t("whyCustom"), text: t("whyCustomText") },
                { emoji: "🛵", title: t("whyLocal"), text: t("whyLocalText") },
              ]
            ).map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="h-full rounded-card bg-white p-6 shadow-warm">
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="font-display mt-3 text-lg font-semibold text-cocoa">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cocoa-light">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
