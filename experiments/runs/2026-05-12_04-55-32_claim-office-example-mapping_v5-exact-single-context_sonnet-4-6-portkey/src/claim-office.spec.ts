import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const customer = { yearsWithMHPCO: 0 };
      const result = quote(customer, []);
      expect(result).toBe(5);
    });
    it("returns base premium plus first insurance surcharge plus processing fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const result = quote(customer, items);
      expect(result).toBe(115); // 100 base + 10 first-insurance + 5 fee
    });
    it("returns correct base premium for each main item type (amulet, staff, potion)", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);  // 60 + 6 + 5
      expect(quote(customer, [{ type: "staff", material: "wood", enchantment: 0, cursed: false }])).toBe(93);    // 80 + 8 + 5
      expect(quote(customer, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);  // 40 + 4 + 5
    });
    it("applies 50% cursed surcharge to the affected item's base premium only", () => {
      const customer = { yearsWithMHPCO: 0 };
      // cursed sword: 100 base + 50 curse (50% of 100) + 10 first-ins (10% of 100 base) + 5 fee = 165
      const result = quote(customer, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }]);
      expect(result).toBe(165);
    });
    it("applies 30% high-enchantment surcharge to items with enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      // enchantment 5: 100 base + 30 high-enchant (30% of 100) + 10 first-ins + 5 fee = 145
      const highEnchant = quote(customer, [{ type: "sword", material: "steel", enchantment: 5, cursed: false }]);
      expect(highEnchant).toBe(145);
      // enchantment 4: no surcharge → 115
      const normalEnchant = quote(customer, [{ type: "sword", material: "steel", enchantment: 4, cursed: false }]);
      expect(normalEnchant).toBe(115);
    });
    it("applies 20% loyalty discount to the policy base premium for customers with >= 2 years", () => {
      // exactly 2 years → loyalty discount applies
      const loyalCustomer = { yearsWithMHPCO: 2 };
      // plain sword: 100 base + 10 first-ins (10% of 100) - 20 loyalty (20% of 100) + 5 fee = 95
      expect(quote(loyalCustomer, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(95);
      // 1 year → no discount → 115
      const newCustomer = { yearsWithMHPCO: 1 };
      expect(quote(newCustomer, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
    });
    it("applies 15% follow-up contract discount to the policy base premium on subsequent quotes", () => {
      const customer = { yearsWithMHPCO: 0 };
      const sword = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // first contract (0 previous): 100 + 10 first-ins + 5 fee = 115; no follow-up discount
      expect(quote(customer, sword, 0)).toBe(115);
      // second contract (1 previous): 100 + 10 first-ins - 15 follow-up (15% of 100) + 5 fee = 100
      expect(quote(customer, sword, 1)).toBe(100);
    });
    it("charges 25G base premium per component (rune or moonstone)", () => {
      const customer = { yearsWithMHPCO: 0 };
      // single rune: 25 base + 2.5 first-ins (10% of 25) + 5 fee = 32.5 → 33G (rounded up, MHPCO's favor)
      expect(quote(customer, [{ type: "rune", cursed: false, enchantment: 0 }])).toBe(33);
      // single moonstone: same calculation → 33G
      expect(quote(customer, [{ type: "moonstone", cursed: false, enchantment: 0 }])).toBe(33);
    });
    it("applies block pricing of 60G for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const rune = { type: "rune", cursed: false, enchantment: 0 };
      // exactly 3 runes → block base 60G + 6G first-ins (10% of 60) + 5G fee = 71G
      expect(quote(customer, [rune, rune, rune])).toBe(71);
      // 2 runes → no block: 50G base + 5G first-ins (10% of 50) + 5G fee = 60G
      expect(quote(customer, [rune, rune])).toBe(60);
    });
  });

  describe("claim", () => {
    it("subtracts 100G deductible from damage amount for a standard item", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 3, material: "steel" }],
        insuranceSum: 1000,
        cap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      // standard sword, damage 500G → payout 400G (500 - 100 deductible), cap 2000 - 400 = 1600G
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses 50% of damage for items with enchantment level >= 8, then subtracts deductible", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 8, material: "steel" }],
        insuranceSum: 1000,
        cap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 600 }] };
      // enchantment 8 → 50% reimbursement: 600 * 0.5 = 300, then deductible: 300 - 100 = 200
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("fully reimburses damage to dragon-material items, then subtracts deductible", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 5, material: "dragon" }],
        insuranceSum: 1000,
        cap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 800 }] };
      // dragon material, enchantment 5 < 8 → full reimbursement: 800 - 100 = 700
      expect(claim(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("caps total payout at twice the policy insurance sum", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 3, material: "steel" }],
        insuranceSum: 1000,
        cap: 600, // remaining cap after a prior claim
      };
      const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
      // desired payout: 1500 - 100 = 1400, but remaining cap is 600 → capped at 600; remainingCap = 0
      expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
    });
  });
});
