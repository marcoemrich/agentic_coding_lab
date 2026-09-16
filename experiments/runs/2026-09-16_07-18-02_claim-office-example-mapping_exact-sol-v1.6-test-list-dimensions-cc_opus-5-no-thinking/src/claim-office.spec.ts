import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}
import { runScenario } from "./claim-office.js";

/**
 * Adopted readings where the specification leaves a contract open:
 *
 * - Failure contract: the spec says the CLI "exits with a non-zero status code
 *   and writes an error description to stderr". The domain layer signals this by
 *   throwing an Error with a descriptive message; the spec does not establish an
 *   error subclass, so the tests assert "throws an Error", not a specific type.
 * - "Alike" components: alike means exactly the same item type. A block applies
 *   only to a group of exactly 3 components of one type (4 runes -> no block).
 * - Rounding in the MHPCO's favour: the final premium is rounded up, the final
 *   payout is rounded down; intermediate amounts stay fractional.
 * - Dragon material: the spec states full reimbursement for dragon-material items,
 *   and that the 50 % high-enchantment clause wins where both apply. Under the
 *   specified rule set no other rule reduces reimbursement, so "fully reimbursed"
 *   coincides with the default. The rule is therefore covered by tests that pin the
 *   payout for dragon items at both enchantment levels rather than by a separate
 *   production branch, which would be unobservable.
 * - First insurance surcharge: 10 % of the policy base premium, applied on every
 *   quote regardless of customer history (per the integration example).
 */
describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums per item type -------------------------------
  it("quotes an empty item list as 5 G -- processing fee only", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("quotes a single plain sword as 115 G -- 100 G base + 10 G first insurance + 5 G fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a single plain amulet as 71 G -- 60 G base + 6 G first insurance + 5 G fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a single plain staff as 93 G -- 80 G base + 8 G first insurance + 5 G fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a single plain potion as 49 G -- 40 G base + 4 G first insurance + 5 G fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", cursed: false }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });
  it("quotes a single rune as 33 G -- 25 G component base + 2.5 G first insurance + 5 G fee, rounded up", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone as 33 G -- 25 G component base + 2.5 G first insurance + 5 G fee, rounded up", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a mixed policy of sword and amulet with base premium 160 G -- item base premiums are summed", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
      ],
    });

    // 160 G base + 16 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 181 }]);
  });

  // --- Quote: building block of 3 alike components ----------------------
  it("quotes 2 runes with base premium 50 G -- no block below 3", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 G base + 5 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes with base premium 60 G -- block of 3 alike components applies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes with base premium 100 G -- no block, block requires exactly 3", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes with base premium 175 G -- no block, block requires exactly 3", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G, rounded up
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes + 1 moonstone with base premium 75 G -- no block, different types are not alike", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G, rounded up
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("quotes 3 runes + 3 moonstones with base premium 120 G -- two separate blocks, one per type", () => {
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

    // 120 G base (two blocks) + 12 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 137 }]);
  });
  it("quotes 3 moonstones with base premium 60 G -- the block rule applies per component type, not only to runes", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 3 }, () => ({ type: "moonstone" })) },
      ],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });

  it("quotes 3 swords with base premium 300 G -- the block offer covers components only, not main items", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 3 }, () => ({ type: "sword" })) }],
    });

    // 300 G base + 30 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 335 }]);
  });

  // --- Quote: item-specific modifiers -----------------------------------
  it("adds a 50 % curse surcharge on the cursed item's base premium -- cursed sword base 100 G -> 150 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 -- sword base 100 G -> 130 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- sword base 100 G stays 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("stacks curse and high-enchantment surcharges on one item -- cursed sword at enchantment 5 -> 100 + 50 + 30 = 180 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 195 }]);
  });
  it("applies the curse surcharge only to the cursed item on a multi-item policy -- cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
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

    // 160 G policy base + 50 G curse (50 % of the sword only) + 16 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 231 }]);
  });
  it("applies the high-enchantment surcharge only to the enchanted item on a multi-item policy -- enchantment-5 sword + plain amulet -> 190 G before policy modifiers and fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // 160 G policy base + 30 G high enchantment (30 % of the sword only) + 16 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 211 }]);
  });
  it("applies item modifiers to component items too -- cursed rune base 25 G -> 37.5 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    });

    // 25 G base + 12.5 G curse + 2.5 G first insurance + 5 G fee = 45 G
    expect(results).toEqual([{ premium: 45 }]);
  });

  // --- Quote: policy-wide modifiers -------------------------------------
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO -- sword policy base 100 G -> 80 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword policy base 100 G stays 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 10 % first insurance surcharge on the policy base premium -- sword policy base 100 G -> 110 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
    });

    // 160 G policy base + 16 G first insurance (10 % of the policy base) + 5 G fee
    expect(results).toEqual([{ premium: 181 }]);
  });
  it("applies a 15 % follow-up discount on the second quote of a scenario -- sword policy base 100 G -> -15 G on the second quote", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // first: 100 + 10 + 5 = 115 G; second: 100 - 15 follow-up + 10 first insurance + 5 fee = 100 G
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies no follow-up discount on the first quote of a scenario", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee, no follow-up discount
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies the 15 % follow-up discount on the third quote as well -- every contract after the first", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
  });
  it("computes policy-wide modifiers from the policy base premium, not from the surcharged amount -- cursed sword at enchantment 7, 3 years, second quote -> 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [sword] },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up = 155 G + 5 G fee = 160 G
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("adds the 5 G processing fee at the very end, after all discounts and surcharges", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: Array.from({ length: 3 }, () => ({ type: "rune" })) },
      ],
    });

    // 60 G block base - 15 G net customer modifiers = 45 G, then + 5 G fee (the fee is
    // never scaled by a discount)
    expect(results[1]).toEqual({ premium: 50 });
  });

  // --- Quote: rounding ---------------------------------------------------
  it("rounds a premium of 197.5 G up to 198 G -- rounding favours the MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    // 175 + 17.5 + 5 = 197.5 G
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts fractional and rounds only the final premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    });

    // 25 + 12.5 curse + 2.5 first insurance + 5 fee = 45 G exactly.
    // Rounding each fractional term separately would yield 46 G.
    expect(results).toEqual([{ premium: 45 }]);
  });

  // --- Quote: integration examples ---------------------------------------
  it("quotes the newcomer with a cursed sword as 165 G -- 100 base + 50 curse + 10 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes the long-standing customer's second contract as 160 G -- 100 + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---------------------------------------------------
  it("throws an Error describing the unknown item type when a quote includes {type: 'broomstick'}", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Insurance sum and cap ----------------------------------------------
  it("insures a sword and an amulet with insurance sum 1600 G and cap 3200 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });

    // insurance sum 1000 + 600 = 1600 G, cap 3200 G; payout 300 - 100 deductible = 200 G
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3000 });
  });
  it("insures two swords with insurance sum 2000 G and cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });

    // insurance sum 2 x 1000 G, cap 4000 G; payout 300 - 100 = 200 G
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3800 });
  });
  it("insures a sword and 3 runes with insurance sum 1750 G and cap 3500 G -- the block discount affects the premium only", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });

    // insurance sum 1000 + 3 x 250 = 1750 G, cap 3500 G; payout 200 G
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3300 });
  });
  it("bases the cap on the unmodified insurance value -- cursed sword premium 165 G but cap 2000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });

    expect(results[0]).toEqual({ premium: 165 });
    // cap 2 x 1000 G from the unmodified insurance value; payout 200 G
    expect(results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });

  // --- Claim: standard reimbursement ---------------------------------------
  it("pays out 400 G for a steel sword at enchantment 3 with damage 500 G -- full reimbursement minus the 100 G deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a rune with damage 200 G -- runes have no enchantment or material, so no special clause applies", () => {
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

    // insurance value 250 G, cap 500 G; payout 200 - 100 = 100 G
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reports the remaining cap after a claim -- sword policy cap 2000 G, payout 400 G -> remainingCap 1600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 0 G when the damage amount is at or below the 100 G deductible -- damage 100 G -> payout 0 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // the deductible never turns into a debt owed to the MHPCO
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: special clauses ------------------------------------------------
  it("reimburses damage to an item at enchantment exactly 8 at 50 % -- dragon sword, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
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

    // 50 % of 1000 = 500, then the 100 G deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a steel sword at enchantment 9 at 50 % then deducts -- damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
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

    // only the high-enchantment clause applies: 50 % first, then the deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword at enchantment 5 fully then deducts -- damage 800 G -> payout 700 G", () => {
    const results = runScenario({
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

    // only the dragon-material clause applies: full reimbursement, then the deductible
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % enchantment rule win over full dragon reimbursement -- dragon sword at enchantment 9, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
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

    // both clauses apply; the 50 % rule wins, then the deductible: 500 - 100
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies no special clause at enchantment 7 on a steel item -- sword damage 1000 G -> payout 900 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // enchantment 7 is below the >= 8 threshold
    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });

  // --- Claim: deductible per damage event ------------------------------------
  it("applies the 100 G deductible once per damaged item -- sword 500 G and amulet 300 G -> payout 600 G", () => {
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

    // (500 - 100) + (300 - 100) = 600 G; cap 3200 G
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats two damage entries of the same item type as separate damages with their own deductible -- two swords insured, damages 500 G and 300 G -> payout 600 G", () => {
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

    // (500 - 100) + (300 - 100) = 600 G; cap 4000 G
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Claim: cap exhaustion ---------------------------------------------------
  it("caps the first claim of 1500 G on a sword policy at 1400 G with remainingCap 600 G", () => {
    const results = runScenario({
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

    // cap 2000 G; payout 1500 - 100 = 1400 G
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces the second claim of 1500 G to the remaining cap -- payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("pays out 0 G once the cap is exhausted -- a third claim yields payout 0 G and remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim, claim],
    });

    expect(results[3]).toEqual({ payout: 0, remainingCap: 0 });
  });

  // --- Claim: rounding ----------------------------------------------------------
  it("rounds a payout of 350.5 G down to 350 G -- rounding favours the MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // 50 % of 901 = 450.5, minus the 100 G deductible = 350.5 G, rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ----------------------------------------------------------
  it("throws an Error when a damage entry names an item not covered by the policy -- amulet damaged while only a sword is insured", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("throws an Error when a damage entry names an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("throws an Error when the damages contain more entries of a type than the policy covers -- two sword damages, one sword insured", () => {
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
  it("throws an Error when a damage entry has a negative amount -- amount: -200", () => {
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
  it("throws an Error when a claim references a step index that is not a quote", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/policy/i);
  });

  // --- CLI adapter ------------------------------------------------------------------
  it("CLI reads the schema example from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout with exit code 0", () => {
    const scenario = {
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
    };

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // 60 G base - 12 loyalty + 6 first insurance + 5 fee = 59 G; payout 200 - 100 = 100 G,
    // cap 1200 G
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for an invalid claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200/);
    expect(result.stdout).toBe("");
  });
});
