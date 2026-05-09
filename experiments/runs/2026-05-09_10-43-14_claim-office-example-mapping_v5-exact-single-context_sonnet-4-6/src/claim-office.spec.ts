import { describe, it, expect } from "vitest";
import { quote, claim, createPolicy } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G (processing fee only) for an empty item list", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote(customer, [])).toBe(5);
    });
    it("should return base premium plus processing fee for a single sword (new customer, first contract)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet (new customer, first contract)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(71);
    });
    it("should return combined base premiums plus processing fee for a sword and an amulet (new customer)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items)).toBe(181);
    });
    it("should apply cursed surcharge (50 %) to the affected item's base premium only", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      // base=100, cursed surcharge=50 (50% of item base), first-insurance=10 (10% of policy base 100), fee=5 → 165
      expect(quote(customer, items)).toBe(165);
    });
    it("should apply high-enchantment surcharge (30 %) for enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // base=100, high-enchantment surcharge=30 (30% of item base), first-insurance=10, fee=5 → 145
      expect(quote(customer, items)).toBe(145);
    });
    it("should apply loyalty discount (20 %) for customers with >= 2 years with MHPCO", () => {
      const customer = { yearsWithMHPCO: 2, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // base=100, first-insurance=10 (10% of policy base), loyalty=-20 (20% of policy base), fee=5 → 95
      expect(quote(customer, items)).toBe(95);
    });
    it("should apply follow-up contract discount (15 %) on the second quote", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // base=100, first-insurance=10, follow-up=-15 (15% of policy base), fee=5 → 100
      expect(quote(customer, items)).toBe(100);
    });
    it("should apply block pricing (60 G) for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      // 3 alike components = block pricing: base=60 G total, first-insurance=6, fee=5 → 71
      expect(quote(customer, items)).toBe(71);
    });
    it("should round the final premium up (in the MHPCO's favor)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "rune" }, { type: "rune" }];
      // base=50 (2×25), first-insurance=5, follow-up=7.5 → subtotal 47.5 + fee 5 = 52.5 → ceil → 53
      expect(quote(customer, items)).toBe(53);
    });
  });

  describe("claim", () => {
    it("should reimburse full damage minus the 100 G deductible for a standard item", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const policy = createPolicy(items);
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim(policy, incident) as { payout: number };
      expect(result.payout).toBe(400);
    });
    it("should apply a separate 100 G deductible per damaged item in the same incident", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const policy = createPolicy(items);
      const incident = {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      const result = claim(policy, incident) as { payout: number };
      expect(result.payout).toBe(600);
    });
    it("should reimburse at 50 % of damage for items with enchantment >= 8 (then deductible)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
      const policy = createPolicy(items);
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim(policy, incident) as { payout: number };
      // 1000 * 50% = 500, then 500 - 100 deductible = 400
      expect(result.payout).toBe(400);
    });
    it("should fully reimburse damage to dragon-material items (then deductible)", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
      const policy = createPolicy(items);
      const incident = { damages: [{ itemType: "sword", amount: 800 }] };
      const result = claim(policy, incident) as { payout: number };
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      expect(result.payout).toBe(700);
    });
    it("should apply the 50 % rule (not full reimbursement) when both clauses apply", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
      const policy = createPolicy(items);
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim(policy, incident) as { payout: number };
      // both clauses apply (dragon material + enchantment 9 >= 8); 50% rule wins
      // 1000 * 50% = 500, then 500 - 100 deductible = 400
      expect(result.payout).toBe(400);
    });
    it("should cap total payout at twice the insurance sum across successive claims", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const policy = createPolicy(items);
      const incident1 = { damages: [{ itemType: "sword", amount: 1500 }] };
      const result1 = claim(policy, incident1) as { payout: number; remainingCap: number };
      // 1500 - 100 deductible = 1400; cap = 2 * 1000 = 2000; remaining = 600
      expect(result1.payout).toBe(1400);
      expect(result1.remainingCap).toBe(600);
      const incident2 = { damages: [{ itemType: "sword", amount: 1500 }] };
      const result2 = claim(policy, incident2) as { payout: number; remainingCap: number };
      // desired 1400 but remainingCap is 600, so payout = 600, remainingCap = 0
      expect(result2.payout).toBe(600);
      expect(result2.remainingCap).toBe(0);
    });
    it("should round the final payout down (in the MHPCO's favor)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
      const policy = createPolicy(items);
      const incident = { damages: [{ itemType: "sword", amount: 901 }] };
      const result = claim(policy, incident) as { payout: number };
      // 901 * 50% = 450.5, then 450.5 - 100 deductible = 350.5 → floor → 350
      expect(result.payout).toBe(350);
    });
  });
});
