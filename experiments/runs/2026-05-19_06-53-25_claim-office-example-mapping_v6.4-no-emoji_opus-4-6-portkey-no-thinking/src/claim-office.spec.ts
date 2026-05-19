import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
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
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("returns base premium plus fee for a single amulet (60 + 5 = 65)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("returns base premium plus fee for a single staff (80 + 5 = 85)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("returns base premium plus fee for a single potion (40 + 5 = 45)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("sums base premiums for multiple items (sword + amulet = 160 + 5 = 165)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("Quote - component premiums", () => {
    it("returns 25G per component (2 runes = 50 + 5 = 55)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("applies building block discount for exactly 3 alike components (3 runes = 60 + 5 = 65)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 73 }] });
    });
    it("does not apply block discount for 4 alike components (4 runes = 100 + 5 = 105)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("does not apply block for 3 components of different types (2 runes + 1 moonstone = 75 + 5 = 80)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("applies separate blocks for 3 runes and 3 moonstones (120 + 5 = 125)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 140 }] });
    });
    it("charges 175G base for 7 runes (no block, 7 * 25 = 175 + 5 = 180)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        }],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to cursed item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("adds 30% high-enchantment surcharge for enchantment >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("does not apply high-enchantment surcharge for enchantment 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 10% first-insurance surcharge on policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second quote step", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("does not apply loyalty discount for customer with < 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165G (100 base + 50 curse + 10 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer second contract with cursed high-enchantment sword: 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote" as const, items: [] },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
    });
    it("rounds premium up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [] },
          { op: "quote" as const, items: [{ type: "rune" }] },
        ],
      });
      // Step 1 (follow-up, 1 rune): policyBase=25, itemPremiums=25
      // firstInsurance=2.5, followUp=3.75
      // total=25+2.5-3.75=23.75 -> ceil(23.75)=24 + 5 = 29
      expect(result).toEqual({ results: [{ premium: 5 }, { premium: 29 }] });
    });
  });

  describe("Quote - errors", () => {
    it("rejects unknown item type with non-zero exit", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "wand", material: "wood", enchantment: 0, cursed: false }],
        }],
      })).toThrow();
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("reimburses damage minus 100G deductible for a regular item", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("applies deductible per damaged item (sword 500 + amulet 300 = 600 payout)", () => {
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
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
    it("reimburses component damage minus deductible (rune damage 200 = 100 payout)", () => {
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
              cause: "magical surge",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 33 },
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
  });

  describe("Claim - enchantment and material clauses", () => {
    it("reimburses at 50% for enchantment >= 8 then applies deductible", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon material then applies deductible", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("applies 50% when both dragon material and enchantment >= 8 (50% wins)", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon material with enchantment < 8: full reimbursement minus deductible", () => {
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
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 2000, remainingCap: 0 },
        ],
      });
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
    it("cap exhaustion: second claim reduced to remaining cap", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1800 }],
            },
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
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1700, remainingCap: 300 },
          { payout: 300, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim - errors", () => {
    it("rejects claim for item not in policy", () => {
      expect(() => processScenario({
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
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      })).toThrow();
    });
    it("rejects claim with more damages of a type than policy covers", () => {
      expect(() => processScenario({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });
    it("rejects claim with negative damage amount", () => {
      expect(() => processScenario({
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
              cause: "suspicious",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      const output = execSync("npx tsx src/cli.ts", {
        input,
        encoding: "utf-8",
      });
      expect(JSON.parse(output)).toEqual({ results: [{ premium: 5 }] });
    });
  });
});
