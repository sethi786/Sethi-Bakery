import type { Metadata } from "next";
import { LogoRoundel } from "@/components/Logo";
import { IconBag, IconCake } from "@/components/icons";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Sethi Bakery — Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin shell — English-only, phone-first with big tap targets.
 * Auth is enforced per-page (login redirects) rather than here so the
 * login page itself can render.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream">
        <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-2.5 px-4">
            <LogoRoundel size={30} />
            <span className="font-display font-semibold text-cocoa">
              Sethi Bakery Admin
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6 pb-24">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/10 bg-white">
          <div className="mx-auto flex max-w-3xl">
            {[
              { href: "/admin/orders", label: "Orders", icon: <IconBag size={22} /> },
              { href: "/admin/products", label: "Products", icon: <IconCake size={22} /> },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-cocoa-light"
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
