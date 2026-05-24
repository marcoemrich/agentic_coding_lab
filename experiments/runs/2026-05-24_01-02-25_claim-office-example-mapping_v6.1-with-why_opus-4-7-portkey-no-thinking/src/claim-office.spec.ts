import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { run } from "./claim-office.js";

const runCli = (input: unknown): { status: number | null; stdout: string; stderr: string } => {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list yields premium 5 G (only the processing fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single main items at base premium (newcomer, first contract scenario adds first-insurance surcharge per-item; use plain config: years=0, with no prior contract) ---
  // We start with simpler cases: a long-standing customer (≥2 yrs) on a follow-up contract — but the simplest is one main item alone.
  // Use single-item, plain (no curse, no high enchantment) to test base premiums in isolation; modifiers will be tested in dedicated cases below.

  it("single sword (plain) for newcomer → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (plain) for newcomer → 60 + 6 + 5 = 71 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (plain) for newcomer → 80 + 8 + 5 = 93 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (plain) for newcomer → 40 + 4 + 5 = 49 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components: per-unit and block discount ---
  it("2 runes → 50 G base premium (no block) → total 60 G with first-insurance and fee", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block of 3 alike) → total 71 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block) → total 115 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (no blocks) → total 198 G (rounds up from 197.5)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components clarification ---
  it("2 runes + 1 moonstone → 75 G base premium (no block) → total 88 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two blocks) → total 137 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Modifier scope on multi-item policy ---
  it("cursed sword + plain amulet → 100 base + 50 curse + 60 base + 16 first-ins + 5 fee = 231 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years → loyalty discount applies → sword 100 + 10 first-ins − 20 loyalty + 5 fee = 95 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword with enchantment 5 → high-enchant surcharge applies → 100 + 30 + 10 + 5 = 145 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed sword with enchantment 5 → both apply → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("sword with enchantment 4 → no high-enchant surcharge → 100 + 10 + 5 = 115 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Insurance value sums & cap ---
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G (verified via claim 0 → remainingCap 3200)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "minor", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "minor", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G; block discount affects premium only, not insurance sum", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "minor", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 181 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "minor", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });

  // --- Claims: standard reimbursement (no special clauses) ---
  it("regular sword (steel, enchantment 3), damage 500 → payout 400 (500 − 100 deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("rune (250 G), damage 200 → payout 100 (200 − 100 deductible; no enchantment/material on rune)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // --- Claims: enchantment threshold ---
  it("dragon-material sword, enchantment 8, damage 1000 → payout 400 (high-enchant 50% then deductible: 500 − 100)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 → payout 400 (both clauses; 50% wins then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 → payout 700 (only dragon: full then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("steel sword, enchantment 9, damage 1000 → payout 400 (only high-enchant; 50% then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // --- Deductible per damage event ---
  it("dragon attack: sword damage 500 + amulet damage 300 → payout 600 (deductible per item: (500−100)+(300−100))", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
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
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // --- Multiple items of same type ---
  it("two swords damaged → each treated as separate damage with its own deductible", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 700, remainingCap: 3300 },
      ],
    });
  });
  it("damages array has more entries of a type than policy covers → CLI exits non-zero", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/more|exceed|sword/i);
    expect(result.stdout).toBe("");
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000): first claim 1500 → payout 1400, remainingCap 600; second claim 1500 → payout 600, remainingCap 0", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Rounding ---
  it("premium calculation that yields a fractional .5 → final rounded up (5 runes: 142.5 → 143)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });
  it("payout calculation that yields 350.5 → final 350 (rounded down)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  // --- Edge cases / errors ---
  it("quote with unknown item type (e.g. broomstick) → CLI exits non-zero with stderr message", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("claim damages an item not in policy (e.g. amulet damaged when only sword insured) → CLI exits non-zero", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not in policy|not covered|amulet/i);
    expect(result.stdout).toBe("");
  });
  it("claim damages an item with unknown type → CLI exits non-zero", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("claim with negative damage amount → CLI exits non-zero", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|invalid/i);
    expect(result.stdout).toBe("");
  });

  // --- Integration examples ---
  it("newcomer with cursed steel sword (enchantment 3): 100 + 50 + 10 + 5 = 165 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("3-year customer's second quote with cursed steel sword (enchantment 7): 100 + 50 + 30 − 20 + 10 − 15 + 5 = 160 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO CLI", () => {
  it("CLI reads JSON scenario from stdin and writes results JSON to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});
