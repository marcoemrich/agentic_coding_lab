import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (input: unknown) =>
  spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums and fee ---
  it("empty item list -> premium 5 G (processing fee only)", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("single plain sword, new customer -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("single amulet -> premium 71 G (60 + 6 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("single staff -> premium 93 G (80 + 8 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("single potion -> premium 49 G (40 + 4 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Components and building blocks ---
  it("2 runes -> premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> premium 71 G (block 60 + 6 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> premium 115 G (no block, 100 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> premium 198 G (175 + 17.5 + 5 = 197.5 rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -> premium 88 G (75 + 7.5 + 5 = 87.5 rounded up, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> premium 137 G (two blocks 120 + 12 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Item-specific modifiers ---
  it("cursed sword, new customer -> premium 165 G (100 + 50 curse + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 -> premium 145 G (100 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years -> loyalty discount: plain sword premium 95 G (100 + 10 - 20 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year -> no loyalty discount: plain sword premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword + plain amulet -> premium 231 G (curse applies to sword only: 160 base + 50 + 16 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("second quote in scenario -> 15% follow-up discount: sword premium 100 G (100 + 10 - 15 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Claims: standard reimbursement ---
  it("claim: steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400 (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it("claim: sword 500 + amulet 300 in one incident -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
    const result = runScenario({
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
    expect(result.results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });

  // --- Claims: special clauses ---
  it("claim: dragon sword enchantment exactly 8, damage 1000 -> payout 400 (50% rule, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: dragon sword enchantment 9, damage 1000 -> payout 400 (both clauses, 50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: dragon sword enchantment 5, damage 800 -> payout 700 (dragon clause only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it("claim: steel sword enchantment 9, damage 1000 -> payout 400 (high-enchantment clause only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: steel sword enchantment 9, damage 701 -> payout 250 (701x0.5 - 100 = 250.5 rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 250, remainingCap: 1750 }]);
  });

  // --- Claims: multiple items of same type ---
  it("policy with two swords, two sword damage entries of 500 -> payout 800, remainingCap 3200 (cap 4000)", () => {
    const result = runScenario({
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
    expect(result.results).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });

  // --- Claims: cap exhaustion ---
  it("sword policy, two successive claims of 1500 -> payouts 1400 then 600, remainingCap 600 then 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- CLI error handling ---
  it("CLI: quote with unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    const proc = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(proc.error).toBeUndefined();
    expect(proc.status).not.toBe(0);
    expect(proc.stderr.length).toBeGreaterThan(0);
    expect(proc.stdout).not.toContain("results");
  });
  it("CLI: claim with damaged item not in policy -> non-zero exit, error on stderr", () => {
    const proc = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    });
    expect(proc.error).toBeUndefined();
    expect(proc.status).not.toBe(0);
    expect(proc.stderr.length).toBeGreaterThan(0);
  });
  it("CLI: more damage entries of a type than policy covers -> non-zero exit, claim rejected", () => {
    const proc = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    });
    expect(proc.error).toBeUndefined();
    expect(proc.status).not.toBe(0);
    expect(proc.stderr.length).toBeGreaterThan(0);
  });
  it("CLI: damage entry with negative amount -> non-zero exit, error on stderr", () => {
    const proc = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(proc.error).toBeUndefined();
    expect(proc.status).not.toBe(0);
    expect(proc.stderr.length).toBeGreaterThan(0);
  });

  // --- Integration ---
  it("integration: 3-year customer's second quote, cursed sword enchantment 7 -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("CLI end-to-end: schema example -> premium 59, payout 100, remainingCap 1100", () => {
    const proc = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(proc.error).toBeUndefined();
    expect(proc.status).toBe(0);
    expect(JSON.parse(proc.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
