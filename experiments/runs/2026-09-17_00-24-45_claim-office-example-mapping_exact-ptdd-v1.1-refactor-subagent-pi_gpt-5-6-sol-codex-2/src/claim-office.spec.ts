import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const runCli = (scenario: unknown) => spawnSync(
  process.execPath,
  ["--import", "tsx", "src/cli.ts"],
  { input: JSON.stringify(scenario), encoding: "utf8" },
);

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const quoteAndClaim = (items: Array<Record<string, unknown>>, damages: Array<Record<string, unknown>>) =>
  runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] } as never).results;

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one sword from its 100 G base premium at 115 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one amulet from its 60 G base premium at 71 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one staff from its 80 G base premium at 93 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one potion from its 40 G base premium at 49 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes 2 runes at 60 G total from a 50 G component base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes at 71 G total from the special 60 G block premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("quotes 4 runes at 115 G total because blocks require exactly 3", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes at 198 G total from a 175 G base premium, rounding 197.5 up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes plus 1 moonstone at 88 G total because unlike component types do not form a block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("quotes 3 runes plus 3 moonstones at 137 G total from two separate 60 G blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a cursed sword plus plain amulet policy, yielding 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years, yielding 95 G for a sword", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5, yielding 195 G for a sword", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment at level 4 but still applies curse, yielding 165 G for a sword", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("quotes a newcomer cursed steel sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract with a new cursed level-7 sword at 160 G", () => {
    const scenario = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for a regular steel level-3 sword damaged by 500 G and leaves 1600 G cap", () => {
    const results = quoteAndClaim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G and leaves 400 G cap", () => {
    const results = quoteAndClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for a dragon sword at exactly enchantment 8 damaged by 1000 G", () => {
    const results = quoteAndClaim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G when both dragon material and enchantment 9 apply, because the 50 percent rule wins", () => {
    const results = quoteAndClaim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon sword at enchantment 5 damaged by 800 G", () => {
    const results = quoteAndClaim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]);
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a steel sword at enchantment 9 damaged by 1000 G", () => {
    const results = quoteAndClaim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one 100 G deductible to each damaged item, paying 600 G for 500 G sword and 300 G amulet damages", () => {
    const results = quoteAndClaim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    );
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for a 4000 G cap and treats two sword damages as separate events", () => {
    const results = quoteAndClaim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    );
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a whole claim with non-zero status, stderr, and no stdout when sword damages outnumber insured swords", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const results = quoteAndClaim([{ type: "sword" }, { type: "amulet" }], []);
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a staff policy at 1600 G from its independently specified 800 G insurance value", () => {
    const results = quoteAndClaim([{ type: "staff" }], []);
    expect(results[1]).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("caps a potion policy at 800 G from its independently specified 400 G insurance value", () => {
    const results = quoteAndClaim([{ type: "potion" }], []);
    expect(results[1]).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("caps a cursed sword at 2000 G based on unmodified insurance value", () => {
    const results = quoteAndClaim([{ type: "sword", cursed: true }], []);
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("caps a sword plus a 3-rune block at 3500 G from its 1750 G insurance sum", () => {
    const results = quoteAndClaim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], []);
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 then 600, leaving 600 then 0", () => {
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G at the final payout only", () => {
    const results = quoteAndClaim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]);
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quoted item with non-zero status, stderr, and no stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsurable or uninsured item with non-zero status, stderr, and no stdout", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    }
  });
  it("rejects a negative damage amount with non-zero status, stderr, and no stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("preserves normative result order and exact quote/claim field names for sequential policy references", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ] });
  });
});
