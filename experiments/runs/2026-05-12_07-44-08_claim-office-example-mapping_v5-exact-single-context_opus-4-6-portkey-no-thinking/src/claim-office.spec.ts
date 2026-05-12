import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums
  it("should return 5G premium for empty item list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("should return 115G premium for a single plain sword (100 base + 10% first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should return 71G premium for a single plain amulet (60 base + 6 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should return 93G premium for a single plain staff (80 base + 8 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should return 49G premium for a single plain potion (40 base + 4 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Quote: components
  it("should return 33G premium for a single rune (25 base + 2.5 first insurance → ceil 28 + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should return 60G premium for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("should return 71G premium for 3 alike runes (60 block base + 6 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should return 115G premium for 4 runes (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should return 88G premium for 2 runes + 1 moonstone (75 base + 7.5 first insurance → ceil 83 + 5 fee = 88)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("should return 137G premium for 3 runes + 3 moonstones (120 block base + 12 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
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
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Quote: cursed surcharge (item-level)
  it("should return 165G premium for a cursed sword (100 base + 50 curse + 10% first insurance on 100 + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // Quote: high enchantment surcharge (item-level)
  it("should add 30% high-enchantment surcharge for enchantment level 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 30 enchantment (30% of 100) + 10 first insurance (10% of 100) + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("should not add high-enchantment surcharge for enchantment level 4", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 0 surcharges + 10 first insurance + 5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // Quote: cursed + high enchantment combined
  it("should apply both cursed and high-enchantment surcharges on the same item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // Quote: multi-item policy with item-specific modifiers
  it("should apply cursed surcharge only to the cursed item in a multi-item policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // policyBase = 100 + 60 = 160, itemSurcharges = 50 (curse on sword only)
    // firstInsurance = 10% of 160 = 16, total = 160 + 50 + 16 = 226 + 5 = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // Quote: loyalty discount (policy-level)
  it("should apply 20% loyalty discount for customer with 2+ years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 10 first insurance (10%) - 20 loyalty (20%) = 90 + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should not apply loyalty discount for customer with less than 2 years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 10 first insurance + 5 fee = 115 (no loyalty)
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // Quote: follow-up contract discount (policy-level)
  it("should apply 15% follow-up discount on second quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
    // second quote: 100 base + 10 first insurance - 15 follow-up (15% of 100) + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Quote: integration — newcomer with cursed sword
  it("should return 165G for newcomer with cursed sword (integration example 1)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // Quote: integration — long-standing customer second contract
  it("should return 160G for long-standing customer second contract with cursed+enchanted sword (integration example 2)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // second quote: 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim: basic payout with deductible
  it("should return payout of 400G for regular sword with 500G damage (500 - 100 deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // sword insurance value 1000G, cap = 2000G
    // payout: 500 - 100 deductible = 400G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: deductible per item
  it("should apply 100G deductible per damaged item in a single event", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
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
    const result = processScenario(scenario);
    // (500 - 100) + (300 - 100) = 600G payout
    // insurance sum = 1000 + 600 = 1600, cap = 3200, remaining = 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim: high enchantment reimbursement
  it("should reimburse at 50% for item with enchantment >= 8 then apply deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // 50% of 1000 = 500, then -100 deductible = 400
    // insurance sum = 1000, cap = 2000, remaining = 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: dragon material full reimbursement
  it("should fully reimburse dragon material item then apply deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "tavern brawl",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // dragon material, enchantment 5 < 8: full reimbursement, then deductible
    // 800 - 100 = 700
    // insurance sum = 1000, cap = 2000, remaining = 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Claim: dragon material + high enchantment
  it("should apply 50% when both dragon material and enchantment >= 8", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // both clauses: 50% wins → 500, then -100 deductible = 400
    // insurance sum = 1000, cap = 2000, remaining = 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should fully reimburse dragon material with enchantment < 8", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "tavern brawl",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // dragon material, enchantment 5 < 8: full reimbursement, then deductible
    // 800 - 100 = 700
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Claim: component damage
  it("should reimburse component damage with deductible, no special clauses", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // 200 - 100 deductible = 100
    // insurance sum = 250, cap = 500, remaining = 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim: cap = 2x insurance sum
  it("should cap total payout at twice the insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // cursed sword: insurance value 1000G (unmodified), cap = 2000G
    // payout: 500 - 100 = 400, remainingCap = 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: cap exhaustion across multiple claims
  it("should track remaining cap across successive claims on the same policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "tavern brawl",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // sword insurance 1000G, cap = 2000G
    // first claim: 1500 - 100 = 1400, remaining = 2000 - 1400 = 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second claim: 1500 - 100 = 1400, but cap only 600 → payout 600, remaining 0
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim: error — damage to item not in policy
  it("should throw error when damage references item not in policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // Claim: error — more damages than insured items
  it("should throw error when damages exceed insured item count for a type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
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
    expect(() => processScenario(scenario)).toThrow();
  });

  // Claim: error — negative damage
  it("should throw error for negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "mysterious shrinkage",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // Quote: error — unknown item type
  it("should throw error for unknown item type in quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // Rounding
  it("should round premium up in MHPCO favor (ceil)", () => {
    // 2 runes + 1 moonstone with loyalty discount
    // 75 base + 7.5 first insurance (10%) - 15 loyalty (20%) = 67.5 → ceil = 68 + 5 fee = 73
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 73 });
  });
  it("should round payout down in MHPCO favor (floor)", () => {
    // sword with enchantment 9, damage 501 → 50% of 501 = 250.5, floor = 250, then -100 deductible = 150
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 501 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // 50% of 501 = 250.5 → floor = 250 → 250 - 100 = 150
    // insurance sum = 1000, cap = 2000, remaining = 2000 - 150 = 1850
    expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
  });
});
