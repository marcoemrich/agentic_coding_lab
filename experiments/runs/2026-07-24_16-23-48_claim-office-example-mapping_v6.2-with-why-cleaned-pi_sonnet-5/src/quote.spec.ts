import { describe, it, expect } from "vitest";
import { computeRawPolicyPremium, computeQuotePremium } from "./quote.js";

describe("Quote - modifier scope on multi-item policies", () => {
  it("cursed sword + amulet -- raw policy premium is 210 G (curse surcharge based on item base, not policy total)", () => {
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(computeRawPolicyPremium(items)).toBe(210);
  });
});

describe("Quote - premium calculation", () => {
  it("empty item list, newcomer, first quote -- premium is 5 G (only the processing fee)", () => {
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, [], true)).toBe(5);
  });
  it("plain sword, enchantment 4, not cursed, newcomer, first quote -- premium is 115 G (base + first-insurance + fee)", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: false }];
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toBe(115);
  });
  it("sword enchantment 4, cursed, newcomer, first quote -- premium is 165 G (curse surcharge applies; no high-enchantment surcharge)", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toBe(165);
  });
  it("sword exactly enchantment 5, not cursed, newcomer, first quote -- premium is 145 G (high-enchantment threshold)", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: false }];
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toBe(145);
  });
  it("sword exactly enchantment 5, cursed, newcomer, first quote -- premium is 195 G (both surcharges apply)", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toBe(195);
  });
  it("customer with exactly 2 years with MHPCO, sword enchantment 4, not cursed, first quote -- premium is 95 G (loyalty discount threshold)", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: false }];
    expect(computeQuotePremium({ yearsWithMHPCO: 2 }, items, true)).toBe(95);
  });
  it("Newcomer with a cursed sword (integration example) -- premium is 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toBe(165);
  });
  it("Long-standing customer's second contract (integration example) -- premium is 160 G (first-insurance surcharge still applies to the new item)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(computeQuotePremium({ yearsWithMHPCO: 3 }, items, false)).toBe(160);
  });
  it("quote with an item of unknown type -- throws an error", () => {
    const items = [{ type: "broomstick" }];
    expect(() => computeQuotePremium({ yearsWithMHPCO: 0 }, items, true)).toThrow();
  });
});
