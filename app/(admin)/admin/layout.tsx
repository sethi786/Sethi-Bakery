import type { Metadata } from "next";
import { LogoRoundel } from "@/components/Logo";
import { IconBag, IconCake, IconStore, IconClock } from "@/components/icons";
import { isDemoMode } from "@/lib/supabase/config";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Sethi Bakery — Admin",
  robots: { index: false, follow: false },
};

const TABS = [
  { href: "/admin/orders", label: "Orders", icon: <IconClock size={22} /> },
  { href: "/admin/products", label: "Products", icon: <IconCake size={22} /> },
  { href: "/admin/categories", label: "Categories", icon: <IconBag size={22} /> },
  { href: "/admin/settings", label: "Shop", icon: <IconStore size={22} /> },
];

/**
 * Admin shell — English-only, phone-first with big tap targets.
 * Auth is enforced per-page via requireAdminOrRedirect(); in demo mode the
 * whole portal is browsable read-only.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demo = isDemoMode();

  return (
    <html lang="en">
      <body className="bg-cream">
        {demo && (
          <div className="bg-gold-light px-4 py-2 text-center text-xs font-semibold text-cocoa">
            Demo preview — browse freely; connect the database (see README) to
            save changes.
          </div>
        )}
        <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-2.5 px-4">
            <LogoRoundel size={30} />
            <span className="font-display font-semibold text-cocoa">
              Sethi Bakery Admin
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6 pb-28">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/10 bg-white">
          <div className="mx-auto flex max-w-3xl">
            {TABS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.68rem] font-semibold text-cocoa-light"
              >
                {tab.icon}
                {tab.label}
              </a>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
