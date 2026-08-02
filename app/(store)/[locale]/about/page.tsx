import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconFlame, IconLeaf, IconCake } from "@/components/icons";
import { SmartImage } from "@/components/storefront/SmartImage";
import { Reveal } from "@/components/storefront/Reveal";
import { img } from "@/lib/brand-images";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-cocoa sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-cocoa-light">{t("lead")}</p>

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-card shadow-warm-lg">
          <SmartImage src={img.story} alt="Our kitchen" emoji="🥖" />
        </div>
        <div className="space-y-4 leading-relaxed text-cocoa-light">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
      </div>

      <h2 className="font-display mt-14 text-2xl font-semibold text-cocoa">
        {t("valuesTitle")}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: <IconFlame size={24} />, title: t("v1"), text: t("v1Text") },
          { icon: <IconLeaf size={24} />, title: t("v2"), text: t("v2Text") },
          { icon: <IconCake size={24} />, title: t("v3"), text: t("v3Text") },
        ].map((v, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="h-full rounded-card bg-white p-6 shadow-warm">
              <span className="text-caramel">{v.icon}</span>
              <h3 className="font-display mt-3 text-lg font-semibold text-cocoa">
                {v.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cocoa-light">
                {v.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
