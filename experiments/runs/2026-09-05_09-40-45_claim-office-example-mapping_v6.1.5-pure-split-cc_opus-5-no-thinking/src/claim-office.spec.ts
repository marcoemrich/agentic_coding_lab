import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty policy ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type (plus 5 G fee, first insurance 10 %) ---
  it("single plain sword, new customer → base premium 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet, new customer → base premium 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff, new customer → base premium 80 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion, new customer → base premium 40 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components ---
  it("single rune → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block of 3 alike applies)", () => {
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
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
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
  it("7 runes → 175 G base premium (no block for 7)", () => {
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

  // --- "Alike" components ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
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
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
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

  // --- Individual premium modifiers ---
  it("cursed sword adds a 50 % risk surcharge on the item's base premium", () => {
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
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge", () => {
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
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
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
  it("cursed sword with enchantment 5 → both surcharges apply", () => {
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
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
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
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
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
  it("first quote in a scenario carries the 10 % initial assessment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in a scenario receives the 15 % follow-up contract discount", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  // The spec's ❓: a long-standing customer on a follow-up contract still pays
  // the initial assessment on a newly insured item. 160 is only reachable if
  // the +10 % is applied alongside the loyalty and follow-up discounts.
  it("first insurance surcharge applies to every quote's items regardless of customer history", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 41 }, { premium: 160 }],
    });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (item-scoped) → 210 G before further modifiers and fee", () => {
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
  it("policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];

    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items },
        { op: "quote", items },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 199 }, { premium: 175 }],
    });
  });
  // Net policy modifier here is -25% (+10 initial assessment, -20 loyalty,
  // -15 follow-up), which is what makes fee placement observable: adding the
  // fee before the modifiers would scale it too, giving 49 instead of 50.
  it("the 5 G processing fee is added at the very end", () => {
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];

    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items },
        { op: "quote", items },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 59 }, { premium: 50 }],
    });
  });

  // --- Rounding in the MHPCO's favor ---
  // sword 100 + rune 25 + 2 moonstones 50 = 175 base; +10% = 192.5; +5 fee
  // = 197.5. A different route to the spec's rounding example than 7 runes,
  // so the two tests do not merely restate one another.
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  // Enchantment 9 halves the damage: 901 / 2 = 450.5, less the 100 deductible
  // = 350.5. Payouts round DOWN in the MHPCO's favor, unlike premiums.
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
  // A rune (base 25) for a loyal customer's second quote puts three fractional
  // modifiers in play: +2.5 assessment, −5 loyalty, −3.75 follow-up. Summed
  // then rounded once → ceil(18.75 + 5) = 24. Rounding each modifier as it is
  // applied would instead give 25, so this discriminates late from early
  // rounding rather than merely documenting it.
  it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
    const rune = { type: "rune" };

    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [rune] },
        { op: "quote", items: [rune] },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 28 }, { premium: 24 }],
    });
  });

  // --- Standard claim reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
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
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
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

  // --- Enchantment threshold vs. dragon material ---
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Insurance sum and cap ---
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
    });
  });
  it("a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
    });
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim",
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
        claim,
        claim,
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  it("two sword damage entries against a policy with two swords → each entry gets its own deductible", () => {
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

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("more damage entries of a type than the policy covers → error (claim rejected)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      }),
    ).toThrow();
  });

  // --- Error cases ---
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not part of the policy (amulet damaged, only sword insured) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      }),
    ).toThrow();
  });
  it("claim referencing a damage entry with an unknown item type → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
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
    ).toThrow();
  });
  it("claim with a damage entry of amount -200 → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
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
    ).toThrow();
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword (0 years, no previous contract) → premium 165 G", () => {
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
  // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 initial
  // assessment − 15 follow-up = 155, + 5 fee = 160. The initial assessment
  // still applies even though the customer is on a follow-up contract: each
  // quote's items are a first insurance regardless of customer history.
  it("long-standing customer's second contract with a cursed sword (3 years, enchantment 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 41 }, { premium: 160 }],
    });
  });

  // --- CLI-level scenario ---
  // Driven as a subprocess so the actual CLI contract is exercised: JSON in on
  // stdin, JSON out on stdout, and a non-zero exit with a stderr description
  // when the scenario is rejected.
  const runCli = (scenario: unknown) =>
    spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

  it("schema example scenario → results array with a quote premium and a claim payout/remainingCap", () => {
    const cli = runCli({
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

    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI rejects an unknown item type with a non-zero exit and a stderr description", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
});
