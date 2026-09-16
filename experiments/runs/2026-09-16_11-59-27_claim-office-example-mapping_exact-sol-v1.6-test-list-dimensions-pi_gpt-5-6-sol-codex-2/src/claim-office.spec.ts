import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function invoke(scenario: unknown): CliResult {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function successfulResults(scenario: unknown): unknown[] {
  return processScenario(scenario as Scenario).results;
}

function quoteScenario(items: unknown[], yearsWithMHPCO = 0): unknown {
  return { customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] };
}

function quoteThenClaim(items: unknown[], damages: unknown[] = []): unknown[] {
  return successfulResults({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  });
}

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(successfulResults(quoteScenario([]))).toEqual([{ premium: 5 }]);
  });
  it("quotes one plain sword at 115 G from its 100 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "sword" }]))).toEqual([{ premium: 115 }]);
  });
  it("quotes one plain amulet at 71 G from its 60 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "amulet" }]))).toEqual([{ premium: 71 }]);
  });
  it("quotes one plain staff at 93 G from its 80 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "staff" }]))).toEqual([{ premium: 93 }]);
  });
  it("quotes one plain potion at 49 G from its 40 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "potion" }]))).toEqual([{ premium: 49 }]);
  });
  it("quotes one rune at 33 G from its 25 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "rune" }]))).toEqual([{ premium: 33 }]);
  });
  it("quotes one moonstone at 33 G from its independently listed 25 G base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "moonstone" }]))).toEqual([{ premium: 33 }]);
  });
  it("quotes 2 runes at 60 G from a 50 G component base premium", () => {
    expect(successfulResults(quoteScenario([{ type: "rune" }, { type: "rune" }]))).toEqual([{ premium: 60 }]);
  });
  it("quotes exactly 3 runes at 71 G from the special 60 G block premium", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(successfulResults(quoteScenario(runes))).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes at 115 G because a block requires exactly 3", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(successfulResults(quoteScenario(runes))).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes at 198 G and rounds the fractional 197.5 G premium up", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(successfulResults(quoteScenario(runes))).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes and 1 moonstone at 88 G because unlike types do not form a block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(successfulResults(quoteScenario(items))).toEqual([{ premium: 88 }]);
  });
  it("quotes 3 runes and 3 moonstones at 137 G from two separate 60 G blocks", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(successfulResults(quoteScenario(items))).toEqual([{ premium: 137 }]);
  });
  it("applies a cursed sword surcharge only to that item in a sword-and-amulet policy, yielding 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(successfulResults(quoteScenario(items))).toEqual([{ premium: 231 }]);
  });
  it("applies the 20 percent loyalty discount at exactly 2 years, yielding 95 G for a plain sword", () => {
    expect(successfulResults(quoteScenario([{ type: "sword" }], 2))).toEqual([{ premium: 95 }]);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, yielding 195 G", () => {
    const sword = { type: "sword", cursed: true, enchantment: 5 };
    expect(successfulResults(quoteScenario([sword]))).toEqual([{ premium: 195 }]);
  });
  it("does not apply the high-enchantment surcharge at enchantment 4, yielding 165 G for a cursed sword", () => {
    const sword = { type: "sword", cursed: true, enchantment: 4 };
    expect(successfulResults(quoteScenario([sword]))).toEqual([{ premium: 165 }]);
  });
  it("quotes a newcomer’s cursed steel sword at 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(successfulResults(quoteScenario([sword], 0))).toEqual([{ premium: 165 }]);
  });
  it("quotes a long-standing customer’s cursed enchantment-7 sword on their second quote at 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" }] },
      ],
    };
    expect(successfulResults(scenario)).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it("exposes quote and claim results in step order using the binding JSON field names", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = invoke(scenario);
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("gives a sword policy a 2000 G cap from its independent 1000 G insurance value", () => {
    expect(quoteThenClaim([{ type: "sword" }])[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives an amulet policy a 1200 G cap from its independent 600 G insurance value", () => {
    expect(quoteThenClaim([{ type: "amulet" }])[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it("gives a staff policy a 1600 G cap from its independent 800 G insurance value", () => {
    expect(quoteThenClaim([{ type: "staff" }])[1]).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("gives a potion policy an 800 G cap from its independent 400 G insurance value", () => {
    expect(quoteThenClaim([{ type: "potion" }])[1]).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("gives a rune policy a 500 G cap from its independent 250 G insurance value", () => {
    expect(quoteThenClaim([{ type: "rune" }])[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("gives a moonstone policy a 500 G cap from its independently listed 250 G insurance value", () => {
    expect(quoteThenClaim([{ type: "moonstone" }])[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("keeps a two-sword policy’s separate copies and gives it a 4000 G cap", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    expect(quoteThenClaim(swords)[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("gives a sword-and-amulet policy a 3200 G cap from the summed insurance values", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(quoteThenClaim(items)[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword’s cap at 2000 G despite its 165 G modified premium", () => {
    const results = quoteThenClaim([{ type: "sword", cursed: true, enchantment: 3 }]);
    expect(results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the component block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quoteThenClaim(items)[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it("pays 400 G for a dragon-material enchantment-8 sword damaged by 1000 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    expect(quoteThenClaim([item], [{ itemType: "sword", amount: 1000 }])[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("applies one deductible per damaged item, paying 600 G for 500 G sword and 300 G amulet damages", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    expect(quoteThenClaim(items, damages)[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 500 G damage to a regular steel enchantment-3 sword", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(quoteThenClaim([sword], [{ itemType: "sword", amount: 500 }])[1]).toEqual({
      payout: 400, remainingCap: 1600,
    });
  });
  it("pays 100 G for 200 G damage to a rune with no special clauses", () => {
    expect(quoteThenClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])[1]).toEqual({
      payout: 100, remainingCap: 400,
    });
  });
  it("lets the 50 percent rule win for a dragon-material enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(quoteThenClaim([sword], [{ itemType: "sword", amount: 1000 }])[1]).toEqual({
      payout: 400, remainingCap: 1600,
    });
  });
  it("fully reimburses a dragon-material enchantment-5 sword, paying 700 G on 800 G damage", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(quoteThenClaim([sword], [{ itemType: "sword", amount: 800 }])[1]).toEqual({
      payout: 700, remainingCap: 1300,
    });
  });
  it("halves reimbursement for a steel enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(quoteThenClaim([sword], [{ itemType: "sword", amount: 1000 }])[1]).toEqual({
      payout: 400, remainingCap: 1600,
    });
  });
  it("treats two damage entries for two insured swords separately, paying 800 G and leaving 3200 G cap", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(quoteThenClaim(swords, damages)[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("tracks cap exhaustion across claims: 1400 G then 600 G, leaving 0 G", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    const results = successfulResults({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: damage } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: damage } },
      ],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G final payout down to 350 G", () => {
    const sword = { type: "sword", enchantment: 9 };
    expect(quoteThenClaim([sword], [{ itemType: "sword", amount: 901 }])[1]).toEqual({
      payout: 350, remainingCap: 1650,
    });
  });

  it("rejects an unknown quote item via non-zero exit, stderr description, and no stdout results", () => {
    const result = invoke(quoteScenario([{ type: "broomstick" }]));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured known item via non-zero exit and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = invoke(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects damage with an unknown item type via non-zero exit and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };
    const result = invoke(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects more damage entries of a type than the policy covers via non-zero exit for the whole claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
        ] } },
      ],
    };
    const result = invoke(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount via non-zero exit and stderr description", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const result = invoke(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
});
