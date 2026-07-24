import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return processing fee only for a single sword (base premium + fee)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword" }];
      // sword base: 100G, first-insurance +10% = 110G, processing fee +5G = 115G
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should compute base premium for amulet", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet" }];
      // amulet base: 60G, first-insurance +10% = 66G, processing fee +5G = 71G
      expect(quote(customer, items, 1)).toBe(71);
    });
    it("should compute base premium for staff", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff" }];
      // staff base: 80G, first-insurance +10% = 88G, processing fee +5G = 93G
      expect(quote(customer, items, 1)).toBe(93);
    });
    it("should compute base premium for potion", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion" }];
      // potion base: 40G, first-insurance +10% = 44G, processing fee +5G = 49G
      expect(quote(customer, items, 1)).toBe(49);
    });
    it("should compute base premium for a single component (rune)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }];
      // rune base: 25G, first-insurance +10% = 27.5G, processing fee +5G = 32.5G → ceil = 33G
      expect(quote(customer, items, 1)).toBe(33);
    });
    it("should apply bundle discount for 3 identical components", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      // 3 identical components → bundle base premium: 60G, first-insurance +10% = 66G, fee +5G = 71G
      expect(quote(customer, items, 1)).toBe(71);
    });
    it("should apply cursed surcharge of 50%", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", cursed: true }];
      // sword base: 100G, cursed +50% = 150G, first-insurance +10% = 165G, fee +5G = 170G
      expect(quote(customer, items, 1)).toBe(170);
    });
    it("should apply high enchantment surcharge of 30% for enchantment >= 5", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", enchantment: 5 }];
      // sword base: 100G, high enchantment +30% = 130G, first-insurance +10% = 143G, fee +5G = 148G
      expect(quote(customer, items, 1)).toBe(148);
    });
    it("should apply loyalty discount of 20% for customers with >= 2 years", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [{ type: "sword" }];
      // sword base: 100G, loyalty -20% = 80G, first-insurance +10% = 88G, fee +5G = 93G
      expect(quote(customer, items, 1)).toBe(93);
    });
    it("should apply first-insurance surcharge of 10%", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword" }];
      // contractNumber=1 → first insurance, surcharge +10%: 100G * 1.10 + 5G = 115G
      expect(quote(customer, items, 1)).toBe(115);
    });
    it("should apply repeat-contract discount of 15% after first contract", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword" }];
      // contractNumber=2 → repeat contract, discount -15% (no first-insurance surcharge): 100G * 0.85 + 5G = 90G
      expect(quote(customer, items, 2)).toBe(90);
    });
  });

  describe("claim", () => {
    it("should deduct 100G deductible from total damage", () => {
      const policy = { items: [{ type: "sword" }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] };
      // total damage: 300G, deductible: 100G → payout: 200G
      expect(claim(policy, incident)).toBe(200);
    });
    it("should reimburse 50% for items with enchantment >= 8", () => {
      const policy = { items: [{ type: "sword", enchantment: 9 }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] };
      // sword enchantment 9 >= 8 → 50% reimbursement: 300G * 0.5 = 150G, deductible 100G → payout: 50G
      expect(claim(policy, incident)).toBe(50);
    });
    it.todo("should fully reimburse damage to dragon material items");
  });
});
