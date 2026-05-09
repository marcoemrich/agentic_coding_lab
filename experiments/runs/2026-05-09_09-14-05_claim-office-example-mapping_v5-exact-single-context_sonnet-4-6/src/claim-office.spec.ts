import { describe, it, expect } from "vitest";
import { quote, createPolicy, processClaim, type Item } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should charge only the processing fee for an empty item list", () => {
      const customer = { yearsWithMHPCO: 1 };
      expect(quote(customer, [], 1)).toBe(5);
    });
    it("should compute base premium for a single sword", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should sum base premiums for multiple items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      expect(quote(customer, items, 1)).toBe(181);
    });
    it("should apply block pricing for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, 1)).toBe(71);
    });
    it("should apply cursed surcharge to the affected item only", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      // policy base = 160G; curse surcharge = 50% of sword base (50G); first insurance = 10% of policy base (16G); fee = 5G
      expect(quote(customer, items, 1)).toBe(231);
    });
    it("should apply high-enchantment surcharge to items with enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // policy base = 100G; high-enchantment surcharge = 30% of 100G (30G); first insurance = 10% of 100G (10G); fee = 5G
      expect(quote(customer, items, 1)).toBe(145);
    });
    it("should apply loyalty discount for customers with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // policy base = 100G; loyalty discount = 20% of 100G (-20G); first insurance = 10% of 100G (+10G); fee = 5G
      expect(quote(customer, items, 1)).toBe(95);
    });
    it("should apply first-insurance surcharge for a customer's first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // policy base = 100G; first insurance = 10% of 100G (10G); fee = 5G
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should apply follow-up discount for subsequent contracts", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // policy base = 100G; first insurance = +10G (always); follow-up discount = -15G; fee = 5G → 100G
      expect(quote(customer, items, 2)).toBe(100);
    });
    it("should round premiums up in MHPCO's favor", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: "rune" }];
      // policy base = 25G; first insurance = 10% of 25G = 2.5G (fractional); fee = 5G → 32.5G → ceil = 33G
      expect(quote(customer, items, 1)).toBe(33);
    });
  });

  describe("claim", () => {
    it("should deduct 100 G per damage event", () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
      const result = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      // payout = 500 - 100 deductible = 400G; cap = 2×1000 = 2000G; remainingCap = 2000 - 400 = 1600G
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should fully reimburse dragon-material items minus deductible", () => {
          const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
          const result = processClaim(policy, {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          });
          // dragon material: full reimbursement, then deductible: 800 - 100 = 700G; cap = 2000 - 700 = 1300G
          expect(result.payout).toBe(700);
          expect(result.remainingCap).toBe(1300);
        });
    it("should reimburse high-enchantment items (>= 8) at 50% minus deductible", () => {
          const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
          const result = processClaim(policy, {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          });
          // high enchantment >= 8: 50% first, then deductible: 1000 * 0.5 - 100 = 400G; cap = 2000 - 400 = 1600G
          expect(result.payout).toBe(400);
          expect(result.remainingCap).toBe(1600);
        });
    it("should cap total payout at twice the insurance sum", () => {
          const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
          // cap = 2000G; damage 2200G → raw payout 2100G → capped at 2000G; remainingCap = 0G
          const result = processClaim(policy, {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 2200 }],
          });
          expect(result.payout).toBe(2000);
          expect(result.remainingCap).toBe(0);
        });
    it("should track remaining cap across successive claims", () => {
          const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
          // first claim: 1500G damage → payout 1400G (1500-100), remainingCap 600G
          const result1 = processClaim(policy, {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          });
          expect(result1.payout).toBe(1400);
          expect(result1.remainingCap).toBe(600);
          // second claim: 1500G damage → desired payout 1400G, but capped at remainingCap 600G
          const result2 = processClaim(
            { ...policy, remainingCap: result1.remainingCap },
            { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
          );
          expect(result2.payout).toBe(600);
          expect(result2.remainingCap).toBe(0);
        });
  });
});
