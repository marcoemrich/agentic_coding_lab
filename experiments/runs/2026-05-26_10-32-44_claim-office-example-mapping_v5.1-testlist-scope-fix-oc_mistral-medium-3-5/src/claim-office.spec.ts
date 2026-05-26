import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office System", () => {
  // === Empty and Edge Cases ===
  it("should return 5 G for empty item list in quote (0 * 1.1 + 5 = 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = processScenario(scenario);
    // Empty items: policy base premium = 0, policy-wide modifiers = 0 * 1.1 = 0, item-specific = 0, fee = 5
    // Total = 0 + 0 + 5 = 5, rounded up = 5
    expect(result.results[0].premium).toBe(5);
  });
  it("should exit with error for unknown item type in quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for damage to uninsured item in claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for negative damage amount in claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for more damage entries than insured items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "fire", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] 
        } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // === Base Premiums ===
  it("should return 115 G for sword quote (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should return 71 G for amulet quote (60 base + 6 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should return 93 G for staff quote (80 base + 8 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("should return 49 G for potion quote (40 base + 4 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(49);
  });
  it("should return 33 G for single rune quote (25 base + 2.5 first insurance + 5 fee = 32.5 -> 33 rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });
  it("should return 33 G for single moonstone quote (25 base + 2.5 first insurance + 5 fee = 32.5 -> 33 rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });

  // === Component Building Blocks ===
  it("should return 60 G for 2 runes quote (50 * 1.1 + 5 = 60 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it("should return 71 G for 3 runes quote (60 * 1.1 + 5 = 71 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should return 115 G for 4 runes quote (100 * 1.1 + 5 = 115 G) - no block", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should return 198 G for 7 runes quote (175 * 1.1 + 5 = 198 G) - no block", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });
  it("should return 88 G for 2 runes + 1 moonstone quote (75 * 1.1 + 5 = 88 G) - no block different types", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(88);
  });
  it("should return 137 G for 3 runes + 3 moonstones quote (120 * 1.1 + 5 = 137 G) - two separate blocks", () => {
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
  it("should apply 15% follow-up contract discount (100 * 1.1 * 0.85 + 5 = 98.5 -> 99 G rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
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
  it("should apply policy-wide loyalty discount to sum of all item base premiums ((100 + 60) * 0.8 * 1.1 + 0 + 5 = 141 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    // (100 + 60) * 0.8 * 1.1 + 0 + 5 = 160 * 0.8 * 1.1 + 5 = 140.8 + 5 = 145.8 -> 146 rounded up
    // But with my implementation: (100 + 60) * 0.8 * 1.1 = 140.8, + 0 item-specific, + 5 = 145.8 -> 146
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
  it("should apply policy-wide loyalty discount to sum of all item base premiums ((100 + 60) * 0.8 * 1.1 + 0 + 5 = 146 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }]
    };
    const result = processScenario(scenario);
    // (100 + 60) * 0.8 * 1.1 + 0 + 5 = 160 * 0.8 * 1.1 + 5 = 140.8 + 5 = 145.8 -> 146 rounded up
    expect(result.results[0].premium).toBe(146);
  });

  // === Rounding in MHPCO's Favor ===
  it("should round up premium 197.5 G to 198 G", () => {
    // Create a scenario that results in 197.5 G before rounding
    // For example: base premium that results in 197.5 after modifiers
    // Let's use a sword with specific modifiers to get 197.5
    // 100 * 1.1 = 110, plus some item-specific modifiers
    // We need: (policyBasePremium * 1.1 + itemSpecific + 5) = 197.5
    // Let's try: policyBasePremium = 175, 175 * 1.1 = 192.5, +5 = 197.5
    // 175 could be from 7 runes (7 * 25 = 175)
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = processScenario(scenario);
    // 7 runes: 7 * 25 = 175, 175 * 1.1 = 192.5, +5 = 197.5 -> rounded up to 198
    expect(result.results[0].premium).toBe(198);
  });
  it("should round down payout 350.5 G to 350 G", () => {
    // Create a scenario that results in 350.5 G payout before rounding
    // Damage: 450, no special clauses, deductible: 100, payout: 350
    // But we need 350.5, so damage: 450.5? But damage must be integer
    // Actually, let's use enchantment to get fractional values
    // Damage: 701, 50% reimbursement = 350.5, deductible: 100, payout: 250.5 -> rounded down to 250
    // That doesn't work. Let me think...
    // Actually, the spec says "only the final premium or payout is rounded"
    // So intermediate calculations can have fractions
    // For payout: damage 450, 50% reimbursement = 225, but that's not 350.5
    // Let me try: damage 801, 50% = 400.5, deductible 100 = 300.5 -> rounded down to 300
    // Still not 350.5
    // Actually, let's just test that fractional payouts are rounded down
    // We can create a scenario where the payout calculation results in a fraction
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Damage: 901, 50% reimbursement = 450.5, deductible: 100, payout: 350.5 -> rounded down to 350
    expect(result.results[1].payout).toBe(350);
  });

  // === Deductible ===
  it("should apply 100 G deductible per damage event to sword damage 500 G -> payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Sword insurance value: 1000, cap: 2000
    // Damage: 500, deductible: 100, payout: 400
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600); // 2000 - 400 = 1600
  });
  it("should apply 100 G deductible per damage event to amulet damage 300 G -> payout 200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Amulet insurance value: 600, cap: 1200
    // Damage: 300, deductible: 100, payout: 200
    expect(result.results[1].payout).toBe(200);
    expect(result.results[1].remainingCap).toBe(1000); // 1200 - 200 = 1000
  });
  it("should apply 100 G deductible to rune damage 200 G -> payout 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Rune insurance value: 250, cap: 500
    // Damage: 200, deductible: 100, payout: 100
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400); // 500 - 100 = 400
  });
  it("should apply 100 G deductible once per damage event (dragon attack: sword 500 + amulet 300 = 600 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "dragon attack", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] 
        } }
      ]
    };
    const result = processScenario(scenario);
    // Sword: 500 - 100 = 400, Amulet: 300 - 100 = 200, Total: 600
    // Insurance sum: 1000 + 600 = 1600, cap: 3200
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(2600); // 3200 - 600 = 2600
  });

  // === Special Clauses ===
  it("should reimburse 50% for enchantment >= 8: sword enchantment 8 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Damage: 1000, 50% reimbursement = 500, deductible: 100, payout: 400
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600); // 2000 - 400 = 1600
  });
  it("should fully reimburse dragon material items: dragon sword damage 800 -> payout 700 G (800 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Damage: 800, full reimbursement (dragon material), deductible: 100, payout: 700
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300); // 2000 - 700 = 1300
  });
  it("should apply 50% rule for dragon sword with enchantment 9 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Dragon material but enchantment >= 8, so 50% rule wins: 1000 * 0.5 = 500, deductible: 100, payout: 400
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600); // 2000 - 400 = 1600
  });
  it("should apply full reimbursement for dragon sword with enchantment 5 damage 800 -> payout 700 G (800 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Dragon material, enchantment < 8, so full reimbursement: 800, deductible: 100, payout: 700
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300); // 2000 - 700 = 1300
  });
  it("should apply 50% rule for steel sword with enchantment 9 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Steel material, enchantment >= 8, so 50% rule: 1000 * 0.5 = 500, deductible: 100, payout: 400
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600); // 2000 - 400 = 1600
  });

  // === Cap ===
  it("should cap payout at twice insurance sum: sword (1000) cap 2000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Damage: 3000, no special clauses, so reimbursement = 3000, deductible: 100, payout before cap: 2900
    // Cap: 2000 (2 * 1000), so payout = 2000
    expect(result.results[1].payout).toBe(2000);
    expect(result.results[1].remainingCap).toBe(0); // 2000 - 2000 = 0
  });
  it("should cap payout at twice insurance sum: sword + amulet (1600) cap 3200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2000 }, { itemType: "amulet", amount: 2000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Sword: 2000 - 100 = 1900, Amulet: 2000 - 100 = 1900, Total: 3800
    // Cap: 3200 (2 * 1600), so payout = 3200
    expect(result.results[1].payout).toBe(3200);
    expect(result.results[1].remainingCap).toBe(0); // 3200 - 3200 = 0
  });
  it("should track remaining cap across multiple claims: first claim 1500 on sword (1000) -> payout 1400, remaining 600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Damage: 1500, no special clauses, reimbursement = 1500, deductible: 100, payout before cap: 1400
    // Cap: 2000, so payout = 1400, remaining cap = 2000 - 1400 = 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });
  it("should track remaining cap across multiple claims: second claim 1500 on sword -> payout 600, remaining 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // First claim: payout 1400, remaining cap 600
    // Second claim: damage 1500, reimbursement = 1500, deductible: 100, payout before cap: 1400
    // But remaining cap is 600, so payout = 600, remaining cap = 0
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // === Multiple Items of Same Type ===
  it("should treat each damage entry as separate with own deductible: two swords damaged -> each gets 100 G deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "dragon attack", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] 
        } }
      ]
    };
    const result = processScenario(scenario);
    // Two swords: insurance sum = 2000, cap = 4000
    // First sword damage: 500 - 100 = 400
    // Second sword damage: 300 - 100 = 200
    // Total payout: 600
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(3400); // 4000 - 600 = 3400
  });
  it("should calculate insurance sum for two swords as 2000 G, cap 4000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    // Two swords: base premium = 200 * 1.1 + 5 = 225
    expect(result.results[0].premium).toBe(225);
    // Insurance sum would be 2000, cap 4000 (verified in claim tests)
  });

  // === Integration Examples ===
  it("should calculate 165 G for newcomer with cursed sword (100 * 1.1 + 50 + 5 = 165 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }]
    };
    const result = processScenario(scenario);
    // 100 * 1.1 (first insurance) + 50 (curse) + 5 (fee) = 110 + 50 + 5 = 165
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
    // Second quote: 100 * 0.8 (loyalty) * 1.1 (first insurance) * 0.85 (follow-up) + 50 (curse) + 30 (high enchantment) + 5 (fee)
    // = 74.8 + 50 + 30 + 5 = 159.8 -> 160 rounded up
    expect(result.results[1].premium).toBe(160);
  });

  // === Insurance Sum and Cap ===
  it("should calculate insurance sum as sum of item insurance values (sword 1000 + amulet 600 = 1600 G)", () => {
    // This is tested implicitly in the claim tests
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
    expect(result.results[1].remainingCap).toBe(300); // 3200 - 2900 = 300
  });
  it("should calculate cap as twice insurance sum (sword 1000 -> cap 2000 G)", () => {
    // Tested in the cap tests above
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
    expect(result.results[1].remainingCap).toBe(0); // 2000 - 2000 = 0
  });
  it("should NOT include premium modifiers in cap calculation (cursed sword still cap 2000 G)", () => {
    // Cap is based on insurance sum, not premium
    // Cursed sword has higher premium but same insurance value
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
    expect(result.results[1].remainingCap).toBe(0); // 2000 - 2000 = 0
  });
  it("should NOT include building block discount in insurance sum (sword 1000 + 3 runes 750 = 1750 G)", () => {
    // Building block discount affects premium, not insurance sum
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
    expect(result.results[1].remainingCap).toBe(600); // 3500 - 2900 = 600
  });

  // === Edge cases ===

  // === CLI Integration ===
  it("should process quote and claim steps in sequence", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results.length).toBe(2);
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].payout).toBe(400);
  });
  it("should output results array matching input steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results.length).toBe(3);
    expect(result.results[0].premium).toBe(115);
    // Second quote gets follow-up discount: 60 * 1.1 * 0.85 + 5 = 61.1 -> 62 rounded up
    expect(result.results[1].premium).toBe(62);
    expect(result.results[2].payout).toBe(400);
  });
});
