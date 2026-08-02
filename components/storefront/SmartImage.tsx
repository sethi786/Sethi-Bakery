"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Image with a graceful branded fallback: if the photo fails to load
 * (offline, dead link, not yet uploaded) it swaps to a warm gradient with
 * an emoji — never a broken-image icon.
 */
export function SmartImage({
  src,
  alt,
  emoji = "🧁",
  gradient = "linear-gradient(140deg, #F3E3D0, #E7CBAA)",
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string | null;
  alt: string;
  emoji?: string;
  gradient?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Catch images that already failed before React hydrated — onError alone
  // misses those (slow/blocked networks), leaving a broken-image icon.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={`flex h-full w-full items-center justify-center ${className}`}
        style={{ background: gradient }}
      >
        <span
          className="text-5xl"
          style={{ filter: "drop-shadow(0 6px 12px rgb(62 42 32 / 0.25))" }}
        >
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${imgClassName} ${className}`}
    />
  );
}
