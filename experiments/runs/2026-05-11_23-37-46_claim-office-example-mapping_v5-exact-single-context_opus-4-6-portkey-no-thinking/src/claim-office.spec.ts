import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quoteResult(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) {
  const result = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote" as const, items }],
  }) as { results: Array<{ premium: number }> };
  return result.results[0].premium;
}

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5G premium for empty item list (processing fee only)", () => {
      expect(quoteResult([])).toBe(5);
    });
    it("should return premium for a single sword (100 base + 10 first ins + 5 fee = 115G)", () => {
      expect(quoteResult([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
    });
    it("should return premium for a single amulet (60 base + 6 first ins + 5 fee = 71G)", () => {
      expect(quoteResult([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
    });
    it("should return premium for a single staff (80 base + 8 first ins + 5 fee = 93G)", () => {
      expect(quoteResult([{ type: "staff", material: "oak", enchantment: 0, cursed: false }])).toBe(93);
    });
    it("should return premium for a single potion (40 base + 4 first ins + 5 fee = 49G)", () => {
      expect(quoteResult([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
    });
  });

  describe("Quote - components", () => {
    it("should charge 25G per component (2 runes = 50 + 5 = 55G)", () => {
      expect(quoteResult([
        { type: "rune" },
        { type: "rune" },
      ])).toBe(60);
    });
    it("should apply block discount for exactly 3 alike components (3 runes block 60 + 6 first ins + 5 fee = 71G)", () => {
      expect(quoteResult([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])).toBe(71);
    });
    it("should not apply block for 4 alike components (4 runes = 100 + 10 first ins + 5 fee = 115G)", () => {
      expect(quoteResult([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])).toBe(115);
    });
    it("should not apply block for 3 different components (2r+1m = 75 + 7.5 first ins + 5 fee = 88G)", () => {
      expect(quoteResult([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ])).toBe(88);
    });
    it("should apply two separate blocks for 3 runes + 3 moonstones (120 + 12 first ins + 5 fee = 137G)", () => {
      expect(quoteResult([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ])).toBe(137);
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("should add 50% cursed surcharge to the cursed item's base premium", () => {
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ])).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for enchantment >= 5", () => {
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ])).toBe(145);
    });
    it("should apply both cursed and high-enchantment surcharges to the same item", () => {
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ])).toBe(195);
    });
    it("should not apply high-enchantment surcharge for enchantment 4", () => {
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ])).toBe(115);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("should add 10% first-insurance surcharge (always applies per quote)", () => {
      // sword base 100, first insurance 10% of 100 = 10, total 110 + 5 fee = 115
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ])).toBe(115);
    });
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      // sword base 100, first ins +10, loyalty -20 = 90 + 5 fee = 95
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 2)).toBe(95);
    });
    it("should apply 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      }) as { results: Array<{ premium: number }> };
      // first quote: 100 + 10 first ins + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
      // second quote: 100 + 10 first ins - 15 follow-up + 5 fee = 100
      expect(result.results[1].premium).toBe(100);
    });
    it("should apply item-specific modifiers per item and policy-wide modifiers on the sum", () => {
      // cursed sword (100 base, +50 curse) + plain amulet (60 base)
      // policy base = 160, first ins = 16 (10% of 160), curse surcharge = 50
      // total = 160 + 50 + 16 + 5 fee = 231
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ])).toBe(231);
    });
  });

  describe("Quote - processing fee and rounding", () => {
    it("should add 5G processing fee after all modifiers", () => {
      // loyal customer (2 yrs): sword 100 base, first ins +10, loyalty -20 = 90 + 5 fee = 95
      // The fee is a flat 5G added after all percentage modifiers
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 2)).toBe(95);
    });
    it("should round premium up (in MHPCO's favor)", () => {
      // 1 rune (25 base) with loyal customer (2 yrs):
      // 25 base + 2.5 first ins - 5 loyalty = 22.5 + 5 fee = 27.5, ceil = 28
      expect(quoteResult([{ type: "rune" }], 2)).toBe(28);
    });
  });

  describe("Quote - integration", () => {
    it("should compute 165G for newcomer with cursed sword", () => {
      // customer: 0 years, no previous contract
      // item: cursed sword (steel, enchantment 3)
      // 100 base + 50 curse + 10 first ins + 5 fee = 165
      expect(quoteResult([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ])).toBe(165);
    });
    it("should compute 160G for long-standing customer's second contract with cursed high-ench sword", () => {
      // customer: 3 years with MHPCO, second quote in scenario
      // item: cursed sword (steel, enchantment 7)
      // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      }) as { results: Array<{ premium: number }> };
      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("Claim - basic", () => {
    it("should apply 100G deductible per damaged item", () => {
      // Quote a regular sword, then claim 500G damage
      // Full reimbursement minus 100G deductible = 400G payout
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
      expect(result.results[1].payout).toBe(400);
    });
    it("should reimburse at 50% for enchantment >= 8 then apply deductible", () => {
      // steel sword, enchantment 9, damage 1000G
      // 50% of 1000 = 500, minus 100 deductible = 400G payout
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      }) as { results: Array<{ payout?: number }> };
      expect(result.results[1].payout).toBe(400);
    });
    it("should fully reimburse dragon material then apply deductible", () => {
      // dragon-material sword, enchantment 5, damage 800G
      // dragon material = full reimbursement, then deductible: 800 - 100 = 700
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      }) as { results: Array<{ payout?: number }> };
      expect(result.results[1].payout).toBe(700);
    });
    it("should apply 50% when both enchantment >= 8 and dragon material", () => {
      // dragon-material sword, enchantment 9, damage 1000G
      // both clauses apply; 50% wins: 500 - 100 deductible = 400
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      }) as { results: Array<{ payout?: number }> };
      expect(result.results[1].payout).toBe(400);
    });
    it("should handle multiple damaged items each with own deductible", () => {
      // sword damage 500G, amulet damage 300G
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ] } },
        ],
      }) as { results: Array<{ payout?: number }> };
      expect(result.results[1].payout).toBe(600);
    });
  });

  describe("Claim - cap", () => {
    it("should cap total payout at 2x insurance sum", () => {
      // sword: insurance 1000G, cap = 2000G
      // damage 2500G → 2500 - 100 deductible = 2400, capped at 2000
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] } },
        ],
      }) as { results: Array<{ payout?: number; remainingCap?: number }> };
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      // sword insured (1000G, cap 2000G); two claims of 1500G each
      // first claim: 1500 - 100 = 1400 payout, remaining cap 600
      // second claim: 1500 - 100 = 1400, capped at 600, remaining cap 0
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      }) as { results: Array<{ payout?: number; remainingCap?: number }> };
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
    it("should reduce payout to remaining cap when cap is nearly exhausted", () => {
      // sword + amulet: insurance 1000+600=1600, cap = 3200
      // first claim: sword 3000G → 2900 after deductible, capped at 3200 → payout 2900, remaining 300
      // second claim: amulet 500G → 400 after deductible, capped at 300 → payout 300, remaining 0
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } },
        ],
      }) as { results: Array<{ payout?: number; remainingCap?: number }> };
      expect(result.results[1].payout).toBe(2900);
      expect(result.results[1].remainingCap).toBe(300);
      expect(result.results[2].payout).toBe(300);
      expect(result.results[2].remainingCap).toBe(0);
    });
  });

  describe("Claim - components", () => {
    it("should apply deductible to component damage (rune damage 200G = payout 100G)", () => {
      // rune: insurance 250G, damage 200G
      // full reimbursement (no enchantment/material) minus 100G deductible = 100G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      }) as { results: Array<{ payout?: number }> };
      expect(result.results[1].payout).toBe(100);
    });
  });

  describe("Error handling", () => {
    it("should reject unknown item type in quote", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }] },
        ],
      })).toThrow();
    });
    it("should reject claim referencing item not in policy", () => {
      // policy covers sword, claim references amulet damage → error
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      })).toThrow();
    });
    it("should reject negative damage amount", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })).toThrow();
    });
    it("should reject more damages of a type than policy covers", () => {
      // policy covers 1 sword, claim has 2 sword damages → error
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ] } },
        ],
      })).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("should process a full scenario with quote and claim via processScenario", () => {
      // Full scenario from spec schema example:
      // customer: 5 years, quote amulet (silver, ench 2), then claim 200G damage
      // premium: 60 base + 6 first ins - 12 loyalty + 5 fee = 59
      // payout: 200 - 100 deductible = 100, remainingCap: 1200 - 100 = 1100
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
      expect(result.results[0].premium).toBe(59);
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
  });
});
