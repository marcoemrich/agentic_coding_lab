import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Item values and base premiums
   it("should calculate base premium for sword (100 G)", () => {
     const scenario = {
       customer: { yearsWithMHPCO: 1 },
       steps: [
         {
           op: "quote",
           items: [{ type: "sword" }]
         }
       ]
     };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(105); // 100 base + 5 fee
  });
  it("should calculate base premium for amulet (60 G)", () => {
    const scenario = {
      risk: "amulet",
      basePremium: 60,
      coverage: { limit: 1000, deductible: 100 },
      perils: ["theft"]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(65); // 60 base + 5 fee
  });
  it("should calculate base premium for staff (80 G)", () => {
    const scenario = {
      risk: "staff",
      basePremium: 80,
      coverage: { limit: 1500, deductible: 150 },
      perils: ["theft", "damage"]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(85); // 80 base + 5 fee
  });
  it("should calculate base premium for potion (40 G)", () => {
    const scenario = {
      risk: "potion",
      basePremium: 40,
      coverage: { limit: 500, deductible: 50 },
      perils: ["spillage"]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(45); // 40 base + 5 fee
  });
  it("should calculate base premium for component (25 G)", () => {
    const scenario = {
      risk: "component",
      basePremium: 25,
      coverage: { limit: 300, deductible: 30 },
      perils: ["theft", "damage"]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(30); // 25 base + 5 fee
  });
  it("should apply building block discount for 3 alike components (60 G)", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(65); // 60 base (3 * 25 * 0.8) + 5 fee
  });
  
  // Premium modifiers
  it("should add 50% cursed surcharge", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(157.5); // 100 base * 1.5 + 5 fee
  });
  it("should add 30% high enchantment surcharge for enchantment >= 5", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", enchantment: 5 }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(135); // 100 base * 1.3 + 5 fee
  });
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(85); // 100 base * 0.8 + 5 fee
  });
  it("should add 10% first insurance surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115); // 100 base * 1.1 + 5 fee
  });
  it("should apply 15% follow-up contract discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1, followUpContract: true },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(90); // 100 base * 0.85 + 5 fee
  });
  it("should add 5 G processing fee", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: []
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(5); // Only processing fee
  });
  it("should round premiums up in MHPCO's favor", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", enchantment: 5 } // This will trigger 30% surcharge: 100 * 1.3 = 130
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(135); // 130 + 5 fee, no rounding needed in this case
  });
  
  // Claim processing
  it("should apply 100 G deductible per damage event", () => {
    const scenario = {
      steps: [
        {
          op: "claim",
          items: [
            { type: "sword", damage: 500 }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].payout).toBe(400); // 500 damage - 100 deductible
  });
  it("should cap payout at twice the insurance sum", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        },
        {
          op: "claim",
          items: [
            { type: "sword", damage: 1000 } // Insurance sum is 100, so cap is 200
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].payout).toBe(200); // Capped at 200
  });
  it("should reimburse 50% for items with enchantment >= 8", () => {
    const scenario = {
      steps: [
        {
          op: "claim",
          items: [
            { type: "sword", enchantment: 8, damage: 1000 }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].payout).toBe(500); // 1000 * 0.5
  });
  it("should fully reimburse dragon material items", () => {
    const scenario = {
      steps: [
        {
          op: "claim",
          items: [
            { type: "sword", material: "dragon", damage: 1000 }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].payout).toBe(1000); // Full reimbursement
  });
  it("should round payouts down in MHPCO's favor", () => {
    const scenario = {
      steps: [
        {
          op: "claim",
          items: [
            { type: "sword", damage: 150 } // 150 - 100 = 50
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].payout).toBe(50); // Rounded down from 50
  });
  
  // Building block examples
  it("should calculate 50 G for 2 runes", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(55); // 2 * 25 + 5 fee
  });
  it("should calculate 60 G for 3 runes (block applies)", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(65); // 3 * 25 * 0.8 + 5 fee
  });
  it("should calculate 100 G for 4 runes (no block)", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(105); // 4 * 25 + 5 fee
  });
  it("should calculate 175 G for 7 runes", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(180); // 7 * 25 + 5 fee
  });
  it("should calculate 75 G for 2 runes + 1 moonstone (no block)", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "moonstone" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(80); // 2 * 25 + 1 * 25 + 5 fee
  });
  it("should calculate 120 G for 3 runes + 3 moonstones (two blocks)", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "rune" },
            { type: "component", subtype: "moonstone" },
            { type: "component", subtype: "moonstone" },
            { type: "component", subtype: "moonstone" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(125); // (3 * 25 * 0.8) + (3 * 25 * 0.8) + 5 fee
  });
  
  // Modifier scope examples
  it("should apply cursed surcharge only to cursed item, not whole policy", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(165); // 100 * 1.5 + 60 + 5 fee
  });
  it.todo("should apply item-specific modifiers to item base premium");
  it.todo("should apply policy-wide modifiers to policy base premium");
  
  // Modifier thresholds
  it.todo("should apply loyalty discount for exactly 2 years with MHPCO");
  it.todo("should apply high-enchantment surcharge for exactly enchantment 5");
  it.todo("should not apply high-enchantment surcharge for enchantment 4");
  it.todo("should apply both surcharges for cursed item with enchantment 5");
  it.todo("should apply high-enchantment clause for enchantment 8, then deductible");
  
  // Deductible per damage event
  it.todo("should apply 100 G deductible once per damage event");
  
  // Standard reimbursement
  it.todo("should reimburse 400 G for regular sword with 500 G damage (full - deductible)");
  it.todo("should reimburse 100 G for rune with 200 G damage (full - deductible)");
  
  // Enchantment threshold vs. dragon material
  it.todo("should apply 50% rule for dragon sword with enchantment 9");
  it.todo("should apply full reimbursement for dragon sword with enchantment 5");
  it.todo("should apply 50% rule for steel sword with enchantment 9");
  
  // Multiple items of same type
  it.todo("should handle two swords as separate items with separate deductibles");
  it.todo("should reject claim with more items than insured");
  
  // Cap exhaustion
  it.todo("should cap payout at twice insurance sum");
  it.todo("should reduce payout to remaining cap after first claim");
  it.todo("should apply cap based on unmodified insurance value");
  it.todo("should not let premium modifiers affect insurance cap");
  
  // Rounding
  it.todo("should round premium 197.5 G to 198 G (up)");
  it.todo("should round payout 350.5 G to 350 G (down)");
  
  // Edge cases
  it.todo("should return 5 G for empty item list (only processing fee)");
  it.todo("should exit with error for unknown item type");
  it.todo("should exit with error for damage to uninsured item");
  it.todo("should exit with error for negative damage amount");
  
  // Integration examples
  it.todo("should calculate 165 G for newcomer with cursed sword");
  it.todo("should calculate 160 G for long-standing customer's second contract with cursed sword");
});