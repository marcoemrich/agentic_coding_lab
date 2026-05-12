import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G processing fee for an empty item list", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [], 0)).toBe(5);
    });
    it("should return base premium plus processing fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(71);
    });
    it("should return base premium plus processing fee for a single staff", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(93);
    });
    it("should return base premium plus processing fee for a single potion", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(49);
    });
    it("should return base premium plus processing fee for a single component (rune)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }];
      expect(quote(customer, items, 0)).toBe(33);
    });
    it("should return combined base premiums plus processing fee for multiple different items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(181);
    });
    it("should apply block discount for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, 0)).toBe(71);
    });
    it("should NOT apply block discount for 2 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, 0)).toBe(60);
    });
    it("should NOT apply block discount for 4 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should apply cursed surcharge (50%) to the cursed item's base premium only", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      expect(quote(customer, items, 0)).toBe(165);
    });
    it("should apply high-enchantment surcharge (30%) for enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, 0)).toBe(145);
    });
    it("should apply loyalty discount (20%) for customer with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(95);
    });
    it("should apply first-insurance surcharge (10%) to every quote", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should apply follow-up contract discount (15%) for second or later quote", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 1)).toBe(100);
    });
    it("should round premium up in MHPCO's favor", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "rune" }];
      expect(quote(customer, items, 0)).toBe(28);
    });
  });

  describe("claim", () => {
    it("should return payout minus 100 G deductible for standard damage", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return 50% of damage minus deductible for high-enchantment item (>= 8)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] };
      const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return full damage minus deductible for dragon-material item", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% rule when both high-enchantment and dragon-material apply", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] };
      const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply deductible per damaged item in a multi-item event", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      };
      const incident = {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      expect(claim(policy, incident, 3200)).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should track remaining cap after a claim", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("should cap payout at remaining cap when cap is exhausted", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] };
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
      expect(claim(policy, incident, 600)).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should round payout down in MHPCO's favor", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] };
      const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 1001 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });
});
