import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoRoundel } from "@/components/Logo";
import {
  IconClock,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
  PaymentBadges,
} from "@/components/icons";
import { shopConfig } from "@/lib/shop-config";

export async function Footer() {
  const t = await getTranslations();

  const linkCls = "text-sm text-cream/70 transition-colors hover:text-cream";

  return (
    <footer className="mt-20 bg-cocoa text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact */}
        <div>
          <div className="flex items-center gap-3">
            <LogoRoundel size={44} />
            <div>
              <p className="font-display text-lg font-semibold tracking-wide">
                {t("brand.name")}
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-caramel">
                {t("brand.tagline")}
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm text-cream/80">
            <li className="flex items-start gap-2.5">
              <IconMapPin size={16} className="mt-0.5 shrink-0 text-caramel" />
              <span>{shopConfig.address.full}</span>
            </li>
            <li>
              <a
                href={shopConfig.phoneHref}
                className="flex items-center gap-2.5 transition-colors hover:text-cream"
              >
                <IconPhone size={16} className="shrink-0 text-caramel" />
                {shopConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${shopConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-cream"
              >
                <IconWhatsApp size={16} className="shrink-0 text-caramel" />
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <IconClock size={16} className="shrink-0 text-caramel" />
              {shopConfig.hours.open} – {shopConfig.hours.close} ·{" "}
              {shopConfig.hours.days}
            </li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
            {t("nav.menu")}
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              { href: "/c/cakes", label: "Cakes" },
              { href: "/c/pastries", label: "Pastries" },
              { href: "/c/patties-snacks", label: "Patties & Snacks" },
              { href: "/c/breads", label: "Breads & Rusk" },
              { href: "/c/grocery", label: "Grocery" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
            Help
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/track" className={linkCls}>
                {t("nav.track")}
              </Link>
            </li>
            <li>
              <Link href="/policies" className={linkCls}>
                {t("policies.title")}
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkCls}>
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkCls}>
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Payments + legal */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
            Payments we accept
          </p>
          <PaymentBadges className="mt-4 text-cream/70" />
          {shopConfig.fssai && (
            <p className="mt-5 text-xs text-cream/60">
              FSSAI Lic. No. {shopConfig.fssai}
            </p>
          )}
          <p className="mt-5 text-xs leading-relaxed text-cream/50">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {shopConfig.name} · {shopConfig.address.city}
        , {shopConfig.address.state}
      </div>
    </footer>
  );
}
