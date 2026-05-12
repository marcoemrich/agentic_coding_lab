import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5G for empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("should return 115G for a single sword (100G base + 10G first insurance + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return correct base premium for each main item type", () => {
      const quote = (type: string) =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type, material: "steel", enchantment: 0, cursed: false }],
            },
          ],
        }).results[0];

      expect(quote("amulet")).toEqual({ premium: 71 });
      expect(quote("staff")).toEqual({ premium: 93 });
      expect(quote("potion")).toEqual({ premium: 49 });
    });
    it("should sum base premiums for multiple items plus fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - components", () => {
    it("should charge 25G base premium per component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25G base + 2.5G first insurance (10%) = 27.5 → ceil = 28 + 5 fee = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should charge 60G for a block of exactly 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      // 60G block base + 6G first insurance (10%) = 66 → ceil = 66 + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should not apply block when count is not exactly 3", () => {
      const quoteRunes = (count: number) =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: Array.from({ length: count }, () => ({ type: "rune" })),
            },
          ],
        }).results[0];

      // 2 runes: 50G base + 5G first insurance + 5G fee = 60
      expect(quoteRunes(2)).toEqual({ premium: 60 });
      // 4 runes: 100G base + 10G first insurance + 5G fee = 115
      expect(quoteRunes(4)).toEqual({ premium: 115 });
    });
    it("should treat different component types separately for blocks", () => {
      // 2 runes + 1 moonstone: no block (different types), 75G base
      const mixed = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      // 75G base + 7.5G first insurance = 82.5 → ceil = 83 + 5 fee = 88
      expect(mixed.results[0]).toEqual({ premium: 88 });

      // 3 runes + 3 moonstones: two separate blocks, 120G base
      const twoBlocks = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      // 120G base + 12G first insurance = 132 → ceil = 132 + 5 fee = 137
      expect(twoBlocks.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("should add 50% cursed surcharge on the cursed item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // 100G base + 50G curse (50% of 100) + 10G first insurance (10% of 100) + 5G fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should add 30% surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // 100G base + 30G enchantment (30% of 100) + 10G first insurance (10% of 100) + 5G fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should scope item-specific modifiers to affected item only in multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // base: 100+60=160, curse surcharge: 50 (on sword only)
      // first insurance: 16 (10% of 160), fee: 5
      // total: 160+50+16+5 = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for >= 2 years with MHPCO", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100G base + 10G first insurance (10%) - 20G loyalty (20%) + 5G fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should apply 10% first insurance surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "potion" },
            ],
          },
        ],
      });
      // base: 100+40=140, first insurance: 14 (10% of 140), fee: 5 → 159
      expect(result.results[0]).toEqual({ premium: 159 });
    });
    it("should apply 15% follow-up discount on second+ quote", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First quote: 100G base + 10G first insurance (10%) + 5G fee = 115
      // Second quote: 100G base + 10G first insurance (10%) - 15G follow-up (15%) + 5G fee = 100
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - integration", () => {
    it("should compute 165G for newcomer with cursed sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // 100G base + 50G curse (50%) + 10G first insurance (10%) + 5G fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should compute 160G for long-standing customer second contract with cursed high-enchantment sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion" },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // Second quote: 100G base + 50G curse + 30G enchantment - 20G loyalty
      //   + 10G first insurance - 15G follow-up = 155G → ceil = 155 + 5G fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - rounding", () => {
    it("should round premiums up in MHPCO favor", () => {
      // A cursed, highly-enchanted rune produces a fractional premium
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      // 25G base + 12.5G curse (50%) + 7.5G enchantment (30%) + 2.5G first insurance (10%)
      // = 47.5 → ceil = 48 + 5G fee = 53
      expect(result.results[0]).toEqual({ premium: 53 });
    });
  });

  describe("Claim - reimbursement", () => {
    it("should fully reimburse minus 100G deductible for standard items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // damage 500G, full reimbursement minus 100G deductible = 400G payout
      // cap = 2 * 1000 = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse at 50% then deductible for enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // cap = 2 * 1000 = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse then deductible for dragon-material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // Dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // cap = 2 * 1000 = 2000, remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% when both dragon material and enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Both clauses: 50% wins. 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // cap = 2 * 1000 = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - cap and successive claims", () => {
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      // damage 1000 - 100 deductible = 900, but cap = 2 * 400 = 800
      // payout capped at 800, remaining = 0
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("should reduce remaining cap across successive claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // cap = 2 * 1000 = 2000
      // First claim: 1500 - 100 = 1400 payout, remaining = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // Second claim: 1500 - 100 = 1400 desired, but capped at 600, remaining = 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should apply deductible per damaged item in multi-damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
      // cap = 2 * (1000 + 600) = 3200, remaining = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - rounding", () => {
    it("should round payouts down in MHPCO favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 701 }],
            },
          },
        ],
      });
      // 50% of 701 = 350.5, then deductible: 350.5 - 100 = 250.5 → floor = 250
      // cap = 2000, remaining = 2000 - 250 = 1750
      expect(result.results[1]).toEqual({ payout: 250, remainingCap: 1750 });
    });
  });

  describe("Error handling", () => {
    it("should reject unknown item types", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "broomstick" }],
            },
          ],
        })
      ).toThrow();
    });
    it("should reject claim for item not in policy", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject negative damage amounts", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject excess damage entries beyond policy coverage", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
  });
});
