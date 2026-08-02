"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LABELS: Record<string, string> = { en: "EN", pa: "ਪੰ", hi: "हि" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-cream-deep p-0.5">
      {Object.entries(LABELS).map(([code, label]) => (
        <button
          key={code}
          onClick={() => router.replace(pathname, { locale: code })}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            locale === code
              ? "bg-cocoa text-cream shadow-sm"
              : "text-cocoa-light hover:text-cocoa"
          }`}
          aria-pressed={locale === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
