import { describe, expect, it } from "vitest";
import {
  demoCakeOptionGroups,
  demoProducts,
} from "./demo-data";
import {
  priceCake,
  round5,
  validateCakeSchedule,
} from "./pricing";

const blackForest = demoProducts.find((p) => p.slug === "black-forest-cake")!; // ₹450/kg

const base = {
  size: "size-1", // 1 kg
  shape: "shape-round",
  egg: "egg-with",
  photo_print: "photo-no",
};

describe("round5", () => {
  it("rounds to the nearest ₹5", () => {
    expect(round5(49_700)).toBe(49_500);
    expect(round5(49_800)).toBe(50_000);
    expect(round5(45_000)).toBe(45_000);
  });
});

describe("priceCake", () => {
  it("prices a plain 1kg cake at the base rate", () => {
    const { total } = priceCake(blackForest, demoCakeOptionGroups, base);
    expect(total).toBe(45_000); // ₹450
  });

  it("scales by weight", () => {
    const { total, weightKg } = priceCake(blackForest, demoCakeOptionGroups, {
      ...base,
      size: "size-2",
    });
    expect(weightKg).toBe(2);
    expect(total).toBe(90_000); // ₹900
  });

  it("applies eggless as a per-kg surcharge", () => {
    const { total } = priceCake(blackForest, demoCakeOptionGroups, {
      ...base,
      size: "size-05",
      egg: "egg-less",
    });
    // 0.5 × 45000 + 0.5 × 5000 = 25000 → ₹250
    expect(total).toBe(25_000);
  });

  it("applies photo print as a flat charge", () => {
    const { total } = priceCake(blackForest, demoCakeOptionGroups, {
      ...base,
      photo_print: "photo-yes",
    });
    expect(total).toBe(60_000); // 45000 + 15000
  });

  it("applies the heart-shape multiplier last, then rounds to ₹5", () => {
    const { total } = priceCake(blackForest, demoCakeOptionGroups, {
      ...base,
      shape: "shape-heart",
    });
    // 45000 × 1.1 = 49500 → already a ₹5 multiple
    expect(total).toBe(49_500);
  });

  it("combines weight + per-kg + flat + multiplier correctly", () => {
    const { total } = priceCake(blackForest, demoCakeOptionGroups, {
      size: "size-2",
      shape: "shape-heart",
      egg: "egg-less",
      photo_print: "photo-yes",
    });
    // ((2×45000) + (2×5000) + 15000) × 1.1 = 115000 × 1.1 = 126500
    expect(total).toBe(126_500);
  });

  it("returns a breakdown that sums consistently", () => {
    const { breakdown } = priceCake(blackForest, demoCakeOptionGroups, {
      ...base,
      photo_print: "photo-yes",
    });
    const summed = breakdown.reduce((a, l) => a + l.amount, 0);
    expect(summed).toBe(60_000);
  });
});

describe("validateCakeSchedule", () => {
  const now = new Date("2026-08-02T10:00:00+05:30");

  it("rejects less than 24h notice", () => {
    expect(validateCakeSchedule("2026-08-02T18:00:00+05:30", now)).toBe(false);
  });

  it("accepts 24h+ notice", () => {
    expect(validateCakeSchedule("2026-08-03T18:00:00+05:30", now)).toBe(true);
  });

  it("rejects garbage dates", () => {
    expect(validateCakeSchedule("not-a-date", now)).toBe(false);
  });
});
