import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  executeScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword from its 100 G base premium at 115 G for a newcomer", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet from its 60 G base premium at 71 G for a newcomer", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff from its 80 G base premium at 93 G for a newcomer", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion from its 40 G base premium at 49 G for a newcomer", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes two runes from their 50 G base premium at 60 G for a newcomer", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly three runes using the 60 G block premium at 71 G for a newcomer", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("quotes four runes without a block from their 100 G base premium at 115 G for a newcomer", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes seven runes without a block at 198 G after keeping 197.5 fractional and rounding up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("does not combine two runes and one moonstone into a block, yielding 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("prices three runes and three moonstones as two separate blocks, yielding 137 G", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a cursed sword plus plain amulet quote, yielding 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("applies the 20% loyalty discount at exactly two years, yielding 95 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("does not apply loyalty below two years, yielding 115 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 1)).toEqual({ premium: 115 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, yielding 195 G for a newcomer sword", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("at enchantment 4 applies only the curse surcharge, yielding 165 G for a cursed newcomer sword", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a newcomer with a cursed steel sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract containing a new cursed enchantment-7 sword at 160 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("reimburses a regular steel enchantment-3 sword damaged by 500 G at 400 G with 1600 G cap remaining", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    } as unknown as Scenario);
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G with 400 G cap remaining", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the enchantment-8 half reimbursement before deductible even for dragon material, paying 400 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the enchantment-9 half reimbursement over dragon full reimbursement, paying 400 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon-material enchantment-5 damage of 800 G before deductible, paying 700 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses steel enchantment-9 damage of 1000 G before deductible, paying 400 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a fractional 350.5 G payout down to 350 G only after reimbursement and deductible", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("applies a separate 100 G deductible to sword and amulet damage in one incident, paying 600 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("maps same-type damage entries to separate insured item instances", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }, { type: "sword", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 },
        ] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it("insures two swords independently with a 4000 G cap and applies a deductible to each damage entry", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status and stderr when damages outnumber insured items of a type", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured|damage/i);
    expect(result.stdout).toBe("");
  });
  it("caps a sword plus amulet policy at 3200 G based on their 1600 G insurance sum", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a cursed sword policy at 2000 G based on unmodified insurance value", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("caps a sword plus three-rune block policy at 3500 G based on 1750 G insurance value", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap across successive 1500 G sword claims: 1400 G then 600 G, leaving zero", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
      ],
    });
    expect(scenario.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for a known item type absent from the policy with non-zero status and stderr", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured|amulet/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for an unknown item type with non-zero status and stderr", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and stderr", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount/i);
    expect(result.stdout).toBe("");
  });
  it("uses the moonstone insurance value of 250 G for a 500 G cap", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("uses the potion insurance value of 400 G for an 800 G cap", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("uses the staff insurance value of 800 G for a 1600 G cap", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("processes steps sequentially and lets a claim reference the quote at its zero-based step index", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(scenario.results[2]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
