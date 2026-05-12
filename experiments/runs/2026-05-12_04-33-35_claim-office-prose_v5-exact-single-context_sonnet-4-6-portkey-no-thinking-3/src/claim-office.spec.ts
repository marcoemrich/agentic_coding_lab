import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should quote a single basic sword with no modifiers", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(115);
    });
    it("should quote a single cursed item with 50% surcharge", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(170);
    });
    it("should quote a single highly enchanted item (level >= 5) with 30% surcharge", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(148);
    });
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(93);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(71);
    });
    it("should apply 15% multi-contract discount after first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const contractNumber = 2;
      expect(quote(customer, items, contractNumber)).toBe(90);
    });
    it("should quote multiple items summing their base premiums", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 1, cursed: false },
        { type: "amulet", material: "silver", enchantment: 1, cursed: false },
      ];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(181);
    });
    it("should treat 3 alike components as a bundle with 60G base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      const contractNumber = 1;
      expect(quote(customer, items, contractNumber)).toBe(71);
    });
  });

  describe("claim", () => {
    it("should apply 100G deductible and pay remainder", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", enchantment: 2, material: "silver", amount: 200 }] };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = { insuranceSum: 600, remainingCap: 150 };
      const incident = { damages: [{ itemType: "amulet", enchantment: 2, material: "silver", amount: 400 }] };
      expect(claim(policy, incident)).toEqual({ payout: 150, remainingCap: 0 });
    });
    it("should reimburse damage to high-enchantment items (>= 8) at 50%", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", enchantment: 8, material: "silver", amount: 400 }] };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", enchantment: 8, material: "dragon", amount: 400 }] };
      expect(claim(policy, incident)).toEqual({ payout: 300, remainingCap: 900 });
    });
  });
});
