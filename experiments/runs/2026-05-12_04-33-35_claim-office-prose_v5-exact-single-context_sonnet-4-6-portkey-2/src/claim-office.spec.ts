import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote", () => {
    it("should quote a single sword for a first-time customer with processing fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(115);
    });
    it("should quote a single amulet for a first-time customer", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(71);
    });
    it("should quote multiple items together", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(181);
    });
    it("should apply cursed item surcharge of 50%", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(170);
    });
    it("should apply high enchantment surcharge of 30% for enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(148);
    });
    it("should apply loyalty discount of 20% for customers with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(93);
    });
    it("should apply subsequent contract discount of 15%", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, { isFirstInsurance: false })).toBe(90);
    });
    it("should apply bundle pricing for 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, { isFirstInsurance: true })).toBe(71);
    });
  });

  describe("Claim", () => {
    it("should process a basic claim subtracting the 100G deductible", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] };
      const result = claim(policy, incident);
      expect(result.payout).toBe(200);
      expect(result.remainingCap).toBe(1000);
    });
    it("should track remaining cap after a claim", () => {
      const policy = { insuranceSum: 600, remainingCap: 150 };
      const incident = { cause: "flood", damages: [{ itemType: "amulet", amount: 400 }] };
      const result = claim(policy, incident);
      expect(result.payout).toBe(150);
      expect(result.remainingCap).toBe(0);
    });
    it("should reimburse high enchantment damage (>= 8) at 50%", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { cause: "fire", damages: [{ itemType: "sword", enchantment: 8, amount: 400 }] };
      const result = claim(policy, incident);
      // effective damage: 400 * 50% = 200; after 100G deductible: payout = 100
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1100);
    });
    it("should reimburse dragon material damage at 100%", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { cause: "fire", damages: [{ itemType: "sword", material: "dragon", enchantment: 8, amount: 400 }] };
      const result = claim(policy, incident);
      // dragon material overrides enchantment reduction: full 400G effective damage
      // after 100G deductible: payout = 300
      expect(result.payout).toBe(300);
      expect(result.remainingCap).toBe(900);
    });
  });
});
