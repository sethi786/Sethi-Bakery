import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoWordmark } from "@/components/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartBadge } from "./CartBadge";

export async function Header() {
  const t = await getTranslations("nav");
  const tAll = await getTranslations();

  return (
    <>
      <div className="bg-cocoa px-4 py-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-gold-light">
        {tAll("announce")}
      </div>
      <header className="sticky top-0 z-40 border-b border-cocoa/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="shrink-0">
          <LogoWordmark compact />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-cocoa-light sm:flex">
          <Link href="/c/cakes" className="transition-colors hover:text-cocoa">
            {t("cakes")}
          </Link>
          <Link href="/c/pastries" className="transition-colors hover:text-cocoa">
            {t("menu")}
          </Link>
          <Link href="/search" className="transition-colors hover:text-cocoa">
            {t("search")}
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
