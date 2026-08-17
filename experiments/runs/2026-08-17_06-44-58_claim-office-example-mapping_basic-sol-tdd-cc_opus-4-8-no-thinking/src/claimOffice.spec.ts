import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claimOffice.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(input: unknown): { stdout: string; status: number } {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    return { stdout, status: 0 };
  } catch (error) {
    const err = error as { status?: number; stdout?: string };
    return { stdout: err.stdout ?? "", status: err.status ?? 1 };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Premium: empty and base premiums ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword (newcomer, no modifiers) -> base 100 + first insurance 10 + fee 5 = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Component base premiums and blocks ---
  it("2 runes -> base 50 (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + first insurance 5 + fee 5 = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> base 60 (block applies, exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 60 + first insurance 6 + fee 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> base 100 (no block; block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });
    // base 100 + first insurance 10 + fee 5 = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> base 175 (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    // base 175 + first insurance 17.5 + fee 5 = 197.5 -> ceil 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> base 75 (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    // base 75 + first insurance 7.5 + fee 5 = 87.5 -> ceil 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> base 120 (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })],
        },
      ],
    });
    // base 120 + first insurance 12 + fee 5 = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("newcomer cursed sword (steel, ench 3) -> premium 165", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 -> high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5 }] },
      ],
    });
    // 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4 }] },
      ],
    });
    // 100 base + 10 first insurance + 5 fee = 115 (no surcharge)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword ench 5 -> both curse and high-enchantment surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 + 50 curse + 30 high-ench + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }],
    });
    // 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("cursed sword + plain amulet -> curse surcharge only on cursed item's base (210 before fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
      ],
    });
    // policy base 160 + curse 50 (on sword base only) + first insurance 16 + fee 5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("premium calc yielding x.5 -> rounded up in MHPCO favor (5 runes -> 143)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(5).fill({ type: "rune" }) }],
    });
    // base 125 + first insurance 12.5 + fee 5 = 142.5 -> ceil 143
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });

  // --- Follow-up contracts / integration ---
  it("long-standing customer's second quote: cursed sword ench 7 -> premium 160", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // step 0: 100 + 10 first insurance - 20 loyalty + 5 fee = 95
    // step 1: 100 + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance
    //         - 15 follow-up = 155 + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Errors: quote ---
  it("quote with unknown item type -> runScenario throws", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
    expect(run).toThrow();
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel ench 3) damage 500 -> payout 400 (minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // quote: 115; claim: 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune (value 250) damage 200 -> payout 100 (minus deductible, no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // rune insurance value 250, cap 500; payout 200 - 100 = 100; remaining 400
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: enchantment vs dragon material clauses ---
  it("dragon sword ench 8 damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // high-ench (>=8) 50%: 500, then deductible 100 -> 400; cap 2000 - 400 = 1600
    expect((result.results[1] as { payout: number; remainingCap: number })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon sword ench 9 damage 1000 -> payout 400 (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // both clauses apply; 50% rule wins: 500, then deductible: 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 5 damage 800 -> payout 700 (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // only dragon-material clause: full reimbursement 800, then deductible: 700
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9 damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // only high-enchantment clause: 50% -> 500, then deductible: 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack sword 500 + amulet 300 -> payout 600 (deductible per damaged item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
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
    // (500-100) + (300-100) = 600; insurance sum 1600, cap 3200 -> remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap based on insurance sum ---
  it("cursed sword premium modifiers do not raise cap -> cap 2000", () => {
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
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    });
    // premium 165 does not raise the cap; cap = 2 * 1000 = 2000
    // gross 3000-100 = 2900 capped at 2000 -> payout 2000, remaining 0
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("cap exhaustion: two 1500 claims on sword -> 1400 then 600, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
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
    // first: 1500-100 = 1400, remaining 600; second: desired 1400 capped to 600, remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of same type ---
  it("two swords, dragon attack on both -> each damage its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "sword", material: "steel", enchantment: 3 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    // insurance sum 2000, cap 4000; (500-100)+(600-100) = 900; remaining 3100
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 3100 });
  });
  // Reading: an invalid claim/quote is signalled by runScenario throwing an Error;
  // the CLI maps a thrown Error to a non-zero exit code and a stderr message.
  it("more sword damages than swords insured -> runScenario throws (claim rejected)", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
    expect(run).toThrow();
  });

  // --- Claim: rounding ---
  it("payout calc yielding x.5 -> rounded down in MHPCO favor (300.5 -> 300)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 801 }] },
        },
      ],
    });
    // 801 * 0.5 = 400.5, - 100 deductible = 300.5 -> floor 300; remaining 1700
    expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
  });

  // --- Errors: claim ---
  it("claim references item not in policy -> runScenario throws", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
    expect(run).toThrow();
  });
  it("claim with negative damage amount -> runScenario throws", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      });
    expect(run).toThrow();
  });

  // --- CLI end-to-end ---
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout", () => {
    const { stdout, status } = runCli({
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
    // amulet base 60 + first insurance 6 - loyalty 12 + fee 5 = 59
    // claim: 200 - 100 = 100; amulet insurance value 600, cap 1200 -> remaining 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI exits non-zero and writes nothing valid to stdout on unknown item type", () => {
    const { status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
  });
});
