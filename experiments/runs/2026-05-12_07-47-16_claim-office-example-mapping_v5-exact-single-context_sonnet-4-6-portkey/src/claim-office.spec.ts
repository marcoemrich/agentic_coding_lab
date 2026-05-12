import { describe, it, expect } from "vitest";
import { quote, claim, createPolicy, type Item, type Damage } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5G premium for an empty item list (processing fee only)", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [], 1)).toBe(5);
    });
    it("should compute the premium for a single plain sword for a newcomer on their first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "sword", enchantment: 3, cursed: false }];
      // base 100G + 10% first insurance (10G) + 5G fee = 115G
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should compute the premium for a single plain amulet for a newcomer on their first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "amulet", enchantment: 2, cursed: false }];
      // base 60G + 10% first insurance (6G) + 5G fee = 71G
      expect(quote(customer, items, 1)).toBe(71);
    });
    it("should sum base premiums across multiple items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", enchantment: 2, cursed: false },
        { type: "amulet", enchantment: 1, cursed: false },
      ];
      // policy base 160G + 10% first insurance (16G) + 5G fee = 181G
      expect(quote(customer, items, 1)).toBe(181);
    });
    it("should add a 50% surcharge on the base premium of a cursed item only, not the whole policy", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", enchantment: 3, cursed: true },
        { type: "amulet", enchantment: 1, cursed: false },
      ];
      // policy base 160G + cursed surcharge on sword only (50% of 100 = 50G)
      // + first insurance (10% of 160G = 16G) + 5G fee
      // = 160 + 50 + 16 + 5 = 231G
      expect(quote(customer, items, 1)).toBe(231);
    });
    it("should apply a 20% loyalty discount on the policy base premium for a customer with 2 or more years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items: Item[] = [{ type: "sword", enchantment: 3, cursed: false }];
      // policy base 100G + first insurance 10G - loyalty discount (20% of 100 = 20G) + 5G fee
      // = 100 + 10 - 20 + 5 = 95G
      expect(quote(customer, items, 1)).toBe(95);
    });
    it("should apply a 15% follow-up discount for a customer's second and subsequent contracts", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items: Item[] = [{ type: "sword", enchantment: 2, cursed: false }];
      // policy base 100G + first insurance 10G - follow-up discount (15% of 100 = 15G)
      // - loyalty discount (20% of 100 = 20G) + 5G fee
      // = 100 + 10 - 15 - 20 + 5 = 80G
      expect(quote(customer, items, 2)).toBe(80);
    });
  });

  describe("claim", () => {
    it("should deduct 100G per damage event from the payout", () => {
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const policy = createPolicy(items);
      const damages: Damage[] = [{ itemType: "sword", amount: 500 }];
      // payout = 500 - 100 deductible = 400G; remainingCap = 2000 - 400 = 1600G
      const result = claim(policy, damages);
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should cap the total payout at twice the insurance sum of the policy", () => {
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const policy = createPolicy(items); // insuranceSum=1000G, cap=2000G

      // First claim: 1500G damage → payout 1400G (1500-100), remainingCap 600G
      const result1 = claim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(result1.payout).toBe(1400);
      expect(result1.remainingCap).toBe(600);

      // Second claim: 1500G damage but only 600G cap remains → payout capped at 600G
      const reducedPolicy = { ...policy, remainingCap: result1.remainingCap };
      const result2 = claim(reducedPolicy, [{ itemType: "sword", amount: 1500 }]);
      expect(result2.payout).toBe(600);
      expect(result2.remainingCap).toBe(0);
    });
    it("should return the remaining cap after a claim is processed", () => {
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const policy = createPolicy(items); // insuranceSum=1000G, cap=2000G
      const damages: Damage[] = [{ itemType: "sword", amount: 300 }];
      // payout = 300 - 100 = 200G; remainingCap = 2000 - 200 = 1800G
      const result = claim(policy, damages);
      expect(result.payout).toBe(200);
      expect(result.remainingCap).toBe(1800);
    });
  });
});
