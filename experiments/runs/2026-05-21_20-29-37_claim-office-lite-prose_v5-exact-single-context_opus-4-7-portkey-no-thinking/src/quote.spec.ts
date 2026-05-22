import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote premium", () => {
  it("returns just the processing fee when there are no items", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [], contractIndex: 0 })).toBe(5);
  });
  it("computes premium for a single sword (base + processing fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword" }],
      contractIndex: 0,
    });
    expect(result).toBe(115);
  });
  it("computes premium for a single amulet", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "amulet" }],
      contractIndex: 0,
    });
    expect(result).toBe(71);
  });
  it("computes premium for a single staff", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "staff" }],
      contractIndex: 0,
    });
    expect(result).toBe(93);
  });
  it("computes premium for a single potion", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "potion" }],
      contractIndex: 0,
    });
    expect(result).toBe(49);
  });
  it("computes premium for a single rune component", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }],
      contractIndex: 0,
    });
    // 25 base * 1.10 = 27.5 -> ceil 28 + 5 = 33
    expect(result).toBe(33);
  });
  it("computes premium for a single moonstone component", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "moonstone" }],
      contractIndex: 0,
    });
    expect(result).toBe(33);
  });
  it("sums base premiums for multiple distinct main items", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword" }, { type: "amulet" }],
      contractIndex: 0,
    });
    // (100 + 60) * 1.10 = 176 + 5 = 181
    expect(result).toBe(181);
  });
  it("applies the 3-alike-component bundle price for 3 runes", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      contractIndex: 0,
    });
    // bundle 60 * 1.10 = 66 + 5 = 71
    expect(result).toBe(71);
  });
  it("applies the 3-alike-component bundle price for 3 moonstones", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }],
      contractIndex: 0,
    });
    expect(result).toBe(71);
  });
  it("prices 4 alike components as one bundle of 3 plus one single", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      contractIndex: 0,
    });
    // bundle 60 + single 25 = 85 * 1.10 = 93.5 -> ceil 94 + 5 = 99
    expect(result).toBe(99);
  });
  it("prices 6 alike components as two bundles of 3", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: Array(6).fill({ type: "rune" }),
      contractIndex: 0,
    });
    // 2 * 60 = 120 * 1.10 = 132 + 5 = 137
    expect(result).toBe(137);
  });
  it("does NOT bundle 3 components of different kinds (rune + moonstone mix)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      contractIndex: 0,
    });
    // No bundle: 3 * 25 = 75 * 1.10 = 82.5 -> ceil 83 + 5 = 88
    expect(result).toBe(88);
  });
  it("adds a 50% surcharge for cursed items", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", cursed: true }],
      contractIndex: 0,
    });
    // 100 * 1.5 = 150 (cursed surcharge per item); then first-insurance: 150 * 1.10 = 165 + 5 = 170
    expect(result).toBe(170);
  });
  it("adds a 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", enchantment: 5 }],
      contractIndex: 0,
    });
    // 100 * 1.30 = 130; first-insurance: 130 * 1.10 = 143 + 5 = 148
    expect(result).toBe(148);
  });
  it("applies a 20% loyalty discount for long-standing customers (>= 2 years)", () => {
    // First insurance still applies. Sword 100 * 1.10 = 110 * 0.80 = 88, + 5 = 93.
    const result = quote({
      customer: { yearsWithMHPCO: 2 },
      items: [{ type: "sword" }],
      contractIndex: 0,
    });
    expect(result).toBe(93);
  });
  it("applies a 10% first-insurance surcharge on the first quote", () => {
    // Same item, contractIndex 0 vs 1 (with no loyalty / no other discounts).
    // contractIndex 0: 100 * 1.10 = 110 + 5 = 115
    // contractIndex 1: only multi-contract discount 15%: 100 * 0.85 = 85 + 5 = 90
    const first = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword" }],
      contractIndex: 0,
    });
    expect(first).toBe(115);
  });
  it("applies a 15% multi-contract discount on contracts after the first", () => {
    // contractIndex 1, no loyalty: sword 100 * 0.85 = 85, + 5 = 90
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword" }],
      contractIndex: 1,
    });
    expect(result).toBe(90);
  });
  it("rounds in the MHPCO's favor (rounds up)", () => {
    // rune 25, no surcharges, no first-insurance, no loyalty:
    // contractIndex 1 -> 25 * 0.85 = 21.25 -> ceil 22, + 5 = 27
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }],
      contractIndex: 1,
    });
    expect(result).toBe(27);
  });
});
