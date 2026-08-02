import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoWordmark } from "@/components/Logo";
import { IconPhone } from "@/components/icons";
import { shopConfig } from "@/lib/shop-config";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartBadge } from "./CartBadge";

export async function Header() {
  const t = await getTranslations("nav");
  const tAll = await getTranslations();

  return (
    <>
      <div className="flex items-center justify-center gap-4 bg-cocoa px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold-light">
        <span className="truncate">{tAll("announce")}</span>
        <a
          href={shopConfig.phoneHref}
          className="hidden shrink-0 items-center gap-1.5 text-cream transition-colors hover:text-gold-light sm:flex"
        >
          <IconPhone size={13} />
          {shopConfig.phone}
        </a>
      </div>
      <header className="sticky top-0 z-40 border-b border-cocoa/5 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" className="shrink-0">
            <LogoWordmark compact />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-cocoa-light md:flex">
            <Link href="/c/cakes" className="transition-colors hover:text-cocoa">
              {t("cakes")}
            </Link>
            <Link href="/c/pastries" className="transition-colors hover:text-cocoa">
              {t("menu")}
            </Link>
            <Link href="/about" className="transition-colors hover:text-cocoa">
              {t("about")}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-cocoa">
              {t("contact")}
            </Link>
            <Link href="/track" className="transition-colors hover:text-cocoa">
              {t("track")}
            </Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <LocaleSwitcher />
            <CartBadge label={t("cart")} />
          </div>
        </div>
      </header>
    </>
  );
}
