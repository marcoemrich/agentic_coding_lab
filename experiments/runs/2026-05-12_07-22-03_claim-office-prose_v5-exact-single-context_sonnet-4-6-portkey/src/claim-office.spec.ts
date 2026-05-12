import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return base premium plus processing fee for a single sword (new customer, first insurance)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // sword base = 100G, first insurance +10% = 110G, fee +5G = 115G
      expect(quote(items, customer, 1)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      // amulet base = 60G, first insurance +10% = 66G, fee +5G = 71G
      expect(quote(items, customer, 1)).toBe(71);
    });
    it("should return base premium plus processing fee for a single staff", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 1, cursed: false }];
      // staff base = 80G, first insurance +10% = 88G, fee +5G = 93G
      expect(quote(items, customer, 1)).toBe(93);
    });
    it("should return base premium plus processing fee for a single potion", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      // potion base = 40G, first insurance +10% = 44G, fee +5G = 49G
      expect(quote(items, customer, 1)).toBe(49);
    });
    it("should apply 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      // sword base = 100G, first insurance +10% = +10G, cursed +50% = +50G → 160G, fee +5G = 165G
      expect(quote(items, customer, 1)).toBe(165);
    });
    it("should apply 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // sword base = 100G, first insurance +10% = +10G, high enchantment +30% = +30G, fee +5G = 145G
      expect(quote(items, customer, 1)).toBe(145);
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const customer = { yearsWithMHPCO: 5 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // sword base = 100G, first insurance +10% = +10G, loyalty -20% = -20G → 90G, fee +5G = 95G
      expect(quote(items, customer, 1)).toBe(95);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      // Verify: contractNumber=2 does NOT get the first-insurance surcharge
      // (and does get the 15% repeat-contract discount, per spec)
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      // sword base = 100G, no first-insurance surcharge, repeat -15% = -15G → 85G, fee +5G = 90G
      expect(quote(items, customer, 2)).toBe(90);
    });
    it("should apply 15% discount on contracts after the first", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      // amulet base = 60G, no first-insurance surcharge, repeat -15% = -9G → 51G, fee +5G = 56G
      expect(quote(items, customer, 2)).toBe(56);
    });
    it("should price a single component at 25 G with processing fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune", material: "stone", enchantment: 0, cursed: false }];
      // component base = 25G, first insurance +10% = ceil(2.5) = +3G, fee +5G = 33G
      expect(quote(items, customer, 1)).toBe(33);
    });
    it("should price a group of 3 identical components at 60 G base premium", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      // 3 identical runes → group base = 60G, first insurance +10% = +6G, fee +5G = 71G
      expect(quote(items, customer, 1)).toBe(71);
    });
    it("should round premium up to whole G in MHPCO's favor", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune", material: "stone", enchantment: 0, cursed: true }];
      // rune base = 25G, cursed +50% = ceil(12.5) = +13G (not 12), first insurance +10% = ceil(2.5) = +3G (not 2), fee +5G = 46G
      expect(quote(items, customer, 1)).toBe(46);
    });
  });

  describe("claim", () => {
    it("should apply 100 G deductible per damage event", () => {
      const policy = {
        items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        insuranceSum: 600,
        remainingCap: 1200,
      };
      const incident = {
        cause: "fire",
        damages: [{ itemType: "amulet", material: "silver", enchantment: 2, amount: 200 }],
      };
      // damage 200G - deductible 100G = payout 100G; remainingCap 1200 - 100 = 1100G
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = {
        items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        insuranceSum: 600,
        remainingCap: 1200,
      };
      const incident = {
        cause: "flood",
        damages: [{ itemType: "amulet", material: "silver", enchantment: 2, amount: 1500 }],
      };
      // damage 1500G - deductible 100G = 1400G, but cap is 1200G → payout = 1200G, remainingCap = 0G
      expect(claim(policy, incident)).toEqual({ payout: 1200, remainingCap: 0 });
    });
    it("should reimburse high-enchantment items (enchantment >= 8) at 50%", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = {
        cause: "battle",
        damages: [{ itemType: "sword", material: "steel", enchantment: 9, amount: 400 }],
      };
      // high enchantment (>=8): 400G * 50% = 200G reimbursable, minus 100G deductible = 100G payout
      // remainingCap: 2000 - 100 = 1900G
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse dragon material items", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = {
        cause: "magic",
        damages: [{ itemType: "sword", material: "dragon", enchantment: 9, amount: 400 }],
      };
      // dragon material: fully reimbursed (100%), overrides high-enchantment 50% reduction
      // 400G * 100% = 400G reimbursable, minus 100G deductible = 300G payout; remainingCap = 2000 - 300 = 1700G
      expect(claim(policy, incident)).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const policy = {
        items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        insuranceSum: 600,
        remainingCap: 1200,
      };
      // First claim: damage 200G - 100G deductible = 100G payout; remainingCap 1200 → 1100
      const firstResult = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", material: "silver", enchantment: 2, amount: 200 }],
      }) as { payout: number; remainingCap: number };
      expect(firstResult).toEqual({ payout: 100, remainingCap: 1100 });

      // Second claim uses updated remainingCap from first result: damage 300G - 100G = 200G payout; remainingCap 1100 → 900
      const secondResult = claim(
        { ...policy, remainingCap: firstResult.remainingCap },
        {
          cause: "flood",
          damages: [{ itemType: "amulet", material: "silver", enchantment: 2, amount: 300 }],
        },
      );
      expect(secondResult).toEqual({ payout: 200, remainingCap: 900 });
    });
  });
});
