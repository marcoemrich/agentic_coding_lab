import { describe, it, expect } from "vitest";
import { calculatePremium, processClaim, createPolicy } from "./mhpco.js";
import { Item, Customer } from "./types.js";

describe("MHPCO Policy System", () => {
  describe("calculatePremium", () => {
    it("should calculate basic premium for a single sword", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 100, First: *1.1 = 110, Processing: +5 = 115, ceil = 116
      expect(premium).toBe(116);
    });

    it("should apply cursed items surcharge", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 100, Cursed: +50% = 150, First: *1.1 = 165, Processing: +5 = 170
      expect(premium).toBe(170);
    });

    it("should apply enchantment surcharge for level >= 5", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 100, Enchanted: +30% = 130, First: *1.1 = 143, Processing: +5 = 148
      expect(premium).toBe(148);
    });

    it("should apply loyalty discount for customers with >= 2 years", () => {
      const customer: Customer = { yearsWithMHPCO: 2 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 100, First: *1.1 = 110, Loyalty: *0.8 = 88, Processing: +5 = 93, ceil = 94
      expect(premium).toBe(94);
    });

    it("should apply subsequent contract discount", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];

      const premium = calculatePremium(items, customer, false);
      // Base: 100, Subsequent: *0.85 = 85, Processing: +5 = 90, ceil = 90
      expect(premium).toBe(90);
    });

    it("should handle amulet items", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 60, First: *1.1 = 66, Processing: +5 = 71
      expect(premium).toBe(71);
    });

    it("should handle staff items", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "staff", material: "oak", enchantment: 1, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 80, First: *1.1 = 88, Processing: +5 = 93
      expect(premium).toBe(93);
    });

    it("should handle component items (rune)", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 25, First: *1.1 = 27.5, Processing: +5 = 32.5, ceil = 33
      expect(premium).toBe(33);
    });

    it("should apply bundle discount for 3 components", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 60 (bundle), First: *1.1 = 66, Processing: +5 = 71
      expect(premium).toBe(71);
    });

    it("should handle 4 components (3 bundle + 1 individual)", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 60 (bundle) + 25 = 85, First: *1.1 = 93.5, Processing: +5 = 98.5, ceil = 99
      expect(premium).toBe(99);
    });

    it("should combine cursed and enchanted surcharges", () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 6, cursed: true },
      ];

      const premium = calculatePremium(items, customer, true);
      // Base: 100, Cursed: +50% = 50, Enchanted: +30% = 30, Total: 180
      // First: *1.1 = 198, Processing: +5 = 203, ceil = 204
      expect(premium).toBe(204);
    });
  });

  describe("processClaim", () => {
    it("should calculate payout with deductible", () => {
      const items: Item[] = [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      const policy = createPolicy(items);

      const result = processClaim(policy, [
        { itemType: "amulet", amount: 200 },
      ]);

      // Damage: 200, Deductible: 100, Payout: 100
      // Insurance sum: 600, Cap: 1200, Remaining: 1100
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1100);
    });

    it("should apply 50% reimbursement for enchantment >= 8", () => {
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 8, cursed: false },
      ];
      const policy = createPolicy(items);

      const result = processClaim(policy, [
        { itemType: "sword", amount: 400 },
      ]);

      // Damage: 400, 50% reimbursement: 200, Deductible: 100, Payout: 100
      // Insurance sum: 1000, Cap: 2000, Remaining: 1900
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1900);
    });

    it("should apply full reimbursement for dragon material", () => {
      const items: Item[] = [
        { type: "sword", material: "dragon", enchantment: 3, cursed: false },
      ];
      const policy = createPolicy(items);

      const result = processClaim(policy, [
        { itemType: "sword", amount: 400 },
      ]);

      // Damage: 400 (dragon), Deductible: 100, Payout: 300
      // Insurance sum: 1000, Cap: 2000, Remaining: 1700
      expect(result.payout).toBe(300);
      expect(result.remainingCap).toBe(1700);
    });

    it("should handle multiple damage items in one claim", () => {
      const items: Item[] = [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const policy = createPolicy(items);

      const result = processClaim(policy, [
        { itemType: "amulet", amount: 200 },
        { itemType: "sword", amount: 300 },
      ]);

      // Damage: 200 + 300 = 500, Deductible: 100, Payout: 400
      // Insurance sum: 600 + 1000 = 1600, Cap: 3200, Remaining: 2800
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(2800);
    });

    it("should cap payout at remaining cap", () => {
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const policy = createPolicy(items);
      policy.remainingCap = 100; // Manually set to test capping

      const result = processClaim(policy, [
        { itemType: "sword", amount: 500 },
      ]);

      // Damage: 500, Deductible: 100, Would be 400, but capped at 100
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(0);
    });

    it("should return 0 payout when damage is less than deductible", () => {
      const items: Item[] = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const policy = createPolicy(items);

      const result = processClaim(policy, [
        { itemType: "sword", amount: 50 },
      ]);

      // Damage: 50, Deductible: 100, Payout: 0
      // Cap: 2000, Remaining: 2000
      expect(result.payout).toBe(0);
      expect(result.remainingCap).toBe(2000);
    });

    it("should handle sequential claims on same policy", () => {
      const items: Item[] = [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      const policy = createPolicy(items);

      // First claim
      const result1 = processClaim(policy, [
        { itemType: "amulet", amount: 200 },
      ]);
      expect(result1.payout).toBe(100);
      policy.remainingCap = result1.remainingCap;

      // Second claim
      const result2 = processClaim(policy, [
        { itemType: "amulet", amount: 250 },
      ]);
      expect(result2.payout).toBe(150);
      expect(result2.remainingCap).toBe(950);
    });
  });
});
