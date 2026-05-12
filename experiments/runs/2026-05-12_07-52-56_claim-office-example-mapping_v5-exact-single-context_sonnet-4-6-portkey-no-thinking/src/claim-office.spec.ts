import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return processing fee only for empty item list", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      expect(quote(customer, [])).toHaveProperty("premium", 5);
    });
    it("should return base premium plus fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toHaveProperty("premium", 115);
    });
    it("should return base premium plus fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toHaveProperty("premium", 71);
    });
    it("should return base premium plus fee for a single staff", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toHaveProperty("premium", 93);
    });
    it("should return base premium plus fee for a single potion", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toHaveProperty("premium", 49);
    });
    it("should return base premium plus fee for a single component", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "component", subtype: "rune" }];
      expect(quote(customer, items)).toHaveProperty("premium", 33);
    });
    it("should apply block pricing for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [
        { type: "component", subtype: "rune" },
        { type: "component", subtype: "rune" },
        { type: "component", subtype: "rune" },
      ];
      expect(quote(customer, items)).toHaveProperty("premium", 71);
    });
    it("should sum base premiums for multiple different items", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items)).toHaveProperty("premium", 181);
    });
    it("should apply cursed surcharge to the cursed item only", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      // cursed sword: 100 base + 50 curse surcharge = 150
      // plain amulet: 60 base
      // policy base: 210, first insurance: +21, + 5 fee = 236
      expect(quote(customer, items)).toHaveProperty("premium", 236);
    });
    it("should apply high-enchantment surcharge for enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // sword base: 100, high-enchantment surcharge: 30 (30% of 100)
      // total: 130 base, first insurance: +13, + 5 fee = 148
      expect(quote(customer, items)).toHaveProperty("premium", 148);
    });
    it("should apply loyalty discount for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base: 100, loyalty discount: -20 (20% of 100), first insurance: +10 (10% of 100)
      // policy base: 90 + 5 fee = 95
      expect(quote(customer, items)).toHaveProperty("premium", 95);
    });
    it("should apply first insurance surcharge to every item in a quote", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base: 100, first insurance surcharge: +10 (10% of 100)
      // policy base: 110 + 5 fee = 115
      expect(quote(customer, items)).toHaveProperty("premium", 115);
    });
    it("should apply follow-up contract discount on second and later quotes", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base: 100, first insurance: +10, follow-up discount: -15
      // policy base: 95 + 5 fee = 100
      expect(quote(customer, items)).toHaveProperty("premium", 100);
    });
  });

  describe("claim", () => {
    it("should apply deductible per damage item", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const policy = quote(customer, items);
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      // full reimbursement minus 100G deductible: 500 - 100 = 400
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon-material item damage minus deductible", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
      const policy = quote(customer, items);
      const incident = { damages: [{ itemType: "sword", material: "dragon", enchantment: 8, amount: 1000 }] };
      // dragon material: full reimbursement overrides 50% enchantment clause
      // payout: 1000 - 100 = 900
      expect(claim(policy, incident)).toEqual({ payout: 900, remainingCap: 1100 });
    });
    it("should reimburse at 50% for item with enchantment >= 8 minus deductible", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 8, cursed: false }];
      const policy = quote(customer, items);
      const incident = { damages: [{ itemType: "sword", material: "steel", enchantment: 8, amount: 1000 }] };
      // enchantment >= 8: reimburse at 50%, then deductible: 1000 * 0.5 - 100 = 400
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const policy = quote(customer, items);
      const incident = { damages: [{ itemType: "sword", material: "steel", enchantment: 0, amount: 2500 }] };
      // sword insurance sum: 1000G, cap: 2000G
      // raw payout: 2500 - 100 = 2400, but capped at 2000
      expect(claim(policy, incident)).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across successive claims on same policy", () => {
      const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const policy = quote(customer, items);
      const incident = { damages: [{ itemType: "sword", material: "steel", enchantment: 0, amount: 1500 }] };
      // first claim: 1500 - 100 = 1400, cap remaining 2000 - 1400 = 600
      const firstResult = claim(policy, incident) as { payout: number; remainingCap: number };
      expect(firstResult).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: same incident, but remaining cap is only 600
      const updatedPolicy = { ...policy, remainingCap: firstResult.remainingCap };
      const secondResult = claim(updatedPolicy, incident) as { payout: number; remainingCap: number };
      expect(secondResult).toEqual({ payout: 600, remainingCap: 0 });
    });
  });
});
