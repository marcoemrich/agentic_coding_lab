import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G processing fee for an empty item list", () => {
      expect(quote({ items: [], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(5);
    });
    it("should return base premium plus fee for a single sword", () => {
      expect(quote({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(115);
    });
    it("should return base premium plus fee for a single amulet", () => {
      expect(quote({ items: [{ type: "amulet" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(71);
    });
    it("should return base premium plus fee for a single staff", () => {
      expect(quote({ items: [{ type: "staff" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(93);
    });
    it("should return base premium plus fee for a single potion", () => {
      expect(quote({ items: [{ type: "potion" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(49);
    });
    it("should return base premium plus fee for a single component (rune)", () => {
      expect(quote({ items: [{ type: "rune" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(33);
    });
    it("should return block premium for exactly 3 alike components", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(71);
    });
    it("should not apply block for 4 alike components", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(115);
    });
    it("should apply block per type for 3 runes and 3 moonstones", () => {
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(137);
    });
    it("should add cursed surcharge (50%) to cursed item base premium", () => {
      // cursed sword: 100G base + 50G curse + 10G first-insurance (10% of 100G policy base) + 5G fee = 165G
      const items = [{ type: "sword", cursed: true }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(165);
    });
    it("should add high-enchantment surcharge (30%) for enchantment >= 5", () => {
      // sword enchantment 5: 100G base + 30G high-enchant + 10G first-insurance + 5G fee = 145G
      const items = [{ type: "sword", enchantment: 5 }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(145);
    });
    it("should apply both cursed and high-enchantment surcharges together", () => {
      // cursed sword enchantment 5: 100G base + 50G curse + 30G high-enchant + 10G first-insurance + 5G fee = 195G
      const items = [{ type: "sword", cursed: true, enchantment: 5 }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(195);
    });
    it("should apply loyalty discount (20%) for customer with >= 2 years", () => {
      // sword, 2 years: 100G base + 10G first-insurance - 20G loyalty + 5G fee = 95G
      const items = [{ type: "sword" }];
      expect(quote({ items, customer: { yearsWithMHPCO: 2, contractCount: 0 } })).toBe(95);
    });
    it("should apply first-insurance surcharge (10%) to each item in a quote", () => {
      // sword + amulet: policyBase = 160G, first-insurance = 16G, fee = 5G → 181G
      const items = [{ type: "sword" }, { type: "amulet" }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(181);
    });
    it("should apply follow-up discount (15%) for second and later quotes", () => {
      // sword, 0 years, contractCount=1: 100G base + 10G first-insurance - 15G follow-up + 5G fee = 100G
      const items = [{ type: "sword" }];
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 1 } })).toBe(100);
    });
    it("should combine multiple modifiers correctly (integration)", () => {
      // 3 years, 2nd contract, cursed sword enchantment 7:
      // 100G base + 50G curse + 30G high-enchant - 20G loyalty + 10G first-insurance - 15G follow-up + 5G fee = 160G
      const items = [{ type: "sword", cursed: true, enchantment: 7 }];
      expect(quote({ items, customer: { yearsWithMHPCO: 3, contractCount: 1 } })).toBe(160);
    });
  });

  describe("claim", () => {
    it("should return full damage minus 100 G deductible for standard item", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should return 50% of damage minus deductible for high enchantment (>= 8) item", () => {
      // sword enchantment 8, damage 1000G: 50% = 500G, minus 100G deductible = 400G
      const policy = {
        items: [{ type: "sword", enchantment: 8 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should return full damage minus deductible for dragon material item", () => {
      // dragon sword enchantment 5, damage 800G: full reimbursement, minus 100G deductible = 700G
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(700);
      expect(result.remainingCap).toBe(1300);
    });
    it("should use 50% rule when both high enchantment and dragon material apply", () => {
      // dragon sword enchantment 9, damage 1000G: both clauses apply, 50% wins → 500G - 100G = 400G
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 2000,
      };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should cap payout at remaining policy cap", () => {
      // sword, remainingCap=500; damage 1000G → raw payout 900G, capped to 500G
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        cap: 2000,
        remainingCap: 500,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(500);
      expect(result.remainingCap).toBe(0);
    });
    it("should track remaining cap across multiple claims", () => {
      // sword, cap=2000; two claims of 1500G each
      const basePolicy = { items: [{ type: "sword" }], insuranceSum: 1000, cap: 2000, remainingCap: 2000 };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const first = claim({ policy: basePolicy, incident });
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);
      const second = claim({ policy: { ...basePolicy, remainingCap: first.remainingCap }, incident });
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
    it("should apply deductible per damaged item in same incident", () => {
      // sword (500G) + amulet (300G) in same incident: deductible per item → 400 + 200 = 600G
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        insuranceSum: 1600,
        cap: 3200,
        remainingCap: 3200,
      };
      const incident = {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
      };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(2600);
    });
  });
});
