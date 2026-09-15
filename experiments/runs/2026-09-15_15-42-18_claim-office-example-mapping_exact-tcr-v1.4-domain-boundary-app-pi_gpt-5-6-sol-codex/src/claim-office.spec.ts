import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0].premium;

const runCli = (scenario: unknown) => spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes sword, amulet, staff, and potion price-list premiums as 115, 71, 93, and 49 G for a newcomer", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }]))).toEqual([115, 71, 93, 49]);
  });
  it("quotes one component at its 25 G base premium, producing 33 G after first-insurance surcharge, fee, and favorable rounding", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("quotes 2 runes at 50 G base premium, producing 60 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the 60 G block premium, producing 71 G total", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(71);
  });
  it("quotes 4 runes at 100 G base premium with no block, producing 115 G total", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes at 175 G base premium, producing 198 G total after favorable rounding", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base and 88 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("prices 3 runes and 3 moonstones as two separate blocks: 120 G base and 137 G total", () => {
    const components = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(components)).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy: 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the 20% loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment exactly 5: a sword costs 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply the enchantment surcharge at level 4 but still applies curse: a sword costs 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a newly insured cursed level-7 sword at 160 G", () => {
    const scenario = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(scenario.results[1].premium).toBe(160);
  });
  it("processes a regular steel level-3 sword damage of 500 G as a 400 G payout with 1600 G cap remaining", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("processes rune damage of 200 G as a 100 G payout with 400 G cap remaining", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the level-8 50% reimbursement before the deductible even for dragon material: 1000 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the level-9 50% clause win over dragon material: 1000 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1].payout).toBe(400);
  });
  it("fully reimburses a dragon-material level-5 sword before deductible: 800 G damage pays 700 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1].payout).toBe(700);
  });
  it("reimburses a steel level-9 sword at 50% before deductible: 1000 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1].payout).toBe(400);
  });
  it("applies a separate 100 G deductible to sword and amulet damages: 500 G plus 300 G pays 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1].payout).toBe(600);
  });
  it("insures two swords for a 4000 G cap and treats two sword damages separately", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim through a non-zero CLI exit when sword damages outnumber insured swords", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/damage/i);
    expect(execution.stdout).toBe("");
  });
  it("bases a sword-and-amulet policy cap on the 1600 G insurance sum, yielding a 3200 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap on its unmodified 1000 G value, yielding a 2000 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(2000);
  });
  it("bases a sword-and-3-rune block cap on the undiscounted 1750 G insurance sum, yielding a 3500 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(3500);
  });
  it("tracks cap exhaustion across two 1500 G sword claims: payouts 1400 G then 600 G, ending at zero", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [damage] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1].payout).toBe(350);
  });
  it("rejects an unknown quoted item through a non-zero CLI exit with stderr and no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/item/i);
    expect(execution.stdout).toBe("");
  });
  it("rejects damage to an uninsured or unknown item through a non-zero CLI exit with stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(execution.status).not.toBe(0);
      expect(execution.stderr).toMatch(/damage/i);
    }
  });
  it("rejects a negative damage amount through a non-zero CLI exit with stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/damage/i);
  });
  it("reads schema-named JSON from stdin and writes ordered quote and claim results to stdout", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).toBe(0);
    expect(execution.stderr).toBe("");
    expect(JSON.parse(execution.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
