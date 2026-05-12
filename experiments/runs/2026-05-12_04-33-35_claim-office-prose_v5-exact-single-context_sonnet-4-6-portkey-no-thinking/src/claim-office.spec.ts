import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single sword (new customer, first policy)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // sword base premium: 100 G, first insurance surcharge +10% = 110 G, processing fee +5 G = 115 G
      expect(quote(customer, items, { contractNumber: 1 })).toBe(115);
    });
    it("should apply 50% cursed surcharge to the base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      // sword base: 100 G, cursed +50% = 150 G, first insurance +10% = 165 G, fee +5 G = 170 G
      expect(quote(customer, items, { contractNumber: 1 })).toBe(170);
    });
    it("should apply 30% high enchantment surcharge for enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 6, cursed: false }];
      // sword base: 100 G, high enchantment +30% = 130 G, first insurance +10% = 143 G, fee +5 G = 148 G
      expect(quote(customer, items, { contractNumber: 1 })).toBe(148);
    });
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // sword base: 100 G, first insurance +10% = 110 G, loyalty -20% = 88 G, fee +5 G = 93 G
      expect(quote(customer, items, { contractNumber: 1 })).toBe(93);
    });
    it("should apply 10% initial assessment surcharge for first insurance and 15% discount for subsequent contracts", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // first insurance (contractNumber: 1): base 100, +10% = 110, +5 fee = 115
      expect(quote(customer, items, { contractNumber: 1 })).toBe(115);
      // subsequent contract (contractNumber: 2): base 100, -15% = 85, +5 fee = 90
      expect(quote(customer, items, { contractNumber: 2 })).toBe(90);
    });
    it("should use building block rate (60 G) for a set of 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      // 3 alike components: building block rate 60 G, first insurance +10% = 66 G, fee +5 G = 71 G
      expect(quote(customer, items, { contractNumber: 1 })).toBe(71);
    });
  });

  describe("claim", () => {
    it("should return zero payout when damage is at or below the 100 G deductible", () => {
      const policy = { insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 80, enchantment: 3, material: "steel" }] };
      // damage 80 <= deductible 100, payout = 0, cap unchanged
      expect(claim(policy, incident)).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("should return damage minus deductible as payout for standard damage above the deductible", () => {
      const policy = { insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 300, enchantment: 3, material: "steel" }] };
      // damage 300 > deductible 100, payout = 300 - 100 = 200, remainingCap = 2000 - 200 = 1800
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const policy = { insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 300, enchantment: 3, material: "dragon" }] };
      // dragon material: fully reimbursed = 300, remainingCap = 2000 - 300 = 1700
      expect(claim(policy, incident)).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should reimburse 50% of damage to items with enchantment level >= 8", () => {
      const policy = { insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 400, enchantment: 9, material: "steel" }] };
      // enchantment >= 8: reimburse 50% of damage = 200, then deductible 100, payout = 100
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should decrease remainingCap by the payout amount after each claim", () => {
      const policy = { insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 300, enchantment: 3, material: "steel" }] };
      // first claim: payout = 300 - 100 = 200, remainingCap = 2000 - 200 = 1800
      const result1 = claim(policy, incident);
      expect(result1).toEqual({ payout: 200, remainingCap: 1800 });
      // second claim with updated cap: payout = 200, remainingCap = 1800 - 200 = 1600
      const policy2 = { insuranceSum: 1000, remainingCap: result1.remainingCap };
      const result2 = claim(policy2, incident);
      expect(result2).toEqual({ payout: 200, remainingCap: 1600 });
    });
  });
});
