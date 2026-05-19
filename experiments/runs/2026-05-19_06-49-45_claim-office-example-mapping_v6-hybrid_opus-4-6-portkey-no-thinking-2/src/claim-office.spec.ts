import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("computes base premium for a single sword (100G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("computes base premium for a single amulet (60G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("computes base premium for a single staff (80G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("computes base premium for a single potion (40G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("computes base premium for a single component (25G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("computes base premium for multiple items (sword + amulet = 160G + 5G fee)", () => {
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

  describe("Quote — component block pricing", () => {
    it("prices 2 runes at 50G (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("prices 3 alike runes at 60G (block of 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("prices 4 runes at 100G (no block — block requires exactly 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("prices 3 runes + 3 moonstones at 120G (two separate blocks)", () => {
      const result = processScenario({
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
      expect(result.results[0]).toEqual({ premium: 137 });
    });
    it("does not apply block for 2 runes + 1 moonstone (different types)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
  });

  describe("Quote — item-level modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item only", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("does not apply high-enchantment surcharge for enchantment 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("item-level modifiers apply only to the affected item in a multi-item policy", () => {
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
      // cursed sword: 100 + 50 = 150; plain amulet: 60; items: 210; first ins: 16 (10% of 160); total: 210 + 16 + 5 = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote — policy-level modifiers", () => {
    it("adds 10% first-insurance surcharge on the policy base premium", () => {
      // first insurance = 10% of policy base premium (sum of item base premiums)
      // sword base = 100, first insurance = 10, total = 110 + 5 fee = 115
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies all policy-level modifiers together (loyalty + first insurance + follow-up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // first quote: 100 base + 10 first ins - 20 loyalty + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
      // second quote: 100 base + 10 first ins - 20 loyalty - 15 follow-up + 5 fee = 80
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote — rounding", () => {
    it("rounds premium up (ceil) in MHPCO's favor", () => {
      // single rune (25G base), loyal customer (2 years), second quote (follow-up)
      // policyBase=25, firstIns=2.5, loyalty=-5, followUp=-3.75 → 25+2.5-5-3.75+5=23.75 → ceil=24
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote" as const, items: [{ type: "rune" }] },
          { op: "quote" as const, items: [{ type: "rune" }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 24 });
    });
  });

  describe("Quote — integration", () => {
    it("newcomer with cursed sword: 165G", () => {
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchantment sword: 160G", () => {
      // 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 fee = 160
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote — errors", () => {
    it("throws error for unknown item type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "broomstick" }],
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim — basic reimbursement", () => {
    it("reimburses damage minus 100G deductible for a standard item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      // payout = 500 - 100 deductible = 400; cap = 2*1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses damage to a component minus 100G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      // payout = 200 - 100 deductible = 100; cap = 2*250 = 500; remaining = 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("applies deductible per damaged item in a multi-item claim", () => {
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
      // sword: 500-100=400, amulet: 300-100=200, total=600; cap=2*1600=3200; remaining=2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim — enchantment and material clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
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
      // 50% of 1000 = 500, minus 100 deductible = 400; cap = 2000; remaining = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses fully for dragon-material items, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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
      // dragon material, enchantment 5 (<8): full reimbursement, then deductible: 800 - 100 = 700
      // cap = 2*1000 = 2000; remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when both dragon-material and enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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
      // both clauses: 50% wins → 1000*0.5=500, minus 100 deductible = 400
      // cap = 2000; remaining = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material with enchantment < 8 gets full reimbursement minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 7, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });
      // dragon material, enchantment 7 (<8): full reimbursement, then deductible: 600 - 100 = 500
      // cap = 2000; remaining = 1500
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
    });
  });

  describe("Claim — cap", () => {
    it("caps total payout at 2x insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // raw payout = 2500 - 100 = 2400; cap = 2*1000 = 2000; capped to 2000
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("tracks remaining cap across successive claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
      // first claim: 1500-100=1400, cap=2000, remaining=600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500-100=1400 but capped to 600, remaining=0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("cap is based on unmodified insurance values, not premiums", () => {
      // cursed sword: insurance value 1000G, cap = 2*1000 = 2000 (not based on premium 165G)
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // raw payout = 2500-100 = 2400; cap = 2*1000 = 2000; payout = 2000
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
  });

  describe("Claim — payout rounding", () => {
    it("rounds payout down (floor) in MHPCO's favor", () => {
      // sword enchantment 9, damage 501G → 501*0.5=250.5 - 100 = 150.5 → floor = 150
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      });
      // cap = 2000; remaining = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Claim — errors", () => {
    it("throws error when damage references an item not in the policy", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("throws error when more damages of a type than insured items", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
        }),
      ).toThrow();
    });
    it("throws error for negative damage amount", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
        }),
      ).toThrow();
    });
  });
});
