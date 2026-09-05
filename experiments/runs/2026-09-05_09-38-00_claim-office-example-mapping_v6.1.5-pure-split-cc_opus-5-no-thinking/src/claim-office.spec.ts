import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases -------------------------------------------------
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("a single plain sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single plain amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single plain staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single plain potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and blocks -------------------------------------------------
  it("a single rune → base premium 25 G (25 + 2.5 first insurance + 5 fee = 32.5 → 33)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium (+10 % first insurance + 5 fee = 60)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies; +10 % + 5 fee = 71)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3; +10 % + 5 fee = 115)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (no block; 192.5 + 5 fee = 197.5 → 198)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types; 87.5 → 88)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks; +12 + 5 fee = 137)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Individual premium modifiers -----------------------------------------
  it("cursed items add a 50 % risk surcharge to the item's base premium (100 + 50 + 10 + 5 = 165)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("enchantment level 5 adds a 30 % high-enchantment surcharge (100 + 30 + 10 + 5 = 145)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("enchantment level 4 adds no high-enchantment surcharge (100 + 10 + 5 = 115)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a cursed sword with exactly enchantment 5 gets both surcharges (100 + 50 + 30 + 10 + 5 = 195)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("a customer with exactly 2 years with MHPCO gets the 20 % loyalty discount (100 − 20 + 10 + 5 = 95)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("a customer with 1 year with MHPCO gets no loyalty discount (100 + 10 + 5 = 115)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("the second contract of a scenario gets the 15 % follow-up discount (115, then 100)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // --- Modifier scope on multi-item policies --------------------------------
  it("cursed sword (100 G) + plain amulet (60 G) → curse adds 50 G on the item only → 210 G before further modifiers and fee", () => {
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

    // 160 policy base + 50 curse (50 % of the sword's own 100, not of the
    // policy's 160 — that would add 80) + 16 first insurance + 5 fee.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding --------------------------------------------------------------
  it("a premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5, the spec's own
    // rounding example.
    const sevenRunes = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    };

    expect(runScenario(sevenRunes)).toEqual({ results: [{ premium: 198 }] });

    // A second fraction, to pin the direction rather than one lucky value:
    // 5 runes → 125 + 12.5 + 5 = 142.5, which must round up too.
    const fiveRunes = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 5 }, () => ({ type: "rune" })) }],
    };

    expect(runScenario(fiveRunes)).toEqual({ results: [{ premium: 143 }] });
  });
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          // 901 halved is 450.5, less the 100 deductible is 350.5.
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claim: standard reimbursement ----------------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  it("`policy` is the zero-based STEP index of the quote, not the quote's ordinal", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 2,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    const { results } = runScenario(scenario);

    // policy 2 is the sword quote (step index 2): cap 2000, payout 500 − 100.
    expect(results[3]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: special clauses ------------------------------------------------
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full, then deductible)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event -----------------------------------
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Cap -------------------------------------------------------------------
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const scenario = {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
    });
  });
  it("a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          // 2400 is desired, but the cap is 2000 — set by the insurance value,
          // not by the 165 G premium the curse surcharge raised.
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 4000, remainingCap: 0 }],
    });
  });
  it("sword (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
    const claimOf1500 = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claimOf1500,
        claimOf1500,
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type --------------------------------------
  it("two swords insured, both damaged → each damage entry gets its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("more damage entries of a type than insured → error", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Error cases -----------------------------------------------------------
  it("quote with an unknown item type (broomstick) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim referencing an item not part of the policy → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with a damage entry of an unknown item type → error", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with a damage entry amount -200 → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Integration examples --------------------------------------------------
  it("newcomer (0 years) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("3-year customer's second quote, cursed sword enchantment 7 → premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- CLI -------------------------------------------------------------------
  it("CLI reads the schema example from stdin and writes results to stdout", () => {
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

    const cli = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits non-zero and writes to stderr on an unknown item type, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const cli = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(cli.status).not.toBe(0);
    // A description, not a crash report: no stack frames, no absolute paths.
    expect(cli.stderr.trim()).toBe(
      "the MHPCO does not insure items of type broomstick",
    );
    expect(cli.stdout).toBe("");
  });
});
