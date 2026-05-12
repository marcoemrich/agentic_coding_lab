import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return 5 G processing fee for empty item list", () => {
      expect(quote({ items: [], customer: { yearsWithMHPCO: 0, contractCount: 1 } })).toBe(5);
    });
    it("should return base premium plus fee for a single sword", () => {
      // contractCount:0 → first insurance +10%: 100 + 10 + 5 = 115
      expect(quote({ items: [{ type: "sword" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(115);
    });
    it("should return base premium plus fee for a single amulet", () => {
      // contractCount:0 → first insurance +10%: 60 + 6 + 5 = 71
      expect(quote({ items: [{ type: "amulet" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(71);
    });
    it("should return base premium plus fee for a single staff", () => {
      // contractCount:0 → first insurance +10%: 80 + 8 + 5 = 93
      expect(quote({ items: [{ type: "staff" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(93);
    });
    it("should return base premium plus fee for a single potion", () => {
      // contractCount:0 → first insurance +10%: 40 + 4 + 5 = 49
      expect(quote({ items: [{ type: "potion" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(49);
    });
    it("should return base premium plus fee for a single component (rune)", () => {
      // contractCount:0 → first insurance +10%: 25 + 2.5 + 5 = 32.5 → rounds up to 33
      expect(quote({ items: [{ type: "rune" }], customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(33);
    });
    it("should return 60 G base premium for a block of 3 alike components", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      // contractCount:0 → first insurance +10%: 60 + 6 + 5 = 71
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(71);
    });
    it("should not apply block discount for 2 alike components", () => {
      const items = [{ type: "rune" }, { type: "rune" }];
      // contractCount:0 → first insurance +10%: 50 + 5 + 5 = 60
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(60);
    });
    it("should not apply block discount for 4 alike components", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
      // contractCount:0 → first insurance +10%: 100 + 10 + 5 = 115
      expect(quote({ items, customer: { yearsWithMHPCO: 0, contractCount: 0 } })).toBe(115);
    });
    it("should apply cursed surcharge (50%) to the cursed item only", () => {
      // Cursed sword: 100G raw base × 1.5 = 150G item premium
      // contractCount:0 → first insurance +10% of raw base (+10G): 150 + 10 + 5 = 165
      const items = [{ type: "sword", cursed: true }];
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote({ items, customer })).toBe(165);
    });
    it("should apply high enchantment surcharge (30%) for enchantment level >= 5", () => {
      // Sword with enchantment 5: 100G raw base × 1.3 = 130G item premium
      // contractCount:0 → first insurance +10% of raw base (+10G): 130 + 10 + 5 = 145
      const items = [{ type: "sword", enchantment: 5 }];
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote({ items, customer })).toBe(145);
    });
    it("should apply loyalty discount (20%) for customers with >= 2 years", () => {
      // Plain sword: 100G base; loyalty -20% of raw base (-20G) → 80G adjusted
      // contractCount:0 → first insurance +10% of raw base (+10G): 80 + 10 + 5 = 95
      const items = [{ type: "sword" }];
      const customer = { yearsWithMHPCO: 2, contractCount: 0 };
      expect(quote({ items, customer })).toBe(95);
    });
    it("should apply first insurance surcharge (10%) for new items", () => {
      // Plain sword: 100G base + 10G first insurance = 110G + 5G fee = 115G
      const items = [{ type: "sword" }];
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote({ items, customer })).toBe(115);
    });
    it("should apply follow-up contract discount (15%) for non-first contracts", () => {
      // Plain sword: 100G raw base; first insurance +10% always applies (+10G);
      // follow-up -15% of raw base (-15G): 100 + 10 - 15 + 5 = 100G
      const items = [{ type: "sword" }];
      const customer = { yearsWithMHPCO: 0, contractCount: 1 };
      expect(quote({ items, customer })).toBe(100);
    });
    it("should combine multiple modifiers correctly (integration example)", () => {
      // Long-standing customer's second contract:
      // 100G base + 50G curse + 30G high enchantment = 180G policy base
      // loyalty -20% of base = -20G; first insurance +10% of base = +10G; follow-up -15% of base = -15G
      // 180 - 20 + 10 - 15 = 155G + 5G fee = 160G
      const items = [{ type: "sword", cursed: true, enchantment: 7 }];
      const customer = { yearsWithMHPCO: 3, contractCount: 1 };
      expect(quote({ items, customer })).toBe(160);
    });
    it("should round premium up (MHPCO's favor)", () => {
      // Rune with contractCount:0: 25G raw + 2.5G first insurance + 5G fee = 32.5G → rounds up to 33G
      const items = [{ type: "rune" }];
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(quote({ items, customer })).toBe(33);
    });
    it("should exit with non-zero status for unknown item type", () => {
      const items = [{ type: "broomstick" }];
      const customer = { yearsWithMHPCO: 0, contractCount: 0 };
      expect(() => quote({ items, customer })).toThrow();
    });
  });

  describe("claim", () => {
    it("should apply 100 G deductible per damage event", () => {
      // Regular sword, damage 500G → payout 500 - 100 deductible = 400G
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should reimburse 50% of damage for items with enchantment >= 8", () => {
      // Sword with enchantment 8: damage 1000G → 50% = 500G, minus 100G deductible = 400G payout
      const policy = {
        items: [{ type: "sword", enchantment: 8 }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should fully reimburse damage for dragon material items", () => {
      // Dragon-material sword, enchantment 5, damage 800G → full reimbursement, minus 100G deductible = 700G payout
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(700);
      expect(result.remainingCap).toBe(1300);
    });
    it("should cap payout at twice the insurance sum", () => {
      // Sword insuranceSum:1000, cap(remainingCap):500; damage 700G → raw payout 600G, capped to 500G
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        remainingCap: 500,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 700 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(500);
      expect(result.remainingCap).toBe(0);
    });
    it("should track remaining cap after each claim", () => {
      // Sword insured, cap 2000G. Two claims of 1500G each.
      // First claim: 1500 - 100 deductible = 1400G payout, remainingCap = 600G
      // Second claim: 1500 - 100 = 1400G raw, capped to 600G, remainingCap = 0G
      const policy = { items: [{ type: "sword" }], insuranceSum: 1000, remainingCap: 2000 };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const first = claim({ policy, incident });
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);
      const second = claim({ policy: { ...policy, remainingCap: first.remainingCap }, incident });
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
    it("should apply deductible once per damaged item in multi-item events", () => {
      // Dragon attack: sword damaged 500G and amulet damaged 300G
      // sword: 500 - 100 = 400G; amulet: 300 - 100 = 200G; total payout = 600G
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        insuranceSum: 1600,
        remainingCap: 3200,
      };
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(2600);
    });
    it("should round payout down (MHPCO's favor)", () => {
      // Sword with enchantment 8: damage 801G → 50% = 400.5G, minus 100G deductible = 300.5G → rounds down to 300G
      const policy = {
        items: [{ type: "sword", enchantment: 8 }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 801 }] };
      const result = claim({ policy, incident });
      expect(result.payout).toBe(300);
    });
    it("should exit with non-zero status for damage referencing item not in policy", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] };
      expect(() => claim({ policy, incident })).toThrow();
    });
    it("should exit with non-zero status for negative damage amount", () => {
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
      expect(() => claim({ policy, incident })).toThrow();
    });
    it("should exit with non-zero status when damages exceed insured items of same type", () => {
      // Policy has one sword, but two sword damages → reject
      const policy = {
        items: [{ type: "sword" }],
        insuranceSum: 1000,
        remainingCap: 2000,
      };
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      };
      expect(() => claim({ policy, incident })).toThrow();
    });
  });
});
