import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

const runCli = (scenario: unknown) =>
  spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums and fee ---
  it("quote with empty item list yields premium 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("quote for a single sword yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote for a single amulet yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quote for a single staff yields 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("quote for a single potion yields 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: components and building blocks ---
  it("quote for a single rune yields 33 G (32.5 rounded up in MHPCO's favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 33 }]);
  });
  it("quote for 2 runes yields 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("quote for 3 runes yields 71 G (building block of 3 alike: 60 base)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quote for 4 runes yields 115 G (no block - block requires exactly 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote for 7 runes yields 198 G (197.5 rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("quote for 2 runes + 1 moonstone yields 88 G (no block: different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("quote for 3 runes + 3 moonstones yields 137 G (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("quote for a cursed sword as newcomer yields 165 G (integration example 1)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("quote for a sword with enchantment 5 yields 145 G (high-enchantment surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5 }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("quote for a cursed sword with enchantment 4 yields 165 G (no high-enchantment surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: true },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("quote for a cursed sword with enchantment 5 yields 195 G (both surcharges)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("quote for cursed sword + plain amulet yields 231 G (curse applies to affected item only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1 },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("quote for customer with exactly 2 years yields 95 G (loyalty discount applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("second quote in a scenario receives 15% follow-up discount (sword -> 100 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract, cursed enchantment-7 sword yields 160 G (integration example 2)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  // --- Quote: errors ---
  it("quote with unknown item type exits non-zero, writes stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claim on regular steel sword (enchantment 3), damage 500 -> payout 400, remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it.todo("claim on a rune, damage 200 -> payout 100, remainingCap 400");
  it.todo("claim damaging sword (500) and amulet (300) -> payout 600, remainingCap 2600 (deductible per item)");

  // --- Claim: enchantment threshold vs dragon material ---
  it.todo("claim on steel sword enchantment 9, damage 1000 -> payout 400 (50% clause), remainingCap 1600");
  it.todo("claim on dragon sword enchantment 5, damage 800 -> payout 700 (full reimbursement), remainingCap 1300");
  it.todo("claim on dragon sword enchantment 9, damage 1000 -> payout 400 (50% rule wins), remainingCap 1600");
  it.todo("claim on dragon sword enchantment 8, damage 1000 -> payout 400 (threshold), remainingCap 1600");

  // --- Claim: multiple items of same type, cap, rounding ---
  it.todo("policy with two swords: two sword damage entries of 500 -> payout 800, remainingCap 3200");
  it.todo("cap exhaustion: two successive claims of 1500 on a sword -> 1400/600 then 600/0");
  it.todo("claim payout 350.5 rounded down to 350 in MHPCO's favor (enchantment 9, damage 901)");

  // --- Claim: errors ---
  it.todo("claim for an item not part of the policy exits non-zero with stderr");
  it.todo("claim with unknown itemType exits non-zero with stderr");
  it.todo("claim with more damage entries of a type than insured items exits non-zero");
  it.todo("claim with negative damage amount exits non-zero with stderr");

  // --- Full schema example ---
  it.todo("schema example: 5-year customer, silver amulet -> premium 59; fire claim 200 -> payout 100, remainingCap 1100");
});
