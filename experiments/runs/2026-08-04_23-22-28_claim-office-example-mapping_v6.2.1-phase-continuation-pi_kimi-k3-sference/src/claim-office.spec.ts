import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (input: unknown): string =>
  execFileSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });

describe("MHPCO Claim Office", () => {
  // --- Quotes: base premiums ---
  it("empty item list yields premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("single sword for a new customer yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("price list: amulet 71 G, staff 93 G, potion 49 G for a new customer", () => {
    const quotePremiumFor = (type: string) =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type }] }],
      }).results;
    expect(quotePremiumFor("amulet")).toEqual([{ premium: 71 }]);
    expect(quotePremiumFor("staff")).toEqual([{ premium: 93 }]);
    expect(quotePremiumFor("potion")).toEqual([{ premium: 49 }]);
  });

  // --- Quotes: component building blocks ---
  it("2 runes yield 60 G (base 50, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes yield 71 G (block of exactly 3 alike: base 60)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes yield 115 G (no block -- block requires exactly 3)", () => {
    const result = runScenario({
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
  it("7 runes yield 198 G (base 175; 197.5 rounded up in MHPCO's favor)", () => {
    const rune = () => ({ type: "rune" });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune(), rune(), rune(), rune(), rune(), rune(), rune()] },
      ],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone yield 88 G (no block: different types)", () => {
    const result = runScenario({
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
  it("3 runes + 3 moonstones yield 137 G (two separate blocks: base 120)", () => {
    const result = runScenario({
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

  // --- Quotes: item-specific modifiers ---
  it("cursed sword yields 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment 5 yields 145 G (high-enchantment surcharge applies at exactly 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 yields 115 G (no high-enchantment surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 yields 195 G (both surcharges apply)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("cursed sword + plain amulet yields 231 G (curse surcharge applies to the cursed item only: 160 base + 50 + 16 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // --- Quotes: policy-wide modifiers ---
  it("customer with exactly 2 years gets loyalty discount: sword 95 G (100 + 10 - 20 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year gets no loyalty discount: sword 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("second quote in a scenario gets 15% follow-up discount: sword 100 G (100 + 10 - 15 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("integration: 3-year customer's second quote of cursed sword enchantment 7 yields 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Quotes: errors ---
  it("quote with unknown item type (broomstick) is rejected with an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claims: standard reimbursement ---
  it("steel sword enchantment 3, damage 500 yields payout 400, remainingCap 1600", () => {
    const result = runScenario({
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
            cause: "goblin mishap",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 yields payout 100 (full minus deductible, no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "imp mishandling",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: special clauses ---
  it("dragon sword enchantment 8, damage 1000 yields payout 400 (50% clause at exactly 8, then deductible)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9, damage 1000 yields payout 400 (both clauses; 50% rule wins)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 yields payout 700 (dragon clause only: full minus deductible)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 yields payout 400 (high-enchantment clause only)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword enchantment 9, damage 701 yields payout 250 (350.5 - 100 = 250.5 rounded down)", () => {
    const result = runScenario({
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
            damages: [{ itemType: "sword", amount: 701 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 250, remainingCap: 1750 });
  });

  // --- Claims: multiple damages / items ---
  it("dragon attack damaging sword 500 and amulet 300 yields payout 600 (deductible per damaged item)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("policy with two swords: two sword damage entries of 500 each yield payout 800, remainingCap 3200", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claims: cap ---
  it("cap exhaustion: two successive claims of 1500 on a sword yield 1400/600 then 600/0", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword (premium 165 G) has cap 2000 based on unmodified insurance value", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin mishap",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes (block) has insurance sum 1750 / cap 3500 (block affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin mishap",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 181 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  // --- Claims: errors ---
  it("claim for an item not part of the policy (amulet damaged, only sword insured) is rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim with more damage entries of a type than the policy covers is rejected", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow(/sword/);
  });
  it("claim with negative damage amount is rejected", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow(/amount/);
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes results JSON to stdout", () => {
    const stdout = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    const output = JSON.parse(stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0].premium).toBe(59);
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("CLI exits non-zero with stderr message and no stdout results on unknown item type", () => {
    const outcome = spawnSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf-8",
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).not.toMatch(/results/);
  });
});
