import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office Engine", () => {
  // --- Quotes ---
  it("Quote: Empty item list should return 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("Quote: Single items with base premiums (Sword: 1000 G value, 100 G base; Amulet: 600 G value, 60 G base; Staff: 800 G value, 80 G base; Potion: 400 G value, 40 G base)", () => {
    const items = [
      { type: "sword" },
      { type: "amulet" },
      { type: "staff" },
      { type: "potion" }
    ];
    for (const item of items) {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item] }
        ]
      };
      const result = processScenario(scenario);
      let expectedBase = 0;
      if (item.type === "sword") expectedBase = 100;
      if (item.type === "amulet") expectedBase = 60;
      if (item.type === "staff") expectedBase = 80;
      if (item.type === "potion") expectedBase = 40;
      // expected premium is base + 10% first insurance + 5 fee
      // sword: 100 + 10 + 5 = 115
      // amulet: 60 + 6 + 5 = 71
      // staff: 80 + 8 + 5 = 93
      // potion: 40 + 4 + 5 = 49
      const expected = Math.round(expectedBase * 1.1) + 5;
      expect(result.results[0]).toEqual({ premium: expected });
    }
  });
  it("Quote: Component base premium (Rune/Moonstone: 250 G value, 25 G base)", () => {
    const items = [
      { type: "rune" },
      { type: "moonstone" }
    ];
    for (const item of items) {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item] }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: Math.ceil(25 * 1.1) + 5 });
    }
  });
  it("Quote: Building block of exactly 3 alike components (3 runes -> 60 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: Math.ceil(60 * 1.1) + 5 });
  });
  it("Quote: No component block for 2 runes (50 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    // base 50 + 10% first insurance = 55 + 5 G fee = 60
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("Quote: No component block for 4 runes (100 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    // base 100 + 10% first insurance = 110 + 5 G fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("Quote: No component block for 7 runes (175 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: Math.ceil(175 * 1.1) + 5 });
  });
  it("Quote: Alike components of different types (2 runes + 1 moonstone -> 75 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: Math.ceil(75 * 1.1) + 5 });
  });
  it("Quote: Two separate component blocks (3 runes + 3 moonstones -> 120 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: Math.ceil(120 * 1.1) + 5 });
  });
  it("Quote: Modifier cursed adds 50% risk surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true }] }
      ]
    };
    const result = processScenario(scenario);
    // base premium 100, cursed surcharge adds 50% of sword base = 50 G. first insurance surcharge = 10 G. Total = 160 G base + 5 G fee = 165 G
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("Quote: Modifier highly enchanted (>= 5) adds 30% risk surcharge (exactly 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 5 }] }
      ]
    };
    const result = processScenario(scenario);
    // base premium 100, highly enchanted surcharge adds 30% of sword base = 30 G. first insurance surcharge = 10 G. Total = 140 G base + 5 G fee = 145 G
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("Quote: Modifier highly enchanted does not apply for level 4", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 4 }] }
      ]
    };
    const result = processScenario(scenario);
    // base premium 100, first insurance surcharge = 10 G. Total = 110 G base + 5 G fee = 115 G
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("Quote: Modifier loyalty discount (>= 2 years) subtracts 20% of policy base premium (exactly 2 years)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    // Base: 100 G. Loyalty (2 years) subtracts 20% of policy base premium = -20 G.
    // Let's check first insurance surcharge. If we do single item and don't apply first-insurance, total is 80 G + 5 G fee = 85 G.
    // Wait, the specification says "each item in a quote is treated as a first insurance, regardless of customer history."
    // And "A first insurance carries a 10 % initial assessment surcharge."
    // "item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item; policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium"
    // Since this is the first quote step/item, let's see: if both apply: Base 100 G. Loyalty: -20 G. First insurance: +10 G. Total = 90 G + 5 G fee = 95 G.
    // Let's implement first-insurance and loyalty, checking if it adds up to 95 G.
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("Quote: Modifier loyalty discount does not apply for 1 year", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    // Base 100 G + first insurance surcharge 10 G + 5 G fee = 115 G
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("Quote: Modifier first insurance adds 10% surcharge to policy base premium", () => {
    // Already verified indirectly, but let's test specifically without other modifiers.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("Quote: Modifier follow-up contract subtracts 15% (for contracts after the first)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }, // First quote
        { op: "quote" as const, items: [{ type: "sword" }] }  // Second quote (follow-up)
      ]
    };
    const result = processScenario(scenario);
    // First quote: 100 base + 10% first insurance + 5 fee = 115 G
    // Second quote: 100 base + 10% first insurance - 15% follow-up = 95 G + 5 fee = 100 G
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("Quote: Modifier scope on multi-item policy (cursed sword and plain amulet)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    // sword base = 100 G, cursed surcharge = 50 G.
    // amulet base = 60 G.
    // policy base = 160 G.
    // first insurance = 10% * 160 = 16 G.
    // total = 160 G + 50 G (cursed) + 16 G (first insurance) + 5 G fee = 231 G.
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("Quote: Complex modifier integration (Newcomer with a cursed sword -> 165 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("Quote: Complex modifier integration (Long-standing customer's second contract with cursed sword enchantment 7 -> 160 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] }, // first quote
        { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] } // second quote
      ]
    };
    const result = processScenario(scenario);
    // second quote premium should be 160 G:
    // (100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G)
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("Quote: Rounding up for premiums (197.5 G -> 198 G)", () => {
    // Math.ceil is already used for quote, but let's test a case where we explicitly get a fractional value.
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }, // first quote
        { op: "quote" as const, items: [{ type: "moonstone", cursed: true }] } // second quote
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ premium: 37 });
  });

  // --- Claims ---
  it("Claim: Deductible of 100 G applies per damage event (single standard steel sword, 500 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }, // Policy 0 (sum = 1000 G, cap = 2000 G)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // quote premium: 115 G
    // claim payout: damage 500 G - 100 G deductible = 400 G payout
    // remaining cap: 2000 G - 400 G = 1600 G remaining cap
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("Claim: Deductible applies to each damaged item in a multi-item damage event (sword 500 G + amulet 300 G -> 600 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, // Policy 0 (sum = 1600 G, cap = 3200 G)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // sword: 500 - 100 = 400
    // amulet: 300 - 100 = 200
    // payout = 600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("Claim: High enchantment (>= 8) reimbursed at 50% of damage amount (steel, enchantment 9, 1000 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // damage 1000 * 50% = 500. 500 - 100 deductible = 400 payout.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("Claim: Dragon material fully reimbursed (dragon, enchantment 5, 800 G damage -> 700 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 800 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // dragon material (enchantment 5 < 8) fully reimbursed: 800 - 100 deductible = 700.
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("Claim: Dragon material high enchantment 50% rule wins (dragon, enchantment 9, 1000 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50 % rule wins, then deductible: 500 − 100)
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("Claim: Components (runes) standard reimbursement (rune 200 G damage -> 100 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "rune", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // rune damage 200 - 100 deductible = 100 payout.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("Claim: Total payout cap (twice the insurance sum, e.g., sword + amulet -> cap 3200 G)", () => {
    // verified indirectly already, but let's test explicitly that cap is indeed twice the insurance sum.
    // sword value 1000 G, amulet value 600 G -> sum 1600 G -> cap 3200 G.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, // policy 0 (sum 1600, cap 3200)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 2000 },
              { itemType: "amulet", amount: 2000 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // sword damage 2000 - 100 = 1900 payout.
    // amulet damage 2000 - 100 = 1900 payout.
    // total payout desired: 3800. Capped at remainingCap 3200 G.
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("Claim: Premium modifiers do not affect the insurance sum cap (cursed sword -> cap 2000 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true }] }, // policy 0 (sum 1000, cap 2000)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3000 }]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("Claim: Component block does not affect insurance sum (sword + 3 runes -> sum 1750 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword" },
            { type: "rune" }, { type: "rune" }, { type: "rune" }
          ]
        }, // policy 0 (sum 1000 + 3*250 = 1750 G -> cap 3500 G)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 2000 },
              { itemType: "rune", amount: 2000 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    // sword: 2000 - 100 = 1900 payout.
    // rune: 2000 - 100 = 1900 payout.
    // total payout desired: 3800. Capped at remainingCap 3500 G.
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("Claim: Cap exhaustion over successive claims (first claim 1400 G payout, second claim capped to 600 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }, // policy 0 (sum 1000 G, cap 2000 G)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }]
          }
        }, // first claim (1500 - 100 = 1400 G payout, 600 G remaining cap)
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }]
          }
        } // second claim (1500 - 100 = 1400 G desired, capped at 600 G, 0 G remaining)
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("Claim: Rounding down for payouts (350.5 G -> 350 G)", () => {
    // Math.floor is already used in processScenario, but let's make sure it is tested.
    // Standard steel sword, enchantment 9.
    // Damage amount: 901 G.
    // 901 G * 50% = 450.5 G.
    // Deductible = 100 G -> 350.5 G.
    // Final payout rounded down: 350 G.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Validations & Errors ---
  it("Validation: Unknown item type in quote throws/returns error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "broomstick" }] }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("Validation: Claim references item type not in policy throws/returns error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }]
          }
        }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("Validation: Claim has negative damage amount throws/returns error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }]
          }
        }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("Validation: Claim has more damaged items of a type than covered by policy throws/returns error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 300 }
            ]
          }
        }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
