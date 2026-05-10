// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty / fee
  it("should return premium of 5 G for empty item list (just processing fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });

  // Quote: single base items (with first-insurance +10% policy modifier and 5 G fee)
  it("should quote a single Sword (base 100 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single Amulet (base 60 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Amulet" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a single Staff (base 80 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Staff" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a single Potion (base 40 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Potion" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("should quote a single Rune component (base 25 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Rune" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote a single Moonstone component (base 25 G + 10% first insurance + 5 G fee)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Moonstone" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });

  // Quote: multiple items summed
  it("should sum premiums for two different items in a single quote", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword" }, { type: "Amulet" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 181 }] });
  });

  // Quote: block of 3 alike components
  it("should apply block-of-3 special premium (60 G) for three alike runes instead of 75 G", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Rune" }, { type: "Rune" }, { type: "Rune" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should apply block-of-3 special premium (60 G) for three alike moonstones instead of 75 G", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Moonstone" }, { type: "Moonstone" }, { type: "Moonstone" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });

  // Item-specific surcharges
  it("should apply +50% cursed surcharge on the item base premium", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword", cursed: true }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should apply +30% high-enchantment surcharge for enchantment >= 5", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword", enchantment: 5 }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("should stack cursed and high-enchantment surcharges on the same item base", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword", cursed: true, enchantment: 5 }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("should apply -20% loyalty discount for customers with >= 2 years", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 2, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Sword" }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should apply -15% follow-up discount for contracts after the first", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword" }] },
        { type: "quote", items: [{ type: "Sword" }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Rounding
  it("should round premium UP to a whole G", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Rune", cursed: true, enchantment: 5 }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 53 }] });
  });

  // Claim: basic deductible
  it("should subtract 100 G deductible per damaged item from a basic claim", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword", material: "steel", enchantment: 3 }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // Claim: payout cap
  it("should cap total payout at 2x the policy insurance sum", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword" }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 1500 }] } },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 1500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Claim: high enchantment clause
  it("should reimburse 50% of damage when item has enchantment >= 8 (then deductible)", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword", material: "steel", enchantment: 9 }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // Claim: dragon material clause
  it("should reimburse full damage when item is made of dragon material", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword", material: "dragon", enchantment: 5 }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 800 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });

  // Claim: both clauses combined
  it("should apply 50% rule first then deductible when both high-enchantment and dragon material apply", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword", material: "dragon", enchantment: 9 }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // Claim: rounding
  it("should round payouts DOWN to a whole G", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword", enchantment: 9 }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: 901 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  // CLI errors (basic validation)
  it("should error on unknown item type in a quote", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [{ type: "quote", items: [{ type: "Broomstick" }] }],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should error on a claim damages array that does not match policy items", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword" }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Amulet", amount: 100 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should error on negative damage amount in a claim", () => {
    const scenario = {
      customer: { name: "Test Customer", years: 0, contracts: 0 },
      steps: [
        { type: "quote", items: [{ type: "Sword" }] },
        { type: "claim", policy: 0, incident: { damages: [{ itemType: "Sword", amount: -200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
