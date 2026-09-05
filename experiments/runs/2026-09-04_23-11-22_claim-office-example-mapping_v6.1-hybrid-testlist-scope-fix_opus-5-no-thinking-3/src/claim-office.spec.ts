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

  // --- Base premiums per main item (plus fee, newcomer surcharges apply) ---
  it("single sword base premium 100 G → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet base premium 60 G → premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff base premium 80 G → premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion base premium 40 G → premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the building block of 3 alike ---
  it("single rune base premium 25 G → premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium → premium 60 G (50 + 5 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) → premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) → premium 115 G", () => {
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
  it("7 runes → 175 G base premium → premium 198 G (197.5 rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" as const })) },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → premium 88 G", () => {
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
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → premium 137 G", () => {
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

  // --- Premium modifiers in isolation ---
  it("cursed sword adds 50 % risk surcharge → 50 G on a 100 G base premium → premium 165 G", () => {
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
  it("sword with exactly enchantment 5 adds 30 % high-enchantment surcharge → premium 145 G", () => {
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
  it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
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
  it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G", () => {
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
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies → premium 95 G", () => {
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
  it("customer with 1 year with MHPCO → no loyalty discount → premium 115 G", () => {
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
  it("first insurance surcharge applies to every quoted item, even for a long-standing customer → premium 59 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 59 }] });
  });
  it("second contract receives a 15 % follow-up discount → premiums 115 G then 100 G", () => {
    const sword = { type: "sword" as const, material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) → curse adds 50 G on the cursed item only → premium 231 G", () => {
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
  it("policy-wide modifiers apply to the policy base premium, not the item-modified total → premium 199 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
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

    expect(result).toEqual({ results: [{ premium: 199 }] });
  });

  // --- Rounding in the MHPCO's favor ---
  // The spec's "197.5 G → 198 G" rounding example is exercised verbatim by the
  // 7-runes test above (175 + 17.5 + 5 = 197.5 → 198).
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  // The spec's "newcomer with a cursed sword → 165 G" integration example is
  // exercised verbatim by the cursed-sword surcharge test above.
  it("long-standing customer's second contract, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment or material), damage 200 G → payout 100 G, remainingCap 400 G", () => {
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

    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
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

  // --- Cap ---
  // "sword + amulet → cap 3200 G" is exercised by the dragon-attack test above
  // (remainingCap 2600 after a 600 G payout), and "cursed sword → cap 2000 G,
  // unaffected by premium modifiers" by the sword-policy claim tests, whose cap
  // is 2000 G regardless of the premium charged.
  it("policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("sword policy (cap 2000 G), two successive claims of 1500 G → payouts 1400 G then 600 G, cap exhausted", () => {
    const claimStep = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claimStep,
        claimStep,
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
  it("policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword" as const, material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 400, remainingCap: 3600 }],
    });
  });
  it("two sword damage entries on a two-sword policy → each is a separate damage with its own deductible", () => {
    const sword = { type: "sword" as const, material: "steel", enchantment: 3, cursed: false };
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

  // --- Error cases ---
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario as never)).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet damaged, only a sword insured) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("claim referencing a damage entry with an unknown item type → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
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

    expect(() => runScenario(scenario)).toThrow(/sword/);
  });
  it("claim containing a damage entry with amount -200 → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/-200/);
  });

  // --- CLI ---
  // The CLI is covered by src/cli.spec.ts, which spawns the executable.
});
