import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / minimal cases
  it("returns only the processing fee (5 G) for an empty item list", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premium per main item type
  it("quotes a plain sword for newcomer: 100 G base + 10 G first-insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet for newcomer (60 base + 6 first-ins + 5 fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff for newcomer (80 base + 8 first-ins + 5 fee = 93 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion for newcomer (40 base + 4 first-ins + 5 fee = 49 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and building blocks (base premiums; combine with modifiers as needed)
  it("quotes 2 runes for newcomer (50 base + 5 first-ins + 5 fee = 60 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes 3 runes as a building block for newcomer (60 base + 6 first-ins + 5 fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes for newcomer (100 base + 10 first-ins + 5 fee = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes for newcomer (175 + 17.5 first-ins + 5 fee = 197.5 → 198 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes + 1 moonstone for newcomer (75 base + 7.5 first-ins + 5 fee = 87.5 → 88 G)", () => {
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
  it("quotes 3 runes + 3 moonstones for newcomer (120 base + 12 first-ins + 5 fee = 137 G)", () => {
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

  // Item-level modifiers
  it("adds 50% curse surcharge to a cursed sword's base premium (matches newcomer integration 165 G)", () => {
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
  it("adds 30% high-enchantment surcharge for enchantment exactly 5", () => {
    // sword (100) + 30% high-ench (30) + 10% first-ins (10) + 5 fee = 145
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("does not add high-enchantment surcharge for enchantment 4", () => {
    // plain sword (100) + 10% first-ins + 5 fee = 115
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("stacks curse and high-enchantment surcharges on the same item", () => {
    // sword (100) + curse (50) + high-ench (30) + 10% first-ins (10) + 5 fee = 195
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Multi-item modifier scoping
  it("applies curse surcharge only to the cursed item in a multi-item policy", () => {
    // cursed sword (100) + amulet (60) = 160 policy base
    // curse surcharge on sword only: 50 (50% of 100)
    // first-insurance: 10% of 160 = 16
    // total: 160 + 50 + 16 + 5 = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Policy-level modifiers
  it("applies 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
    // sword (100) - loyalty 20% (20) + first-ins 10% (10) + 5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies 10% first-insurance surcharge even for long-standing customer", () => {
    // sword (100) - loyalty 20% (20) + first-ins 10% (10) + 5 fee = 95
    // distinct from "no first-ins for follow-up"; first-ins applies per item, not per customer-history
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies 15% follow-up contract discount on second+ quote", () => {
    // Two quotes: first is no discount, second gets follow-up discount.
    // 1st quote: sword (100) + 10% first-ins (10) + 5 = 115
    // 2nd quote: sword (100) + 10% first-ins (10) - 15% follow-up (15) + 5 = 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Integration examples from prompt
  it("newcomer cursed sword example yields 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract cursed enchanted sword yields 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Rounding
  it("rounds premium up in MHPCO's favor (7 runes → 197.5 → 198)", () => {
    // 7 runes = 175 base + 17.5 first-ins + 5 fee = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("rounds payout down in MHPCO's favor (high-ench half-payout fractional → floor)", () => {
    // steel sword ench 9, damage 901: half = 450.5, minus 100 deductible = 350.5 → floor 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "blast", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350 });
  });

  // Claim processing - basic
  it("pays out damage minus 100 G deductible for a standard sword", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("pays out rune damage minus 100 G deductible (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100 });
  });
  it("reimburses dragon-material item in full, then applies deductible (ench 5, dmg 800 → 700)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700 });
  });
  it("reimburses high-enchantment (≥8) item at 50%, then applies deductible (steel ench 9, dmg 1000 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("with both dragon material and high enchantment, 50% rule wins then deductible (dragon ench 9, dmg 1000 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("applies deductible once per damaged item in a multi-item incident", () => {
    // Sword 500 + amulet 300, each less deductible 100: 400 + 200 = 600
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600 });
  });

  // Multiple items of same type
  it("handles two swords as two separate insurances and two separate deductibles", () => {
    // Two swords damaged 400 each: 300 + 300 = 600
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "sword", material: "steel", enchantment: 3 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 400 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600 });
  });
  it("rejects claim if damages contains more entries of a type than the policy covers", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // Validation / error cases
  it("rejects quote with unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("rejects claim referencing item not in the policy", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("rejects claim with negative damage amount", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
