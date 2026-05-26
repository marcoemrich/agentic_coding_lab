import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

const runCli = (scenario: unknown) =>
  spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  // ---------- Base premiums (single item, only processing fee added) ----------
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword newcomer → 115 G (100 base + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet newcomer → 71 G (60 base + 6 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff newcomer → 93 G (80 base + 8 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion newcomer → 49 G (40 base + 4 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune newcomer → 33 G (25 base + 2.5 first ins + 5 fee = 32.5 → 33 rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone newcomer → 33 G (same as rune)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // ---------- Component blocks of 3 alike ----------
  it("2 runes newcomer → 60 G (50 base + 5 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes newcomer → 71 G (60 block base + 6 first ins + 5 fee)", () => {
    const result = processScenario({
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
  it("4 runes newcomer → 115 G (100 base, no block; 4 × 25 + 10 first ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes newcomer → 198 G (175 base + 17.5 first ins + 5 fee = 197.5 → 198)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // ---------- 'Alike' components (❓ same type, not just family) ----------
  it("2 runes + 1 moonstone newcomer → 88 G (75 base, no block; 75 + 7.5 + 5 = 87.5 → 88)", () => {
    const result = processScenario({
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
  it("3 runes + 3 moonstones newcomer → 137 G (two blocks: 60 + 60 + 12 first ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // ---------- Individual premium modifiers ----------
  it("cursed sword newcomer → 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment exactly 5 newcomer → 145 G (100 base + 30 high-ench + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 newcomer → 115 G (below high-ench threshold; 100 + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword enchant 5 + cursed newcomer → 195 G (100 + 50 curse + 30 high-ench + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("long-standing customer (2 years) sword → 95 G (100 − 20 loyalty + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("two-sword quote newcomer → 225 G (first ins applies to whole policy base; 200 + 20 + 5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });

  // ---------- Multi-item modifier scope (❓ per-item vs policy-wide) ----------
  it("cursed sword + plain amulet newcomer → 231 G (160 base + 50 curse + 16 first ins + 5 fee; curse only on cursed item)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // ---------- Rounding in MHPCO's favor ----------
  it("sword + rune newcomer → 143 G (premium 142.5 rounded up in MHPCO's favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });
  it("payout yielding 350.5 G → 350 G (rounded down)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  // ---------- Integration examples ----------
  it("integration: newcomer with cursed steel sword enchant 3 → 165 G", () => {
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
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("integration: 3-year customer, 2nd contract, cursed steel sword enchant 7 → 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({
      premium: 160,
    });
  });

  // ---------- Claim processing: standard reimbursement ----------
  it("claim: regular steel sword enchant 3, damage 500 G → payout 400 G, remaining cap 1600", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: rune damage 200 G → payout 100 G, remaining cap 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  // ---------- Special clauses ----------
  it("claim: steel sword enchant 9, damage 1000 G → payout 400 G (50% high-ench, then deductible)", () => {
    const result = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: dragon sword enchant 5, damage 800 G → payout 700 G (dragon full, then deductible)", () => {
    const result = processScenario({
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
            cause: "dragon-attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("claim: dragon sword enchant 9, damage 1000 G → payout 400 G (50% wins over dragon)", () => {
    const result = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: dragon sword enchant exactly 8, damage 1000 G → payout 400 G (boundary; high-ench wins)", () => {
    const result = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // ---------- Deductible per damage event ----------
  it("claim: dragon attack damages sword 500 + amulet 300 → payout 600 G, remaining 2600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon-attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // ---------- Cap behaviour ----------
  it("cap: sword + amulet policy → cap 3200 G (2 × insurance sum 1600)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "trivial",
            damages: [{ itemType: "amulet", amount: 100 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 0,
      remainingCap: 3200,
    });
  });
  it("cursed sword (premium 165 G) → cap 2000 G (based on unmodified insurance value)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "trivial",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });
  it("policy covers sword + 3 runes (block) → insurance sum 1750 G; block discount does not affect insurance sum", () => {
    const result = processScenario({
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
            cause: "trivial",
            damages: [{ itemType: "rune", amount: 100 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 0,
      remainingCap: 3500,
    });
  });
  it("sword policy (cap 2000), two successive 1500 G claims → first payout 1400 G remaining 600 G; second payout 600 G remaining 0 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // ---------- Multiple items of the same type ----------
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "trivial",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 0,
      remainingCap: 4000,
    });
  });
  it("dragon attack damaging both swords → each entry treated as separate damage with its own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon-attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });
  it("damages array has more entries of a type than policy covers → CLI exits non-zero, claim rejected", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon-attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/sword|more|not.*insur/i);
    expect(result.stdout).not.toContain("results");
  });

  // ---------- Edge cases ----------
  it("quote with unknown item type (e.g. broomstick) → CLI exits non-zero with stderr message", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick|unknown/i);
    expect(result.stdout).not.toContain("results");
  });
  it("claim references an item not part of the policy → CLI exits non-zero with stderr message", () => {
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
    expect(result.stderr).toMatch(/amulet|not.*polic|not.*insur/i);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damage entry with negative amount → CLI exits non-zero with stderr message", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "mystery",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount|-200/i);
    expect(result.stdout).not.toContain("results");
  });
});
