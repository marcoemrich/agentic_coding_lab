import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, insuranceValue, runScenario, type Scenario } from "./claim-office.js";

function runCli(scenario: Scenario) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G -- processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list -- sword 100/1000, amulet 60/600, staff 80/800, potion 40/400 premium/value", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => [basePremium([{ type }]), insuranceValue({ type })]))
      .toEqual([[100, 1000], [60, 600], [80, 800], [40, 400]]);
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes at the 60 G block premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("prices 4 runes at 100 G base premium -- no block", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G base premium", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone at 75 G -- unlike types do not form a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones at 120 G -- two separate blocks", () => {
    expect(basePremium([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toBe(120);
  });
  it("scopes a cursed surcharge to its item -- cursed sword plus plain amulet quotes at 231 G including first-insurance surcharge and fee", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years -- plain sword quotes at 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5 -- cursed sword quotes at 195 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] },
    ] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment below 5 -- cursed enchantment-4 sword quotes at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] },
    ] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer first contract with a cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [
        { type: "sword", cursed: true, enchantment: 5 }, { type: "rune" },
      ] },
    ] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("pays 400 G for regular sword damage of 500 G -- one 100 G deductible", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for rune damage of 200 G -- components use standard reimbursement", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G -- 50 percent wins then deductible", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when one event damages a sword for 500 G and amulet for 300 G -- deductible per damaged item", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for dragon-material enchantment-9 sword damage of 1000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon-material enchantment-5 sword damage of 800 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel enchantment-9 sword damage of 1000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sets a two-sword policy insurance sum to 2000 G and cap to 4000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles -- payout 800 G for 500 G each", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim via non-zero CLI exit when two sword damages exceed one insured sword", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("sets sword-plus-amulet cap to 3200 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed-sword cap to 2000 G from unmodified insurance value", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sets sword-plus-3-rune cap to 3500 G -- block affects premium only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts cap over successive 1500 G claims -- payouts 1400 then 600, remaining cap 600 then 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [damage] } },
    ] }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects unknown quote item via non-zero CLI exit, stderr description, and empty stdout", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage to an uninsured item via non-zero CLI exit and stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects an unknown damage item via non-zero CLI exit and stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects negative damage via non-zero CLI exit and stderr description", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
});
