// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Quote: empty and basic single items ===
  it("should return premium of 5 G (processing fee only) for an empty item list", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [],
    });
    expect(result).toEqual({ premium: 5 });
  });
  it("should quote a single sword at 110 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should quote a single amulet at 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 71 });
  });
  it("should quote a single staff at 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 93 });
  });
  it("should quote a single potion at 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 49 });
  });
  it("should quote a single rune at 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 33 });
  });
  it("should quote a single moonstone at 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "moonstone", material: "crystal", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 33 });
  });

  // === Quote: multiple distinct items ===
  it("should quote multiple distinct items by summing their item premiums plus the 5 G fee", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 181 });
  });

  // === Quote: components and blocks of 3 alike ===
  it("should quote exactly 3 alike runes as a block with 60 G base premium (plus first-insurance and fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 71 });
  });
  it("should quote exactly 3 alike moonstones as a block with 60 G base premium (plus first-insurance and fee)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 71 });
  });
  it("should NOT treat 4 alike runes as a block (charge each rune individually)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should NOT treat 2 alike runes as a block (charge each rune individually)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 60 });
  });

  // === Quote: item-specific modifiers ===
  it("should add 50% cursed surcharge on a cursed item's base premium", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
    });
    expect(result).toEqual({ premium: 165 });
  });
  it("should add 30% high-enchantment surcharge for an item with enchantment >= 5", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
    });
    expect(result).toEqual({ premium: 145 });
  });
  it("should NOT add high-enchantment surcharge for enchantment level < 5", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should stack cursed and high-enchantment surcharges additively on the item's base premium", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
    });
    expect(result).toEqual({ premium: 195 });
  });

  // === Quote: policy-wide modifiers ===
  it("should apply -20% loyalty discount when customer has been insured for >= 2 years", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 3, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 95 });
  });
  it("should NOT apply loyalty discount when customer has been insured < 2 years", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 1, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 115 });
  });
  it("should apply -15% follow-up discount for the customer's second contract", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 2 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 100 });
  });
  it("should NOT apply follow-up discount for the customer's first contract", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 115 });
  });

  // === Quote: multiple items of same type (separate insurance) ===
  it("should treat two swords as separate insurance entries (each charged individually)", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ],
    });
    expect(result).toEqual({ premium: 225 });
  });

  // === Quote: rounding ===
  it("should round the final premium UP to whole G in MHPCO's favor", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 2, contractNumber: 1 },
      items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
    });
    expect(result).toEqual({ premium: 28 });
  });

  // === Quote: integration examples from spec ===
  it("should quote newcomer's cursed sword (steel, enchantment 3) at 165 G", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
    });
    expect(result).toEqual({ premium: 165 });
  });
  it("should quote 3-year customer's 2nd contract cursed sword (steel, enchantment 7) at 160 G", () => {
    const result = runScenario({
      command: "quote",
      customer: { yearsInsured: 3, contractNumber: 2 },
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
    });
    expect(result).toEqual({ premium: 160 });
  });

  // === Claim: basic single damage ===
  it("should pay out damage minus 100 G deductible for a single damaged item", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ type: "sword", amount: 500 }],
    });
    expect(result).toMatchObject({ payout: 400 });
  });
  it("should report remainingCap as 2x unmodified insurance sum minus payout after a claim", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ type: "sword", amount: 500 }],
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: enchantment and material clauses ===
  it("should pay only 50% reimbursement when damaged item has enchantment >= 8", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      damages: [{ type: "sword", amount: 1000 }],
    });
    expect(result).toMatchObject({ payout: 400 });
  });
  it("should pay full reimbursement when damaged item is made of dragon material (overrides 50% clause)", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      damages: [{ type: "sword", amount: 1000 }],
    });
    expect(result).toMatchObject({ payout: 900 });
  });
  it("should NOT apply enchantment/material clauses to runes or moonstones", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "rune", material: "stone", enchantment: 9, cursed: false }],
      damages: [{ type: "rune", amount: 200 }],
    });
    expect(result).toMatchObject({ payout: 100 });
  });

  // === Claim: cap enforcement ===
  it("should cap total payout at 2x unmodified insurance sum across multiple claim events", () => {
    // From spec: sword insurance sum 1000 G, cap 2000 G; two successive
    // claims of 1500 G each → first payout 1400, second payout 600.
    const scenario = {
      customer: { yearsInsured: 0, contractNumber: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ type: "sword", amount: 1500 }],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ type: "sword", amount: 1500 }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("should round payout DOWN to whole G in MHPCO's favor", () => {
    const result = runScenario({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      damages: [{ type: "sword", amount: 501 }],
    });
    expect(result).toMatchObject({ payout: 150 });
  });

  // === CLI integration / error cases ===
  it("should exit non-zero and write to stderr when quote contains an unknown item type", () => {
    const input = JSON.stringify({
      command: "quote",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "banana", material: "yellow", enchantment: 0, cursed: false }],
    });
    const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item type/i);
  });
  it("should exit non-zero when a claim references an item not in the policy", () => {
    const input = JSON.stringify({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ type: "amulet", amount: 100 }],
    });
    const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not in the policy/i);
  });
  it("should exit non-zero when a claim has more damage entries of a type than the policy covers", () => {
    const input = JSON.stringify({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [
        { type: "sword", amount: 100 },
        { type: "sword", amount: 200 },
      ],
    });
    const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/more damage entries.*than.*polic/i);
  });
  it("should exit non-zero when a claim contains a negative damage amount", () => {
    const input = JSON.stringify({
      command: "claim",
      customer: { yearsInsured: 0, contractNumber: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ type: "sword", amount: -100 }],
    });
    const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative damage/i);
  });
});
