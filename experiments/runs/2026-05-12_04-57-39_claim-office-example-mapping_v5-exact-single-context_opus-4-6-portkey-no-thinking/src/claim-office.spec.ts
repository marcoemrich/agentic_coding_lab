import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quoteScenario(items: any[], yearsWithMHPCO = 0) {
  return processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote" as const, items }],
  });
}

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5G premium for empty item list (processing fee only)", () => {
      const result = quoteScenario([]);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("should return 105G premium for a single sword (100G base + 5G fee)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 71G premium for a single amulet (60G base + 6G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 93G premium for a single staff (80G base + 8G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "staff", material: "wood", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should return 49G premium for a single potion (40G base + 4G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "potion", material: "glass", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
  });

  describe("Quote - components", () => {
    it("should return 60G premium for 2 runes (2×25G + 5G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should return 71G premium for 3 runes (block of 3 alike: 60G + 6G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 115G premium for 4 runes (no block: 4×25G + 10G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 88G premium for 2 runes + 1 moonstone (no block: 3×25G + 8G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]);
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("should return 137G premium for 3 runes + 3 moonstones (two blocks: 2×60G + 12G first ins + 5G fee)", () => {
      const result = quoteScenario([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]);
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - cursed surcharge", () => {
    it("should add 50% surcharge to cursed item only (cursed sword 100G + 50G curse + 10G first ins + 5G fee = 165G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ]);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should apply cursed surcharge per item not policy (cursed sword + plain amulet: 100+50+60 + 16 first ins + 5 = 231G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - high enchantment surcharge", () => {
    it("should add 30% surcharge for enchantment level 5 (sword: 100+30 + 10 first ins + 5 = 145G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should not add surcharge for enchantment level 4 (sword: 100 + 10 first ins + 5 = 115G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - first insurance surcharge", () => {
    it("should add 10% first insurance surcharge (sword: 100 base + 10 first ins + 5 fee = 115G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - loyalty discount", () => {
    it("should apply 20% loyalty discount for customer with 2+ years (sword: 100 - 20 + 10 first ins + 5 fee = 95G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 2);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
  });

  describe("Quote - follow-up contract discount", () => {
    it("should apply 15% follow-up discount on second quote (second sword quote for new customer: 100 - 15 + 10 first ins + 5 fee = 100G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - integration: newcomer with cursed sword", () => {
    it("should compute 165G for newcomer with cursed sword (100 base + 50 curse + 10 first ins + 5 fee)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ]);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
  });

  describe("Quote - integration: long-standing customer second contract", () => {
    it("should compute 160G for 3yr customer second quote with cursed enchanted sword (100+50+30-20+10-15 + 5 = 160G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - rounding", () => {
    it("should round premium up in MHPCO's favor (197.5G → 198G)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]);
      // policy base = 100 + 75 = 175, first ins = 17.5, fee = 5 → 197.5 → ceil = 198
      expect(result.results[0]).toEqual({ premium: 198 });
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("should reimburse damage minus 100G deductible (sword 500G damage → 400G payout)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse component damage minus deductible (rune 200G damage → 100G payout)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "rune", damage: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - deductible per item", () => {
    it("should apply deductible per damaged item (sword 500G + amulet 300G → 600G payout)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { damages: [
            { type: "sword", damage: 500 },
            { type: "amulet", damage: 300 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - high enchantment reimbursement", () => {
    it("should reimburse at 50% for enchantment >= 8 (steel sword ench 9, 1000G damage → 400G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse fully for enchantment < 8 (steel sword ench 5, 800G damage → 700G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 800 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - dragon material", () => {
    it("should fully reimburse dragon material items (dragon sword ench 5, 800G damage → 700G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 800 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% when dragon material AND enchantment >= 8 (dragon sword ench 9, 1000G → 400G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - cap", () => {
    it("should cap total payout at 2x insurance sum (sword 1000G → cap 2000G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 2500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across claims (sword cap 2000G, two claims of 1500G: first→1400G rem 600G, second→600G rem 0G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 1500 }] } },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 1500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim - cap calculation", () => {
    it("should base cap on unmodified insurance values not premiums (cursed sword cap = 2000G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 2500 }] } },
        ],
      });
      // cap = 2 × 1000 = 2000 (based on insurance value, not premium)
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should sum insurance values for multi-item policy (sword + amulet → cap 3200G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 4000 }] } },
        ],
      });
      // cap = 2 × (1000 + 600) = 3200
      expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
    });
    it("should use item insurance values not block discounts for cap (sword + 3 runes → cap 3500G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 4000 }] } },
        ],
      });
      // cap = 2 × (1000 + 3×250) = 2 × 1750 = 3500
      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
  });

  describe("Claim - multiple items of same type", () => {
    it("should allow two swords in a policy with insurance sum 2000G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 4500 }] } },
        ],
      });
      // insurance sum = 2 × 1000 = 2000, cap = 4000
      // payout = 4500 - 100 = 4400, capped at 4000
      expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
    });
    it("should apply separate deductible per damage entry for two swords", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ] },
          { op: "claim", policy: 0, incident: { damages: [
            { type: "sword", damage: 500 },
            { type: "sword", damage: 300 },
          ] } },
        ],
      });
      // payout = (500-100) + (300-100) = 400 + 200 = 600
      // cap = 2 × 2000 = 4000, remaining = 4000 - 600 = 3400
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("Claim - rounding", () => {
    it("should round payout down in MHPCO's favor (350.5G → 350G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: 901 }] } },
        ],
      });
      // ench >= 8: 901 * 0.5 = 450.5, minus 100 deductible = 350.5 → floor = 350
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Error handling", () => {
    it("should error on unknown item type in quote", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "shield", material: "steel", enchantment: 0, cursed: false }] }],
      })).toThrow();
    });
    it("should error on damage for item not in policy", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "amulet", damage: 300 }] } },
        ],
      })).toThrow();
    });
    it("should error on negative damage amount", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ type: "sword", damage: -200 }] } },
        ],
      })).toThrow();
    });
    it("should error on more damage entries than insured items of that type", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [
            { type: "sword", damage: 300 },
            { type: "sword", damage: 200 },
          ] } },
        ],
      })).toThrow();
    });
  });
});
