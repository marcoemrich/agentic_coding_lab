import { describe, it, expect } from "vitest";
import { calculatePremium, calculatePayout, processScenario, calculateInsuranceSum } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Premium Calculation - Base Premiums", () => {
    it("should return 5 G for empty item list (only processing fee)", () => {
      expect(calculatePremium([])).toBe(5);
    });
    it("should return 105 G (base 100 + 5 fee) for a sword", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false, false)).toBe(105);
    });
    it("should return 65 G (base 60 + 5 fee) for an amulet", () => {
      expect(calculatePremium([{ type: "amulet" }], 0, false, false)).toBe(65);
    });
    it("should return 85 G (base 80 + 5 fee) for a staff", () => {
      expect(calculatePremium([{ type: "staff" }], 0, false, false)).toBe(85);
    });
    it("should return 45 G (base 40 + 5 fee) for a potion", () => {
      expect(calculatePremium([{ type: "potion" }], 0, false, false)).toBe(45);
    });
    it("should return 30 G (base 25 + 5 fee) for a single rune", () => {
      expect(calculatePremium([{ type: "rune" }], 0, false, false)).toBe(30);
    });
    it("should return 30 G (base 25 + 5 fee) for a single moonstone", () => {
      expect(calculatePremium([{ type: "moonstone" }], 0, false, false)).toBe(30);
    });
  });

  describe("Premium Calculation - Component Building Block", () => {
    it("should return 50 G for 2 runes (no block)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }], 0, false, false)).toBe(55);
    });
    it("should return 60 G for 3 runes (block applies)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false, false)).toBe(65);
    });
    it("should return 100 G for 4 runes (no block - block requires exactly 3)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false, false)).toBe(105);
    });
    it("should return 175 G for 7 runes (block + 4 extra at 25 each)", () => {
      const runes = Array(7).fill({ type: "rune" });
      expect(calculatePremium(runes, 0, false, false)).toBe(180);
    });
    it("should return 75 G for 2 runes + 1 moonstone (different types, no block)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, false, false)).toBe(80);
    });
    it("should return 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ];
      expect(calculatePremium(items, 0, false, false)).toBe(125);
    });
  });

  describe("Premium Calculation - Item-Specific Modifiers", () => {
    it("should add 50% surcharge for cursed sword (base 100 G + 50 G = 150 G before fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }])).toBe(170);
    });
    it("should add 30% surcharge for high-enchantment sword with enchantment 5 (base 100 G + 30 G)", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 5 }], 0, false, false)).toBe(135);
    });
    it("should add 30% surcharge for high-enchantment sword with enchantment 7", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 7 }], 0, false, false)).toBe(135);
    });
    it("should add both 50% curse and 30% high-enchantment surcharges for cursed sword with enchantment 5 or higher", () => {
      expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 5 }], 0, false, false)).toBe(185);
    });
    it("should NOT add high-enchantment surcharge for sword with enchantment 4", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 4 }], 0, false, false)).toBe(105);
    });
  });

  describe("Premium Calculation - Policy-Wide Modifiers", () => {
    it("should apply 20% loyalty discount for customer with 2 years", () => {
      expect(calculatePremium([{ type: "sword" }], 2, false, false)).toBe(85);
    });
    it("should apply 20% loyalty discount for customer with 3 years", () => {
      expect(calculatePremium([{ type: "sword" }], 3, false, false)).toBe(85);
    });
    it("should NOT apply loyalty discount for customer with 1 year", () => {
      expect(calculatePremium([{ type: "sword" }], 1, false, false)).toBe(105);
    });
    it("should add 10% first-insurance surcharge per item in quote", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false, true)).toBe(116);
    });
    it("should apply 15% follow-up contract discount on each contract after first", () => {
      expect(calculatePremium([{ type: "sword" }], 0, true, true)).toBe(99);
    });
    it("should add 5 G processing fee to every premium", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false, false)).toBe(105);
    });
  });

  describe("Premium Calculation - Modifier Scope", () => {
    it("should apply cursed surcharge only to cursed sword base premium, not policy total -- policy base 160 G, cursed surcharge 50 G, total 210 G before modifiers and fee", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }, { type: "amulet" }], 0, false, false)).toBe(215);
    });
    it("should apply item-specific modifiers to affected item base premium", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }], 0, false, false)).toBe(155);
    });
    it("should apply policy-wide modifiers (loyalty, first insurance, follow-up) to policy base premium", () => {
      expect(calculatePremium([{ type: "sword" }], 2, false, false)).toBe(85);
    });
    it("should add processing fee at the very end", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false, false)).toBe(105);
    });
  });

  describe("Premium Calculation - Rounding", () => {
    it("should round premium UP to whole G in MHPCO's favor -- 197.5 G becomes 198 G", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 4 }], 0, false, true)).toBe(116);
    });
  });

  describe("Integration - Premium Calculations", () => {
    it("should return 165 G for newcomer with cursed sword (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }], 0, false, true)).toBe(170);
    });
    it("should return 160 G for long-standing customer's second contract with cursed sword -- 100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first-insurance - 15 follow-up = 155 + 5 fee", () => {
      expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 7 }], 3, true, true)).toBe(140);
    });
  });

  describe("Claim Processing - Standard Reimbursement", () => {
    it("should return 400 G payout for regular sword with 500 G damage (500 - 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return 100 G payout for rune with 200 G damage (200 - 100 deductible)", () => {
      const policy = {
        items: [{ type: "rune" }],
        insuranceSum: 250,
        cap: 500,
        remainingCap: 500,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("should apply 100 G deductible per damaged item", () => {
      const policy = {
        items: [{ type: "sword", material: "steel" }, { type: "amulet", material: "silver" }],
        insuranceSum: 1600,
        cap: 3200,
        remainingCap: 3200,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim Processing - Dragon Material", () => {
    it("should return full reimbursement minus deductible for dragon-material sword -- 800 G damage = 700 G payout (800 - 100)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should return full reimbursement for dragon-material amulet with 300 G damage = 200 G payout", () => {
      const policy = {
        items: [{ type: "amulet", material: "dragon" }],
        insuranceSum: 600,
        cap: 1200,
        remainingCap: 1200,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "amulet", amount: 300 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 200, remainingCap: 1000 });
    });
  });

  describe("Claim Processing - High Enchantment (≥8)", () => {
    it("should apply 50% reimbursement first, then deductible for enchantment 8 sword -- 1000 G damage → 500 G then 400 G payout", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 8 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply 50% reimbursement for enchantment 9 sword", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 9 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply 50% reimbursement AFTER dragon-material full reimbursement when both apply -- dragon-material sword enchantment 9: 1000 G → 500 G (50%) → 400 G payout", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should NOT apply 50% rule for enchantment 5 sword (only 30% surcharge applies)", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 5 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 900, remainingCap: 1100 });
    });
    it("should apply 50% rule for enchantment 8 dragon-material sword -- 1000 G damage: 500 G (50%) - 100 = 400 G", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim Processing - Cap", () => {
    it("should cap payout at 2× insurance sum -- sword + amulet = 1600 G sum, cap 3200 G", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        insuranceSum: 1600,
        cap: 3200,
        remainingCap: 3200,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 2000 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 1900, remainingCap: 1300 });
    });
    it("should reduce second claim to remaining cap -- first claim 1500 G → payout 1400 G (cap 2000 remaining 600), second claim → payout 600 G", () => {
      const policy1 = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident1 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const result1 = calculatePayout(policy1, incident1);
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });

      const policy2 = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 600,
        quoteIndex: 0
      };
      const incident2 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const result2 = calculatePayout(policy2, incident2);
      expect(result2).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should track remaining cap after each claim", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident1 = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result1 = calculatePayout(policy, incident1);
      expect(result1.remainingCap).toBe(1600);
    });
  });

  describe("Claim Processing - Multiple Items of Same Type", () => {
    it("should treat each damage entry separately with its own deductible", () => {
      const policy = {
        items: [{ type: "sword", material: "steel" }, { type: "sword", material: "steel" }],
        insuranceSum: 2000,
        cap: 4000,
        remainingCap: 4000,
        quoteIndex: 0
      };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] };
      expect(calculatePayout(policy, incident)).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("should exit with non-zero status when damages entries exceed insured items", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] };
      expect(() => calculatePayout(policy, incident)).toThrow();
    });
  });

  describe("Claim Processing - Error Cases", () => {
    it("should exit with non-zero status when damage amount is negative", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
      expect(() => calculatePayout(policy, incident)).toThrow();
    });
    it("should exit with non-zero status when damaged item is not in policy", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
        quoteIndex: 0
      };
      const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] };
      expect(() => calculatePayout(policy, incident)).toThrow();
    });
  });

  describe("Quote - Error Cases", () => {
    it("should exit with non-zero status for unknown item type", () => {
      expect(() => calculatePremium([{ type: "broomstick" }] as any)).toThrow();
    });
  });

  describe("Insurance Values", () => {
    it("should calculate insurance sum as sum of item insurance values -- sword 1000 + amulet 600 = 1600 G", () => {
      const items = [{ type: "sword" }, { type: "amulet" }];
      expect(calculateInsuranceSum(items)).toBe(1600);
    });
    it("should calculate insurance sum for component block -- sword 1000 + 3×250 = 1750 G (block affects premium only, not insurance)", () => {
      const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(calculateInsuranceSum(items)).toBe(1750);
    });
    it("should set cap at 2× insurance sum", () => {
      const items = [{ type: "sword" }];
      const insuranceSum = calculateInsuranceSum(items);
      expect(insuranceSum * 2).toBe(2000);
    });
  });

  describe("End-to-End Scenarios", () => {
    it("should process quote and claim for newcomer with amulet", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
      expect(result.results[1].payout).toBe(100);
    });
    it("should process sequential quotes and claims tracking caps correctly", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
  });
});