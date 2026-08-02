import { getTranslations, setRequestLocale } from "next-intl/server";
import { IconCake, IconScooter, IconShield } from "@/components/icons";

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("policies");

  const sections = [
    {
      icon: <IconScooter size={22} />,
      title: t("deliveryTitle"),
      paras: [t("delivery1"), t("delivery2")],
    },
    {
      icon: <IconCake size={22} />,
      title: t("cakesTitle"),
      paras: [t("cakes1"), t("cakes2")],
    },
    {
      icon: <IconShield size={22} />,
      title: t("refundTitle"),
      paras: [t("refund1"), t("refund2")],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-cocoa sm:text-4xl">
        {t("title")}
      </h1>
      <div className="mt-8 space-y-5">
        {sections.map((s, i) => (
          <section key={i} className="rounded-card bg-white p-7 shadow-warm">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-cocoa">
              <span className="text-caramel">{s.icon}</span>
              {s.title}
            </h2>
            {s.paras.map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed text-cocoa-light">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
