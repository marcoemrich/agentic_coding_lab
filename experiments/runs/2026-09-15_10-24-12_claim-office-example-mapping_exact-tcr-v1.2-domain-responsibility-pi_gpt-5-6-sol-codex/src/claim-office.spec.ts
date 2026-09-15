import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

function quote(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0, priorQuotes = 0): number {
  const steps = [
    ...Array.from({ length: priorQuotes }, () => ({ op: "quote" as const, items: [] })),
    { op: "quote" as const, items },
  ];
  const result = processScenario({ customer: { yearsWithMHPCO }, steps }).results.at(-1);
  if (result === undefined || !("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword for 115 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes one plain amulet, staff, and potion from base premiums 60 G, 80 G, and 40 G", () => {
    expect([quote([{ type: "amulet" }]), quote([{ type: "staff" }]), quote([{ type: "potion" }])]).toEqual([71, 93, 49]);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G base premium", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(71);
  });
  it("quotes 4 runes at 100 G base premium because a block requires exactly 3", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes at 175 G base premium because no block applies", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone at 75 G base premium because alike means the same type", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones at 120 G base premium as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(quote(items)).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword, producing 210 G before policy modifiers and fee with a plain amulet", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the 20 percent loyalty discount at exactly 2 years with MHPCO", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword at exactly enchantment 5", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but still applies curse when cursed", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("rounds a final premium of 197.5 G up to 198 G while retaining fractional intermediate amounts", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "moonstone" })))).toBe(198);
  });
  it("quotes a newcomer first contract with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a new cursed enchantment-7 sword at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1)).toBe(160);
  });
  it("rejects an unknown quote item with non-zero status, an stderr description, and no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("Unknown item type: broomstick");
    expect(execution.stdout).toBe("");
  });

  it("pays 400 G for regular sword damage of 500 G after one 100 G deductible", () => {
    const scenario = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G after one 100 G deductible", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when sword damage 500 G and amulet damage 300 G each receive a deductible", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for an enchantment-8 dragon sword damaged by 1000 G because the 50 percent clause wins before deductible", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for an enchantment-9 dragon sword damaged by 1000 G because the 50 percent clause wins before deductible", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for an enchantment-5 dragon sword damaged by 800 G using full reimbursement before deductible", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for an enchantment-9 steel sword damaged by 1000 G using half reimbursement before deductible", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a final payout of 350.5 G down to 350 G while retaining fractional intermediate amounts", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("insures two swords for 2000 G with a 4000 G cap and treats two sword damages separately", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects an entire claim when sword damage entries outnumber insured swords", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("More sword damages than insured items");
    expect(execution.stdout).toBe("");
  });
  it("sets sword-and-amulet insurance sum to 1600 G and cap to 3200 G", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G from unmodified 1000 G insurance value", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results;
    expect(results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword-and-3-runes insurance sum to 1750 G despite the component block premium", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("pays 1400 G on the first 1500 G sword claim and leaves 600 G cap", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("limits the second 1500 G sword claim to the remaining 600 G and exhausts the cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects claim damage for a type absent from the policy with non-zero status and an stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("Damage item is not covered: amulet");
    expect(execution.stdout).toBe("");
  });
  it("rejects claim damage with an unknown item type with non-zero status and an stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("Damage item is not covered: broomstick");
    expect(execution.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and an stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("Damage amount cannot be negative");
    expect(execution.stdout).toBe("");
  });
  it("processes quote then claim sequentially and emits ordered schema-shaped results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).toBe(0);
    expect(execution.stderr).toBe("");
    expect(JSON.parse(execution.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
