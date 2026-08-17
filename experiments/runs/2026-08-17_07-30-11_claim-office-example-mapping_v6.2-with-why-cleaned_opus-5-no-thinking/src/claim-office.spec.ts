import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums for main items ---
  it("quotes an empty item list — premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword for a new customer — 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet for a new customer — 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff for a new customer — 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion for a new customer — 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and the block of 3 alike ---
  it("quotes 1 rune — 25 G base premium (+ 2.5 first insurance + 5 fee = 32.5 → 33 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 2 runes — 50 G base premium, no block (+ 5 first insurance + 5 fee = 60 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes 3 runes — 60 G base premium, block applies (+ 6 first insurance + 5 fee = 71 G)", () => {
    const result = runScenario({
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
  it("quotes 4 runes — 100 G base premium, no block since a block requires exactly 3 (+ 10 first insurance + 5 fee = 115 G)", () => {
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

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes — 175 G base premium, no block (+ 17.5 first insurance + 5 fee = 197.5 → 198 G)", () => {
    const result = runScenario({
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
  it("quotes 2 runes + 1 moonstone — 75 G base premium, no block since types differ (+ 7.5 first insurance + 5 fee = 87.5 → 88 G)", () => {
    const result = runScenario({
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
  it("quotes 3 runes + 3 moonstones — 120 G base premium, two separate blocks (+ 12 first insurance + 5 fee = 137 G)", () => {
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

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to a cursed sword — 100 G base + 50 G curse (+ 10 first insurance + 5 fee = 165 G)", () => {
    const result = runScenario({
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
  it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 — 100 G base + 30 G (+ 10 first insurance + 5 fee = 145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4 — 100 G base (+ 10 first insurance + 5 fee = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 — 100 G base + 50 + 30 (+ 10 first insurance + 5 fee = 195 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 20 % loyalty discount for a customer with exactly 2 years with MHPCO — 100 G base − 20 (+ 10 first insurance + 5 fee = 95 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO — 100 G base (+ 10 first insurance + 5 fee = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  // The 10 % first insurance surcharge and the 5 G processing fee are already
  // pinned by the plain-item and empty-list tests above.
  it("applies the 15 % follow-up discount to every contract after the customer's first — second quote 100 G vs first 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item's base premium — cursed sword + plain amulet → 160 G base + 50 G curse (+ 16 first insurance + 5 fee = 231 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: rounding in MHPCO's favour ---
  // Premium rounding (197.5 → 198) and fractional intermediates (32.5 → 33)
  // are already pinned by the 7-rune and 1-rune tests above.

  // --- Quote: integration examples ---
  // The newcomer's cursed sword (165 G) is already pinned by the curse
  // surcharge test above — same scenario, same expected premium.
  it("quotes a 3-year customer's second contract for a cursed sword with enchantment 7 — 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- Quote: errors ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type/i);
  });

  // --- Claim: standard reimbursement ---
  it("pays a regular sword (steel, enchantment 3) with damage 500 G — payout 400 G (damage minus 100 G deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays damage 200 G to a rune — payout 100 G (runes have no enchantment or material)", () => {
    const result = runScenario({
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

    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment 8 at 50 % — dragon sword, damage 1000 G → payout 400 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("fully reimburses dragon-material damage — dragon sword, enchantment 5, damage 800 G → payout 700 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("lets the 50 % rule win when both clauses apply — dragon sword, enchantment 9, damage 1000 G → payout 400 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("applies only the high-enchantment clause to a steel sword with enchantment 9, damage 1000 G → payout 400 G", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ---
  it("applies the 100 G deductible once per damaged item — sword 500 G + amulet 300 G → payout 600 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: insurance sum and cap ---
  // "cap = 2 × insurance sum" and "remainingCap reported per claim" are already
  // pinned by every claim test's remainingCap assertion (e.g. sword + amulet →
  // 3200 − 600 = 2600).
  // "cap ignores premium modifiers" is subsumed by the test below: the block
  // discount is the sharpest case of premium and insurance value diverging.
  it("bases the insurance sum on full component values — sword + 3 runes → insurance sum 1750 G despite the block discount", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 600 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 500, remainingCap: 3000 }],
    });
  });
  it("reduces a payout to the remaining cap across successive claims — two 1500 G claims on a sword → 1400 G then 600 G", () => {
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

    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Claim: multiple items of the same type ---
  it("treats two sword damage entries as separate damages, each with its own deductible — two swords insured, cap 4000 G", () => {
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
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
    ).toThrow(/than the policy covers/i);
  });

  // --- Claim: rounding ---
  it("rounds a payout of 350.5 G down to 350 G — enchantment 9, damage 901 → 450.5 − 100", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claim: errors ---
  // An unknown item type in a damage is the same rule: the policy does not
  // cover it either.
  it("rejects a claim whose damage references an item not covered by the policy", () => {
    const claimAgainstSwordPolicy = (itemType: string) => () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType, amount: 200 }] },
          },
        ],
      });

    expect(claimAgainstSwordPolicy("amulet")).toThrow(
      /not covered by the policy/i,
    );
    expect(claimAgainstSwordPolicy("broomstick")).toThrow(
      /not covered by the policy/i,
    );
  });
  it("rejects a claim containing a damage entry with a negative amount", () => {
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
    ).toThrow(/negative/i);
  });

  // --- Scenario / CLI wiring ---
  it("returns one result per step, in order, for a mixed quote-and-claim scenario", () => {
    const result = runScenario({
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
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 2,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
        { premium: 80 },
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 900 },
      ],
    });
  });
});
