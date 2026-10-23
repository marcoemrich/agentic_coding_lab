import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";
import { runCli } from "./cli.js";

describe("MHPCO Claim Office", () => {
  // Base premiums and empty list
  it("calculates quote premium for an empty item list as 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("calculates quote premium for a single plain sword for a customer with 0 years as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("calculates quote premium for a single plain amulet for a customer with 0 years as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("calculates quote premium for a single plain staff for a customer with 0 years as 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("calculates quote premium for a single plain potion for a customer with 0 years as 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("calculates quote premium for a single rune for a customer with 0 years as 33 G (25 G base + 2.5 G first insurance = 27.5 G + 5 G fee = 32.5 G rounded up to 33 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("calculates quote premium for a single moonstone for a customer with 0 years as 33 G (25 G base + 2.5 G first insurance = 27.5 G + 5 G fee = 32.5 G rounded up to 33 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Component building blocks
  it("calculates quote premium for 2 runes (50 G base premium) for a customer with 0 years as 60 G (50 G base + 5 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("calculates quote premium for 3 runes as a building block (60 G base premium) for a customer with 0 years as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    const result = processScenario({
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
  it("calculates quote premium for 4 runes with no building block (100 G base premium, requires exactly 3) for a customer with 0 years as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    const result = processScenario({
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
  it("calculates quote premium for 7 runes with no building block (175 G base premium) for a customer with 0 years as 198 G (175 G base + 17.5 G first insurance + 5 G fee = 197.5 G rounded up to 198 G)", () => {
    const result = processScenario({
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
  it("calculates quote premium for 2 runes and 1 moonstone with no building block (75 G base premium, different types) for a customer with 0 years as 88 G (75 G base + 7.5 G first insurance + 5 G fee = 87.5 G rounded up to 88 G)", () => {
    const result = processScenario({
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
  it("calculates quote premium for 3 runes and 3 moonstones as two separate building blocks (120 G base premium) for a customer with 0 years as 137 G (120 G base + 12 G first insurance + 5 G fee)", () => {
    const result = processScenario({
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

  // Item-specific modifiers and thresholds
  it("applies 50% cursed surcharge to a cursed sword (enchantment 3) for a newcomer (0 years) yielding 165 G (100 G base + 50 G curse + 10 G first insurance + 5 G fee)", () => {
    const result = processScenario({
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
  it("applies no high-enchantment surcharge for enchantment 4, and curse surcharge only if cursed (plain sword enchantment 4 -> 115 G, cursed sword enchantment 4 -> 165 G)", () => {
    const plainResult = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: false }],
        },
      ],
    });
    const cursedResult = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: true }],
        },
      ],
    });
    expect(plainResult).toEqual({ results: [{ premium: 115 }] });
    expect(cursedResult).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies 30% high-enchantment surcharge for a sword with exactly enchantment 5 yielding 145 G (100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("applies both 30% high-enchantment and 50% cursed surcharges to a cursed sword with enchantment 5 yielding 195 G (100 G base + 30 G high enchantment + 50 G curse + 10 G first insurance + 5 G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("applies item-specific cursed surcharge only to the affected item on a multi-item policy (cursed sword 100 G + plain amulet 60 G = 160 G policy base + 50 G sword curse + 16 G first insurance + 5 G fee = 231 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Customer and policy-wide modifiers
  it("applies 20% loyalty discount for a customer with exactly 2 years with MHPCO (plain sword: 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee = 95 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("does not apply loyalty discount for a customer with 1 year with MHPCO (plain sword: 100 G base + 10 G first insurance + 5 G fee = 115 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies 15% follow-up contract discount and 10% first insurance surcharge on a long-standing customer's (3 years) second quote with a cursed sword (enchantment 7) yielding 160 G (100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty + 10 G first insurance - 15 G follow-up + 5 G fee)", () => {
    const result = processScenario({
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

  // Claim processing: standard reimbursement, deductibles, and item insurance values
  it("processes a claim on a regular steel sword (enchantment 3) with 500 G damage yielding payout 400 G and remainingCap 1600 G (cap 2000 G - 400 G)", () => {
    const result = processScenario({
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
            cause: "accident",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("processes a claim on a rune (insurance value 250 G, cap 500 G) with 200 G damage yielding payout 100 G and remainingCap 400 G (no special clause applies to components)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });
  it("processes a claim on a silver amulet (insurance value 600 G, cap 1200 G) with 200 G damage yielding payout 100 G and remainingCap 1100 G", () => {
    const result = processScenario({
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
    });
    expect(result).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("processes a claim on a staff (insurance value 800 G, cap 1600 G) with 300 G damage yielding payout 200 G and remainingCap 1400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "snap",
            damages: [{ itemType: "staff", amount: 300 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 93 },
        { payout: 200, remainingCap: 1400 },
      ],
    });
  });
  it("processes a claim on a potion (insurance value 400 G, cap 800 G) with 250 G damage yielding payout 150 G and remainingCap 650 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spill",
            damages: [{ itemType: "potion", amount: 250 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 49 },
        { payout: 150, remainingCap: 650 },
      ],
    });
  });
  it("processes a claim on a moonstone (insurance value 250 G, cap 500 G) with 200 G damage yielding payout 100 G and remainingCap 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "crack",
            damages: [{ itemType: "moonstone", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });
  it("applies the 100 G deductible once per damaged item in a multi-item claim (sword 500 G damage + amulet 300 G damage -> payout 600 G, remainingCap 2600 G from 3200 G cap)", () => {
    const result = processScenario({
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
    });
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });
  it("does not produce a negative payout for a damage entry when damage is less than the 100 G deductible (e.g. 50 G damage -> 0 G payout)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 0, remainingCap: 2000 },
      ],
    });
  });

  // Claim processing: enchantment threshold vs. dragon material and rounding
  it("reimburses steel sword with enchantment 9 at 50% before deductible: 1000 G damage -> 400 G payout (500 - 100)", () => {
    const result = processScenario({
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
            cause: "duel",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("reimburses dragon-material sword with enchantment 5 in full before deductible: 800 G damage -> 700 G payout (800 - 100)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 5,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("reimburses dragon-material sword with exactly enchantment 8 at 50% before deductible (high-enchantment clause applies): 1000 G damage -> 400 G payout", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 8,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("reimburses dragon-material sword with enchantment 9 at 50% before deductible (50% rule wins over dragon material): 1000 G damage -> 400 G payout", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 9,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("rounds fractional claim payout down in MHPCO's favor (enchantment 8 sword with 901 G damage -> 450.5 G - 100 G = 350.5 G rounded down to 350 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  // Claim processing: multiple items of the same type and cap exhaustion
  it("computes cap of 4000 G for a policy with two swords (insurance sum 2000 G) and applies deductible to each of two sword damage entries separately", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
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
    });
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 600, remainingCap: 3400 },
      ],
    });
  });
  it("computes cap of 2000 G for a cursed sword based on unmodified insurance value (1000 G), unaffected by premium modifiers", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse backfire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 165 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("computes insurance sum of 1750 G and cap of 3500 G for a sword and 3 runes (block discount affects premium only, not insurance sum)", () => {
    const result = processScenario({
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
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 400, remainingCap: 3100 },
      ],
    });
  });
  it("caps total payout across successive claims at twice the insurance sum (sword cap 2000 G: first claim 1500 G damage -> payout 1400 G, remainingCap 600 G; second claim 1500 G damage -> payout 600 G, remainingCap 0 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "first accident",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "second accident",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
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

  // Error / rejection cases (observable contract: domain throws Error; CLI exits with non-zero status code, writes error description to stderr, and writes no results to stdout)
  it("rejects a quote containing an item with an unknown type (e.g. broomstick) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow(Error);
  });
  it("rejects a claim referencing a damage entry whose item type is not insured by the policy (e.g. amulet damaged when only sword is insured) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      })
    ).toThrow(/not insured/i);
  });
  it("rejects a claim referencing a damage entry with an unknown item type by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "crash",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("rejects a claim containing more damage entries of a given type than the policy covers (e.g. two sword damages when only one sword is insured) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("rejects a claim containing a damage entry with a negative amount (e.g. amount: -200) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("rejects a claim referencing a policy index that does not correspond to an earlier quote step by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      })
    ).toThrow(/policy/i);
  });

  // CLI adapter (src/cli.ts)
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout with exit code 0", () => {
    const input = JSON.stringify({
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
    });
    let stdout = "";
    let stderr = "";
    const exitCode = runCli(
      input,
      (text) => {
        stdout += text;
      },
      (text) => {
        stderr += text;
      }
    );
    expect(exitCode).toBe(0);
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("CLI exits with a non-zero status code, writes an error description to stderr, and writes nothing to stdout when a quote or claim is rejected", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    let stdout = "";
    let stderr = "";
    const exitCode = runCli(
      input,
      (text) => {
        stdout += text;
      },
      (text) => {
        stderr += text;
      }
    );
    expect(exitCode).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.length).toBeGreaterThan(0);
  });
});
