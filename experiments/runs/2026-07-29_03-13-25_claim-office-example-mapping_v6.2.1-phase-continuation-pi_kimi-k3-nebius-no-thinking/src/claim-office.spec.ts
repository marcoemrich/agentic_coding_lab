import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const quoteOnly = (items: object[], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });

const runCli = (scenario: unknown) =>
  spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("empty item list -> premium 5 (only processing fee)", () => {
    expect(quoteOnly([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword -> 115 (100 base + 10 first insurance + 5 fee)", () => {
    expect(quoteOnly([{ type: "sword" }])).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet -> 71 (60 + 6 + 5)", () => {
    expect(quoteOnly([{ type: "amulet" }])).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff -> 93 (80 + 8 + 5)", () => {
    expect(quoteOnly([{ type: "staff" }])).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion -> 49 (40 + 4 + 5)", () => {
    expect(quoteOnly([{ type: "potion" }])).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and blocks ---
  it("single rune -> 33 (25 + 2.5 + 5 = 32.5 rounded up)", () => {
    expect(quoteOnly([{ type: "rune" }])).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes -> 60 (50 base + 5 + 5)", () => {
    expect(quoteOnly([{ type: "rune" }, { type: "rune" }])).toEqual({
      results: [{ premium: 60 }],
    });
  });
  it("3 runes -> 71 (block: 60 base + 6 + 5)", () => {
    expect(
      quoteOnly([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> 115 (no block -- block requires exactly 3)", () => {
    expect(
      quoteOnly([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> 198 (175 + 17.5 + 5 = 197.5 rounded up; no block)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quoteOnly(sevenRunes)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> 88 (75 + 7.5 + 5 = 87.5 up; different types, no block)", () => {
    expect(
      quoteOnly([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> 137 (two separate blocks: 120 + 12 + 5)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quoteOnly(items)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword, newcomer -> 165 (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quoteOnly([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    ).toEqual({ results: [{ premium: 165 }] });
  });
  it("cursed sword + plain amulet -> 231 (curse surcharge only on the cursed item's base)", () => {
    expect(
      quoteOnly([
        { type: "sword", cursed: true },
        { type: "amulet", cursed: false },
      ]),
    ).toEqual({ results: [{ premium: 231 }] });
  });
  it("sword with enchantment exactly 5 -> 145 (high-enchantment surcharge applies)", () => {
    expect(quoteOnly([{ type: "sword", enchantment: 5 }])).toEqual({
      results: [{ premium: 145 }],
    });
  });
  it("sword with enchantment 4 -> 115 (no high-enchantment surcharge)", () => {
    expect(quoteOnly([{ type: "sword", enchantment: 4 }])).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("cursed sword with enchantment 5 -> 195 (both surcharges apply)", () => {
    expect(quoteOnly([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({
      results: [{ premium: 195 }],
    });
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years, plain sword -> 95 (loyalty discount applies)", () => {
    expect(quoteOnly([{ type: "sword" }], 2)).toEqual({
      results: [{ premium: 95 }],
    });
  });
  it("customer with 1 year, plain sword -> 115 (no loyalty discount)", () => {
    expect(quoteOnly([{ type: "sword" }], 1)).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("second quote of a scenario gets 15% follow-up discount: 115 then 100", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("long-standing customer's second contract: 3 years, quote amulet then cursed sword ench 7 -> 59 then 160", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { premium: 160 }],
    });
  });

  // --- Claim: standard reimbursement ---
  it("plain sword ench 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune damage 200 -> payout 100, remainingCap 400 (no special clause)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("dragon attack damages sword (500) and amulet (300) -> payout 600, remainingCap 2600 (deductible per damaged item)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: special clauses ---
  it("dragon sword ench exactly 8, damage 1000 -> payout 400, remainingCap 1600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon sword ench 9, damage 1000 -> payout 400 (both clauses; 50% rule wins)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon sword ench 5, damage 800 -> payout 700, remainingCap 1300 (only dragon clause)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword ench 9, damage 1000 -> payout 400 (only high-enchantment clause)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("steel sword ench 9, damage 901 -> payout 350 (350.5 rounded down in MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claim: multiple items of same type and cap ---
  it("two swords insured, two sword damage entries of 500 -> payout 800, remainingCap 3200 (each entry separate deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("cap exhaustion: sword, two successive claims of 1500 -> 1400/600 then 600/0", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    };
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- CLI error cases ---
  it("CLI: quote with unknown item type (broomstick) -> non-zero exit, stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/i);
    expect(result.stdout).not.toMatch(/results/);
  });
  it("CLI: claim damage for item not in policy -> non-zero exit, stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/i);
    expect(result.stdout).not.toMatch(/results/);
  });
  it("CLI: more damage entries of a type than covered -> non-zero exit, stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/sword/i);
    expect(result.stdout).not.toMatch(/results/);
  });
  it("CLI: damage entry with negative amount -> non-zero exit, stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200|negative|amount/i);
    expect(result.stdout).not.toMatch(/results/);
  });

  // --- CLI end-to-end ---
  it("CLI: schema example end-to-end -> premium 59, payout 100, remainingCap 1100", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
