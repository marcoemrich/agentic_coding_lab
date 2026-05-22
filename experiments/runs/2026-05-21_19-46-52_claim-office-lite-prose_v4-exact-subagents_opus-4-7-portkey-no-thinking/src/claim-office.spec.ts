import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("processScenario - empty scenario", () => {
    it("should return empty results for scenario with no steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [],
      };
      expect(processScenario(scenario)).toEqual({ results: [] });
    });
  });

  describe("Quoting - base premiums for single main items", () => {
    it("should quote a sword (base 100 G) with processing fee and first-insurance surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 115 }],
      });
    });
    it("should quote an amulet (base 60 G) with processing fee and first-insurance surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "amulet" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 71 }],
      });
    });
    it("should quote a staff (base 80 G) with processing fee and first-insurance surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "staff" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 93 }],
      });
    });
    it("should quote a potion (base 40 G) with processing fee and first-insurance surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "potion" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 49 }],
      });
    });
  });

  describe("Quoting - components", () => {
    it("should quote a single rune at base premium 25 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "rune" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 33 }],
      });
    });
    it("should quote a single moonstone at base premium 25 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "moonstone" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 33 }],
      });
    });
    it("should quote 2 alike components at 2 x 25 G base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "rune" as const }, { kind: "rune" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 60 }],
      });
    });
    it("should quote 3 alike runes as a building block at special 60 G base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "rune" as const }, { kind: "rune" as const }, { kind: "rune" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 71 }],
      });
    });
    it("should quote 3 alike moonstones as a building block at special 60 G base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "moonstone" as const }, { kind: "moonstone" as const }, { kind: "moonstone" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 71 }],
      });
    });
    it("should not combine unlike components into a building block", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "rune" as const }, { kind: "rune" as const }, { kind: "moonstone" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 88 }],
      });
    });
  });

  describe("Quoting - multiple items in one quote", () => {
    it("should sum base premiums of multiple main items in one quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }, { kind: "amulet" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 181 }],
      });
    });
  });

  describe("Quoting - risk surcharges", () => {
    it("should add 50% surcharge for a cursed item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const, cursed: true }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 170 }],
      });
    });
    it("should add 30% surcharge for highly enchanted item (enchantment >= 5)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const, enchantment: 5 }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 148 }],
      });
    });
    it("should not add enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const, enchantment: 4 }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 115 }],
      });
    });
    it("should apply both cursed and high-enchantment surcharges when both apply", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const, cursed: true, enchantment: 5 }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 203 }],
      });
    });
  });

  describe("Quoting - customer modifiers", () => {
    it("should apply 10% first-insurance surcharge when customer has no prior contracts", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 115 }],
      });
    });
    it("should apply 15% per-contract discount on the second contract", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 115 },
          { kind: "quote", premium: 90 },
        ],
      });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 95 }],
      });
    });
    it("should not apply loyalty discount for customers with < 2 years with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 115 }],
      });
    });
  });

  describe("Quoting - processing fee and rounding", () => {
    it("should add a 5 G processing fee to every quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 115 }],
      });
    });
    it("should round the final premium up to whole G (in MHPCO's favor)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "rune" as const }],
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ kind: "quote", premium: 33 }],
      });
    });
  });

  describe("Claims - basics", () => {
    it("should return payout 0 for a claim on a non-reimbursable item (no high enchantment, no dragon material)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const }],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 115 },
          { kind: "claim", payout: 0 },
        ],
      });
    });
    it("should reimburse 50% of damage amount minus 100 G deductible for items with enchantment >= 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "sword" as const, enchantment: 8 }],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 148 },
          { kind: "claim", payout: 200 },
        ],
      });
    });
    it("should fully reimburse damage amount minus 100 G deductible for dragon-material items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "staff" as const, material: "dragon" as const }],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              damages: [{ itemType: "staff", amount: 500 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 93 },
          { kind: "claim", payout: 400 },
        ],
      });
    });
    it("should apply only one 100 G deductible per claim event covering multiple damaged items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [
              { kind: "sword" as const, material: "dragon" as const },
              { kind: "staff" as const, material: "dragon" as const },
            ],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "staff", amount: 400 },
              ],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 203 },
          { kind: "claim", payout: 600 },
        ],
      });
    });
    it("should return payout 0 when reimbursable amount is less than the deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "staff" as const, material: "dragon" as const }],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              damages: [{ itemType: "staff", amount: 50 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 93 },
          { kind: "claim", payout: 0 },
        ],
      });
    });
  });

  describe("End-to-end scenario", () => {
    it("should process a quote followed by a claim against that policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            kind: "quote" as const,
            items: [{ kind: "amulet" as const }],
          },
          {
            kind: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [
          { kind: "quote", premium: 59 },
          { kind: "claim", payout: 0 },
        ],
      });
    });
  });
});
