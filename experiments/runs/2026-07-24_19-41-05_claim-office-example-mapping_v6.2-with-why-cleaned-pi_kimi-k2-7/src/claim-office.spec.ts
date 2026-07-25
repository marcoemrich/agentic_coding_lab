import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G for empty item list -- edge case", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items: any[] = [];
      expect(quote(customer, items)).toBe(5);
    });
    it("should return 105 G for a single plain sword -- base premium + fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword" }];
      expect(quote(customer, items)).toBe(105);
    });
    it("should return 55 G for 2 runes -- 50 base premium + 5 fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      expect(quote(customer, items)).toBe(55);
    });
    it("should return 65 G for 3 runes -- 60 block premium + 5 fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items)).toBe(65);
    });
    it("should return 105 G for 4 runes -- 100 base + 5 fee, no block", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ];
      expect(quote(customer, items)).toBe(105);
    });
    it("should return 180 G for 7 runes -- 175 base + 5 fee (two blocks + one extra)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = Array(7).fill({ type: "rune" });
      expect(quote(customer, items)).toBe(180);
    });
    it("should return 80 G for 2 runes + 1 moonstone -- 75 base + 5 fee, different types no block", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
      expect(quote(customer, items)).toBe(80);
    });
    it("should return 125 G for 3 runes + 3 moonstones -- 120 base + 5 fee (two blocks)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ];
      expect(quote(customer, items)).toBe(125);
    });
    it("should apply cursed surcharge to affected item only -- cursed sword + plain amulet -> 231 G total with first insurance", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(231);
    });
    it("should return 165 G for newcomer with a cursed sword -- integration example", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ];
      expect(quote(customer, items, 0)).toBe(165);
    });
    it("should return 160 G for long-standing customer's second contract cursed enchanted sword -- integration example", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ];
      expect(quote(customer, items, 1)).toBe(160);
    });
    it("should apply high-enchantment surcharge for enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, 0)).toBe(145);
    });
    it("should not apply high-enchantment surcharge for enchantment 4", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 4, cursed: false }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should apply loyalty discount for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 0)).toBe(95);
    });
    it("should apply first insurance surcharge for first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should apply follow-up contract discount after first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      expect(quote(customer, items, 1)).toBe(100);
    });
    it("should round premium up in MHPCO's favor -- 197.5 G -> 198 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = Array(7).fill({ type: "rune" });
      expect(quote(customer, items, 0)).toBe(198);
    });
    it("should throw for unknown item type in quote", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "broomstick" }];
      expect(() => quote(customer, items, 0)).toThrow();
    });
  });

  describe("claim", () => {
    it("should pay out 400 G for regular steel sword enchantment 3 damage 500 G -- standard reimbursement", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay out 100 G for rune damage 200 G -- standard reimbursement", () => {
      const policy = {
        items: [{ type: "rune" }],
        remainingCap: 500,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("should pay out 400 G for dragon-material sword enchantment 9 damage 1000 G -- 50% rule wins over dragon", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay out 700 G for dragon-material sword enchantment 5 damage 800 G -- only dragon clause applies", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 800 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should pay out 400 G for steel sword enchantment 9 damage 1000 G -- only high-enchantment clause applies", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply 100 G deductible per damaged item -- dragon attack on sword and amulet -> 600 G", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        remainingCap: 3200,
      };
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should treat multiple damages of same item type as separate events with separate deductibles", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ],
        remainingCap: 4000,
      };
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      };
      expect(claim(policy, incident)).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("should reject claim when damages exceed insured count of same type", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      };
      expect(() => claim(policy, incident)).toThrow();
    });
    it("should cap total payout at twice the insurance sum -- two successive claims", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const incident1 = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      const result1 = claim(policy, incident1);
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
      const policy2 = { ...policy, remainingCap: result1.remainingCap };
      const incident2 = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      expect(claim(policy2, incident2)).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should round payout down in MHPCO's favor -- 350.5 G -> 350 G", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 901 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 350, remainingCap: 1650 });
    });
    it("should reject claim for unknown item type in damages", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "broomstick", amount: 500 }],
      };
      expect(() => claim(policy, incident)).toThrow();
    });
    it("should reject claim for negative damage amount", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      };
      expect(() => claim(policy, incident)).toThrow();
    });
  });
});
