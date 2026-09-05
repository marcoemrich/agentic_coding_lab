import { describe, it, expect } from "vitest";
import { parseScenario, runScenario } from "./claim-office.js";

// These tests submit scenarios the way a caller does: as untyped data that has
// to cross the wire boundary before the domain sees it. The literals below
// cannot be typed as `Scenario` directly — they carry fields the domain ignores
// (`material`) and, in the error cases, deliberately invalid ones
// (`type: "broomstick"`) that only a runtime check can reject. So each scenario
// goes through the real parseScenario rather than a cast.
const submit = (scenario: unknown) => runScenario(parseScenario(scenario));

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items (incl. 10 % first insurance surcharge + 5 G fee) ---
  it("a single plain sword → base premium 100 G (+10 % first insurance +5 G fee = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single plain amulet → base premium 60 G (+10 % first insurance +5 G fee = 71 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single plain staff → base premium 80 G (+10 % first insurance +5 G fee = 93 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single plain potion → base premium 40 G (+10 % first insurance +5 G fee = 49 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and building blocks ---
  it("a single rune → base premium 25 G (+10 % first insurance +5 G fee = 32.5 G → 33 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("a single moonstone → base premium 25 G (+10 % first insurance +5 G fee = 32.5 G → 33 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium, no block (+10 % first insurance +5 G fee = 60 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium, block applies (+10 % first insurance +5 G fee = 71 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium, no block since a block requires exactly 3 (+10 % first insurance +5 G fee = 115 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium, no repeated-block discount (+10 % first insurance +5 G fee = 197.5 G → 198 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium, no block because the types differ (+10 % first insurance +5 G fee = 87.5 G → 88 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (+10 % first insurance +5 G fee = 137 G)", () => {
    const scenario = {
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
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("a cursed sword adds a 50 % risk surcharge on that item's base premium (100 + 50 + 10 first insurance + 5 fee = 165 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("a sword with exactly enchantment 5 adds a 30 % high-enchantment surcharge (100 + 30 + 10 first insurance + 5 fee = 145 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("a sword with enchantment 4 gets no high-enchantment surcharge (100 + 10 first insurance + 5 fee = 115 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a cursed sword with enchantment 5 gets both surcharges (100 + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount (100 − 20 + 10 first insurance + 5 fee = 95 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("a customer with 1 year with MHPCO receives no loyalty discount (100 + 10 first insurance + 5 fee = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  // The 10 % first insurance surcharge is asserted by every quote test above,
  // and the follow-up-contract test confirms it still applies on a later contract.
  it("the customer's second contract receives a 15 % follow-up discount, and first insurance still applies (100 + 50 + 30 − 20 + 10 − 15 + 5 fee = 160 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };

    expect(submit(scenario)).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) → curse surcharge is 50 G, 50 % of the sword alone and not 80 G of the 160 G policy total (+16 first insurance +5 fee = 231 G)", () => {
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

    expect(submit(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in the MHPCO's favour ---
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down), remainingCap 1650 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  // Fractional intermediates surviving to a single final rounding are asserted
  // by the 7-runes premium (197.5 → 198) and the payout above (350.5 → 350).

  // --- Integration examples ---

  // --- Insurance sum and cap ---
  it("a cursed sword costs 165 G in premium but its cap stays 2000 G, based on the unmodified insurance value, so a 1500 G claim pays 1400 G leaving remainingCap 600 G", () => {
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
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };

    expect(submit(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("a policy covering a sword and 3 runes → premium 181 G uses the block price, but insurance sum is 1750 G and cap 3500 G, so a 500 G claim pays 400 G leaving remainingCap 3100 G", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    expect(submit(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });

  // --- Standard claim processing ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G, remainingCap 400 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Special claim clauses ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible), remainingCap 1600 G", () => {
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    expect(submit(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full then deductible), remainingCap 1300 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply, the 50 % rule wins), remainingCap 1600 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G, remainingCap 1600 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Deductible per damage event ---
  it("damaged sword (500 G) and amulet (300 G) in one incident → payout 600 G, deductible per item, remainingCap 2600 G", () => {
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("two insured swords (premium 225 G, cap 4000 G), two sword damage entries → each entry gets its own deductible, payout 600 G, remainingCap 3400 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
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

    expect(submit(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });

  // --- Cap exhaustion ---
  it("two successive claims of 1500 G against a sword policy (cap 2000 G) exhaust the cap → payouts 1400 G then 600 G, remainingCap 600 G then 0 G", () => {
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
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        claim,
        claim,
      ],
    };

    expect(submit(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Error cases ---
  it("quote with an unknown item type (e.g. broomstick) → rejected, no results produced", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => submit(scenario)).toThrow();
  });
  it("claim damaging an item not covered by the policy (amulet, only sword insured) → the whole claim is rejected", () => {
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
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };

    expect(() => submit(scenario)).toThrow();
  });
  it("claim damaging an item with an unknown type → the whole claim is rejected", () => {
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
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    };

    expect(() => submit(scenario)).toThrow();
  });
  it("claim with more damage entries of a type than the policy covers → the whole claim is rejected", () => {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    expect(() => submit(scenario)).toThrow();
  });
  it("claim naming a policy index that no quote step created → rejected", () => {
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
          policy: 7,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    // A descriptive domain error, not an incidental TypeError from
    // dereferencing a policy that was never created.
    expect(() => submit(scenario)).toThrow(/policy/i);
  });

  it("claim with a damage entry of amount -200 → the whole claim is rejected", () => {
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
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };

    expect(() => submit(scenario)).toThrow();
  });
});
