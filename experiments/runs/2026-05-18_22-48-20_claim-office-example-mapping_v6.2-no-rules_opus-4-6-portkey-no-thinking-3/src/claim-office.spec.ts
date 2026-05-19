import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === QUOTE: Base premiums ===
  it("returns premium of 5 G for an empty item list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("calculates base premium of 100 G + 5 G fee for a single sword", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("calculates base premium for each item type (amulet 60, staff 80, potion 40)", () => {
    const makeScenario = (type: string) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type, material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(processScenario(makeScenario("amulet"))).toEqual({ results: [{ premium: 71 }] });
    expect(processScenario(makeScenario("staff"))).toEqual({ results: [{ premium: 93 }] });
    expect(processScenario(makeScenario("potion"))).toEqual({ results: [{ premium: 49 }] });
  });
  it("calculates base premium of 25 G per component (rune/moonstone)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "rune" },
          { type: "rune" },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("applies building block discount: 3 alike components cost 60 G instead of 75 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("does not apply block discount for 4 alike components (block requires exactly 3)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("calculates mixed components without block (2 runes + 1 moonstone = 75 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("applies two separate blocks for 3 runes + 3 moonstones = 120 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("sums base premiums for multiple different items in a policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  // === QUOTE: Item-specific modifiers ===
  it("adds 50% cursed surcharge to the cursed item's base premium only", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("applies both cursed and high-enchantment surcharges to same item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("applies item-specific surcharges only to affected items in multi-item policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // === QUOTE: Policy-wide modifiers ===
  it("applies 10% first insurance surcharge to policy base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies 20% loyalty discount for customers with >= 2 years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies 15% follow-up discount on second and subsequent contracts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { premium: 100 },
      ],
    });
  });
  it("combines all modifiers: newcomer with cursed sword = 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("combines all modifiers: long-standing customer second contract cursed enchanted sword = 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // === QUOTE: Rounding ===
  it("rounds premiums up (in MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // === QUOTE: Errors ===
  it("rejects unknown item type with non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
      }],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // === CLAIM: Standard reimbursement ===
  it("reimburses full damage minus 100 G deductible for regular item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 500 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("applies deductible per damaged item in multi-damage event", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [
            { type: "sword", amount: 500 },
            { type: "amulet", amount: 300 },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 600 });
  });
  it("reimburses component damage minus deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "rune", amount: 200 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 100 });
  });

  // === CLAIM: Special clauses ===
  it("reimburses enchantment >= 8 damage at 50% then deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 1000 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("reimburses dragon material damage fully then deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 800 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 700 });
  });
  it("when both dragon and enchantment >= 8 apply, 50% rule wins then deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 1000 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("dragon material with enchantment < 8 gets full reimbursement then deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 600 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 500 });
  });

  // === CLAIM: Cap ===
  it("caps total payout at 2x insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 2500 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 2000 });
  });
  it("tracks remaining cap across multiple claims on same policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 1500 }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 1500 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1400 });
    expect(result.results[2]).toEqual({ payout: 600 });
  });
  it("reduces payout to remaining cap when cap is nearly exhausted", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 1900 }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: 500 }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1800 });
    expect(result.results[2]).toEqual({ payout: 200 });
  });

  // === CLAIM: Errors ===
  it("rejects damage to item not covered by policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "amulet", amount: 300 }],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("rejects more damage entries of a type than policy covers", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [
            { type: "sword", amount: 300 },
            { type: "sword", amount: 200 },
          ],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("rejects negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policyIndex: 0,
          damages: [{ type: "sword", amount: -100 }],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // === CLI integration ===
  it("processes a full scenario with quote and claim steps via CLI JSON interface", () => {
    const { execSync } = require("child_process");
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policyIndex: 0,
          damages: [{ type: "sword", amount: 500 }],
        },
      ],
    };
    const input = JSON.stringify(scenario);
    const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
      encoding: "utf-8",
      cwd: process.cwd(),
    });
    const result = JSON.parse(output.trim());
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400 },
      ],
    });
  });
});
