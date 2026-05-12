import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should quote a single sword with no modifiers: base premium plus processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // base: 100, first insurance +10% = 110, processing fee +5 = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should quote a single component with no modifiers: component premium plus processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "component", material: "moonstone", enchantment: 0, cursed: false }],
        },
      ],
    });
    // base: 25, first insurance +10% = 27.5 → ceil = 28, processing fee +5 = 33
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should quote 3 alike components at bundle rate plus processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", material: "rune", enchantment: 0, cursed: false },
            { type: "component", material: "rune", enchantment: 0, cursed: false },
            { type: "component", material: "rune", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // bundle: 3 alike components = 60G base, first insurance +10% = 66, processing fee +5 = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should apply 50% surcharge for a cursed item", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // base: 100, cursed +50% + first insurance +10% = rate 1.60 → 160, fee +5 = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("should apply 20% loyalty discount for long-standing customer (>=2 years)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    // base: 100, first insurance +10% = 110%, loyalty -20% = 90%, fee +5 = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should pay out damage minus deductible for a basic claim", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
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
    // sword insured at 1000G, cap = 2*1000 = 2000G
    // damage 300G - deductible 100G = payout 200G, remaining cap = 1800G
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("should fully reimburse damage to dragon material items", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // dragon material: fully reimbursed (100% rate), deductible 100G → payout 400G
    // sword insurance sum 1000G, cap 2000G, remaining = 2000 - 400 = 1600G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should reduce remaining cap after each claim", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 400 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 250 }] },
        },
      ],
    });
    // amulet insurance 600G, cap = 1200G
    // claim1: 400-100=300 payout, remaining 900G
    // claim2: 250-100=150 payout, remaining 750G
    expect(result.results[1]).toEqual({ payout: 300, remainingCap: 900 });
    expect(result.results[2]).toEqual({ payout: 150, remainingCap: 750 });
  });
});
