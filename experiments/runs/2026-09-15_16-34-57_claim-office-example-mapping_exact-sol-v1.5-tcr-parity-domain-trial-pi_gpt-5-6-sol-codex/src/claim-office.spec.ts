import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, processScenario, quote, riskAdjustedPremium } from "./claim-office.js";

const newcomer = { yearsWithMHPCO: 0 };

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

function runScenario(steps: unknown[], yearsWithMHPCO = 0) {
  return processScenario({ customer: { yearsWithMHPCO }, steps }) as { results: Array<Record<string, number>> };
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote(newcomer, [], 0)).toBe(5);
  });
  it("prices sword, amulet, staff, and potion base premiums at 100, 60, 80, and 40 G", () => {
    expect(basePremium([{ type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" }])).toBe(280);
  });
  it("prices 2 runes at a 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as one 60 G building block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("prices 4 runes at 100 G because blocks require exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G because no block applies", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes and 1 moonstone at 75 G because unlike component types do not form a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes and 3 moonstones at 120 G as two separate blocks", () => {
    const components = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(basePremium(components)).toBe(120);
  });
  it("applies a cursed surcharge only to the cursed sword: sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    expect(riskAdjustedPremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
  it("applies the 20% loyalty discount at exactly 2 years", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("applies both 50% curse and 30% high-enchantment surcharges to a cursed enchantment-5 sword", () => {
    expect(riskAdjustedPremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("does not apply the high-enchantment surcharge at enchantment 4 but still applies a curse surcharge", () => {
    expect(riskAdjustedPremium([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(150);
  });
  it("quotes a newcomer’s first cursed steel sword at 165 G", () => {
    expect(quote(newcomer, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("quotes a 3-year customer’s second-contract cursed enchantment-7 sword at 160 G, retaining per-item first-insurance surcharge", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1)).toBe(160);
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(quote(newcomer, Array.from({ length: 7 }, () => ({ type: "rune" })), 0)).toBe(198);
  });
  it("rejects an unknown quote item via CLI with non-zero status, descriptive stderr, and no stdout results", () => {
    const result = runCli({ customer: newcomer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("reimburses regular steel enchantment-3 sword damage of 500 G at 400 G after one deductible", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G after one deductible", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reimburses dragon enchantment-8 sword damage of 1000 G at 400 G because the high-enchantment clause wins", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses dragon enchantment-9 sword damage of 1000 G at 400 G when both special clauses apply", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    expect(result.results[1]?.payout).toBe(400);
  });
  it("reimburses dragon enchantment-5 sword damage of 800 G at 700 G in full before deductible", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ]);
    expect(result.results[1]?.payout).toBe(700);
  });
  it("reimburses steel enchantment-9 sword damage of 1000 G at 400 G using the 50% clause", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    expect(result.results[1]?.payout).toBe(400);
  });
  it("applies one 100 G deductible to each of two damaged items, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("covers two swords independently with insurance sum 2000 G and cap 4000 G", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers via CLI", () => {
    const result = runCli({ customer: newcomer, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("sword");
    expect(result.stdout).toBe("");
  });
  it("sets sword-plus-amulet cap from the 1600 G insurance sum to 3200 G", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ]);
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value, not its 165 G premium", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ]);
    expect(result.results[0]?.premium).toBe(165);
    expect(result.results[1]?.remainingCap).toBe(2000);
  });
  it("sets sword-plus-3-runes cap from the 1750 G insurance sum to 3500 G despite block pricing", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ]);
    expect(result.results[1]?.remainingCap).toBe(3500);
  });
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G, exhausting the 2000 G cap", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = runScenario([
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ]);
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } },
    ]);
    expect(result.results[1]?.payout).toBe(350);
  });
  it("rejects damage to an item type absent from the policy via CLI with non-zero status and descriptive stderr", () => {
    const result = runCli({ customer: newcomer, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damage item type via CLI with non-zero status and descriptive stderr", () => {
    const result = runCli({ customer: newcomer, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount via CLI with non-zero status and descriptive stderr", () => {
    const result = runCli({ customer: newcomer, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("-200");
    expect(result.stdout).toBe("");
  });
  it("emits one ordered result per quote and claim using the binding JSON field names", () => {
    const result = runScenario([
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ], 5);
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
