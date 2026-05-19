import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("computes base premium for a single sword (100G + 10G first insurance + 5G fee = 115G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("computes base premium for each main item type (amulet, staff, potion)", () => {
      const amulet = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
      });
      expect(amulet).toEqual({ results: [{ premium: 71 }] });

      const staff = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
      });
      expect(staff).toEqual({ results: [{ premium: 93 }] });

      const potion = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
      });
      expect(potion).toEqual({ results: [{ premium: 49 }] });
    });
    it("computes base premium for a single component (rune: 25G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("computes base premium for 3 alike components using block discount (60G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("does not apply block discount for 2 or 4 alike components", () => {
      const twoRunes = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(twoRunes).toEqual({ results: [{ premium: 60 }] });

      const fourRunes = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(fourRunes).toEqual({ results: [{ premium: 115 }] });
    });
    it("treats different component types as not alike (2 runes + 1 moonstone = 75G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("applies separate blocks for different component types (3 runes + 3 moonstones = 120G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      });
      // 100 base + 50 curse (50% of 100) + 10 first insurance (10% of 100) + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        }],
      });
      // 100 base + 30 enchantment (30% of 100) + 10 first insurance (10% of 100) + 5 fee = 145
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        }],
      });
      // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("applies item-specific surcharges only to affected items in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      });
      // policy base: 100 + 60 = 160
      // item surcharges: 50 (curse on sword only, 50% of 100)
      // policy-wide: 16 (10% of 160)
      // fee: 5
      // total: 160 + 50 + 16 + 5 = 231
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote — policy-wide modifiers", () => {
    it("adds 10% first-insurance surcharge on every quote", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        }],
      });
      // 60 base + 6 first insurance (10% of 60) + 5 fee = 71
      // Note: loyalty discount not yet implemented — this test just confirms first insurance is always present
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      // 100 base + 10 first insurance (10% of 100) - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      // First quote: 100 + 10 + 5 = 115
      // Second quote: 100 + 10 - 15 (15% of 100) + 5 = 100
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("stacks all policy-wide modifiers (loyalty + first insurance + follow-up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      // First quote: 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
      // Second quote: 100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee = 80
      expect(result).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
    });
  });

  describe("Quote — rounding and integration", () => {
    it("rounds final premium up in MHPCO's favor", () => {
      // Loyal customer with a single rune: 25 base + 2.5 first insurance - 5 loyalty + 5 fee = 27.5 → ceil = 28
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 28 }] });
    });
    it("newcomer with cursed sword: premium is 165G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      });
      // 100 base + 50 curse (50% of 100) + 10 first insurance (10% of 100) + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer second contract with cursed high-enchantment sword: premium is 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      // First quote: 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
      // Second quote: 100 base + 50 curse + 30 enchantment + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee = 160
      expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
    });
  });

  describe("Quote — errors", () => {
    it("rejects unknown item type with an error", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("Claim — standard reimbursement", () => {
    it("pays full damage minus 100G deductible for a standard item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      // Quote: 100 + 10 + 5 = 115
      // Claim: 500 - 100 deductible = 400 payout; cap = 2000 (2×1000), remaining = 1600
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("applies deductible per damage entry when multiple items are damaged", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
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
      // Quote: (100+60) base + 16 first insurance + 5 fee = 181
      // Claim: (500-100) + (300-100) = 600 payout; cap = 3200, remaining = 2600
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("Claim — special clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8, then deductible", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Quote: 100 base + 30 enchantment (30% of 100) + 10 first insurance + 5 fee = 145
      // Claim: 1000 * 50% = 500, then -100 deductible = 400; cap = 2000, remaining = 1600
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon-material items, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // Quote: 100 base + 30 enchantment (>=5) + 10 first insurance + 5 fee = 145
      // Claim: 800 full reimbursement (dragon material) - 100 deductible = 700; cap=2000, remaining=1300
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("applies 50% rule when item has both dragon material and enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Quote: 100 base + 30 enchantment (>=5) + 10 first insurance + 5 fee = 145
      // Claim: both dragon + enchantment>=8 → 50% wins: 1000*0.5=500, then -100 = 400; cap=2000, remaining=1600
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });

  describe("Claim — cap and exhaustion", () => {
    it("caps total payout at 2x the insurance sum", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // Quote: 100 + 10 + 5 = 115
      // Claim: 2500 - 100 = 2400, but cap = 2000 → payout = 2000, remainingCap = 0
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 2000, remainingCap: 0 },
        ],
      });
    });
    it("tracks remaining cap across multiple claims on the same policy", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      // Quote: 100 + 10 + 5 = 115
      // Claim 1: 1500 - 100 = 1400 payout, cap remaining = 2000 - 1400 = 600
      // Claim 2: 1500 - 100 = 1400 desired, but cap remaining = 600 → payout = 600, remaining = 0
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim — rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      });
      // Quote: 100 + 30 enchantment + 10 first insurance + 5 fee = 145
      // Claim: 501 * 0.5 = 250.5, then -100 = 150.5 → floor = 150; cap=2000, remaining=1850
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 150, remainingCap: 1850 },
        ],
      });
    });
  });

  describe("Claim — errors", () => {
    it("rejects damage to an item not covered by the policy", () => {
      expect(() =>
        processScenario({
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
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("rejects more damage entries of a type than items insured", () => {
      expect(() =>
        processScenario({
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
    it("rejects negative damage amounts", () => {
      expect(() =>
        processScenario({
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
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });
});
