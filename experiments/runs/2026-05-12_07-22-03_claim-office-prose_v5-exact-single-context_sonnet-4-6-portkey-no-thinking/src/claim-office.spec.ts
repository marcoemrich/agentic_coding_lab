import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(71);
    });
    it("should return base premium plus processing fee for a single component", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune", material: "stone", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(33);
    });
    it("should apply bundle premium for 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items)).toBe(71);
    });
    it("should add 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      expect(quote(customer, items)).toBe(170);
    });
    it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items)).toBe(148);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(93);
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const customer = { yearsWithMHPCO: 3, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(93);
    });
    it("should apply 15% discount for contracts after the first", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(90);
    });
  });

  describe("claim", () => {
    it("should apply 100 G deductible to a basic damage claim", () => {
      const policy = { insuranceSum: 600, cap: 1200, remainingCap: 1200 };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      };
      const result = claim(policy, incident);
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1100);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = { insuranceSum: 600, cap: 1200, remainingCap: 200 };
      const incident = {
        cause: "flood",
        damages: [{ itemType: "amulet", amount: 500 }],
      };
      const result = claim(policy, incident);
      expect(result.payout).toBe(200);
      expect(result.remainingCap).toBe(0);
    });
    it("should reimburse 50% of damage for high enchantment items (enchantment >= 8)", () => {
      const policy = { insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const incident = {
        cause: "magic surge",
        damages: [{ itemType: "sword", amount: 400, enchantment: 8 }],
      };
      const result = claim(policy, incident);
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1900);
    });
    it("should fully reimburse damage for dragon material items", () => {
      const policy = { insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const incident = {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 300, material: "dragon" }],
      };
      const result = claim(policy, incident);
      expect(result.payout).toBe(200);
      expect(result.remainingCap).toBe(1800);
    });
  });
});
