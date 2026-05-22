import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial quote ---
  it("quote with empty item list returns premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single item base premiums (with newcomer first-insurance and fee folded in) ---
  it("quote for single plain sword (newcomer, 0 years) returns premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
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
  it("quote for single plain amulet (newcomer) returns premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
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
  it("quote for single plain staff (newcomer) returns premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for single plain potion (newcomer) returns premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component base premiums (building block of 3) ---
  it("quote for 2 runes returns base premium 50 G before policy-wide modifiers (50 + 5 first-insurance + 5 fee = 60 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes applies block: base premium 60 G (60 + 6 first-insurance + 5 fee = 71 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes returns base premium 100 G — no block since block requires exactly 3 (100 + 10 first-insurance + 5 fee = 115 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 7 runes returns base premium 175 G (one block of 3 = 60 G + 4 runes × 25 G = 100 G; 175 + 18 first-insurance + 5 fee = 198 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification ---
  it("quote for 2 runes + 1 moonstone returns base premium 75 G — no block since types differ (75 + 8 first-insurance + 5 fee = 88 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote for 3 runes + 3 moonstones returns base premium 120 G — two separate blocks (120 + 12 first-insurance + 5 fee = 137 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifier: cursed (applies to that item only) ---
  it("quote for cursed sword + plain amulet (newcomer) returns policy base 160 G + 50 G curse on the sword's 100 G base, then first-insurance and fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true, material: "steel", enchantment: 3 },
            { type: "amulet", cursed: false, material: "silver", enchantment: 2 },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Modifier thresholds ---
  it("quote for sword with enchantment exactly 5 applies high-enchantment surcharge (30 % of base premium)", () => {
    const result = processScenario({
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
  it("quote for sword with enchantment 4 does NOT apply high-enchantment surcharge", () => {
    const result = processScenario({
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
  it("quote for cursed sword with enchantment exactly 5 applies both cursed and high-enchantment surcharges", () => {
    const result = processScenario({
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
  it("quote with customer who has exactly 2 years with MHPCO applies the 20 % loyalty discount", () => {
    const result = processScenario({
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

  // --- Integration: newcomer with a cursed sword (spec example) ---
  it("integration: newcomer (0 years, first contract) cursed sword (steel, enchantment 3) returns premium 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Integration: long-standing customer's second contract (spec example) ---
  it("integration: 3-years customer, 2nd quote in scenario, cursed sword (steel, enchantment 7) returns premium 160 G (loyalty + follow-up + curse + high enchantment + first-insurance per item + fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: false, material: "steel", enchantment: 2 }],
        },
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, material: "steel", enchantment: 7 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Rounding in MHPCO's favor ---
  it("premium calculation that yields 197.5 G is rounded UP to 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout calculation that yields 350.5 G is rounded DOWN to 350 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  // --- Claim: standard reimbursement (no special clauses) ---
  it("claim on plain steel sword (enchantment 3) with 500 G damage: payout 400 G (full minus 100 G deductible)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("claim on a rune (insurance value 250 G) with 200 G damage: payout 100 G (full minus 100 G deductible; runes have no enchantment/material clauses)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "wear", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });

  // --- Claim: high-enchantment clause ---
  it("claim on steel sword, enchantment 9, damage 1000 G: payout 400 G (50 % first, then deductible)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  // --- Claim: dragon-material clause ---
  it("claim on dragon-material sword, enchantment 5, damage 800 G: payout 700 G (full reimbursement, then deductible)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });

  // --- Claim: both clauses — 50 % rule wins ---
  it("claim on dragon-material sword, enchantment 9, damage 1000 G: payout 400 G (50 % rule wins, then deductible: 500 − 100)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("claim on dragon-material sword, enchantment exactly 8, damage 1000 G: payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  // --- Claim: deductible per damage event (multi-item single incident) ---
  it("claim on sword and amulet (single dragon attack), damages [500, 300]: payout 600 G (deductible applies once per damaged item)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  // --- Claim: cap = 2 × insurance sum ---
  it("policy with sword and amulet has insurance sum 1600 G; cap is 3200 G", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }] });
  });
  it("policy with cursed sword (modifiers make premium 165 G) has cap 2000 G — modifiers do not raise the cap", () => {
    const result = processScenario({
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
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }] });
  });
  it("policy with sword and 3 runes (block) has insurance sum 1750 G — block discount affects premium only, not the insurance sum", () => {
    const result = processScenario({
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
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }] });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword policy (cap 2000 G), first claim 1500 G: payout 1400 G, remainingCap 600 G", () => {
    const result = processScenario({
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
            cause: "test",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }] });
  });
  it("sword policy (cap 2000 G), second successive claim 1500 G: payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const result = processScenario({
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
            cause: "test1",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test2",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });

  // --- Claim: multiple items of the same type ---
  it("policy with two swords has insurance sum 2000 G and cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }] });
  });
  it("claim on two swords (two separate damage entries) treats each entry as separate damage with its own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] });
  });
  it("claim contains more entries of a given type than the policy covers: the whole claim is rejected (error)", () => {
    expect(() =>
      processScenario({
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
              cause: "test",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Edge cases / errors ---
  it("quote includes an item with unknown type (e.g. broomstick): error, no results", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references an item not part of the policy (e.g. amulet damage when only a sword is insured): error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with a negative damage amount (amount: -200): error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
});
