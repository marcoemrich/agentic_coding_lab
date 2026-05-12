import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G premium for an empty item list (processing fee only)", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [], true)).toBe(5);
    });
    it("should return base premium plus fee for a single plain sword", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: false, enchantment: 3 }];
      expect(quote(customer, items, true)).toBe(115);
    });
    it("should return base premium plus fee for a single plain amulet", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", cursed: false, enchantment: 3 }];
      expect(quote(customer, items, true)).toBe(71);
    });
    it("should combine base premiums plus fee for multiple plain items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", cursed: false, enchantment: 3 },
        { type: "amulet", cursed: false, enchantment: 3 },
      ];
      expect(quote(customer, items, true)).toBe(181);
    });
    it("should add 50% cursed surcharge on the affected item's base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: true, enchantment: 3 }];
      expect(quote(customer, items, true)).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for items with enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: false, enchantment: 5 }];
      expect(quote(customer, items, true)).toBe(145);
    });
    it("should add both cursed and high-enchantment surcharges when both apply", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: true, enchantment: 5 }];
      expect(quote(customer, items, true)).toBe(195);
    });
    it("should price each component (rune) at 25 G base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, true)).toBe(60);
    });
    it("should apply a block rate of 60 G for exactly 3 identical components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, true)).toBe(71);
    });
    it("should not apply the block rate when 4 or more identical components are present", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, true)).toBe(115);
    });
    it("should apply the block rate separately for each group of 3 identical alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "sword" }, { type: "sword" }, { type: "sword" },
      ];
      expect(quote(customer, items, true)).toBe(137);
    });
    it("should apply 20% loyalty discount on policy base premium for customers with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", cursed: false, enchantment: 3 }];
      expect(quote(customer, items, true)).toBe(95);
    });
    it("should apply 10% first-insurance surcharge on policy base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: false, enchantment: 3 }];
      expect(quote(customer, items, true)).toBe(115);
    });
    it("should apply 15% follow-up discount on policy base premium for second-or-later quotes", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: false, enchantment: 3 }];
      expect(quote(customer, items, false)).toBe(90);
    });
    it("should round the final premium up (in MHPCO's favor)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }];
      expect(quote(customer, items, true)).toBe(33);
    });
  });

  describe("claim", () => {
    it("should pay damage minus 100 G deductible for a standard item", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", enchantment: 3 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 50% of damage minus deductible for items with enchantment >= 8", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", enchantment: 8 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should pay full damage minus deductible for dragon-material items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", material: "dragon", enchantment: 3 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply the 50% rule (not full reimbursement) when both dragon material and high enchantment apply", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", material: "dragon", enchantment: 9 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap the payout at twice the policy insurance sum", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", enchantment: 3 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 2500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should reduce the remaining cap after each claim", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", enchantment: 3 }, insuranceSum: 1000, remainingCap: 600 };
      const incident = { damage: 1500 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should round the final payout down (in MHPCO's favor)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const policy = { item: { type: "sword", enchantment: 8 }, insuranceSum: 1000, remainingCap: 2000 };
      const incident = { damage: 301 };
      expect(claim(customer, policy, incident)).toEqual({ payout: 100, remainingCap: 1900 });
    });
  });
});
