import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
};

const runCli = (scenario: Scenario) =>
  spawnSync("./claim-office", {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

const quoteScenario = (items: unknown[], yearsWithMHPCO = 0): Scenario => ({
  customer: { yearsWithMHPCO },
  steps: [{ op: "quote", items }],
});

const expectSuccess = (scenario: Scenario) => {
  const result = runCli(scenario);
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout) as { results: Record<string, number>[] };
};

const claimScenario = (items: unknown[], damages: unknown[]): Scenario => ({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ],
});

const claimResult = (items: unknown[], damages: unknown[]) =>
  expectSuccess(claimScenario(items, damages)).results[1];

const expectRejected = (scenario: Scenario) => {
  const result = runCli(scenario);
  expect(result.status).not.toBe(0);
  expect(result.stderr.length).toBeGreaterThan(0);
  expect(result.stdout).toBe("");
};

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(expectSuccess(quoteScenario([]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain newcomer sword at 115 G, proving its 100 G base premium", () => {
    expect(expectSuccess(quoteScenario([{ type: "sword" }]))).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes one plain newcomer amulet at 71 G, proving its 60 G base premium", () => {
    expect(expectSuccess(quoteScenario([{ type: "amulet" }]))).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes one plain newcomer staff at 93 G, proving its 80 G base premium", () => {
    expect(expectSuccess(quoteScenario([{ type: "staff" }]))).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes one plain newcomer potion at 49 G, proving its 40 G base premium", () => {
    expect(expectSuccess(quoteScenario([{ type: "potion" }]))).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes at 60 G total, from a 50 G component base premium", () => {
    expect(expectSuccess(quoteScenario([{ type: "rune" }, { type: "rune" }]))).toEqual({
      results: [{ premium: 60 }],
    });
  });
  it("quotes exactly 3 runes at 71 G total, from the special 60 G block premium", () => {
    expect(expectSuccess(quoteScenario(Array.from({ length: 3 }, () => ({ type: "rune" }))))).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("quotes 4 runes at 115 G total, with no block because a block requires exactly 3", () => {
    expect(expectSuccess(quoteScenario(Array.from({ length: 4 }, () => ({ type: "rune" }))))).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes 7 runes at 198 G total, from a 175 G base and upward final rounding", () => {
    expect(expectSuccess(quoteScenario(Array.from({ length: 7 }, () => ({ type: "rune" }))))).toEqual({
      results: [{ premium: 198 }],
    });
  });
  it("quotes 2 runes plus 1 moonstone at 88 G total because unlike component types do not form a block", () => {
    expect(expectSuccess(quoteScenario([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]))).toEqual({
      results: [{ premium: 88 }],
    });
  });
  it("quotes 3 runes plus 3 moonstones at 137 G total from two independent 60 G blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(expectSuccess(quoteScenario(items))).toEqual({ results: [{ premium: 137 }] });
  });
  it("quotes a cursed sword and plain amulet at 231 G, applying the 50 G curse surcharge only to the sword", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(expectSuccess(quoteScenario(items))).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 30 percent enchantment surcharge at exactly level 5: a plain newcomer sword costs 145 G", () => {
    expect(expectSuccess(quoteScenario([{ type: "sword", enchantment: 5 }]))).toEqual({
      results: [{ premium: 145 }],
    });
  });
  it("does not apply the enchantment surcharge at level 4 while still applying curse: the sword costs 165 G", () => {
    expect(expectSuccess(quoteScenario([{ type: "sword", enchantment: 4, cursed: true }]))).toEqual({
      results: [{ premium: 165 }],
    });
  });
  it("applies both curse and enchantment surcharges to a level-5 cursed sword: 195 G", () => {
    expect(expectSuccess(quoteScenario([{ type: "sword", enchantment: 5, cursed: true }]))).toEqual({
      results: [{ premium: 195 }],
    });
  });
  it("applies the loyalty discount at exactly 2 years: a plain first sword quote costs 95 G", () => {
    expect(expectSuccess(quoteScenario([{ type: "sword" }], 2))).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies the 15 percent follow-up discount after the first quote while retaining each item's 10 percent first-insurance surcharge", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect(expectSuccess(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("quotes the specified 3-year customer's second-contract cursed level-7 sword at 160 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(expectSuccess(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays 400 G for 500 G damage to a regular steel level-3 sword and leaves 1600 G cap", () => {
    expect(claimResult(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage and leaves 400 G cap, with no item-special clause", () => {
    expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("at exactly enchantment 8, pays 400 G for 1000 G damage to a dragon sword after halving then deducting", () => {
    expect(claimResult(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("when dragon material and level-9 enchantment both apply, the 50 percent clause wins: payout 400 G", () => {
    expect(claimResult(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below level 8: level-5 damage of 800 G pays 700 G", () => {
    expect(claimResult(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    )).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves level-9 steel sword damage before the deductible: 1000 G damage pays 400 G", () => {
    expect(claimResult(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword damage of 500 G and amulet damage of 300 G: payout 600 G", () => {
    expect(claimResult(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords independently and accepts two sword damages, paying 800 G and leaving 3200 G cap", () => {
    expect(claimResult(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status and stderr when sword damages outnumber insured swords", () => {
    expectRejected(claimScenario(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    ));
  });
  it("sets a sword-and-amulet policy cap to 3200 G from their 1600 G unmodified insurance sum", () => {
    expect(claimResult([{ type: "sword" }, { type: "amulet" }], [])).toEqual({
      payout: 0,
      remainingCap: 3200,
    });
  });
  it("sets a cursed sword policy cap to 2000 G, unaffected by its premium modifiers", () => {
    expect(claimResult([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets a sword-and-3-rune policy cap to 3500 G, unaffected by the component block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(claimResult(items, [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts of 1400 G then 600 G, exhausting the 2000 G cap", () => {
    const incident = { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    };
    expect(expectSuccess(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G only at the final payout", () => {
    expect(claimResult(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
    )).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quoted item type with non-zero status, stderr, and no stdout results", () => {
    expectRejected(quoteScenario([{ type: "broomstick" }]));
  });
  it("rejects damage to an item type absent from the policy with non-zero status and stderr", () => {
    expectRejected(claimScenario(
      [{ type: "sword" }],
      [{ itemType: "amulet", amount: 200 }],
    ));
  });
  it("rejects a negative damage amount with non-zero status and stderr", () => {
    expectRejected(claimScenario(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: -200 }],
    ));
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(expectSuccess(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("sets a staff policy cap to 1600 G from its independently specified 800 G insurance value", () => {
    expect(claimResult([{ type: "staff" }], [])).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("sets a potion policy cap to 800 G from its independently specified 400 G insurance value", () => {
    expect(claimResult([{ type: "potion" }], [])).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("sets a moonstone policy cap to 500 G from its independently specified 250 G component value", () => {
    expect(claimResult([{ type: "moonstone" }], [])).toEqual({ payout: 0, remainingCap: 500 });
  });
});
