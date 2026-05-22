import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base prices per item type
  it("quotes a sword for a new customer (base price + processing fee + first-insurance surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet, staff, and potion correctly", () => {
    const quoteOne = (type: string): number => {
      const r = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type, material: "x", enchantment: 1, cursed: false }] }],
      });
      return (r.results[0] as { premium: number }).premium;
    };
    expect(quoteOne("amulet")).toBe(71);
    expect(quoteOne("staff")).toBe(93);
    expect(quoteOne("potion")).toBe(49);
  });
  it("quotes a single component (rune) at 25 G base", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(r).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 3 alike components as a building block at 60 G base", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(r).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 alike components as one building block plus one single", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(r).toEqual({ results: [{ premium: 99 }] });
  });

  // Quote: modifiers
  it("applies 50% surcharge for a cursed item", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(r).toEqual({ results: [{ premium: 170 }] });
  });
  it("applies 30% surcharge for an item with enchantment level >= 5", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(r).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies 20% loyalty discount for customers with >= 2 years", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(r).toEqual({ results: [{ premium: 85 }] });
  });
  it("applies 15% multi-contract discount on contracts after the first", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(r).toEqual({ results: [{ premium: 85 }, { premium: 73 }] });
  });
  it("rounds the total premium up (in MHPCO's favor)", () => {
    // 40 * 1.30 * 1.10 = 57.2 → ceil 58, + 5 fee = 63
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", enchantment: 5 }] }],
    });
    expect(r).toEqual({ results: [{ premium: 63 }] });
  });

  // Claim: payouts
  it("pays 0 when total damage does not exceed the 100 G deductible", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 80 }] } },
      ],
    });
    expect(r.results[1]).toEqual({ payout: 0 });
  });
  it("pays damage minus 100 G deductible for ordinary items", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(r.results[1]).toEqual({ payout: 200 });
  });
  it("pays 50% of damage (minus deductible) for items with enchantment >= 8", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 400 }] } },
      ],
    });
    expect(r.results[1]).toEqual({ payout: 100 });
  });
  it("pays full damage (minus deductible) for items made of dragon material", () => {
    // Dragon material wins over high-enchantment 50% rule
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 10 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(r.results[1]).toEqual({ payout: 400 });
  });

  // CLI / scenario orchestration
  it("runs a scenario with a quote followed by a claim against that policy", () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(r).toEqual({ results: [{ premium: 53 }, { payout: 100 }] });
  });
});
