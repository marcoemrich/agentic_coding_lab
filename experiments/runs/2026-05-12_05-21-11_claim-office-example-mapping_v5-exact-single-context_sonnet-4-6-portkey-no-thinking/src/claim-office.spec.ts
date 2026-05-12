import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G processing fee for empty item list", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote(customer, [])).toBe(5);
    });
    it("should return base premium plus processing fee for a single sword", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100 + 10% first insurance 10 = 110 + 5 fee = 115
      expect(quote(customer, items)).toBe(115);
    });
    it("should return base premium plus processing fee for a single amulet", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      // amulet base 60 + 10% first insurance 6 = 66 + 5 fee = 71
      expect(quote(customer, items)).toBe(71);
    });
    it("should return base premium plus processing fee for a single staff", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "staff", material: "oak", enchantment: 0, cursed: false }];
      // staff base 80 + 10% first insurance 8 = 88 + 5 fee = 93
      expect(quote(customer, items)).toBe(93);
    });
    it("should return base premium plus processing fee for a single potion", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "potion", material: "liquid", enchantment: 0, cursed: false }];
      // potion base 40 + 10% first insurance 4 = 44 + 5 fee = 49
      expect(quote(customer, items)).toBe(49);
    });
    it("should return base premium plus processing fee for a single component (rune)", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }];
      // rune base 25 + 10% first insurance 2.5 = 27.5 + 5 fee = 32.5 → ceil = 33
      expect(quote(customer, items)).toBe(33);
    });
    it("should sum base premiums for multiple items", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      // sword 100 + amulet 60 = policyBase 160 + 10% first insurance 16 = 176 + 5 fee = 181
      expect(quote(customer, items)).toBe(181);
    });
    it("should apply block pricing for exactly 3 alike components", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      // block base 60 + 10% first insurance 6 = 66 + 5 fee = 71
      expect(quote(customer, items)).toBe(71);
    });
    it("should NOT apply block pricing for 2 alike components", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }, { type: "rune" }];
      // 2 runes base 50 + 10% first insurance 5 = 55 + 5 fee = 60
      expect(quote(customer, items)).toBe(60);
    });
    it("should NOT apply block pricing for 4 alike components", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      // 4 runes base 100 + 10% first insurance 10 = 110 + 5 fee = 115
      expect(quote(customer, items)).toBe(115);
    });
    it("should NOT apply block pricing for mixed component types", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
      // 2 runes + 1 moonstone base 75 + 10% first insurance 7.5 = 82.5 + 5 fee = 87.5 → ceil = 88
      expect(quote(customer, items)).toBe(88);
    });
    it("should apply cursed item surcharge (50%) to the cursed item's base premium only", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      // policyBase: sword 100 + amulet 60 = 160
      // cursed surcharge: 50% of sword base 100 = 50
      // first insurance: 10% of policyBase 160 = 16
      // total: 160 + 50 + 16 = 226 + 5 fee = 231
      expect(quote(customer, items)).toBe(231);
    });
    it("should apply high enchantment surcharge (30%) for enchantment level >= 5", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      // policyBase: sword 100; enchantment surcharge: 30; first insurance: 10
      // total: 100 + 30 + 10 = 140 + 5 fee = 145
      expect(quote(customer, items)).toBe(145);
    });
    it("should NOT apply high enchantment surcharge for enchantment level < 5", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 4, cursed: false }];
      // sword base 100 + 10% first insurance 10 = 110 + 5 fee = 115
      expect(quote(customer, items)).toBe(115);
    });
    it("should apply both cursed and high enchantment surcharges when applicable", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }];
      // policyBase: 100; cursed: 50; enchantment: 30; first insurance: 10
      // total: 100 + 50 + 30 + 10 = 190 + 5 fee = 195
      expect(quote(customer, items)).toBe(195);
    });
    it("should apply loyalty discount (20%) for customers with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 2, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // policyBase: 100; first insurance: +10; loyalty discount: -20
      // total: 100 + 10 - 20 = 90 + 5 fee = 95
      expect(quote(customer, items)).toBe(95);
    });
    it("should NOT apply loyalty discount for customers with < 2 years", () => {
      const customer = { yearsWithMHPCO: 1, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100 + 10% first insurance 10 = 110 + 5 fee = 115
      expect(quote(customer, items)).toBe(115);
    });
    it("should apply first insurance surcharge (10%) to all items in a quote", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // sword base 100 + 10% first insurance 10 = 110 + 5 fee = 115
      expect(quote(customer, items)).toBe(115);
    });
    it("should apply follow-up contract discount (15%) for subsequent quotes", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      // policyBase: 100; first insurance: +10; follow-up discount: -15
      // total: 100 + 10 - 15 = 95 + 5 fee = 100
      expect(quote(customer, items)).toBe(100);
    });
    it("should round final premium up in MHPCO's favor", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      const items = [{ type: "rune" }];
      // policyBase: 25; first insurance: +2.5; follow-up discount: -3.75
      // total: 23.75 + 5 fee = 28.75 → ceil = 29
      expect(quote(customer, items)).toBe(29);
    });
    it("should exit with non-zero status for unknown item type", () => {
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      const items = [{ type: "broomstick" }];
      expect(() => quote(customer, items)).toThrow();
    });
  });

  describe("claim", () => {
    it("should pay damage minus 100 G deductible for standard item", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should apply 100 G deductible per damage event for multiple items", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        remainingCap: 3200,
      };
      const incident = {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total payout: 600
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(2600);
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 8 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // enchantment >= 8: 50% of 500 = 250, then deductible: 250 - 100 = 150
      expect(result.payout).toBe(150);
      expect(result.remainingCap).toBe(1850);
    });
    it("should fully reimburse damage to dragon material items", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 3 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 800 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      expect(result.payout).toBe(700);
      expect(result.remainingCap).toBe(1300);
    });
    it("should apply 50% rule (not full) when both enchantment >= 8 and dragon material", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // both apply: 50% rule wins → 50% of 1000 = 500, then deductible: 500 - 100 = 400
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should cap total payout at twice the insurance sum across claims", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 0 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: 2500 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // uncapped payout would be 2500 - 100 = 2400, but cap is 2000
      expect(result.payout).toBe(2000);
      expect(result.remainingCap).toBe(0);
    });
    it("should track remaining cap after each claim", () => {
      // Second claim: remainingCap already reduced to 600 from prior claim
      const policy = {
        items: [{ type: "sword", enchantment: 0 }],
        remainingCap: 600,
      };
      const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
      const result = claim(policy, incident) as { payout: number; remainingCap: number };
      // uncapped payout would be 1500 - 100 = 1400, but remainingCap is 600
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });
    it("should exit with non-zero status for damage to item not in policy", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 0 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "amulet", amount: 300 }] };
      expect(() => claim(policy, incident)).toThrow();
    });
    it("should exit with non-zero status for negative damage amount", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 0 }],
        remainingCap: 2000,
      };
      const incident = { damages: [{ itemType: "sword", amount: -200 }] };
      expect(() => claim(policy, incident)).toThrow();
    });
    it("should exit with non-zero status when damage entries exceed insured items of that type", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 0 }], // ONE sword insured
        remainingCap: 2000,
      };
      const incident = {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 }, // TWO sword damages
        ],
      };
      expect(() => claim(policy, incident)).toThrow();
    });
  });
});
