import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ---------------------------------------------------------------------
  // Quote -- simplest case
  // ---------------------------------------------------------------------
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  // ---------------------------------------------------------------------
  // Quote -- main item base premiums (price-list catalogue, premium side)
  // Each entry is independent data and gets its own test.
  // ---------------------------------------------------------------------
  it("quotes a single plain sword as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a single plain amulet as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a single plain staff as 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a single plain potion as 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });

  // ---------------------------------------------------------------------
  // Quote -- component base premiums and the building block of 3 alike
  // ---------------------------------------------------------------------
  it("quotes a single rune as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes 2 runes as 60 G (50 G base, no block + 5 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes as 71 G (60 G block base + 6 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes as 115 G (100 G base, block requires exactly 3 + 10 G first insurance + 5 G fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes as 198 G (175 G base + 17.5 G first insurance + 5 G fee = 197.5, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes + 1 moonstone as 88 G (75 G base, no block: alike means same type + 7.5 G first insurance + 5 G fee, rounded up)", () => {
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
  it("quotes 3 runes + 3 moonstones as 137 G (120 G base, two separate blocks + 12 G first insurance + 5 G fee)", () => {
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

  // ---------------------------------------------------------------------
  // Quote -- item-scoped modifiers and their thresholds
  // ---------------------------------------------------------------------
  it("adds a 50 % curse surcharge to the cursed item's base premium (cursed sword -> 165 G)", () => {
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
  it("adds a 30 % high-enchantment surcharge at exactly enchantment 5 (sword ench 5 -> 145 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (sword ench 4 -> 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -> 195 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 195 }]);
  });

  // ---------------------------------------------------------------------
  // Quote -- modifier scope on multi-item policies
  // ---------------------------------------------------------------------
  it("applies the curse surcharge only to the cursed item's base premium, not the policy total (cursed sword + plain amulet -> 231 G)", () => {
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

    expect(results).toEqual([{ premium: 231 }]);
  });

  // ---------------------------------------------------------------------
  // Quote -- policy-scoped modifiers and their thresholds
  // ---------------------------------------------------------------------
  it("applies a 20 % loyalty discount on the policy base premium at exactly 2 years with MHPCO (sword -> 95 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount at 1 year with MHPCO (sword -> 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 10 % first-insurance surcharge per insured item (newcomer with a cursed sword -> 165 G)", () => {
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
  it("applies a 15 % follow-up-contract discount on every quote after the customer's first (second quote of a plain sword, 0 years -> 100 G)", () => {
    const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [plainSword] },
        { op: "quote", items: [plainSword] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("still applies the first-insurance surcharge on a follow-up contract (3 years, second quote, cursed sword ench 7 -> 160 G)", () => {
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

  // ---------------------------------------------------------------------
  // Quote -- rounding in the MHPCO's favour
  // ---------------------------------------------------------------------
  it("rounds a premium of 197.5 G up to 198 G (7 runes, MHPCO's favour)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts as fractions and rounds the final premium up, not to nearest (76.25 G -> 77 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "moonstone" }, { type: "moonstone" }],
        },
      ],
    });

    // base 75 + first insurance 7.5 - follow-up 11.25 + fee 5 = 76.25
    expect(results[1]).toEqual({ premium: 77 });
  });

  // ---------------------------------------------------------------------
  // Quote -- rejection
  // ---------------------------------------------------------------------
  it("throws an Error when a quote contains an item of unknown type (e.g. broomstick) -- chosen contract: domain throws Error, CLI exits non-zero with stderr message", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // ---------------------------------------------------------------------
  // Claim -- standard reimbursement and the per-damage deductible
  // ---------------------------------------------------------------------
  it("pays out damage minus the 100 G deductible for a plain steel sword ench 3, damage 500 G -> payout 400 G", () => {
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
  it("pays out damage minus the 100 G deductible for a rune (no enchantment, no material), damage 200 G -> payout 100 G", () => {
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
  it("applies the 100 G deductible once per damaged item (sword 500 G + amulet 300 G -> payout 600 G)", () => {
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

  // ---------------------------------------------------------------------
  // Claim -- special clauses and their thresholds
  // ---------------------------------------------------------------------
  it("reimburses 50 % of the damage at exactly enchantment 8 (steel sword, damage 1000 G -> payout 400 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies no high-enchantment clause at enchantment 7 (steel sword, damage 1000 G -> payout 900 G)", () => {
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

    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("reimburses dragon material fully (dragon sword ench 5, damage 800 G -> payout 700 G)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % high-enchantment rule win over dragon material (dragon sword ench 9, damage 1000 G -> payout 400 G)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the high-enchantment clause alone for a steel sword ench 9, damage 1000 G -> payout 400 G", () => {
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

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the high-enchantment clause then the deductible for a dragon sword at exactly ench 8, damage 1000 G -> payout 400 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ---------------------------------------------------------------------
  // Claim -- rounding in the MHPCO's favour
  // ---------------------------------------------------------------------
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour)", () => {
    const results = runScenario({
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

    // 901 halved = 450.5, minus the 100 G deductible = 350.5 -> rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // ---------------------------------------------------------------------
  // Claim -- insurance sum and cap (price-list catalogue, insurance-value
  // side; each item type's insurance value is independent data)
  // ---------------------------------------------------------------------
  it("caps a sword policy at 2000 G (2 x 1000 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("caps an amulet policy at 1200 G (2 x 600 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1200, remainingCap: 0 });
  });
  it("caps a staff policy at 1600 G (2 x 800 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "staff", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1600, remainingCap: 0 });
  });
  it("caps a potion policy at 800 G (2 x 400 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "potion", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 800, remainingCap: 0 });
  });
  it("caps a single-rune policy at 500 G (2 x 250 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 500, remainingCap: 0 });
  });
  it("caps a single-moonstone policy at 500 G (2 x 250 G insurance value)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "moonstone", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 500, remainingCap: 0 });
  });
  it("sums insurance values across items for the cap (sword + amulet -> insurance sum 1600 G, cap 3200 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("bases the cap on unmodified insurance values (cursed sword, premium 165 G -> cap still 2000 G)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });

    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("ignores the block discount for the insurance sum (sword + 3 runes -> insurance sum 1750 G, cap 3500 G)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 99999 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // ---------------------------------------------------------------------
  // Claim -- cap exhaustion across successive claims
  // ---------------------------------------------------------------------
  it("reports the remaining cap after a claim, then reduces a later payout to the remaining cap (1500 G twice -> 1400 G then 600 G)", () => {
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


  // ---------------------------------------------------------------------
  // Claim -- multiple items of the same type
  // ---------------------------------------------------------------------
  it("insures two swords as insurance sum 2000 G with cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
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
  it("treats two sword damage entries as separate damages, each with its own deductible (500 G + 300 G -> payout 600 G)", () => {
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

  // ---------------------------------------------------------------------
  // Claim -- rejection
  // ---------------------------------------------------------------------
  it("throws an Error when a damage names an item type not covered by the policy (amulet damaged, only a sword insured)", () => {
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
  it("throws an Error when a damage names an item of unknown type (e.g. broomstick)", () => {
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
  it("throws an Error when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] },
        },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("throws an Error when a damage amount is negative (amount: -200)", () => {
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
    ).toThrow(/-200|negative/);
  });

  // ---------------------------------------------------------------------
  // Scenario processing -- steps, ordering and policy references
  // ---------------------------------------------------------------------
  it("returns one result per step, in the order of the input steps", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });

    expect(results).toEqual([
      { premium: 115 },
      { payout: 200, remainingCap: 1800 },
      { premium: 62 },
    ]);
  });
  it("resolves a claim's policy field as the zero-based index of the quote step that created the policy", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // policy 1 is the sword policy: cap 2000, payout 500 - 100
    expect(results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("claim-office CLI", () => {
  const runCli = (input: unknown) =>
    spawnSync("npx", ["tsx", fileURLToPath(new URL("./cli.ts", import.meta.url))], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });

  it("reads a scenario from stdin and writes {results: [...]} as JSON to stdout (schema example -> premium 65 G, payout 100 G, remainingCap 1100 G)", () => {
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
    // 60 base + 6 first insurance - 12 loyalty + 5 fee = 59; cap 1200, payout 200 - 100
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits with a non-zero status and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toMatch(/results/);
  });

  it("exits with a non-zero status and writes an error description to stderr for a damage outside the policy", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).not.toMatch(/results/);
  });

  it("exits with a non-zero status and writes an error description to stderr for a negative damage amount", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|-200/);
    expect(result.stdout).not.toMatch(/results/);
  });
});
