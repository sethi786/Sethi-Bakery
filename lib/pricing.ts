import type { CakeOptionGroup, LocalizedText, Product } from "./types";
import { lt } from "./content";

export interface CakePriceResult {
  total: number; // paise
  weightKg: number;
  breakdown: { label: string; amount: number }[];
}

/** Round paise to the nearest ₹5 so prices look like a bakery menu. */
export function round5(paise: number): number {
  return Math.round(paise / 500) * 500;
}

/**
 * Cake pricing engine — pure and isomorphic. Runs client-side for the live
 * price ticker and re-runs server-side inside placeOrder from option IDs;
 * the client's price is never trusted.
 *
 * total = round5((weight × baseRate + Σflat + Σ(perKg × weight)) × Πmultiplier)
 */
export function priceCake(
  product: Pick<Product, "base_price" | "name">,
  groups: CakeOptionGroup[],
  selections: Record<string, string>, // groupCode -> optionId
  locale = "en"
): CakePriceResult {
  const baseRate = product.base_price ?? 0;
  const breakdown: { label: string; amount: number }[] = [];

  const sizeGroup = groups.find((g) => g.code === "size");
  const sizeOption = sizeGroup?.options.find(
    (o) => o.id === selections["size"]
  );
  const weightKg = sizeOption?.weight_kg ?? 1;

  let subtotal = Math.round(weightKg * baseRate);
  breakdown.push({
    label: `${lt(product.name, locale)} · ${weightKg} kg`,
    amount: subtotal,
  });

  let multiplier = 1;

  for (const group of groups) {
    if (group.input_type !== "single_select") continue;
    const selected = group.options.find((o) => o.id === selections[group.code]);
    if (!selected || selected.price_effect === "none") continue;

    const label = `${lt(group.name, locale)}: ${lt(selected.name, locale)}`;
    if (selected.price_effect === "flat" && group.code !== "size") {
      const amount = Math.round(selected.amount);
      subtotal += amount;
      if (amount !== 0) breakdown.push({ label, amount });
    } else if (selected.price_effect === "per_kg" && group.code !== "size") {
      const amount = Math.round(selected.amount * weightKg);
      subtotal += amount;
      if (amount !== 0) breakdown.push({ label, amount });
    } else if (selected.price_effect === "multiplier") {
      multiplier *= selected.amount;
      breakdown.push({ label, amount: 0 });
    }
  }

  const total = round5(Math.round(subtotal * multiplier));
  return { total, weightKg, breakdown };
}

/** Minimum lead time for custom cakes, in hours. */
export const CAKE_LEAD_TIME_HOURS = 24;

export function minCakeDate(now: Date = new Date()): Date {
  return new Date(now.getTime() + CAKE_LEAD_TIME_HOURS * 3600 * 1000);
}

export function validateCakeSchedule(
  scheduledFor: string,
  now: Date = new Date()
): boolean {
  const t = new Date(scheduledFor).getTime();
  return Number.isFinite(t) && t >= minCakeDate(now).getTime();
}

export const MAX_CAKE_MESSAGE_LENGTH = 40;

export type { LocalizedText };
