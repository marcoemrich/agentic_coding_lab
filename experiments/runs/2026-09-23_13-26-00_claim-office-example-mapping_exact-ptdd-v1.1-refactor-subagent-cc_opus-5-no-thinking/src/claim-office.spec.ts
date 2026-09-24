import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { quote, runScenario } from "./claim-office.js";

// How a clerk runs the claim-office CLI: the scenario document on stdin, the
// results document on stdout.
function runClaimOfficeCli(scenario: unknown): string {
  return execFileSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

// Observable contract readings adopted where the specification leaves them open:
// - The specification defines rejection only at the CLI level ("exits with a
//   non-zero status code and writes an error description to stderr"). The most
//   defensible reading is that the domain layer signals rejection by throwing an
//   Error, and the CLI adapter translates a thrown Error into exit code 1 plus a
//   stderr message. Tests below state which layer they observe.
// - "A building block of 3 alike components" is read, per the spec examples, as
//   exactly-3 groups of the identical component type (4 runes => no block).

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and the item catalogue ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single plain sword as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff as 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion as 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune as 32.5 G (25 G base + 2.5 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(32.5);
  });
  it("quotes a single moonstone as 32.5 G (25 G base + 2.5 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(32.5);
  });
  it("quotes a sword and an amulet as 181 G (160 G base + 16 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
  });

  // --- Quote: component building blocks ---
  it("quotes 2 runes as base premium 50 G (no block) -- 60 G with surcharge and fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes as base premium 60 G (block applies) -- 71 G with surcharge and fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes as base premium 100 G (no block; block requires exactly 3) -- 115 G with surcharge and fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(4).fill({ type: "rune" }))).toBe(115);
  });
  it("quotes 7 runes as base premium 175 G (no block at 7) -- 197.5 G with surcharge and fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(197.5);
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types) -- 87.5 G with surcharge and fee", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(87.5);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks) -- 137 G with surcharge and fee", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        ...Array(3).fill({ type: "rune" }),
        ...Array(3).fill({ type: "moonstone" }),
      ]),
    ).toBe(137);
  });
  it("quotes 3 moonstones as base premium 60 G (block applies to moonstones too) -- 71 G with surcharge and fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(3).fill({ type: "moonstone" }))).toBe(71);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge on the cursed item's base premium: cursed sword => 100 + 50 + 10 + 5 = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5: sword => 100 + 30 + 10 + 5 = 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4: sword => 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 => 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item, not the policy total: cursed sword + plain amulet => 160 base + 50 curse + 16 first insurance + 5 fee = 231 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }]),
    ).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO: sword => 100 - 20 + 10 + 5 = 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO: sword => 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge to a newcomer's first quote: sword, 0 years => 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 15 % follow-up-contract discount to a customer's second quote: sword, 0 years, second quote => 100 + 10 - 15 + 5 = 100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });
  it("applies the first-insurance surcharge on every quote, regardless of customer history (each quoted item is a first insurance): 3-year customer's second quote on a plain sword => 100 + 10 - 20 - 15 + 5 = 80 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 80 });
  });
  it("applies the loyalty discount to the policy base premium (sum of item base premiums), not per item: two swords, 2 years => 200 base - 40 loyalty + 20 first insurance + 5 fee = 185 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }, { type: "sword" }])).toBe(185);
  });

  // --- Quote: rounding in MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(results[0]).toEqual({ premium: 198 });
  });
  it("keeps intermediate amounts fractional and rounds only the final premium: a single rune computes 32.5 G and is reported as 33 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(32.5);
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results[0]).toEqual({ premium: 33 });
  });

  // --- Quote: integration examples ---
  it("integration: newcomer (0 years, no previous contract) with a cursed steel sword (ench. 3) => premium 165 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
  });
  it("integration: 3-year customer's second quote with a cursed steel sword (ench. 7) => premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an unknown item type (e.g. broomstick) by throwing an Error (CLI: non-zero exit, error on stderr, no results on stdout)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword (ench. 3) with damage 500 G (full reimbursement minus 100 G deductible)", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a damaged rune (value 250 G) with damage 200 G (no enchantment or material => no special clause)", () => {
    const { results } = runScenario({
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
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G in one incident => payout 600 G", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("reimburses 50 % for enchantment exactly 8: dragon sword ench. 8, damage 1000 G => payout 400 G", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material at enchantment 5: dragon sword, damage 800 G => payout 700 G", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("prefers the 50 % clause when both apply: dragon sword ench. 9, damage 1000 G => payout 400 G", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 50 % clause alone for a steel sword ench. 9, damage 1000 G => payout 400 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("never pays a negative amount: damage 50 G below the 100 G deductible => payout 0 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy at twice the insurance sum: sword + amulet => insurance sum 1600 G, cap 3200 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases the cap on unmodified insurance values: cursed sword (premium 165 G) => cap 2000 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("counts each of two swords in the insurance sum: two swords => insurance sum 2000 G, cap 4000 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("ignores the block discount in the insurance sum: sword + 3 runes => insurance sum 1750 G, cap 3500 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("reports remainingCap after a claim: sword policy (cap 2000 G), claim 1500 G => payout 1400 G, remainingCap 600 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("limits a second claim to the remaining cap: second claim 1500 G => payout 600 G, remainingCap 0 G", () => {
    const damage = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, damage, damage],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("treats two sword damage entries on a two-sword policy as separate damages with their own deductibles: 500 + 500 => payout 800 G", () => {
    const { results } = runScenario({
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
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error (CLI: non-zero exit)", () => {
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

  // --- Claim: rounding in MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour): ench. 8 sword, damage 901 G => 0.5 * 901 - 100 = 350.5", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) by throwing an Error (CLI: non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim referencing an unknown item type by throwing an Error (CLI: non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with a negative damage amount (-200) by throwing an Error (CLI: non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI adapter ---
  it("CLI: reads the schema example scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout", () => {
    const stdout = runClaimOfficeCli({
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
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI: processes steps sequentially so a claim step resolves its policy by zero-based quote step index", () => {
    const stdout = runClaimOfficeCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(JSON.parse(stdout)).toEqual({
      results: [
        { premium: 115 },
        { premium: 62 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("CLI: exits with a non-zero status code and writes an error description to stderr for an invalid scenario, writing no results to stdout", () => {
    let status = 0;
    let stdout = "";
    let stderr = "";
    try {
      runClaimOfficeCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
    } catch (failure) {
      const spawn = failure as { status: number; stdout: string; stderr: string };
      status = spawn.status;
      stdout = spawn.stdout;
      stderr = spawn.stderr;
    }
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/broomstick/);
  });
});
