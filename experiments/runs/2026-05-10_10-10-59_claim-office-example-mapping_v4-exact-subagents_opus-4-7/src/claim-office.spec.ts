import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { quote, claim, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Quote (Premium Calculation)", () => {
  // Simplest case: empty quote
  it("should return 5G premium (just processing fee) for empty item list", () => {
    const result = quote({ customer: { yearsWithMHPCO: 0 }, items: [], previousContracts: 0 });
    expect(result).toEqual({ premium: 5 });
  });

  // Single item base premiums (no modifiers other than first-insurance per-item surcharge)
  it("should calculate premium for a single plain sword for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should calculate premium for a single plain amulet for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "amulet", material: "gold", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 71 });
  });
  it("should calculate premium for a single plain staff for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 93 });
  });
  it("should calculate premium for a single plain potion for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 49 });
  });
  it("should calculate premium for a single rune component for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 33 });
  });
  it("should calculate premium for a single moonstone component for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "moonstone", material: "stone", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 33 });
  });

  // Multiple items, base premiums
  it("should sum base premiums for a cursed sword plus plain amulet (before fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "gold", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 231 });
  });
  it("should calculate premium for a plain sword plus plain amulet for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "gold", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 181 });
  });

  // Item-specific modifiers
  it("should add 50% surcharge to base premium for a cursed item", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 165 });
  });
  it("should add 30% surcharge to base premium for a highly enchanted item (enchantment >= 5)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 145 });
  });
  it("should apply both cursed and high-enchantment surcharges to the same item", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 195 });
  });

  // Component blocks
  it("should charge 50G for 2 runes (no block)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 60 });
  });
  it("should charge 60G base for 3 alike runes as a block", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 71 });
  });
  it("should charge 100G for 4 runes (one block of 3 plus 1 single)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should charge 175G for 7 runes (two blocks of 3 plus 1 single)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 198 });
  });
  it("should charge 75G for 2 runes plus 1 moonstone (no block, mixed types)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 88 });
  });
  it("should charge 120G for 3 runes plus 3 moonstones (two separate blocks)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 137 });
  });

  // Policy-wide modifiers
  it("should apply 20% loyalty discount for long-standing customer (>= 2 years)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 2 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 95 });
  });
  it("should apply 10% first-insurance surcharge per item for a newcomer", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 225 });
  });
  it("should apply 15% follow-up contract discount on subsequent quotes", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      previousContracts: 1,
    });
    expect(result).toEqual({ premium: 100 });
  });

  // Combined modifiers (canonical examples from spec)
  it("should calculate 165G for newcomer with cursed sword (100 + 50 + 10 + 5)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 165 });
  });
  it("should calculate 160G for long-standing customer 2nd contract with cursed sword ench 7", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 3 },
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      previousContracts: 1,
    });
    expect(result).toEqual({ premium: 160 });
  });

  // Rounding
  it("should round the final premium UP to whole G (in MHPCO's favor)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 2 },
      items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 28 });
  });
  it("should round 197.5G premium up to 198G", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      previousContracts: 0,
    });
    expect(result).toEqual({ premium: 198 });
  });
});

describe("MHPCO Claim Office - Claim (Damage Payout)", () => {
  // Simplest case
  it("should pay out damage minus 100G deductible for a plain item", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay out 400G for a regular sword ench 3 with 500G damage", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Component claims (no special clauses)
  it("should pay out 100G for a rune with 200G damage (250G insured, minus deductible)", () => {
    const result = claim({
      items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Special clauses
  it("should reimburse 50% of damage then deduct 100G for items with enchantment >= 8", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay out 400G for a steel sword ench 9 with 1000G damage", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should fully reimburse dragon-material items then deduct 100G", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should pay out 700G for a dragon sword ench 5 with 800G damage", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should apply 50% rule (not dragon rule) when both apply, paying 400G for dragon sword ench 8 with 1000G damage", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Multiple damage entries
  it("should apply own deductible to each damage entry when one event damages multiple items", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "gold", enchantment: 0, cursed: false },
      ],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap (2x unmodified insurance sum)
  it("should cap total payout at 2x sum of unmodified insurance values across the policy", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "sword", amount: 5000 }],
    });
    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("should reduce payout when remaining cap is less than computed payout", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "sword", amount: 1500 }],
      remainingCap: 600,
    });
    expect(result).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("should share the cap across multiple successive claims on the same policy", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const result1 = claim({
      items: policyItems,
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
    const result2 = claim({
      items: policyItems,
      damages: [{ itemType: "sword", amount: 1500 }],
      remainingCap: result1.remainingCap,
    });
    expect(result2).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Rounding
  it("should round the final payout DOWN to whole G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 333 }],
    });
    expect(result).toEqual({ payout: 66, remainingCap: 1934 });
  });
  it("should round a 350.5G payout down to 350G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO Claim Office - CLI", () => {
  it("should read JSON from stdin and write a results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should produce a results array with one entry per step", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "amulet", material: "gold", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results).toHaveLength(2);
  });
  it("should output {premium: N} for a quote step", () => {
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
  it.todo("should output {payout: N, remainingCap: N} for a claim step");
  it.todo("should track remaining cap across successive claims on the same policy");
  it.todo("should reference the policy by step index for claim operations");
});

describe("MHPCO Claim Office - Errors", () => {
  it.todo("should exit non-zero and write to stderr for an unknown item type in a quote");
  it.todo("should exit non-zero and write to stderr when a claim references an item not in the policy");
  it.todo("should exit non-zero and write to stderr for a damage entry with negative amount");
  it.todo("should exit non-zero and write to stderr when damages contain more entries of a type than the policy covers");
});
