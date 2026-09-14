import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, itemAdjustedPremium, roundPayout, roundPremium, runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it.each([
    ["sword", 100], ["amulet", 60], ["staff", 80], ["potion", 40],
  ])("prices %s at %i G base premium", (type, premium) => {
    expect(basePremium([{ type }])).toBe(premium);
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes at 60 G block base", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("prices 4 runes at 100 G base with no partial block", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G base with no partial block", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes and 1 moonstone at 75 G base without a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes and 3 moonstones as two separate 60 G blocks", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(basePremium(items)).toBe(120);
  });
  it("applies curse only to the cursed sword: 210 G before policy modifiers and fee", () => {
    expect(itemAdjustedPremium([
      { type: "sword", cursed: true },
      { type: "amulet", cursed: false },
    ])).toBe(210);
  });
  it("applies the 20% loyalty discount at exactly 2 years: plain sword costs 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies 30% high-enchantment at exactly 5 and combines it with curse: 180 G", () => {
    expect(itemAdjustedPremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("does not surcharge enchantment 4 but still applies curse: 150 G", () => {
    expect(itemAdjustedPremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(150);
  });
  it("rounds final premium 197.5 G up to 198 G", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("quotes a newcomer first-contract cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, descriptive stderr, and empty stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/unknown item.*broomstick/i);
  });

  it("pays 400 G for regular steel enchantment-3 sword damage 500 G and leaves cap 1600 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for rune damage 200 G and leaves 400 G cap", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("pays 400 G for dragon enchantment-8 sword damage 1000 G because high enchantment wins", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 400 G for dragon enchantment-9 sword damage 1000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon enchantment-5 sword damage 800 G under full reimbursement", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel enchantment-9 sword damage 1000 G under half reimbursement", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies separate deductibles to sword 500 G and amulet 300 G, paying 600 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats duplicate swords separately with cap 4000 G and one deductible per damage", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than covered via non-zero CLI status and stderr", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/damage.*sword.*exceeds.*cover/i);
  });
  it("sets sword plus amulet cap from 1600 G insurance sum to 3200 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed sword cap to 2000 G from unmodified insurance value", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword plus 3-rune-block cap to 3500 G from insurance sum 1750 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts sword cap across two 1500 G claims: 1400/600 then 600/0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds final payout 350.5 G down to 350 G", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
  it("rejects uninsured amulet damage via non-zero CLI status and descriptive stderr", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/amulet.*exceeds.*cover/i);
  });
  it("rejects unknown broomstick damage via non-zero CLI status and descriptive stderr", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/broomstick.*exceeds.*cover/i);
  });
  it("rejects damage amount -200 via non-zero CLI status and descriptive stderr", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/amount.*negative.*-200/i);
  });
  it("emits one ordered result per quote and claim with binding JSON field names", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const result = spawnSync("./claim-office", [], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
