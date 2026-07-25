import { describe, it, expect } from "vitest";
import { itemSurchargeTotal, computeQuote } from "./pricing.js";

describe("Pricing: modifiers and quote totals", () => {
  // Edge case: empty item list
  it("computeQuote returns premium 5 G for an empty item list (only the processing fee)", () => {
    expect(computeQuote([], { yearsWithMHPCO: 0 }, false)).toBe(5);
  });

  // Modifier scope on multi-item policies
  it("itemSurchargeTotal returns 50 G for a cursed sword (base premium 100 G) in a policy with a plain amulet (curse surcharge scoped to the sword's own base premium, not the policy total)", () => {
    expect(itemSurchargeTotal({ type: "sword", cursed: true }, 100)).toBe(50);
  });

  // Modifier thresholds
  it("computeQuote returns 59 G for a plain amulet quote by a customer with exactly 2 years with MHPCO on their first contract (60 base +6 first insurance -12 loyalty = 54 +5 fee = 59)", () => {
    expect(computeQuote([{ type: "amulet" }], { yearsWithMHPCO: 2 }, false)).toBe(59);
  });
  it("computeQuote returns 145 G for a newcomer's sword with exactly enchantment level 5 (100 base +30 high-enchantment +10 first insurance = 140 +5 fee = 145)", () => {
    expect(computeQuote([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0 }, false)).toBe(
      145
    );
  });
  it("computeQuote returns 195 G for a newcomer's cursed sword with exactly enchantment level 5 (both surcharges apply: 100 base +50 curse +30 high-enchantment +10 first insurance = 190 +5 fee = 195)", () => {
    expect(
      computeQuote(
        [{ type: "sword", cursed: true, enchantment: 5 }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(195);
  });
  it("computeQuote returns 115 G for a newcomer's sword with enchantment level 4 (no high-enchantment surcharge: 100 base +10 first insurance = 110 +5 fee = 115)", () => {
    expect(computeQuote([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0 }, false)).toBe(
      115
    );
  });

  // Rounding in the MHPCO's favor
  it("computeQuote returns 53 G for a follow-up quote of 2 runes with no loyalty discount, rounded up from 52.5 G (50 base +5 first insurance -7.5 follow-up = 47.5 +5 fee = 52.5 -> rounds up)", () => {
    expect(
      computeQuote([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, true)
    ).toBe(53);
  });

  // Integration examples
  it("computeQuote returns 165 G for a newcomer's cursed sword (steel, enchantment 3) (100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165)", () => {
    expect(
      computeQuote(
        [{ type: "sword", material: "steel", cursed: true, enchantment: 3 }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(165);
  });
  it("computeQuote returns 160 G for a long-standing customer's (3 years) second contract with a cursed sword (steel, enchantment 7) (100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160)", () => {
    expect(
      computeQuote(
        [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }],
        { yearsWithMHPCO: 3 },
        true
      )
    ).toBe(160);
  });
});
