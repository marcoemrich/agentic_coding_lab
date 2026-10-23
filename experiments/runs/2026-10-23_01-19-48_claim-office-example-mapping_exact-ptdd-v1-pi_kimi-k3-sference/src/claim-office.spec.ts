import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Observable contract for CLI rejection cases (spec: "the CLI exits with a
// non-zero status code and writes an error description to stderr"): each
// rejection test runs the claim-office CLI as a subprocess and asserts a
// non-zero exit code with a non-empty stderr message, and no `results` on
// stdout where the spec requires it.

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

function runCliExpectingFailure(scenario: Scenario): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(
    "pnpm",
    ["exec", "tsx", "src/cli.ts"],
    { input: JSON.stringify(scenario), encoding: "utf-8" },
  );
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function runCli(scenario: Scenario): { results: Record<string, number>[] } {
  const stdout = execFileSync(
    "pnpm",
    ["exec", "tsx", "src/cli.ts"],
    { input: JSON.stringify(scenario), encoding: "utf-8" },
  );
  return JSON.parse(stdout);
}

describe("MHPCO claim office", () => {
  // -- Quote: base premiums and item values --------------------------------
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output.results).toEqual([{ premium: 5 }]);
  });

  it("single plain sword -> 100 base + 10 first insurance + 5 fee = 115 G (new customer)", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output.results).toEqual([{ premium: 115 }]);
  });
  it("single plain amulet -> 60 base + 6 + 5 = 71 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(output.results).toEqual([{ premium: 71 }]);
  });
  it("single plain staff -> 80 base + 8 + 5 = 93 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(output.results).toEqual([{ premium: 93 }]);
  });
  it("single plain potion -> 40 base + 4 + 5 = 49 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(output.results).toEqual([{ premium: 49 }]);
  });
  it("single rune -> 25 base + 2.5 + 5 rounded up = 33 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(output.results).toEqual([{ premium: 33 }]);
  });

  // -- Quote: component building blocks -------------------------------------
  it("2 runes -> 50 base + 5 first insurance + 5 fee = 60 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> block 60 base + 6 + 5 fee = 71 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(output.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> no block, 100 base + 10 + 5 fee = 115 G", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: fourRunes }],
    });
    expect(output.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> 175 base (block requires exactly 3) + 17.5 + 5 = 198 G", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: sevenRunes }],
    });
    expect(output.results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -> 75 base, no block (different types) + 7.5 + 5 = 88 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(output.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> two blocks, 120 base + 12 + 5 = 137 G", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(output.results).toEqual([{ premium: 137 }]);
  });

  // -- Quote: item-specific modifiers ---------------------------------------
  it("cursed sword -> 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(output.results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 -> 100 + 30 high enchantment + 10 + 5 = 145 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(output.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge, 100 + 10 + 5 = 115 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(output.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 -> both surcharges, 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(output.results).toEqual([{ premium: 195 }]);
  });
  it("policy with cursed sword and plain amulet -> 160 base + 50 curse (sword only) + 16 + 5 = 231 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(output.results).toEqual([{ premium: 231 }]);
  });

  // -- Quote: policy-wide modifiers ------------------------------------------
  it("customer with exactly 2 years -> loyalty discount applies: sword 100 + 10 - 20 + 5 = 95 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year -> no loyalty discount: sword 100 + 10 + 5 = 115 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output.results).toEqual([{ premium: 115 }]);
  });
  it("second quote in scenario -> 15% follow-up discount: sword 100 + 10 - 15 + 5 = 100 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(output.results).toEqual([{ premium: 49 }, { premium: 100 }]);
  });

  // -- Quote: rounding in the MHPCO's favor ----------------------------------
  it("premium rounding: a calculation yielding 197.5 G -> 198 G (rounded up in MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: sevenRunes }],
    });
    expect(output.results).toEqual([{ premium: 198 }]);
  });
  it("intermediate amounts kept fractional: only final premium rounded (single rune 32.5 -> 33 G)", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(output.results).toEqual([{ premium: 33 }]);
  });

  // -- Quote: integration examples -------------------------------------------
  it("integration: newcomer with cursed sword (0 years, first quote) -> premium 165 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(output.results).toEqual([{ premium: 165 }]);
  });
  it("integration: 3-year customer's second quote of cursed sword ench 7 -> 100+50+30-20+10-15+5 = 160 G", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(output.results[1]).toEqual({ premium: 160 });
  });

  // -- Quote: rejection -------------------------------------------------------
  it("quote with unknown item type (broomstick) -> CLI exits non-zero, stderr message, no results on stdout", () => {
    const result = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });

  // -- Claim: standard reimbursement ------------------------------------------
  it("claim: steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // -- Claim: special clauses --------------------------------------------------
  it("claim: steel sword enchantment 9, damage 1000 -> 50% then deductible -> payout 400", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon sword enchantment 5, damage 800 -> full then deductible -> payout 700", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: dragon sword enchantment 9, damage 1000 -> 50% rule wins -> payout 400", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon sword enchantment exactly 8, damage 1000 -> high-enchantment clause -> payout 400", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // -- Claim: deductible per damage event ---------------------------------------
  it("claim: dragon attack damages sword 500 and amulet 300 -> deductible per item -> payout 600", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // -- Claim: multiple items of the same type -----------------------------------
  it("claim: policy covers two swords; two sword damage entries each get own deductible", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim: more damage entries of a type than insured -> CLI exits non-zero with stderr message", () => {
    const result = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  // -- Claim: cap exhaustion ------------------------------------------------------
  it("claim: sword insured, two successive claims of 1500 -> payouts 1400 then 600, remainingCap 0", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("claim: policy sword + amulet -> insurance sum 1600, cap 3200 (remainingCap reflects full cap)", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 150 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 50, remainingCap: 3150 });
  });
  it("claim: cursed sword -> cap 2000 based on unmodified insurance value", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(output.results[0]).toEqual({ premium: 165 });
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("claim: policy sword + 3 runes (block) -> insurance sum 1750, cap 3500 (block affects premium only)", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // quote: 100 sword + 60 rune block = 160 base + 16 first insurance + 5 fee
    expect(output.results[0]).toEqual({ premium: 181 });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // -- Claim: rounding --------------------------------------------------------------
  it("payout rounding: a calculation yielding 350.5 G -> 350 G (rounded down in MHPCO's favor)", () => {
    // steel sword enchantment 9, damage 901 -> 50% = 450.5, minus 100 deductible = 350.5 -> 350
    const output = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // -- Claim: rejection ---------------------------------------------------------------
  it("claim with damage to item not part of policy -> CLI exits non-zero with stderr message", () => {
    const result = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with damage entry of unknown item type -> CLI exits non-zero with stderr message", () => {
    const result = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative damage amount (-200) -> CLI exits non-zero with stderr message", () => {
    const result = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
