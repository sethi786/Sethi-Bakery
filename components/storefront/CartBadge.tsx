"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { Link } from "@/i18n/navigation";

export function CartBadge({ label }: { label: string }) {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep transition-transform active:scale-90"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cocoa">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-[0.65rem] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
