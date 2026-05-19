import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns premium of 115 G for a single sword (100 base + 10 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns premium of 71 G for a single amulet (60 base + 10% first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns premium of 93 G for a single staff (80 base + 10% first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns premium of 49 G for a single potion (40 base + 10% first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns premium for multiple items summing their base premiums", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      };
      const result = processScenario(scenario);
      // 160 base (100+60) + 16 first insurance (10%) + 5 fee = 181
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - components", () => {
    it("returns base premium of 25 G per component (e.g. 2 runes = 50 G base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      };
      const result = processScenario(scenario);
      // 50 base (2*25) + 5 first insurance (10%) + 5 fee = 60
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("applies building block discount for exactly 3 alike components (3 runes = 60 G base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      };
      const result = processScenario(scenario);
      // 60 base (block discount) + 6 first insurance (10%) + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block discount for 4 alike components (4 runes = 100 G base)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // 100 base (4*25, no block) + 10 first insurance (10%) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("does not apply block discount for 3 different components (2 runes + 1 moonstone = 75 G base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        }],
      };
      const result = processScenario(scenario);
      // 75 base (2*25 + 1*25, no block: different types) + 7.5 first insurance + 5 fee = 87.5
      expect(result.results[0]).toEqual({ premium: 87.5 });
    });
    it("applies separate blocks for different component types (3 runes + 3 moonstones = 120 G base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        }],
      };
      const result = processScenario(scenario);
      // 120 base (2 blocks of 60) + 12 first insurance (10%) + 5 fee = 137
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium only", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 50 curse (50% of 100) + 10 first insurance (10% of 100) + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 30 enchantment (30% of 100) + 10 first insurance (10% of 100) + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 50 curse + 30 enchantment + 10 first insurance (10% of 100) + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("does not apply high-enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 0 surcharges + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      };
      const result = processScenario(scenario);
      // base 160 (100+60), cursed surcharge 50 (50% of sword's 100 only)
      // first insurance 16 (10% of 160), fee 5 → 160 + 50 + 16 + 5 = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance (10%) - 20 loyalty (20%) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customers with < 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 5 fee = 115 (no loyalty discount)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 10% first insurance surcharge (always applies per quote)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 15% follow-up contract discount on second and subsequent quotes", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // First quote: 100 + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 + 10 first insurance - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up to whole G in MHPCO's favor");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 165 G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160 G");
  });

  describe("Claim - basic payout", () => {
    it.todo("applies 100 G deductible per damaged item");
    it.todo("reimburses standard damage fully minus deductible");
    it.todo("reimburses damage to component (rune) minus deductible");
  });

  describe("Claim - special reimbursement clauses", () => {
    it.todo("reimburses enchantment >= 8 damage at 50% then applies deductible");
    it.todo("reimburses dragon material damage fully then applies deductible");
    it.todo("when both enchantment >= 8 and dragon material, 50% rule wins");
    it.todo("dragon material with enchantment < 8 gets full reimbursement minus deductible");
  });

  describe("Claim - payout cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on the same policy");
  });

  describe("Claim - multiple damages in one event", () => {
    it.todo("applies deductible separately to each damaged item in a single claim");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down to whole G in MHPCO's favor");
  });

  describe("Error handling", () => {
    it.todo("rejects unknown item type in quote with error");
    it.todo("rejects claim for item not in policy with error");
    it.todo("rejects negative damage amount with error");
    it.todo("rejects claim with more damages of a type than policy covers");
  });

  describe("CLI integration", () => {
    it.todo("reads JSON from stdin and writes results to stdout");
    it.todo("processes sequential steps where claims reference earlier quotes");
  });
});
