import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium for a single sword for a new customer on their first policy", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should return correct base premiums for each main item type (amulet, staff, potion)", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }], 1)).toBe(71);
      expect(quote(customer, [{ type: "staff", material: "oak", enchantment: 0, cursed: false }], 1)).toBe(93);
      expect(quote(customer, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }], 1)).toBe(49);
    });
    it("should return base premium for a single component", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "component", material: "stone", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 1)).toBe(33);
    });
    it("should apply a reduced premium for a building block of three alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "component", material: "moonstone", enchantment: 0, cursed: false },
        { type: "component", material: "moonstone", enchantment: 0, cursed: false },
        { type: "component", material: "moonstone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 1)).toBe(71);
    });
    it("should apply a 50% cursed surcharge on item base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      expect(quote(customer, items, 1)).toBe(170);
    });
    it("should apply a 30% enchantment surcharge for items with enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, 1)).toBe(148);
    });
    it("should apply a 20% loyalty discount for customers with >= 2 years with MHPCO", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 1)).toBe(93);
    });
    it("should apply a 10% initial assessment surcharge on a first insurance", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 0, cursed: false }];
      // staff 80G base + ceil(80 * 10/100)=8G surcharge + 5G fee = 93G
      expect(quote(customer, items, 1)).toBe(93);
    });
    it("should apply a 15% discount on each contract after the first", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // contractNumber: 2 → no initial assessment surcharge, but -15% subsequent discount
      // base 100G, no surcharge, -15G discount = 85G, +5G fee = 90G
      expect(quote(customer, items, 2)).toBe(90);
    });
    it("should add a 5 G processing fee to every premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      // potion: 40G base + ceil(40 * 10/100)=4G surcharge + 5G fee = 49G
      expect(quote(customer, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }], 1)).toBe(49);
    });
  });

  describe("claim", () => {
    it("should return payout as damage minus the 100 G deductible", () => {
      // sword: insuranceSum 1000G, damage 300G, deductible 100G → payout 200G, cap 2×1000-200=1800G
      const policy = { insuranceSum: 1000 };
      const incident = { damages: [{ amount: 300 }] };
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap total payouts at twice the insurance sum across multiple claims", () => {
      const policy = { insuranceSum: 1000 };
      // First claim: damage 1200 - 100 deductible = 1100 payout, remainingCap = 2000 - 1100 = 900
      const result1 = claim(policy, { damages: [{ amount: 1200 }] });
      expect(result1).toEqual({ payout: 1100, remainingCap: 900 });
      // Second claim: damage 1500 - 100 = 1400, but only 900 remaining cap → payout = 900, remainingCap = 0
      const result2 = claim(policy, { damages: [{ amount: 1500 }] }, result1.remainingCap);
      expect(result2).toEqual({ payout: 900, remainingCap: 0 });
    });
    it("should reimburse damage to enchantment >= 8 items at 50% of the damage amount", () => {
      const policy = { insuranceSum: 1000 };
      const incident = { damages: [{ amount: 400, enchantment: 8 }] };
      // enchantment >= 8: payout = 50% of damage = 200, remainingCap = 2000 - 200 = 1800
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const policy = { insuranceSum: 1000 };
      const incident = { damages: [{ amount: 500, material: "dragon" }] };
      // dragon material: fully reimbursed, no deductible → payout = 500, remainingCap = 2000 - 500 = 1500
      expect(claim(policy, incident)).toEqual({ payout: 500, remainingCap: 1500 });
    });
  });
});
