import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Item values and base premiums
  it("should calculate base premium for sword (100 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(100);
  });
  it("should calculate base premium for amulet (60 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it("should calculate base premium for staff (80 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(80);
  });
  it("should calculate base premium for potion (40 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(40);
  });
  it("should calculate base premium for single component (25 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(25);
  });
  it("should apply building block discount for 3 alike components (60 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it.todo("should not apply building block discount for 2 alike components (50 G)");
  it.todo("should not apply building block discount for 4 alike components (100 G)");
  it.todo("should apply separate building blocks for different component types (120 G)");

  // Premium modifiers
  it.todo("should add 50% cursed surcharge to item base premium");
  it.todo("should add 30% high enchantment surcharge for enchantment level >= 5");
  it.todo("should apply 20% loyalty discount for customers with >= 2 years");
  it.todo("should add 10% first insurance surcharge");
  it.todo("should apply 15% follow-up contract discount");
  it.todo("should add 5 G processing fee to every premium");
  it.todo("should round premium up to whole G in MHPCO's favor (197.5 -> 198)");

  // Modifier scope
  it.todo("should apply cursed surcharge only to cursed item's base premium");
  it.todo("should apply policy-wide modifiers to sum of all item base premiums");
  it.todo("should apply both cursed and high enchantment surcharges to same item");

  // Claim processing
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should cap total payout at twice insurance sum");
  it.todo("should reimburse at 50% for items with enchantment >= 8");
  it.todo("should fully reimburse damage to dragon material items");
  it.todo("should apply high-enchantment clause before deductible");
  it.todo("should apply dragon-material clause before deductible");
  it.todo("should apply high-enchantment clause over dragon-material when both apply");
  it.todo("should round payout down to whole G in MHPCO's favor (350.5 -> 350)");

  // Multiple items
  it.todo("should calculate insurance sum for multiple items of same type");
  it.todo("should apply separate deductible for each damaged item");
  it.todo("should reject claim with more damage entries than policy items");

  // Cap exhaustion
  it.todo("should calculate cap based on unmodified insurance values");
  it.todo("should not let building block discount affect insurance sum");
  it.todo("should reduce second claim payout when cap is partially exhausted");
  it.todo("should limit payout to remaining cap");

  // Integration examples
  it.todo("should calculate 165 G premium for newcomer with cursed sword");
  it.todo("should calculate 160 G premium for long-standing customer's second contract with cursed sword");

  // Edge cases
  it.todo("should return 5 G premium for empty item list");
  it.todo("should exit with error for unknown item type in quote");
  it.todo("should exit with error for damage to uninsured item in claim");
  it.todo("should exit with error for negative damage amount in claim");

  // Modifier thresholds
  it.todo("should apply loyalty discount for exactly 2 years");
  it.todo("should apply high-enchantment surcharge for exactly enchantment 5");
  it.todo("should not apply high-enchantment surcharge for enchantment 4");
  it.todo("should apply both surcharges to cursed item with enchantment 5");
  it.todo("should apply high-enchantment clause to dragon material item with enchantment 8");
});