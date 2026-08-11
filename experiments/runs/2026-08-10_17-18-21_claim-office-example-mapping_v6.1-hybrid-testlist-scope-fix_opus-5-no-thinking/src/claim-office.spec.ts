import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type (each + fee) ---
  it("a sword → premium 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("an amulet → premium 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("a staff → premium 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("a potion → premium 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and building blocks ---
  it("2 runes → 50 G base premium (+ 5 G first insurance + 5 G fee = 60 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) (+ 6 G first insurance + 5 G fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) (= 115 G)", () => {
    const result = runScenario({
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
  it("7 runes → 175 G base premium (+ 17.5 first insurance + 5 fee = 197.5 → 198 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) (= 88 G)", () => {
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
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (= 137 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array(3).fill({ type: "rune" }),
            ...Array(3).fill({ type: "moonstone" }),
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-scoped modifiers ---
  it("cursed sword adds a 50 % surcharge on the sword's base premium (100 + 50 + 10 + 5 = 165 G)", () => {
    const result = runScenario({
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
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
    const result = runScenario({
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
  it("sword with enchantment 4 → no high-enchantment surcharge (100 + 10 + 5 = 115 G)", () => {
    const result = runScenario({
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
  it("cursed sword with exactly enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
    const result = runScenario({
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

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → curse adds 50 G (50 % of the cursed item, not the policy total) (160 + 50 + 16 + 5 = 231 G)", () => {
    const result = runScenario({
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

  // --- Policy-scoped modifiers ---
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies (100 + 10 − 20 + 5 = 95 G)", () => {
    const result = runScenario({
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
  it("customer with 1 year with MHPCO → no loyalty discount (100 + 10 + 5 = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  // "first insurance adds a 10 % surcharge" is asserted by every quote test above.

  it("second contract of a customer → 15 % follow-up discount applies (100 + 10 − 15 + 5 = 100 G)", () => {
    const plainSword = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [plainSword, plainSword],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Rounding ---
  // "a premium yielding 197.5 G → 198 G (rounded up)" is asserted by the
  // 7-runes test above.

  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it("intermediate amounts are kept as fractions; only the final payout is rounded (two damages of 901 G → 701 G, not 700 G)", () => {
    const enchantedSword = {
      type: "sword",
      material: "steel",
      enchantment: 9,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [enchantedSword, enchantedSword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 901 },
              { itemType: "sword", amount: 901 },
            ],
          },
        },
      ],
    });

    // 350.5 + 350.5 = 701 exactly; rounding each entry first would give 700.
    expect(result.results[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });

  // --- Integration examples ---
  // Integration example "newcomer with a cursed sword → 165 G" is identical in
  // input and expectation to the cursed-sword test above; not duplicated here.

  it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement − 100 G deductible)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment or material, so no special clause)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim processing: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Insurance sum and cap ---
  // "sword + amulet → insurance sum 1600 G, cap 3200 G" is asserted by the
  // dragon-attack test above (remainingCap 2600 = 3200 − 600).
  it("policy covering a cursed sword (premium 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("policy covering a sword and 3 runes → insurance sum 1750 G (block affects premium only), cap 3500 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  // "two swords → insurance sum 2000 G, cap 4000 G" is asserted by the
  // two-sword damage test below (remainingCap 3400 = 4000 − 600).

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000 G), two successive claims of 1500 G → payouts 1400 G then 600 G, cap exhausted", () => {
    const claim1500 = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim1500,
        claim1500,
      ],
    });

    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---
  it("two swords insured, dragon attack damages both → each entry is a separate damage with its own deductible (400 + 200 = 600 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
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

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
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

  // --- Error cases ---
  it("quote includes an item with an unknown type (e.g. broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim references a damage entry whose item is not part of the policy → error", () => {
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

  it("claim references a damage entry with an unknown item type → error", () => {
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
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim contains a damage entry with amount: -200 → error", () => {
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
});
