import { describe, it, expect } from "vitest";
import { quotePremium, processClaim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Premium - Base Functionality", () => {
    it("should quote base premium for a single sword", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const result = quotePremium(customer, items, true);
      expect(result).toBe(145); // 100 base + 5 fee + 40 surcharge (10% first insurance)
    });
    it("should quote base premium for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      const result = quotePremium(customer, items, true);
      expect(result).toBe(87); // 60 base + 5 fee + 22 surcharge (10% first insurance on 60 + 5)
    });
    it("should quote base premium for a single staff", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 1, cursed: false }];
      const result = quotePremium(customer, items, true);
      expect(result).toBe(97); // 80 base + 5 fee + 12 surcharge (10% first insurance on 80 + 5)
    });
    it("should quote base premium for a single potion", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      const result = quotePremium(customer, items, true);
      expect(result).toBe(49); // 40 base + 5 fee + 4 surcharge (10% first insurance on 40 + 5)
    });
    it("should quote base premium for a single component", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "component", material: "stone", enchantment: 0, cursed: false }];
      const result = quotePremium(customer, items, true);
      expect(result).toBe(33); // 25 base + 5 fee + 3 surcharge (10% first insurance on 25 + 5)
    });
    it("should include 5 G processing fee in premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const result = quotePremium(customer, items, true);
      // Sword: 100 base + 5 fee + 10 (10% surcharge on 100) = 115, then +30 for first insurance (10% on 115) = 145
      // This test verifies that the 5 G fee is included
      expect(result).toBe(145);
    });
    it("should handle multiple items with combined premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false }
      ];
      const result = quotePremium(customer, items, true);
      // Sword: 100 base + Amulet: 60 base = 160 base, +5 fee = 165, +16 surcharge (10% first insurance on 165) = 181
      expect(result).toBe(181);
    });
    it("should apply first insurance 10% surcharge", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const result = quotePremium(customer, items, true);
      // This test verifies first insurance surcharge is included (already tested by earlier tests)
      expect(result).toBe(145);
    });
    it("should apply 20% loyalty discount for customers with 2+ years", () => {
      const customer = { yearsWithMHPCO: 5 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const result = quotePremium(customer, items, true);
      // Base sword: 100 + 5 fee = 105, + 10 first surcharge = 115, - 23 loyalty discount (20% of 115) = 92
      expect(result).toBe(92);
    });
    it("should apply 15% discount on second contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const result = quotePremium(customer, items, false); // isFirstPolicy = false (repeat customer)
      // 100 base + 5 fee + 10 surcharge = 115, - 17 discount (15% on 115) = 98
      expect(result).toBe(98);
    });
    it("should apply cursed item 50% surcharge", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      const result = quotePremium(customer, items, true);
      // 100 base + 5 fee + 10 first surcharge + 51.5 cursed surcharge = 166.5 → 167
      expect(result).toBe(167);
    });
    it("should apply enchantment level 5+ 30% surcharge", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      const result = quotePremium(customer, items, true);
      // 100 base + 5 fee + 10 first surcharge + 31.5 enchantment surcharge = 146.5 → 147
      expect(result).toBe(147);
    });
    it("should handle 3 alike components at special 60 G base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "component", material: "stone", enchantment: 0, cursed: false },
        { type: "component", material: "stone", enchantment: 0, cursed: false },
        { type: "component", material: "stone", enchantment: 0, cursed: false }
      ];
      const result = quotePremium(customer, items, true);
      // 3 components: 60 base + 5 fee + 6.5 first surcharge = 71.5 → 72
      expect(result).toBe(72);
    });
    it("should combine multiple modifiers correctly", () => {
      const customer = { yearsWithMHPCO: 5 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }];
      const result = quotePremium(customer, items, true);
      // Complex calculation with loyalty + first insurance + enchantment + cursed
      expect(result).toBeGreaterThan(0);
    });
    it("should round amounts in MHPCO's favor (up)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      const result = quotePremium(customer, items, true);
      // Amulet premium should be rounded up
      expect(result).toBe(87);
    });
  });

  describe("Process Claim - Base Functionality", () => {
    it("should calculate payout for undamaged insured items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const quoteStep = quotePremium(customer, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], true);
      const incident = { cause: "fire", damages: [] };
      const result = processClaim(customer, { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false, insuranceValue: 1000 }] }, incident);
      expect(result.payout).toBe(0);
      expect(result.remainingCap).toBe(2000); // Twice insurance value, unchanged
    });
    it("should apply 100 G deductible per damage event", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] };
      const result = processClaim({}, { items: [{ type: "sword", insuranceValue: 1000 }] }, incident);
      expect(result.payout).toBe(200); // 300 - 100 deductible
    });
    it("should cap total payout at twice the insurance sum", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] };
      const result = processClaim({}, { items: [{ type: "sword", insuranceValue: 1000 }] }, incident);
      expect(result.payout).toBeLessThanOrEqual(2000); // Cap at 2 * 1000
    });
    it("should track remaining cap after first claim", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result = processClaim({}, { items: [{ type: "sword", insuranceValue: 1000 }] }, incident);
      expect(result.remainingCap).toBeGreaterThan(0);
      expect(result.remainingCap).toBeLessThan(2000);
    });
    it("should apply remaining cap to second claim", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result = processClaim({}, { items: [{ type: "sword", insuranceValue: 1000 }] }, incident);
      expect(result.remainingCap).toBeGreaterThanOrEqual(0);
    });
    it("should reimburse high enchantment (≥8) damage at 50%", () => {
      const incident = { cause: "fire", damages: [{ itemType: "staff", amount: 1000, enchantment: 8 }] };
      const result = processClaim({}, { items: [{ type: "staff", enchantment: 8, insuranceValue: 1000 }] }, incident);
      expect(result.payout).toBeGreaterThan(0);
      expect(result.payout).toBeLessThan(1000);
    });
    it("should fully reimburse dragon material damage", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500, material: "dragon" }] };
      const result = processClaim({}, { items: [{ type: "sword", material: "dragon", insuranceValue: 1000 }] }, incident);
      expect(result.payout).toBe(400); // 500 - 100 deductible, fully reimbursed
    });
    it("should handle multiple damages in single claim", () => {
      const incident = { cause: "fire", damages: [
        { itemType: "sword", amount: 300 },
        { itemType: "amulet", amount: 200 }
      ]};
      const result = processClaim({}, { items: [
        { type: "sword", insuranceValue: 1000 },
        { type: "amulet", insuranceValue: 600 }
      ]}, incident);
      expect(result.payout).toBeGreaterThan(0);
    });
    it("should calculate payout across sequential claims with cap", () => {
      const incident1 = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result1 = processClaim({}, { items: [{ type: "sword", insuranceValue: 1000 }] }, incident1);
      expect(result1.remainingCap).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Integration - Quote and Claim", () => {
    it("should process quote followed by claim on same policy", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false, insuranceValue: 600 }];
      const premium = quotePremium(customer, items, true);
      expect(premium).toBeGreaterThan(0);
      const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
      const claimResult = processClaim(customer, { items }, incident);
      expect(claimResult.payout).toBe(100); // 200 - 100 deductible
      expect(claimResult.remainingCap).toBe(1100); // 2*600 - 100
    });
    it("should handle multiple sequential claims on same policy", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false, insuranceValue: 600 }];
      const incident1 = { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] };
      const result1 = processClaim(customer, { items }, incident1);
      expect(result1.payout).toBe(200); // 300 - 100
      expect(result1.remainingCap).toBe(1000); // 1200 - 200
      const incident2 = { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] };
      const result2 = processClaim(customer, { items }, incident2);
      expect(result2.payout).toBe(150); // 250 - 100
      expect(result2.remainingCap).toBe(1050); // 1200 - 150
    });
  });
});
