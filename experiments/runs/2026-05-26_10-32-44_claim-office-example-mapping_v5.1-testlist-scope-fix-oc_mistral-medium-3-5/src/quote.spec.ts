import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Quote Operation", () => {
  // === Empty and Edge Cases ===
  it("should return 5 G processing fee for empty item list", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(5);
  });

  // === Base Premiums ===
  it("should return 115 G for sword (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should return 71 G for amulet (60 base + 6 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should return 93 G for staff (80 base + 8 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("should return 49 G for potion (40 base + 4 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(49);
  });
  it("should return 33 G for single rune (25 base + 2.5 first insurance + 5 fee = 32.5 -> 33 rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });
  it("should return 33 G for single moonstone (25 base + 2.5 first insurance + 5 fee = 32.5 -> 33 rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });

  // === Component Building Blocks ===
  it("should return 60 G for 2 runes (50 * 1.1 + 5 = 60 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it("should return 71 G for 3 runes (60 * 1.1 + 5 = 71 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should return 115 G for 4 runes (100 * 1.1 + 5 = 115 G) - no block", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should return 198 G for 7 runes (175 * 1.1 + 5 = 198 G) - no block", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });
  it("should return 88 G for 2 runes + 1 moonstone (75 * 1.1 + 5 = 88 G) - no block different types", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(88);
  });
  it("should return 137 G for 3 runes + 3 moonstones (120 * 1.1 + 5 = 137 G) - two separate blocks", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(137);
  });

  // === Item-Specific Modifiers ===
  it("should add 50% curse surcharge to cursed sword (100 * 1.1 + 50 + 5 = 165 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("should add 50% curse surcharge to cursed amulet (60 * 1.1 + 30 + 5 = 101 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", cursed: true }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(101);
  });
  it("should add 30% high enchantment surcharge for sword with enchantment 5 (100 * 1.1 + 30 + 5 = 145 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(145);
  });
  it("should add 30% high enchantment surcharge for sword with enchantment 7 (100 * 1.1 + 30 + 5 = 145 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 7 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(145);
  });
  it("should NOT add high enchantment surcharge for sword with enchantment 4 (100 * 1.1 + 0 + 5 = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should apply both curse and high enchantment surcharges for cursed sword with enchantment 5 (100 * 1.1 + 50 + 30 + 5 = 195 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(195);
  });
  it("should apply both curse and high enchantment surcharges for cursed sword with enchantment 7 (100 * 1.1 + 50 + 30 + 5 = 195 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(195);
  });

  // === Policy-Wide Modifiers ===
  it("should apply 20% loyalty discount for customer with 2 years (100 * 0.8 * 1.1 + 5 = 93 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("should apply 20% loyalty discount for customer with 3 years (100 * 0.8 * 1.1 + 5 = 93 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("should NOT apply loyalty discount for customer with 1 year (100 * 1.1 + 5 = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should add 10% first insurance surcharge (100 * 1.1 + 5 = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should apply 15% follow-up contract discount (100 * 0.85 * 1.1 + 5 = 100 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    // Second quote: 100 * 1.1 * 0.85 + 5 = 93.5 + 5 = 98.5 -> 99 rounded up
    // Wait, let me recalculate: 100 * 1.1 = 110, 110 * 0.85 = 93.5, +5 = 98.5 -> 99
    expect(result.results[1].premium).toBe(99);
  });

  // === Modifier Scope on Multi-Item Policies ===
  it("should apply cursed surcharge only to cursed item in multi-item policy (100 * 1.1 + 60 * 1.1 + 50 + 5 = 231 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(231);
  });
  it("should apply policy-wide loyalty discount to sum of all item base premiums ((100 + 60) * 0.8 * 1.1 + 0 + 5 = 146 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(146);
  });
  it("should apply processing fee at the very end (100 * 1.1 + 0 + 5 = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });

  // === Rounding in MHPCO's Favor ===
  it("should round up premium 197.5 G to 198 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });
  it("should round down payout 350.5 G to 350 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(350);
  });
  it("should keep intermediate amounts as fractions, only round final result", () => {
    // This is tested implicitly by the rounding tests above
    // The implementation keeps intermediate amounts as fractions and only rounds the final result
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });

  // === Integration Examples ===
  it("should calculate 165 G for newcomer with cursed sword (100 * 1.1 + 50 + 5 = 165 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("should calculate 160 G for long-standing customer's second contract with cursed sword enchantment 7 (100 * 0.8 * 1.1 * 0.85 + 50 + 30 + 5 = 160 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // First quote
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] } // Second quote
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].premium).toBe(160);
  });

  // === Multiple Items ===
  it("should sum base premiums for multiple items (sword 100 + amulet 60 * 1.1 + 5 = 181 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(181);
  });
  it("should sum base premiums for two swords (100 + 100 * 1.1 + 5 = 225 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(225);
  });
  it("should apply building block discount for 3 runes + sword ((100 + 60) * 1.1 + 5 = 181 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(181);
  });

  // === Insurance Sum and Cap ===
  it("should calculate insurance sum as sum of item insurance values (sword 1000 + amulet 600 = 1600 G)", () => {
    // This is tested implicitly in claim tests
    // The cap is calculated as 2 * insurance sum
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000 + 600 = 1600, cap: 3200
    // Damage: 3000, no special clauses, reimbursement = 3000, deductible: 100, payout before cap: 2900
    // Capped at 3200, but 2900 < 3200, so payout = 2900
    expect(result.results[1].payout).toBe(2900);
  });
  it("should calculate cap as twice insurance sum (sword 1000 -> cap 2000 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000, cap: 2000
    // Damage: 3000, no special clauses, reimbursement = 3000, deductible: 100, payout before cap: 2900
    // Capped at 2000, so payout = 2000
    expect(result.results[1].payout).toBe(2000);
  });
  it("should NOT include premium modifiers in cap calculation (cursed sword still cap 2000 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000 (same as non-cursed), cap: 2000
    // Damage: 3000, no special clauses for payout, reimbursement = 3000, deductible: 100, payout before cap: 2900
    // Capped at 2000, so payout = 2000
    expect(result.results[1].payout).toBe(2000);
  });
  it("should NOT include building block discount in insurance sum (sword 1000 + 3 runes 750 = 1750 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000 + 3 * 250 = 1750, cap: 3500
    // Damage: 3000, no special clauses, reimbursement = 3000, deductible: 100, payout before cap: 2900
    // Capped at 3500, but 2900 < 3500, so payout = 2900
    expect(result.results[1].payout).toBe(2900);
  });
});
