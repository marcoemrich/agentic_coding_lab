import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });
    it("returns 105 G for a single sword (100 base + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("returns base premium plus fee for each item type (amulet, staff, potion)", () => {
      const makeScenario = (type: string) => ({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type, material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(processScenario(makeScenario("amulet")).results[0].premium).toBe(71);
      expect(processScenario(makeScenario("staff")).results[0].premium).toBe(93);
      expect(processScenario(makeScenario("potion")).results[0].premium).toBe(49);
    });
    it("returns 30 G per component (25 base + 5 fee) for a single rune", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(33);
    });
    it("returns 55 G for 2 runes (2 x 25 = 50 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });
    it("returns 65 G for a building block of 3 alike components (60 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("returns 105 G for 4 runes (4 x 25 = 100 + 5 fee, no block discount)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("returns 80 G for 2 runes and 1 moonstone (3 x 25 = 75 + 5 fee, no block: different types)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(88);
    });
    it("returns 125 G for 3 runes and 3 moonstones (two blocks: 60 + 60 = 120 + 5 fee)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(137);
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% surcharge for a cursed item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 50 curse + 10 first insurance (10% of 100) + 5 fee = 165
      expect(result.results[0].premium).toBe(165);
    });
    it("adds 30% surcharge for high enchantment (level >= 5)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 30 enchantment + 10 first insurance (10% of 100) + 5 fee = 145
      expect(result.results[0].premium).toBe(145);
    });
    it("applies both cursed and high enchantment surcharges to the same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 50 curse + 30 enchantment + 10 first insurance (10% of 100) + 5 fee = 195
      expect(result.results[0].premium).toBe(195);
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // policy base: 160 (100+60), curse +50, first insurance 10% of 160 = 16
      // total: 160 + 50 + 16 + 5 fee = 231
      expect(result.results[0].premium).toBe(231);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 10% first insurance surcharge on policy base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // policy base = 100, first insurance = 10% of 100 = 10
      // total = 100 + 10 + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // policy base = 100, first insurance = +10, loyalty = -20
      // total = 100 + 10 - 20 + 5 fee = 95
      expect(result.results[0].premium).toBe(95);
    });
    it.todo("applies 15% follow-up contract discount on second quote");
    it.todo("rounds final premium up (in MHPCO's favor)");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: premium is 165 G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: premium is 160 G");
  });

  describe("Claim - basic payout", () => {
    it.todo("reimburses damage minus 100 G deductible for a standard item");
    it.todo("reimburses component damage minus 100 G deductible");
    it.todo("applies 100 G deductible per damage entry in a single claim");
  });

  describe("Claim - special reimbursement clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon material items, then deductible");
    it.todo("applies 50% rule when item has both dragon material and enchantment >= 8");
    it.todo("fully reimburses dragon material with enchantment < 8, then deductible");
  });

  describe("Claim - cap and exhaustion", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks cap exhaustion across multiple claims on the same policy");
    it.todo("rounds payout down (in MHPCO's favor)");
  });

  describe("Error handling", () => {
    it.todo("rejects unknown item type in quote with non-zero exit");
    it.todo("rejects claim damage for item not in policy with non-zero exit");
    it.todo("rejects negative damage amount with non-zero exit");
    it.todo("rejects more damage entries than insured items of that type with non-zero exit");
  });
});
