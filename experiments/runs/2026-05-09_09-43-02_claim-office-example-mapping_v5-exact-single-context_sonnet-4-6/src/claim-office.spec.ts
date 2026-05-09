import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5G for empty item list (processing fee only)", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [])).toBe(5);
    });
    it("should return correct premium for a single sword (new customer)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(115);
    });
    it("should return correct premium for a single amulet (new customer)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(71);
    });
    it("should return correct premium for a single staff (new customer)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(93);
    });
    it("should return correct premium for a single potion (new customer)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion", material: "liquid", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(49);
    });
    it("should apply 50% cursed surcharge to the affected item's base premium only", () => {
      const customer = { yearsWithMHPCO: 0 };
      // cursed sword (100G base) + plain amulet (60G base)
      // policy base = 160G; cursed surcharge = 50% of 100G = 50G (not 50% of 160G)
      // first insurance = 10% of 160G = 16G; fee = 5G
      // total = 160 + 50 + 16 + 5 = 231G
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items)).toBe(231);
    });
    it("should apply 30% high-enchantment surcharge when enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      // sword enchantment 5: base 100G + 30G high-enchantment + 10G first insurance + 5G fee = 145G
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items)).toBe(145);
    });
    it("should not apply high-enchantment surcharge when enchantment level < 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      // sword enchantment 4 (< 5): no high-enchantment surcharge → same as plain sword
      const items = [{ type: "sword", material: "steel", enchantment: 4, cursed: false }];
      expect(quote(customer, items)).toBe(115);
    });
    it("should apply 20% loyalty discount for customers with >= 2 years with MHPCO", () => {
      // 2 years: loyalty discount applies (-20% of policy base)
      // sword: policyBase=100, firstInsurance=+10, loyaltyDiscount=-20, fee=+5 → 95G
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items)).toBe(95);
    });
    it("should apply 15% follow-up contract discount for second quote", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // policyBase=100, firstInsurance=+10, followUpDiscount=-15, fee=+5 → 100G
      expect(quote(customer, items, { isFollowUp: true })).toBe(100);
    });
    it("should combine premiums for multiple items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      // policyBase = 160, firstInsuranceSurcharge = 16, fee = 5 → 181G
      expect(quote(customer, items)).toBe(181);
    });
    it("should charge 25G base premium for a single rune component", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }];
      // policyBase = 25, firstInsuranceSurcharge = 2.5, fee = 5 → 32.5 → rounds up to 33G
      expect(quote(customer, items)).toBe(33);
    });
    it("should apply block pricing of 60G for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      // block: 3 alike runes → policyBase 60G (not 75G); firstInsuranceSurcharge 6G, fee 5G → 71G
      expect(quote(customer, items)).toBe(71);
    });
    it("should not apply block pricing for 2 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      // 2 runes: no block pricing; policyBase 50G, firstInsuranceSurcharge 5G, fee 5G → 60G
      expect(quote(customer, items)).toBe(60);
    });
    it("should not apply block pricing for 4 alike components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      // 4 runes: no block pricing; policyBase 100G, firstInsuranceSurcharge 10G, fee 5G → 115G
      expect(quote(customer, items)).toBe(115);
    });
    it("should round premium up (in MHPCO's favor)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      // policyBase=50, followUpDiscount=50×3/20=7.5G, firstInsuranceSurcharge=5G, fee=5G → 52.5 → rounds up to 53G
      expect(quote(customer, items, { isFollowUp: true })).toBe(53);
    });
  });

  describe("claim", () => {
    it("should reimburse full damage minus 100G deductible for standard item", () => {
      const policy = { items: [{ type: "sword" }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      // standard item: full reimbursement minus 100G deductible per damage event
      // payout = 500 - 100 = 400G; remainingCap = 2000 - 400 = 1600G
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse 50% of damage minus deductible for enchantment >= 8 items", () => {
      const policy = { items: [{ type: "sword", enchantment: 8 }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 600 }] };
      // enchantment >= 8: reimburse at 50% of damage = 300G, minus 100G deductible = 200G
      // remainingCap = 2000 - 200 = 1800G
      expect(claim(policy, incident)).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should reimburse full damage minus deductible for dragon material items", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 0 }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 400 }] };
      // dragon material: full reimbursement (no 50% reduction), minus 100G deductible
      // payout = 400 - 100 = 300G; remainingCap = 2000 - 300 = 1700G
      expect(claim(policy, incident)).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should apply 50% reimbursement when both dragon material and enchantment >= 8", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8 }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      // dragon + enchantment >= 8: 50% rule wins → 50% of 1000 = 500, minus 100 deductible = 400G
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should cap payout at remaining policy cap", () => {
      const policy = { items: [{ type: "sword" }], remainingCap: 600 };
      const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
      // full reimbursement: 1500 - 100 deductible = 1400G, but cap is 600G
      // payout = min(1400, 600) = 600G; remainingCap = 0G
      expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should track remaining cap after each claim", () => {
      let policy = { items: [{ type: "sword" }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
      // first claim: 1500 - 100 deductible = 1400G payout, cap = 2000 - 1400 = 600G
      const result1 = claim(policy, incident);
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: uncapped = 1400G but cap = 600G → payout = 600G, remainingCap = 0G
      policy = { ...policy, remainingCap: result1.remainingCap };
      const result2 = claim(policy, incident);
      expect(result2).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should round payout down (in MHPCO's favor)", () => {
      const policy = { items: [{ type: "sword", enchantment: 8 }], remainingCap: 2000 };
      const incident = { damages: [{ itemType: "sword", amount: 701 }] };
      // enchantment >= 8: 50% → 701/2 = 350.5G; 350.5 - 100 deductible = 250.5G → rounds down to 250G
      expect(claim(policy, incident)).toEqual({ payout: 250, remainingCap: 1750 });
    });
  });
});
