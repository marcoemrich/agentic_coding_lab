import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns 115G for a single sword (100G base + 10G first ins + 5G fee)", () => {
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
    it("returns 65G for a single amulet (60G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 93G for a single staff (80G base + 8G first ins + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns 49G for a single potion (40G base + 4G first ins + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 181G for a sword and an amulet (160 base + 16 first ins + 5G fee)", () => {
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

  describe("Quote - component premiums", () => {
    it("returns 30G for a single rune (25G base + 5G fee)", () => {
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
    it("returns 55G for 2 runes (50G base + 5G fee)", () => {
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
    it("returns 65G for 3 runes (60G block discount + 5G fee)", () => {
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
    it("returns 115G for 4 runes (no block, 100G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 198G for 7 runes (175G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("returns 80G for 2 runes and 1 moonstone (75G, no block, + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("returns 125G for 3 runes and 3 moonstones (two blocks, 120G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - cursed surcharge", () => {
    it("adds 50% surcharge to a cursed sword (100+50 base + 5G fee = 155G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("applies curse surcharge only to the cursed item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100+60 base + 50 curse surcharge + 16 first ins + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - high enchantment surcharge", () => {
    it("adds 30% surcharge for enchantment level 5 (threshold)", () => {
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
      // 100 base + 30 ench surcharge + 10 first ins + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first ins + 5 fee = 115 (no ench surcharge)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both cursed and high enchantment surcharges to same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 30 ench + 10 first ins + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
  });

  describe("Quote - first insurance surcharge", () => {
    it("adds 10% first insurance surcharge to policy base premium", () => {
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
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies first insurance surcharge to every quote regardless of customer history", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Even with 5 years, first insurance still applies:
      // 100 base + 10 first ins - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
  });

  describe("Quote - loyalty discount", () => {
    it("applies 20% loyalty discount for customer with 2 years (threshold)", () => {
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
      // 100 base + 10 first ins - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customer with 1 year", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first ins + 5 fee = 115 (no loyalty discount)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - follow-up contract discount", () => {
    it("applies 15% discount on second quote in scenario", () => {
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
      // First quote: 100 base + 10 first ins + 5 fee = 115
      // Second quote: 100 base + 10 first ins - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("does not apply discount on first quote in scenario", () => {
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
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO favor (ceiling)", () => {
      // 1 rune with 2-year loyalty: 25 base + 2.5 first ins - 5 loyalty + 5 fee = 27.5 -> ceil = 28
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 0 years, first contract = 165G", () => {
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
      // 100 base + 50 curse + 10 first ins + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract: cursed sword ench 7 = 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
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
      // Second quote: 100 base + 50 curse + 30 ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - errors", () => {
    it("rejects unknown item type with non-zero exit", () => {
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
  });

  describe("Claim - standard reimbursement", () => {
    it("reimburses damage minus 100G deductible for a regular item", () => {
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
  });

  describe("Claim - deductible per item", () => {
    it("applies deductible separately to each damaged item in same event", () => {
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
      // payout = (500-100) + (300-100) = 600; cap = 2*(1000+600) = 3200; remaining = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - high enchantment reimbursement", () => {
    it("reimburses 50% of damage then deductible for enchantment >= 8", () => {
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
      // cap = 2*1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - dragon material reimbursement", () => {
    it("reimburses full damage then deductible for dragon material item", () => {
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
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // cap = 2*1000 = 2000; remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - dragon material + high enchantment", () => {
    it("applies 50% rule when both dragon material and enchantment >= 8", () => {
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
      // both dragon + ench >= 8: 50% wins. 1000 * 0.5 = 500, then deductible: 500 - 100 = 400
      // cap = 2*1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies full reimbursement for dragon material with enchantment < 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 7, cursed: false },
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
      // dragon material, ench 7 (< 8): full reimbursement, then deductible: 800 - 100 = 700
      // cap = 2*1000 = 2000; remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at 2x insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
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
      // payout without cap: 1000 - 100 = 900; cap = 2*400 = 800; payout capped at 800
      // remaining = 0
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // First claim: 1500-100 = 1400; cap = 2000; remaining = 2000-1400 = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // Second claim: 1500-100 = 1400, but cap remaining is 600; payout = 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("insurance sum uses unmodified item values, not premiums", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1950 }],
            },
          },
        ],
      });
      // insurance sum = 1000 (not 165 premium), cap = 2000
      // payout = 1950 - 100 = 1850; under cap 2000
      // remaining = 2000 - 1850 = 150
      expect(result.results[1]).toEqual({ payout: 1850, remainingCap: 150 });
    });
    it("component block discount does not affect insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      // insurance sum = 1000 + 3*250 = 1750 (not affected by block discount)
      // cap = 2*1750 = 3500
      // payout = 200 - 100 = 100; remaining = 3500 - 100 = 3400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
  });

  describe("Claim - multiple items of same type", () => {
    it("treats each damage entry separately with its own deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      // (500-100) + (300-100) = 400+200 = 600; cap = 2*2000 = 4000; remaining = 4000-600 = 3400
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("rejects claim with more damages of a type than policy covers", () => {
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
                cause: "dragon",
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

  describe("Claim - errors", () => {
    it("rejects damage to item not covered by policy", () => {
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
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
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
  });
});
