import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    // --- Empty / single item ---
    it("should return 5 G for an empty item list (processing fee only)", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      expect(quote(customer, [])).toBe(5);
    });
    it("should return base premium plus fee for a single sword", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
      expect(quote(customer, [sword])).toBe(115);
    });
    it("should return base premium plus fee for a single amulet", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const amulet = { type: "amulet", material: "silver", enchantment: 0, cursed: false };
      expect(quote(customer, [amulet])).toBe(71);
    });
    it("should return base premium plus fee for a single staff", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const staff = { type: "staff", material: "wood", enchantment: 0, cursed: false };
      expect(quote(customer, [staff])).toBe(93);
    });
    it("should return base premium plus fee for a single potion", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const potion = { type: "potion", material: "glass", enchantment: 0, cursed: false };
      expect(quote(customer, [potion])).toBe(49);
    });

    // --- Components ---
    it("should return 25 G base premium per component for 2 runes", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const rune1 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune2 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      expect(quote(customer, [rune1, rune2])).toBe(60);
    });
    it("should return 60 G base premium for a building block of exactly 3 alike components", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const rune1 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune2 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune3 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      expect(quote(customer, [rune1, rune2, rune3])).toBe(71);
    });
    it("should return 25 G per component with no block discount for 4 alike components", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const rune1 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune2 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune3 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune4 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      expect(quote(customer, [rune1, rune2, rune3, rune4])).toBe(115);
    });
    it("should return separate block premiums for 3 runes and 3 moonstones", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const rune1 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune2 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune3 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const moon1 = { type: "moonstone", material: "stone", enchantment: 0, cursed: false };
      const moon2 = { type: "moonstone", material: "stone", enchantment: 0, cursed: false };
      const moon3 = { type: "moonstone", material: "stone", enchantment: 0, cursed: false };
      expect(quote(customer, [rune1, rune2, rune3, moon1, moon2, moon3])).toBe(137);
    });
    it("should not apply block discount for 2 runes and 1 moonstone (different types)", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const rune1 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const rune2 = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const moon1 = { type: "moonstone", material: "stone", enchantment: 0, cursed: false };
      expect(quote(customer, [rune1, rune2, moon1])).toBe(88);
    });

    // --- Item-specific modifiers ---
    it("should add 50% cursed surcharge to the cursed item base premium only", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const cursedSword = { type: "sword", material: "steel", enchantment: 0, cursed: true };
      expect(quote(customer, [cursedSword])).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for enchantment level 5 or above", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
      expect(quote(customer, [sword])).toBe(145);
    });
    it("should not add high-enchantment surcharge for enchantment level 4", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
      expect(quote(customer, [sword])).toBe(115);
    });
    it("should apply both cursed and high-enchantment surcharges to the same item", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const cursedEnchantedSword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
      expect(quote(customer, [cursedEnchantedSword])).toBe(195);
    });

    // --- Policy-wide modifiers ---
    it("should apply 20% loyalty discount for customers with 2 or more years", () => {
      const customer = { yearsAsCustomer: 2, quoteCount: 0 };
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
      expect(quote(customer, [sword])).toBe(95);
    });
    it("should apply 10% first-insurance surcharge on every quote", () => {
      const customer = { yearsAsCustomer: 3, quoteCount: 0 };
      const potion = { type: "potion", material: "glass", enchantment: 0, cursed: false };
      // 40 (base) + 4 (first insurance 10%) - 8 (loyalty 20%) + 5 (fee) = 41
      expect(quote(customer, [potion])).toBe(41);
    });
    it("should apply 15% follow-up discount on the second and subsequent quotes", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 1 };
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
      // 100 base + 10 (first insurance 10%) - 15 (follow-up 15% on base 100) + 5 fee = 100
      expect(quote(customer, [sword])).toBe(100);
    });

    // --- Multi-item policies ---
    it("should sum base premiums of multiple different items before applying policy-wide modifiers", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
      const amulet = { type: "amulet", material: "silver", enchantment: 0, cursed: false };
      expect(quote(customer, [sword, amulet])).toBe(181);
    });
    it("should apply item-specific surcharges only to the affected item in a multi-item policy", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const cursedSword = { type: "sword", material: "steel", enchantment: 0, cursed: true };
      const plainAmulet = { type: "amulet", material: "silver", enchantment: 0, cursed: false };
      // base: 100 + 60 = 160; cursed surcharge on sword only: 50; first insurance: 16; fee: 5
      // total: 160 + 50 + 16 + 5 = 231
      expect(quote(customer, [cursedSword, plainAmulet])).toBe(231);
    });

    // --- Integration examples from spec ---
    it("should return 165 G for a newcomer with a cursed sword", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(quote(customer, [cursedSword])).toBe(165);
    });
    it("should return 160 G for a long-standing customer's second contract with a cursed enchanted sword", () => {
      const customer = { yearsAsCustomer: 3, quoteCount: 1 };
      const cursedEnchantedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      expect(quote(customer, [cursedEnchantedSword])).toBe(160);
    });

    // --- Rounding ---
    it("should round premiums up in MHPCO's favor", () => {
      const customer = { yearsAsCustomer: 0, quoteCount: 0 };
      const runes = Array.from({ length: 7 }, () => ({
        type: "rune",
        material: "stone",
        enchantment: 0,
        cursed: false,
      }));
      // 7 runes: 7 x 25 = 175 base; first insurance 10% = 17.5; fee = 5
      // total = 175 + 17.5 + 5 = 197.5 → ceil = 198
      expect(quote(customer, runes)).toBe(198);
    });
  });

  describe("claim", () => {
    // --- Standard reimbursement ---
    it("should reimburse damage minus 100 G deductible for a regular item", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    // --- Dragon material ---
    it("should fully reimburse damage to dragon-material items minus deductible when enchantment is below 8", () => {
      const items = [
        { type: "sword", material: "dragon", enchantment: 5, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 800 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });

    // --- High enchantment ---
    it("should reimburse at 50% of damage amount minus deductible for enchantment 8 or above", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    // --- Both clauses ---
    it("should apply 50% rule when both dragon-material and enchantment >= 8 apply", () => {
      const items = [
        { type: "sword", material: "dragon", enchantment: 9, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    // --- Deductible per item ---
    it("should apply 100 G deductible per damaged item independently", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });

    // --- Cap ---
    it("should cap total payout at twice the insurance sum", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 2500 }] };
      const result = claim(items, incident);
      expect(result).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const firstIncident = { damages: [{ itemType: "sword", amount: 1500 }] };
      const firstResult = claim(items, firstIncident);
      expect(firstResult).toEqual({ payout: 1400, remainingCap: 600 });

      const secondIncident = { damages: [{ itemType: "sword", amount: 1500 }] };
      const secondResult = claim(items, secondIncident, firstResult.payout);
      expect(secondResult).toEqual({ payout: 600, remainingCap: 0 });
    });

    // --- Rounding ---
    it("should round payouts down in MHPCO's favor", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ];
      const incident = { damages: [{ itemType: "sword", amount: 501 }] };
      const result = claim(items, incident);
      // 501 * 0.5 = 250.5 (high enchantment), minus 100 deductible = 150.5, floor = 150
      expect(result).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });
});
