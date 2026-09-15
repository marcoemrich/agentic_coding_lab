import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { quote, runScenario } from "./claim-office.js";

function invokeCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(5);
  });
  it("uses the main-item price list: sword 1000 G value/100 G base, amulet 600/60, staff 800/80, potion 400/40", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }], customer))).toEqual([115, 71, 93, 49]);
  });
  it("uses 250 G insurance value and 25 G base premium for each component", () => {
    expect(quote([{ type: "rune" }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(33);
  });
  it("quotes 2 runes at a 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G block base premium", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })), { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(71);
  });
  it("quotes 4 runes at 100 G base because the block requires exactly 3", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })), { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(115);
  });
  it("quotes 7 runes at 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone at 75 G base because different component types are not alike", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote(items, { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones at a 120 G base premium using two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items, { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(quote(items, { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(231);
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
  });
  it("applies both 50% curse and 30% high-enchantment surcharges to a cursed sword at exactly enchantment 5", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4, while applying curse only when cursed", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(165);
  });
  it("quotes a newcomer’s first cursed steel sword at 165 G including assessment and fee", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote([sword], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(165);
  });
  it("quotes a long-standing customer’s second contract cursed enchantment-7 sword at 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote([sword], { yearsWithMHPCO: 3, previousContracts: 1 })).toBe(160);
  });
  it("applies the 10% first-insurance assessment to each new item even on a follow-up contract", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, previousContracts: 1 })).toBe(100);
  });
  it("rounds a final premium of 197.5 G up to 198 G while retaining fractional intermediate amounts", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(198);
  });
  it("writes quote and sequential claim results in schema order through the claim-office CLI", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = invokeCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("rejects an unknown quote item via non-zero CLI status, stderr description, and no stdout results", () => {
    const result = invokeCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("reimburses a regular steel enchantment-3 sword damaged by 500 G at 400 G after deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G because components have no special clause", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies one 100 G deductible per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for an enchantment-8 dragon sword damaged by 1000 G because the 50% clause wins before deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for an enchantment-9 dragon sword damaged by 1000 G because the 50% clause wins", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for an enchantment-5 dragon sword damaged by 800 G using full reimbursement before deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for an enchantment-9 steel sword damaged by 1000 G using 50% reimbursement before deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats two insured swords as distinct: 2000 G insurance sum, 4000 G cap, and a deductible for each damage entry", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim via non-zero CLI status when damage entries outnumber insured items of that type", () => {
    const result = invokeCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("sets sword-and-amulet policy cap to 3200 G from their 1600 G insurance sum", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G from unmodified value, not its 165 G premium", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword-and-3-runes insurance sum to 1750 G despite the component block premium discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("limits successive 1500 G sword claims to payouts 1400 then 600 with remaining caps 600 then 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a final payout of 350.5 G down to 350 G while retaining fractional intermediate amounts", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects a claim for a known item type absent from the policy via non-zero CLI status and stderr", () => {
    const result = invokeCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("rejects a claim for an unknown item type via non-zero CLI status and stderr", () => {
    const result = invokeCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("rejects a negative damage amount via non-zero CLI status and stderr", () => {
    const result = invokeCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
