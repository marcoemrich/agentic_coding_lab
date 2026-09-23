import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";
import { spawnSync } from "node:child_process";

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status ?? -1, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case ---
  it("quote with an empty item list -- premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Quote: main item base premiums (parallel catalogue: each type has own value/premium) ---
  it("quote for a single plain sword -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for a single plain amulet -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quote for a single plain staff -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quote for a single plain potion -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: component base premiums and the block of 3 ---
  it("quote for 1 rune -- base premium 25 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quote for 2 runes -- base premium 50 G (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quote for 3 runes -- base premium 60 G (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quote for 4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for 7 runes -- base premium 175 G (no block; block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quote for 1 moonstone -- base premium 25 G (moonstone priced like a rune)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quote for 3 moonstones -- base premium 60 G (block applies to moonstones too)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 3 }, () => ({ type: "moonstone" })) }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });

  // --- Quote: 'alike' means same type (clarifying question) ---
  it("quote for 2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("quote for 3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
      ],
    });
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("quote for a cursed sword -- curse adds 50 G (50 % of the item's base premium)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quote for a sword with enchantment 5 -- high-enchantment surcharge 30 G applies (threshold is >= 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("quote for a sword with enchantment 4 -- no high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for a cursed sword with enchantment 5 -- both surcharges apply (50 G + 30 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("quote for a customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("quote for a customer with 1 year with MHPCO -- no loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote always adds the 10 % first-insurance surcharge, regardless of customer history", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("second quote in a scenario -- 15 % follow-up-contract discount on the policy base premium", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("third quote in a scenario -- 15 % follow-up-contract discount also applies", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
  });

  // --- Quote: modifier scope on multi-item policies (clarifying question) ---
  it("quote for a cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (only the cursed item's base) -> 210 G before further modifiers and fee", () => {
    const results = runScenario({
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
    // 160 base + 50 curse = 210, + 16 first insurance + 5 fee = 231
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Quote: rounding in MHPCO's favour ---
  it("quote whose raw premium is 197.5 G -- final premium 198 G (rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quote keeps intermediate amounts as fractions and rounds only the final premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    // 175 base + 175 * (0.1 - 0.2) = 157.5, + 5 fee = 162.5 -> 163
    expect(results).toEqual([{ premium: 163 }]);
  });

  // --- Quote: integration examples ---
  it("newcomer (0 years) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: error cases ---
  it("quote with an unknown item type (broomstick) -- CLI exits non-zero, error on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });

  // --- Claim: insurance sum and cap ---
  it("policy covering a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const results = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 5000 },
              { itemType: "amulet", amount: 5000 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [
              { itemType: "sword", amount: 99999 },
              { itemType: "sword", amount: 99999 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("policy covering a sword and 3 runes -- insurance sum 1750 G (block discount affects premium only), cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("cursed sword with premium 165 G -- cap 2000 G (based on unmodified insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claim on a steel sword enchantment 3, damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune (no enchantment, no material), damage 200 G -- payout 100 G (full minus deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim with damage below the deductible -- payout 0 G, never negative", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: special clauses ---
  it("claim on a steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a steel sword enchantment 8, damage 1000 G -- payout 400 G (threshold is >= 8)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a steel sword enchantment 7, damage 1000 G -- payout 900 G (no high-enchantment clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("claim on a dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim on a dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (50 % rule wins over dragon material)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a dragon-material sword enchantment 8, damage 1000 G -- payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damaging a sword (500 G) and an amulet (300 G) -- payout 600 G (deductible once per damaged item)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("policy covering two swords, damages listing two sword entries -- each entry gets its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Claim: cap exhaustion across claims ---
  it("sword policy (cap 2000 G), first claim of 1500 G -- payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword policy (cap 2000 G), second claim of 1500 G -- payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claim,
        claim,
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in MHPCO's favour ---
  it("claim whose raw payout is 350.5 G -- final payout 350 G (rounded down)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901 * 0.5 = 450.5, minus the 100 G deductible = 350.5 -> 350
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: error cases ---
  it("claim naming an item not in the policy (amulet when only a sword is insured) -- CLI exits non-zero with error on stderr", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
  });
  it("claim naming an unknown item type -- CLI exits non-zero with error on stderr", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- CLI exits non-zero, whole claim rejected", () => {
    const { status, stderr } = runCli({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/sword/);
  });
  it("claim with a damage entry of amount -200 -- CLI exits non-zero with error on stderr", () => {
    const { status, stderr } = runCli({
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
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/-200|negative/);
  });

  // --- CLI ---
  it("CLI reads the schema example from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout", () => {
    const { status, stdout } = runCli({
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
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI processes steps sequentially so a claim refers to the policy of its quote step by zero-based index", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(status).toBe(0);
    // policy 0 is the amulet policy: cap 1200, payout 300 - 100 = 200
    expect(JSON.parse(stdout).results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});
