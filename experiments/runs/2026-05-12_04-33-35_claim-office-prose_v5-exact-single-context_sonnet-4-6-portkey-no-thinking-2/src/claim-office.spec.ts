import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100G, first insurance +10% = 110G, +5G processing fee = 115G
      expect(quote(customer, items)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      // amulet base 60G, first insurance +10% = 66G, +5G processing fee = 71G
      expect(quote(customer, items)).toBe(71);
    });
    it("should add 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      // sword base 100G, cursed +50% = 150G, first insurance +10% = 165G, +5G fee = 170G
      expect(quote(customer, items)).toBe(170);
    });
    it("should add 30% surcharge for an item with enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // sword base 100G, enchantment >=5 +30% = 130G, first insurance +10% = 143G, +5G fee = 148G
      expect(quote(customer, items)).toBe(148);
    });
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2, priorContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100G, first insurance +10% = 110G, loyalty -20% = 88G, +5G fee = 93G
      expect(quote(customer, items)).toBe(93);
    });
    it("should add 10% surcharge for first insurance (0 prior contracts)", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100G, first insurance +10% = 110G, +5G fee = 115G
      expect(quote(customer, items)).toBe(115);
    });
    it("should apply 15% discount for subsequent contracts (>= 1 prior contract)", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100G, subsequent -15% = 85G, no first insurance surcharge, +5G fee = 90G
      expect(quote(customer, items)).toBe(90);
    });
    it("should sum premiums for multiple items", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      // sword base 100G + amulet base 60G = 160G total base
      // first insurance +10% = 176G, +5G fee = 181G
      expect(quote(customer, items)).toBe(181);
    });
    it("should apply bundle discount for 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0, priorContracts: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      // 3 alike runes: bundle base 60G, first insurance +10% = 66G, +5G fee = 71G
      expect(quote(customer, items)).toBe(71);
    });
  });

  describe("claim", () => {
    it("should deduct 100G deductible from damage amount", () => {
      // amulet: insurance value 600G, cap = 2 × 600 = 1200G
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ amount: 200, enchantment: 0, material: "silver" }] };
      // damage 200G - deductible 100G = 100G payout, remainingCap = 1200 - 100 = 1100G
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should reimburse 50% for items with enchantment level >= 8", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ amount: 300, enchantment: 8, material: "silver" }] };
      // enchantment >= 8: effective damage = 300 * 50% = 150G, deductible 100G, payout = 50G
      // remainingCap = 1200 - 50 = 1150G
      expect(claim(policy, incident)).toEqual({ payout: 50, remainingCap: 1150 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident = { damages: [{ amount: 200, enchantment: 8, material: "dragon" }] };
      // dragon material: full reimbursement overrides enchantment reduction
      // effective damage = 200G (no 50% reduction), deductible 100G, payout = 100G
      // remainingCap = 1200 - 100 = 1100G
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = { insuranceSum: 600, remainingCap: 80 };
      const incident = { damages: [{ amount: 300, enchantment: 0, material: "silver" }] };
      // would-be payout = 300 - 100 = 200G, but remainingCap only 80G
      // actual payout = 80G, remainingCap after = 0G
      expect(claim(policy, incident)).toEqual({ payout: 80, remainingCap: 0 });
    });
    it("should track remaining cap across multiple claims", () => {
      const policy = { insuranceSum: 600, remainingCap: 1200 };
      const incident1 = { damages: [{ amount: 200, enchantment: 0, material: "silver" }] };
      // first claim: damage 200 - deductible 100 = 100G payout, remainingCap = 1200 - 100 = 1100G
      const result1 = claim(policy, incident1);
      expect(result1).toEqual({ payout: 100, remainingCap: 1100 });

      const policy2 = { insuranceSum: 600, remainingCap: result1.remainingCap };
      const incident2 = { damages: [{ amount: 300, enchantment: 0, material: "silver" }] };
      // second claim: damage 300 - deductible 100 = 200G payout, remainingCap = 1100 - 200 = 900G
      const result2 = claim(policy2, incident2);
      expect(result2).toEqual({ payout: 200, remainingCap: 900 });
    });
  });
});
