import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories, getProducts } from "@/lib/catalog";
import { lt } from "@/lib/content";
import { img } from "@/lib/brand-images";
import { Reveal } from "@/components/storefront/Reveal";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SmartImage } from "@/components/storefront/SmartImage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const t2 = await getTranslations("home2");
  const [categories, featured] = await Promise.all([
    getCategories(),
    getProducts({ featured: true }),
  ]);

  return (
    <div>
      {/* ── Hero: full-bleed photography ─────────────────────── */}
      <section className="relative h-[82vh] max-h-[820px] min-h-[540px] overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          <SmartImage
            src={img.hero}
            alt="Fresh bakes at Sethi Bakery"
            priority
            gradient="linear-gradient(140deg, #3E2A20, #6B5344)"
            emoji="🥐"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(30 18 12 / 0.35) 0%, rgb(30 18 12 / 0.25) 40%, rgb(30 18 12 / 0.65) 100%)",
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <p
            className="animate-fade-up text-[0.7rem] font-bold uppercase tracking-[0.4em] text-gold-light"
            style={{ animationDelay: "0ms" }}
          >
            {t2("eyebrow")}
          </p>
          <h1
            className="font-display animate-fade-up mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "140ms", textShadow: "0 2px 24px rgb(0 0 0 / 0.3)" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg"
            style={{ animationDelay: "280ms" }}
          >
            {t("heroSubtitle")}
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "420ms" }}
          >
            <Link
              href="/c/cakes"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-cocoa shadow-warm-lg transition-all hover:bg-gold-light active:scale-95"
            >
              {t("orderCake")}
            </Link>
            <Link
              href="/c/pastries"
              className="rounded-full border-2 border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10 active:scale-95"
            >
              {t("browseMenu")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-cocoa/10 bg-cream py-3.5">
        <div className="font-display flex w-max animate-marquee gap-8 whitespace-nowrap text-sm uppercase tracking-[0.3em] text-caramel">
          {[0, 1].map((n) => (
            <span key={n} aria-hidden={n === 1}>
              {t("marquee").repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Best sellers ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Reveal className="text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-caramel">
            ★ ★ ★ ★ ★
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-cocoa sm:text-4xl">
            {t("featured")}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.slice(0, 8).map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 80}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Category tiles with photography ──────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold text-cocoa sm:text-4xl">
            {t("categories")}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 70}>
              <Link
                href={`/c/${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card shadow-warm transition-shadow hover:shadow-warm-lg"
              >
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                  <SmartImage
                    src={img.categories[category.slug] ?? null}
                    alt={category.name.en}
                    emoji="🧁"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgb(30 18 12 / 0.75) 100%)",
                  }}
                />
                <span className="font-display absolute inset-x-0 bottom-0 p-4 text-center text-lg font-semibold text-white">
                  {lt(category.name, locale)}
                  <span className="mt-1 block h-px w-8 bg-gold-light/80 transition-all duration-500 group-hover:w-16 mx-auto" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Story: editorial split ───────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-card shadow-warm-lg">
                <SmartImage
                  src={img.story}
                  alt="Baking at Sethi Bakery"
                  emoji="👨‍🍳"
                  gradient="linear-gradient(140deg, #E7CBAA, #C68A4B)"
                />
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-card bg-cocoa px-6 py-4 text-cream shadow-warm-lg sm:-right-6">
                <p className="font-display text-3xl font-bold text-gold-light">3</p>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
                  generations
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-caramel">
              {t2("storyLabel")}
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-cocoa sm:text-5xl">
              {t2("storyTitle")}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cocoa-light sm:text-lg">
              {t2("storyText")}
            </p>
            <Link
              href="/c/pastries"
              className="mt-8 inline-block border-b-2 border-caramel pb-1 text-sm font-bold uppercase tracking-[0.2em] text-cocoa transition-colors hover:border-cocoa"
            >
              {t2("storyCta")} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Custom cake banner ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={img.cakeBanner}
            alt=""
            emoji="🎂"
            gradient="linear-gradient(140deg, #6B5344, #3E2A20)"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cocoa/70"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white sm:py-28">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold sm:text-5xl">
              {t2("cakeCtaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85 sm:text-lg">
              {t2("cakeCtaText")}
            </p>
            <Link
              href="/c/cakes"
              className="mt-8 inline-block rounded-full bg-gold-light px-8 py-4 text-sm font-bold uppercase tracking-widest text-cocoa shadow-warm-lg transition-all hover:bg-white active:scale-95"
            >
              {t2("cakeCtaButton")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold text-cocoa sm:text-4xl">
            {t2("reviewsTitle")}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {([1, 2, 3] as const).map((n, i) => (
            <Reveal key={n} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-card bg-white p-7 shadow-warm">
                <p className="text-sm tracking-[0.25em] text-gold">★★★★★</p>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-cocoa-light">
                  “{t2(`review${n}Text`)}”
                </blockquote>
                <figcaption className="font-display mt-5 border-t border-cocoa/10 pt-4 text-sm font-semibold text-cocoa">
                  {t2(`review${n}Name`)}
                  <span className="mt-0.5 block text-xs font-normal uppercase tracking-[0.15em] text-caramel">
                    Patti, Punjab
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Gallery strip ────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <Reveal className="px-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-cocoa sm:text-3xl">
            {t2("galleryTitle")}
          </h2>
          <p className="mt-2 text-sm text-cocoa-light">{t2("galleryText")}</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-3 gap-1 sm:grid-cols-6">
          {img.gallery.map((src, i) => (
            <div key={i} className="group aspect-square overflow-hidden">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                <SmartImage src={src} alt="" emoji="🧁" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
