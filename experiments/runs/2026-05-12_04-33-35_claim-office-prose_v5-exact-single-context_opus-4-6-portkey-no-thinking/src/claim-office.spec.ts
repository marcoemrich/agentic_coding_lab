import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

const quoteItems = (
  items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>,
  customer: { yearsWithMHPCO: number } = { yearsWithMHPCO: 0 },
) =>
  processScenario({
    customer,
    steps: [
      {
        op: "quote",
        items: items.map((item) => ({
          material: "steel",
          enchantment: 0,
          cursed: false,
          ...item,
        })),
      },
    ],
  }).results[0].premium;

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should compute base premium for a single sword", () => {
      expect(quoteItems([{ type: "sword" }])).toBe(115);
    });
    it("should compute base premium for each item type (amulet, staff, potion)", () => {
      expect(quoteItems([{ type: "amulet" }])).toBe(71);
      expect(quoteItems([{ type: "staff" }])).toBe(93);
      expect(quoteItems([{ type: "potion" }])).toBe(49);
    });
    it("should compute premium for a single component (rune)", () => {
      expect(quoteItems([{ type: "rune" }])).toBe(33);
    });
    it("should apply building block discount for 3 alike components", () => {
      expect(
        quoteItems([{ type: "rune" }, { type: "rune" }, { type: "rune" }])
      ).toBe(71);
    });
    it("should compute premium for multiple items", () => {
      expect(quoteItems([{ type: "sword" }, { type: "amulet" }])).toBe(181);
    });
    it("should add cursed item surcharge of 50%", () => {
      expect(quoteItems([{ type: "sword", cursed: true }])).toBe(170);
    });
    it("should add high enchantment surcharge of 30% for enchantment >= 5", () => {
      expect(quoteItems([{ type: "sword", enchantment: 5 }])).toBe(148);
    });
    it("should apply loyalty discount of 20% for customers >= 2 years", () => {
      expect(
        quoteItems([{ type: "sword" }], { yearsWithMHPCO: 2 })
      ).toBe(93);
    });
    it("should add initial assessment surcharge of 10% for first insurance", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].premium).toBe(90);
    });
    it("should apply 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result.results[1].premium).toBe(56);
    });
    it("should add 5G processing fee to every premium", () => {
      // potion base=40, first surcharge 10% = 44, + 5G fee = 49
      expect(quoteItems([{ type: "potion" }])).toBe(49);
      // sword base=100, first surcharge 10% = 110, + 5G fee = 115
      expect(quoteItems([{ type: "sword" }])).toBe(115);
    });
    it("should round amounts in MHPCO's favor (round up)", () => {
      // cursed amulet: 60 * 1.5 = 90, first surcharge: 90 * 1.1 = 99,
      // loyalty: 99 * 0.8 = 79.2, + 5 = 84.2, ceil = 85
      expect(
        quoteItems([{ type: "amulet", cursed: true }], { yearsWithMHPCO: 2 })
      ).toBe(85);
    });
  });

  describe("Processing claims", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(200);
    });
    it("should reimburse regular damage fully minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // 500 damage - 100 deductible = 400 payout (100% reimbursement)
      expect(result.results[1].payout).toBe(400);
      // sword insured at 1000G, cap = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should reimburse dragon material damage at 100%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", material: "dragon", amount: 400 }],
            },
          },
        ],
      });
      // dragon material: 100% reimbursement, 400 - 100 deductible = 300
      expect(result.results[1].payout).toBe(300);
    });
    it("should reimburse high enchantment (>= 8) damage at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", enchantment: 9, amount: 400 }],
            },
          },
        ],
      });
      // high enchantment: 50% of 400 = 200, minus 100 deductible = 100
      expect(result.results[1].payout).toBe(100);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      // potion insured at 400G, cap = 800G
      // 1000 - 100 deductible = 900, but capped at 800
      expect(result.results[1].payout).toBe(800);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // claim 1: 500 - 100 = 400 payout, cap 2000 - 400 = 1600
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
      // claim 2: 300 - 100 = 200 payout, cap 1600 - 200 = 1400
      expect(result.results[2].payout).toBe(200);
      expect(result.results[2].remainingCap).toBe(1400);
    });
  });
});
