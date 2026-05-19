import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("returns base premium plus fee for a single sword (100 + 5 = 105)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("returns base premium plus fee for a single amulet (60 + 5 = 65)", () => {
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
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("returns base premium plus fee for a single staff (80 + 5 = 85)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("returns base premium plus fee for a single potion (40 + 5 = 45)", () => {
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
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("Quote - components", () => {
    it("returns 25G base premium per component (2 runes = 50 + 5 = 55)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("applies block discount for exactly 3 alike components (3 runes = 60 + 5 = 65)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("does not apply block for 4 alike components (4 runes = 100 + 5 = 105)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("does not apply block for 3 components of different types (2 runes + 1 moonstone = 75 + 5 = 80)", () => {
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
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("applies separate blocks for 3 runes and 3 moonstones (120 + 5 = 125)", () => {
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
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
    it("calculates 7 alike components without block (7 runes = 175 + 5 = 180)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item base premium", () => {
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
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("adds 30% high-enchantment surcharge for enchantment level 5", () => {
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
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("adds both cursed and high-enchantment surcharges when both apply", () => {
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
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("does not add high-enchantment surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies 20% loyalty discount for customer with 2+ years", () => {
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
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second quote in scenario", () => {
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
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { premium: 100 },
        ],
      });
    });
  });

  describe("Quote - modifier stacking on multi-item policy", () => {
    it("applies cursed surcharge only to the cursed item, not the whole policy", () => {
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
      // policyBasePremium = 100 + 60 = 160
      // itemSurcharges = 50 (cursed sword only) + 0 (amulet) = 50
      // firstInsurance = 160 * 0.1 = 16
      // premium = 160 + 50 + 16 + 5 = 231
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
    it("sums item base premiums then applies policy-wide modifiers", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
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
      // policyBasePremium = 100 + 60 = 160
      // itemSurcharges = 0
      // firstInsurance = 160 * 0.1 = 16
      // loyaltyDiscount = 160 * 0.2 = 32
      // premium = 160 + 0 + 16 - 32 + 5 = 149
      expect(result).toEqual({ results: [{ premium: 149 }] });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
            ],
          },
        ],
      });
      // policyBasePremium = 25
      // firstInsurance = 25 * 0.1 = 2.5
      // premium = 25 + 2.5 + 5 = 32.5 → ceil = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 0 years, first contract, cursed steel sword ench 3 = 165G", () => {
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
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer second contract: 3 years, 2nd quote, cursed steel sword ench 7 = 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // First quote: empty items → premium = ceil(0 + 0 + 0 - 0 - 0 + 5) = 5
      // Second quote: policyBasePremium = 100
      //   itemSurcharges = 50 (cursed) + 30 (ench>=5) = 80
      //   firstInsurance = 100 * 0.1 = 10
      //   loyaltyDiscount = 100 * 0.2 = 20
      //   followUpDiscount = 100 * 0.15 = 15
      //   premium = ceil(100 + 80 + 10 - 20 - 15 + 5) = ceil(160) = 160
      expect(result).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // Quote: premium = 115
      // Claim: sword insurance value = 1000, cap = 2000
      //   damage 500 - 100 deductible = 400 payout
      //   remainingCap = 2000 - 400 = 1600
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("reimburses damage to a component minus 100G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "rune", amount: 200 },
              ],
            },
          },
        ],
      });
      // Quote: 1 rune, policyBasePremium=25, firstInsurance=2.5, premium=ceil(25+2.5+5)=33
      // Claim: rune insurance value=250, cap=500
      //   damage 200 - 100 deductible = 100 payout
      //   remainingCap = 500 - 100 = 400
      expect(result).toEqual({
        results: [
          { premium: 33 },
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
  });

  describe("Claim - special clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8, then deductible", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });
      // Claim: enchantment 9 >= 8 → 50% reimbursement
      //   1000 * 0.5 = 500, then - 100 deductible = 400
      //   cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon material items, then deductible", () => {
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
              damages: [
                { itemType: "sword", amount: 800 },
              ],
            },
          },
        ],
      });
      // Dragon material, enchantment 5 (< 8): full reimbursement
      //   800 - 100 deductible = 700 payout
      //   cap = 2000, remainingCap = 2000 - 700 = 1300
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });
      // Both dragon material and enchantment >= 8: 50% rule wins
      //   1000 * 0.5 = 500, then - 100 deductible = 400
      //   cap = 2000, remainingCap = 1600
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon material with enchantment < 8, then deductible", () => {
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
              damages: [
                { itemType: "sword", amount: 800 },
              ],
            },
          },
        ],
      });
      // Dragon material, enchantment 7 (< 8): full reimbursement
      //   800 - 100 deductible = 700 payout
      //   cap = 2000, remainingCap = 1300
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
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
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 2500 },
              ],
            },
          },
        ],
      });
      // Claim: damage 2500 - 100 deductible = 2400
      //   cap = 2 * 1000 = 2000
      //   payout = min(2400, 2000) = 2000
      //   remainingCap = 2000 - 2000 = 0
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
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 1500 },
              ],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1500 },
              ],
            },
          },
        ],
      });
      // First claim: 1500 - 100 = 1400, cap = 2000 → payout 1400, remainingCap 600
      // Second claim: 1500 - 100 = 1400, but only 600 remaining → payout 600, remainingCap 0
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim - multiple items", () => {
    it("applies deductible separately per damaged item in a single event", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      // Quote: policyBasePremium = 100+60 = 160, firstInsurance = 16
      //   premium = ceil(160 + 0 + 16 + 5) = 181
      // Claim: sword 500-100=400, amulet 300-100=200, total=600
      //   cap = (1000+600)*2 = 3200, remainingCap = 3200-600 = 2600
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
    it("handles two items of the same type in a policy", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 800 },
                { itemType: "sword", amount: 800 },
              ],
            },
          },
        ],
      });
      // Quote: policyBasePremium = 100+100 = 200, firstInsurance = 20
      //   premium = ceil(200 + 0 + 20 + 5) = 225
      // Claim: sword1 800-100=700, sword2 800-100=700, total=1400
      //   cap = (1000+1000)*2 = 4000, remainingCap = 4000-1400 = 2600
      expect(result).toEqual({
        results: [
          { premium: 225 },
          { payout: 1400, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO favor", () => {
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
              damages: [
                { itemType: "sword", amount: 701 },
              ],
            },
          },
        ],
      });
      // Claim: enchantment 9 >= 8 → 50% reimbursement
      //   701 * 0.5 = 350.5, then - 100 deductible = 250.5 → floor = 250
      //   cap = 2000, remainingCap = 2000 - 250 = 1750
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 250, remainingCap: 1750 },
        ],
      });
    });
  });

  describe("Validation", () => {
    it("rejects unknown item type in quote with error", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
              ],
            },
          ],
        }),
      ).toThrow();
    });
    it("rejects claim referencing item not in policy with error", () => {
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
                  { itemType: "amulet", amount: 200 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("rejects claim with more damage entries than policy covers for a type", () => {
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
                cause: "dragon attack",
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
    it("rejects claim with negative damage amount", () => {
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
                  { itemType: "sword", amount: -200 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });
});
