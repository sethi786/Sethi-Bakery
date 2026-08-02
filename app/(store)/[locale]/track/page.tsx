import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackForm } from "@/components/storefront/TrackForm";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("track");

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-cocoa">{t("title")}</h1>
      <p className="mt-2 text-cocoa-light">{t("lead")}</p>
      <div className="mt-8">
        <TrackForm />
      </div>
    </div>
  );
}
