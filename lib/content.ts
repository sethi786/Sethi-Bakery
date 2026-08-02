import type { LocalizedText } from "./types";

/** Resolve a localized jsonb field with graceful fallback to English. */
export function lt(field: LocalizedText | null | undefined, locale: string): string {
  if (!field) return "";
  return (
    field[locale as keyof LocalizedText] ??
    field.en ??
    Object.values(field).find(Boolean) ??
    ""
  );
}
