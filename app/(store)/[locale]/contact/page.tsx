import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  IconClock,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
} from "@/components/icons";
import { shopConfig } from "@/lib/shop-config";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-cocoa sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-xl text-cocoa-light">{t("lead")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <a
            href={shopConfig.phoneHref}
            className="flex items-center gap-4 rounded-card bg-white p-5 shadow-warm transition-transform active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-deep text-caramel">
              <IconPhone size={22} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
                {t("call")}
              </span>
              <span className="font-display text-lg font-bold text-cocoa">
                {shopConfig.phone}
              </span>
            </span>
          </a>

          <a
            href={`https://wa.me/${shopConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-card bg-white p-5 shadow-warm transition-transform active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <IconWhatsApp size={22} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
                {t("whatsapp")}
              </span>
              <span className="font-display text-lg font-bold text-cocoa">
                WhatsApp
              </span>
            </span>
          </a>

          <div className="flex items-start gap-4 rounded-card bg-white p-5 shadow-warm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-deep text-caramel">
              <IconMapPin size={22} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
                {t("visit")}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-cocoa">
                {shopConfig.address.full}
              </span>
            </span>
          </div>

          <div className="flex items-start gap-4 rounded-card bg-white p-5 shadow-warm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-deep text-caramel">
              <IconClock size={22} />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
                {t("hoursTitle")}
              </span>
              <span className="mt-1 block text-sm text-cocoa">
                {shopConfig.hours.open} – {shopConfig.hours.close}
                <br />
                {shopConfig.hours.days}
              </span>
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-card shadow-warm">
          <iframe
            src={shopConfig.osmEmbedUrl}
            title={t("mapTitle")}
            className="h-[420px] w-full border-0"
            loading="lazy"
          />
          <a
            href={shopConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-cocoa py-3.5 text-center text-sm font-bold uppercase tracking-widest text-cream transition-colors hover:bg-cocoa-light"
          >
            {t("openMaps")} →
          </a>
        </div>
      </div>
    </div>
  );
}
