import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should quote a single sword with base premium, first-insurance surcharge, and processing fee", () => {
    const result = processScenario({
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
  it("should quote an amulet using its item-type pricing", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should apply loyalty discount for customers with at least 2 years", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    // yearsWithMHPCO=2: subsequent contract (-15%) + loyalty (-20%) = -35% on base 100G → 65G + 5G fee = 70G
    expect(result).toEqual({ results: [{ premium: 70 }] });
  });
  it("should add risk surcharge for cursed items", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: true }],
        },
      ],
    });
    // +10% first-assessment + 50% cursed = +60% on base 100G → 160G + 5G fee = 165G
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should add risk surcharge for highly enchanted items (level >= 5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // +10% first-assessment + 30% enchantment = +40% on base 100G → 140G + 5G fee = 145G
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("should apply bundle pricing for three alike components", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 3 alike runes: bundle base 60G; +10% first-assessment → 66G; +5G fee = 71G
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should apply deductible and return payout and remaining cap for a basic claim", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    // quote: sword base 100G + 10% first-assessment → 110G + 5G = 115G
    // claim: 300G damage - 100G deductible = 200G payout; cap = 2×1000G - 200G = 1800G
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 200, remainingCap: 1800 }],
    });
  });
  it("should cap claim payout at twice the policy insurance sum", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 900 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 700 }] },
        },
      ],
    });
    // amulet: insuranceSum=600G, cap=1200G; premium=71G
    // claim 1: 900G - 100G deductible = 800G payout; remainingCap = 1200 - 800 = 400G
    // claim 2: 700G - 100G deductible = 600G uncapped, but cap is 400G → payout=400G; remainingCap=0G
    expect(result).toEqual({
      results: [
        { premium: 71 },
        { payout: 800, remainingCap: 400 },
        { payout: 400, remainingCap: 0 },
      ],
    });
  });
});
