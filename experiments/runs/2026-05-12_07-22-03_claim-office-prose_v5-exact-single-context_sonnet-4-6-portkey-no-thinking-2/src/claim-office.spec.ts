import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single sword (new customer, first contract)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      expect(quote(customer, items)).toBe(71);
    });
    it("should return base premium plus processing fee for a single component", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "component", material: "moonstone", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(33);
    });
    it("should add 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      expect(quote(customer, items)).toBe(170);
    });
    it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items)).toBe(148);
    });
    it("should apply 20% loyalty discount for long-standing customer (>= 2 years)", () => {
      const customer = { yearsWithMHPCO: 3, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items)).toBe(93);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 2, cursed: false }];
      expect(quote(customer, items)).toBe(93);
    });
    it("should apply 15% multi-contract discount for second contract onwards", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items)).toBe(90);
    });
    it("should sum premiums for multiple items in one quote", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      expect(quote(customer, items)).toBe(181);
    });
  });

  describe("claim", () => {
    it("should pay out damage minus deductible for a basic claim", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", amount: 200, enchantment: 2, material: "silver" }] };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should return zero payout when damage is less than or equal to deductible", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", amount: 80, enchantment: 2, material: "silver" }] };
      expect(claim(policy, incident)).toEqual({ payout: 0, remainingCap: 1200 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = { insuranceSum: 600, remainingCap: 200 };
      const incident = { damages: [{ itemType: "amulet", amount: 500, enchantment: 2, material: "silver" }] };
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 0 });
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", amount: 300, enchantment: 8, material: "silver" }] };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should reimburse fully for items made of dragon material", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ itemType: "amulet", amount: 300, enchantment: 8, material: "dragon" }] };
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should reduce remaining cap across multiple claims on the same policy", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const firstResult = claim(policy, { damages: [{ itemType: "amulet", amount: 200, enchantment: 2, material: "silver" }] });
      expect(firstResult).toEqual({ payout: 100, remainingCap: 1100 });
      const secondResult = claim({ ...policy, remainingCap: firstResult.remainingCap }, { damages: [{ itemType: "amulet", amount: 300, enchantment: 2, material: "silver" }] });
      expect(secondResult).toEqual({ payout: 200, remainingCap: 900 });
    });
  });
});
