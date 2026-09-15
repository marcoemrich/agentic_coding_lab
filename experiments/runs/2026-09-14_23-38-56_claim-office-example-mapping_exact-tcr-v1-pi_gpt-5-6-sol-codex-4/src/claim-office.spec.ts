import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function invoke(scenario: object): CliResult {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function successfulResults(scenario: object): unknown[] {
  const result = invoke(scenario);
  expect(result.status, result.stderr).toBe(0);
  expect(result.stderr).toBe("");
  return (JSON.parse(result.stdout) as { results: unknown[] }).results;
}

function quote(items: object[], yearsWithMHPCO = 0): number {
  const results = successfulResults({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(quote([])).toBe(5);
  });
  it("quotes a plain sword for a newcomer at 115 G from its 100 G base premium", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet for a newcomer at 71 G from its 60 G base premium", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff for a newcomer at 93 G from its 80 G base premium", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion for a newcomer at 49 G from its 40 G base premium", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes at a 50 G base premium and a 60 G final premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G block base premium and 71 G final premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes without a block at a 100 G base premium and 115 G final premium", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without blocks at a 175 G base premium and 198 G final premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes plus 1 moonstone without a mixed-type block at 88 G after rounding up", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes plus 3 moonstones as two separate blocks at 137 G", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("scopes a cursed sword surcharge to that item beside a plain amulet, producing 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the loyalty threshold at exactly 2 years, quoting a plain sword at 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and enchantment surcharges at enchantment 5, quoting a sword at 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("does not apply enchantment surcharge at level 4 but applies curse, quoting a sword at 165 G", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("scopes a high-enchantment surcharge to that item beside a plain amulet, producing 211 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }, { type: "amulet", enchantment: 4 }])).toBe(211);
  });
  it("quotes a long-standing customer's cursed level-7 sword on their second contract at 160 G", () => {
    const results = successfulResults({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 41 }, { premium: 160 }]);
  });
  it("rounds a 197.5 G final premium up to 198 G and keeps intermediate fractions", () => {
    expect(quote([
      { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ])).toBe(198);
  });
  it("pays 400 G for 500 G damage to a regular steel level-3 sword", () => {
    const results = successfulResults({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune with no special clauses", () => {
    const results = successfulResults({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon-material sword at exactly enchantment 8", () => {
    const results = successfulResults({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when one event damages a sword for 500 G and an amulet for 300 G, deducting per item", () => {
    const results = successfulResults({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 1000 G damage to a dragon-material level-9 sword because the 50% clause wins", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon-material level-5 sword at full reimbursement", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel level-9 sword at 50% reimbursement", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives a two-sword policy a 4000 G cap, preserving it after an empty claim", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two insured sword damages separately with separate deductibles, paying 800 G", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status, stderr, and no stdout when sword damages outnumber insured swords", () => {
    const result = invoke({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the premium block discount", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across 1500 G successive claims with payouts 1400 G then 600 G", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G raw payout down to 350 G and keeps intermediate fractions", () => {
    const results = successfulResults({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item with non-zero status, stderr description, and no stdout results", () => {
    const result = invoke({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects damage to a known item absent from the policy with non-zero status and stderr", () => {
    const result = invoke({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damage item with non-zero status and stderr", () => {
    const result = invoke({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and stderr", () => {
    const result = invoke({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
});
