import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums per item type ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword → base premium 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 100 G base + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet → base premium 60 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };

    // 60 G base + 6 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff → base premium 80 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };

    // 80 G base + 8 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion → base premium 40 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };

    // 40 G base + 4 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune → base premium 25 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → rounded up
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone → base premium 25 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };

    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → rounded up
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Building block of 3 alike components ---
  it("2 runes → 50 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    // 50 G base + 5 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const scenario = {
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
    };

    // 100 G base + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 → rounded up
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 → rounded up
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 swords → 300 G base premium (blocks apply to components only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 3 }, () => ({ type: "sword" })),
        },
      ],
    };

    // 300 G base + 30 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 335 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const scenario = {
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
    };

    // 120 G base (two blocks) + 12 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds a 50 % surcharge on that item's base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };

    // 100 G base + 10 G first insurance + 5 G fee (no surcharge below level 5)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 gets both surcharges", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (only the cursed item's base) → 210 G before further modifiers and fee", () => {
    const scenario = {
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
    };

    // 160 G policy base + 50 G curse (50 % of the sword's 100 G, not of 160 G)
    // = 210 G, + 16 G first insurance (10 % of 160 G) + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 100 G base + 10 G first insurance + 5 G fee (no loyalty below 2 years)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  // The 10 % first insurance surcharge is asserted by every quote test above:
  // each expected premium includes it (e.g. "single sword" → 100 + 10 + 5).
  it("the second quote of a customer receives a 15 % follow-up contract discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };

    // first:  100 G base + 10 G first insurance + 5 G fee
    // second: 100 G base + 10 G first insurance − 15 G follow-up + 5 G fee
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  // The 5 G processing fee is asserted by every quote test above, most
  // directly by "empty item list → premium 5 G".

  // --- Rounding ---
  // Premium rounding up is asserted by "7 runes → 175 G base premium", whose
  // 197.5 G total is the spec's own rounding example.
  it("payout of 350.5 G is rounded down to 350 G (MHPCO's favour)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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
    };

    // 50 % of 901 G = 450.5 G, − 100 G deductible = 350.5 G → rounded down
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  // The newcomer integration example (0 years, cursed steel sword,
  // enchantment 3 → 165 G) is asserted by the cursed-sword surcharge test.
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };

    // 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
    // + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 5 }, { premium: 160 }],
    });
  });

  // --- Claim: standard reimbursement ---
  it("steel sword, enchantment 3, damage 500 G → payout 400 G (damage minus deductible)", () => {
    const scenario = {
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
    };

    // full reimbursement 500 G − 100 G deductible = 400 G
    // cap 2000 G (2 × 1000 G insurance sum) − 400 G paid = 1600 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const scenario = {
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
    };

    // no special clause applies: 200 G − 100 G deductible = 100 G
    // cap 500 G (2 × 250 G) − 100 G = 400 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
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
    };

    // only the dragon-material clause applies (enchantment 5 < 8):
    // full reimbursement 800 G − 100 G deductible = 700 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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
    };

    // enchantment >= 8: 50 % of 1000 G = 500 G, then − 100 G deductible = 400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
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
    };

    // both clauses apply; the 50 % rule wins: 500 G − 100 G deductible = 400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over dragon material)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
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
    };

    // both clauses apply; the 50 % rule wins: 500 G − 100 G deductible = 400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damaging sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };

    // (500 − 100) + (300 − 100) = 600 G; the deductible applies per damaged item
    // cap 3200 G (2 × 1600 G) − 600 G = 2600 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: cap ---
  // The sword + amulet cap of 3200 G is asserted by the dragon-attack test
  // above, whose remainingCap of 2600 G is 3200 − 600.
  it("policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    const scenario = {
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
    };

    // premium: 100 G + 60 G block = 160 G base + 16 G first insurance + 5 G fee
    // cap: 2 × (1000 + 3×250) = 3500 G — the block discount does not reduce it
    // claim: 200 − 100 = 100 G payout, leaving 3400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("cursed sword → cap 2000 G based on the unmodified insurance value", () => {
    const scenario = {
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
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    };

    // premium 165 G (with the curse surcharge), but the cap is still
    // 2 × 1000 G: premium modifiers do not raise it. The desired 2400 G
    // payout is therefore reduced to the 2000 G cap.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("sword policy, first claim of 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const scenario = {
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
    };

    // 1500 − 100 = 1400 G, within the 2000 G cap; 2000 − 1400 = 600 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword policy, second claim of 1500 G → payout 600 G, remaining cap 0 G", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    };

    // first claim pays 1400 G of the 2000 G cap, leaving 600 G; the second
    // claim wants 1400 G but is reduced to the remaining cap
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  // The two-sword cap of 4000 G is asserted by the test below, whose
  // remainingCap of 3400 G is 4000 − 600.
  it("two sword damage entries → each treated as a separate damage with its own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 2 }, () => ({ type: "sword" })),
        },
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
    };

    // premium: 200 G base + 20 G first insurance + 5 G fee
    // cap: 2 × 2000 G = 4000 G
    // claim: (500 − 100) + (300 − 100) = 600 G, leaving 3400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("more damage entries of a type than insured → the claim is rejected with an error", () => {
    const scenario = {
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
    };

    // only one sword is insured, so a second sword damage cannot be covered
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Errors ---
  it("quote with an unknown item type (broomstick) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim for an item not part of the policy → error", () => {
    const scenario = {
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
    };

    // only a sword is insured; an amulet is not covered by this policy
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with a damage entry of unknown item type → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim referencing a policy that does not exist → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 7,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/policy/);
  });

  it("claim with a negative damage amount (-200) → error", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow();
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes {results:[...]} to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
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
    };

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // premium: 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee
    // claim: 200 − 100 = 100 G; cap 1200 G − 100 G = 1100 G
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes to stderr on an unknown item type, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("broomstick");
    expect(run.stdout).toBe("");
    // a crash dump is not an error report: the description must be the
    // message alone, not a stack trace
    expect(run.stderr).not.toContain("at ");
  });
});
