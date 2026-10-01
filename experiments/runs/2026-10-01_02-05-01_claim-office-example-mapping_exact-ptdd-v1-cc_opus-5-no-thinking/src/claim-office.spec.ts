import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { runScenario } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

// Observable contract for rejection cases:
// The specification states that invalid scenarios make the CLI exit with a
// non-zero status code and write an error description to stderr. The domain
// layer expresses this by throwing an Error; the CLI adapter translates a
// thrown Error into exit code 1 plus an stderr message. This reading is stated
// explicitly here because the specification defines the CLI-level contract but
// not the in-process one, and it does not establish any specific error type or
// message text.

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Quote: base premiums per main item type (parallel price-list catalogue) ---
  it("quotes a plain sword as premium 105 G (100 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a plain amulet as premium 65 G (60 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff as premium 85 G (80 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion as premium 45 G (40 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: component base premiums (parallel component catalogue) ---
  it("quotes a single rune as premium 30 G (25 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone as premium 30 G (25 G base + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Quote: building block of 3 alike components ---
  it("quotes 2 runes as base premium 50 G (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes as base premium 100 G (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes as base premium 175 G (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });

  // --- Quote: "alike" means same component type, not same family ---
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
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
  it("adds a 50 % curse surcharge to a cursed sword -- base premium 150 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 -- base premium 130 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4 -- base premium 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("adds both surcharges to a cursed sword with enchantment 5 -- base premium 180 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Quote: item-specific modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  // Reading adopted: the specification's scope paragraph lists "first insurance"
  // among the policy-wide modifiers, so it applies to the policy base premium.
  // The "each item is a first insurance" sentence settles *whether* it applies to
  // a follow-up customer, not which base it uses. Both readings coincide on every
  // worked example in the specification.
  it("applies a 10 % first-insurance surcharge to each item in a quote", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 15 % follow-up discount to the customer's second quote in a scenario", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies no follow-up discount to the customer's first quote in a scenario", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies the first-insurance surcharge on a follow-up contract too (each quoted item is a first insurance)", () => {
    const results = runScenario({
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
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // Follow-up contract on a plain sword: the policy modifier is exactly
    // -5 G (100 x (0.10 - 0.15)). Rounding that intermediate in the office's
    // favour before summing would yield 101 G; rounding only the final amount
    // yields 100 G.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as premium 165 G", () => {
    const results = runScenario({
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
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as premium 160 G", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick) by throwing an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a sword policy at 2000 G (2 x insurance sum 1000 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("caps a sword + amulet policy at 3200 G (2 x insurance sum 1600 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("caps a two-sword policy at 4000 G (2 x insurance sum 2000 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("bases the cap on unmodified insurance values: cursed sword -> cap 2000 G despite premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("bases the insurance sum on undiscounted item values: sword + 3 runes -> insurance sum 1750 G, cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays 400 G for 500 G damage to a regular steel sword with enchantment 3 (full minus 100 G deductible)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune (no enchantment or material -> no special clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("pays 400 G for 1000 G damage to a steel sword with enchantment 9 (50 % clause, then deductible)", () => {
    const results = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword with exactly enchantment 8 (50 % clause, then deductible)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon sword with enchantment 5 (full reimbursement, then deductible)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword with enchantment 9 (50 % clause wins, then deductible)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const results = runScenario({
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

  // --- Claim: multiple items of the same type ---
  it("treats two sword damage entries on a two-sword policy as separate damages with their own deductibles", () => {
    const results = runScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers by throwing an Error", () => {
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays 1400 G on a first 1500 G claim against a sword policy, leaving cap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap 600 G, leaving cap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        claim,
        claim,
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in the MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G", () => {
    // 901 G damage to a deeply enchanted sword: 901 x 0.5 = 450.5, minus the
    // 100 G deductible = 350.5, which rounds down in the MHPCO's favour.
    const results = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
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
  it("rejects a claim whose damaged item has an unknown type by throwing an Error", () => {
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
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim containing a damage entry with amount -200 by throwing an Error", () => {
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
    ).toThrow(/-200/);
  });

  // --- Claim: remaining price-list insurance values (catalogue completeness) ---
  it("caps a staff policy at 1600 G (2 x insurance value 800 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "staff", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1500 });
  });

  it("caps a potion policy at 800 G (2 x insurance value 400 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "potion", amount: 200 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 700 });
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout", () => {
    const { status, stdout } = runCli({
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
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for an invalid scenario, writing no results to stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });
});
