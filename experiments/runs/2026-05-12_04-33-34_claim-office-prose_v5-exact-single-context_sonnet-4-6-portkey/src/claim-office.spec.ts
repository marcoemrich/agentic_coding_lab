import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single plain item (first contract)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should add 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      expect(quote(customer, items, 1)).toBe(170);
    });
    it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, 1)).toBe(148);
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const customer = { yearsWithMHPCO: 5 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 1)).toBe(93);
    });
    it("should apply 15% discount on contracts after the first", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 2)).toBe(90);
    });
    it("should use bulk deal price for 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "component", material: "rune", enchantment: 0, cursed: false },
        { type: "component", material: "rune", enchantment: 0, cursed: false },
        { type: "component", material: "rune", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 1)).toBe(71);
    });
  });

  describe("claim", () => {
    it("should subtract 100G deductible from damage amount", () => {
      const policy = {
        insuranceSum: 600,
        remainingCap: 1200,
        items: [{ type: "amulet", material: "silver", enchantment: 2 }],
      };
      const incident = {
        damages: [{ itemType: "amulet", amount: 300 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should reimburse 50% of damage for items with enchantment >= 8", () => {
      const policy = {
        insuranceSum: 1000,
        remainingCap: 2000,
        items: [{ type: "sword", material: "steel", enchantment: 9 }],
      };
      const incident = {
        damages: [{ itemType: "sword", amount: 500 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should reimburse 100% of damage for items made of dragon material", () => {
      const policy = {
        insuranceSum: 1000,
        remainingCap: 2000,
        items: [{ type: "sword", material: "dragon", enchantment: 10 }],
      };
      const incident = {
        damages: [{ itemType: "sword", amount: 500 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should track remaining cap after a payout", () => {
      const policy = {
        insuranceSum: 600,
        remainingCap: 150,
        items: [{ type: "amulet", material: "silver", enchantment: 2 }],
      };
      const incident = {
        damages: [{ itemType: "amulet", amount: 400 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 150, remainingCap: 0 });
    });
  });
});
