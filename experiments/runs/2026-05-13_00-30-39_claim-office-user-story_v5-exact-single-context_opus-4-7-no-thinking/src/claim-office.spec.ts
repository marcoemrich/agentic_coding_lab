import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quoting — base item types
  it("should quote a single sword for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single amulet for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };
    const result = runScenario(input);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it.todo("should quote a single staff for a new customer");
  it.todo("should quote a single potion for a new customer");

  // Quoting — components
  it.todo("should quote a single component (rune) at component price");
  it.todo("should quote a building block of 3 alike components at special price");

  // Quoting — multiple items
  it.todo("should quote multiple main items together");

  // Quoting — surcharges
  it.todo("should add 50% surcharge for cursed items");
  it.todo("should add 30% surcharge for highly enchanted items (enchantment >= 5)");

  // Quoting — customer-level adjustments
  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");
  it.todo("should apply 10% initial assessment surcharge on first insurance");
  it.todo("should apply 15% discount on contracts after the first");

  // Quoting — rounding
  it.todo("should round premium up to whole G in MHPCO's favor");

  // Claims — base payout
  it.todo("should pay out a basic claim minus the 100 G deductible");
  it.todo("should cap total payout at twice the insurance sum across multiple claims");
  it.todo("should reimburse only 50% of damage for items with enchantment >= 8");
  it.todo("should fully reimburse damage for items made of dragon material");

  // CLI / scenario flow
  it.todo("should report remainingCap after each claim");
});
