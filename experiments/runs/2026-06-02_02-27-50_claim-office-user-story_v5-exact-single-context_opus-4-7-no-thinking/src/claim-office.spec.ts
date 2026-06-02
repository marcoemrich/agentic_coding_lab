import { describe, it, expect } from "vitest";
import { runScenario, Item } from "./claim-office.js";

const quotePremium = (years: number, items: Item[]): number => {
  const result = runScenario({
    customer: { yearsWithMHPCO: years },
    steps: [{ op: "quote", items }],
  });
  return (result.results[0] as { premium: number }).premium;
};

describe("MHPCO Claim Office", () => {
  // Quote — base premiums for main items (new customer, single item)
  it("quotes a sword for a new customer (base 100 + 10% first + 5 fee)", () => {
    expect(quotePremium(0, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("quotes an amulet for a new customer", () => {
    expect(quotePremium(0, [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
  });
  it("quotes a staff for a new customer", () => {
    expect(quotePremium(0, [{ type: "staff", material: "oak", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("quotes a potion for a new customer", () => {
    expect(quotePremium(0, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });

  // Quote — components
  it("quotes a single rune component for a new customer", () => {
    expect(quotePremium(0, [{ type: "rune", material: "stone", enchantment: 0, cursed: false }])).toBe(33);
  });
  it("quotes 3 alike runes as a building block (60 G base)", () => {
    const rune: Item = { type: "rune", material: "stone", enchantment: 0, cursed: false };
    expect(quotePremium(0, [rune, rune, rune])).toBe(71);
  });

  // Quote — risk surcharges
  it("adds 50% cursed surcharge to a sword premium", () => {
    expect(quotePremium(0, [{ type: "sword", material: "steel", enchantment: 0, cursed: true }])).toBe(170);
  });
  it("adds 30% high enchantment surcharge to a sword (enchantment ≥ 5)", () => {
    expect(quotePremium(0, [{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(148);
  });

  // Quote — customer discounts and surcharges
  it("applies 20% loyalty discount for long-standing customers (≥ 2 years)", () => {
    expect(quotePremium(2, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("applies 15% subsequent-contract discount to the second quote in a scenario", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  // Claims — base behaviour
  it("pays out a simple amulet claim minus 100 G deductible and reports remaining cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("caps total payout at twice the insurance sum across multiple claims", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 800 }] } },
        { op: "claim", policy: 0, incident: { cause: "curse", damages: [{ itemType: "amulet", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 500 });
    expect(result.results[2]).toEqual({ payout: 500, remainingCap: 0 });
  });
  it("reimburses damage to enchantment ≥ 8 items at 50%", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
  });
  it("fully reimburses damage to dragon-material items", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});
