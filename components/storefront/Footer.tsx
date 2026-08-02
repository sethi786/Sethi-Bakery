import { getTranslations } from "next-intl/server";
import { LogoRoundel } from "@/components/Logo";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-20 border-t border-cocoa/10 bg-cocoa text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <LogoRoundel size={44} />
            <div>
              <p className="font-display text-lg font-semibold tracking-wide">
                {t("brand.name")}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-caramel">
                {t("brand.tagline")}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-cream/60">{t("footer.madeWith")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
            {t("footer.visit")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/80">
            {t("brand.location")}
            <br />
            {t("footer.hours")}
          </p>
        </div>
        <div className="text-sm text-cream/60">
          <p>© {new Date().getFullYear()} Sethi Bakery</p>
        </div>
      </div>
    </footer>
  );
}
