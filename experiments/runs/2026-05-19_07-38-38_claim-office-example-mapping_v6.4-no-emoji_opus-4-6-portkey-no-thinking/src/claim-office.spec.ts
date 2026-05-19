import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - Base Premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });
    it("returns base premium plus first insurance plus fee for a single sword (100 + 10 + 5 = 115 G)", () => {
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
    it("returns base premium plus first insurance plus fee for a single amulet (60 + 6 + 5 = 71 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("returns base premium plus first insurance plus fee for a single staff (80 + 8 + 5 = 93 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });
    it("returns base premium plus first insurance plus fee for a single potion (40 + 4 + 5 = 49 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(49);
    });
    it("sums base premiums for multiple items (sword + amulet = 160 + 16 + 5 = 181 G)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(181);
    });
  });

  describe("Quote - Components", () => {
    it("returns 25 G base premium per component (2 runes = 50 + 5 = 55 G)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });
    it("applies block discount for exactly 3 alike components (3 runes = 60 + 6 + 5 = 71 G)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("does not apply block for 4 alike components (4 runes = 100 + 10 + 5 = 115 G)", () => {
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
    it("does not apply block for 3 different components (2 runes + 1 moonstone = 75 + 8 + 5 = 88 G)", () => {
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
    it("applies separate blocks for different component types (3 runes + 3 moonstones = 120 + 12 + 5 = 137 G)", () => {
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

  describe("Quote - Item-Specific Modifiers", () => {
    it("adds 50% surcharge for a cursed item (cursed sword = 150 + 10 + 5 = 165 G)", () => {
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
      expect(result.results[0].premium).toBe(165);
    });
    it("adds 30% surcharge for enchantment level >= 5 (sword ench 5 = 130 + 10 + 5 = 145 G)", () => {
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
      expect(result.results[0].premium).toBe(145);
    });
    it("does not add enchantment surcharge for level < 5 (sword ench 4 = 100 + 10 + 5 = 115 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("applies both cursed and enchantment surcharges (cursed sword ench 5 = 180 + 10 + 5 = 195 G)", () => {
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
      expect(result.results[0].premium).toBe(195);
    });
    it("applies item-specific modifiers only to the affected item (cursed sword + plain amulet = 210 + 16 + 5 = 231 G)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(231);
    });
  });

  describe("Quote - Policy-Wide Modifiers", () => {
    it("applies 10% first insurance surcharge (sword, new customer = 100 + 10 + 5 = 115 G)", () => {
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
    it("applies 20% loyalty discount for customer >= 2 years (sword, 2yr customer = 100 - 20 + 10 + 5 = 95 G)", () => {
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
      expect(result.results[0].premium).toBe(95);
    });
    it("applies 15% follow-up discount on second quote (sword, 2nd contract = 100 - 20 + 10 - 15 + 5 = 80 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(95);
      expect(result.results[1].premium).toBe(80);
    });
  });

  describe("Quote - Integration", () => {
    it("newcomer with cursed sword: 100 + 50 curse + 10 first = 160 + 5 = 165 G", () => {
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
      expect(result.results[0].premium).toBe(165);
    });
    it("long-standing 2nd contract cursed enchanted sword: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
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
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].premium).toBe(160);
    });
    it("rounds premium up in MHPCO's favor (2 runes follow-up loyal = ceil(42.5) = 43 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
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
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].premium).toBe(43);
    });
  });

  describe("Quote - Errors", () => {
    it("rejects unknown item type with non-zero exit", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "dragon_egg", material: "shell", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Claim - Basic Payout", () => {
    it("applies 100 G deductible per damage (sword 500 G damage = 400 G payout)", () => {
      const scenario = {
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
            damages: [
              { type: "sword", amount: 500 },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
    });
    it("applies deductible to component damage (rune 200 G damage = 100 G payout)", () => {
      const scenario = {
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
            damages: [
              { type: "rune", amount: 200 },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(100);
    });
    it.todo("applies deductible per damaged item (sword 500 + amulet 300 = 600 G payout)");
  });

  describe("Claim - Special Reimbursement Clauses", () => {
    it.todo("reimburses at 50% for enchantment >= 8 (steel sword ench 9, 1000 G = 400 G)");
    it.todo("fully reimburses dragon material (dragon sword ench 5, 800 G = 700 G)");
    it.todo("50% rule wins when both dragon and high enchantment apply (dragon sword ench 9, 1000 G = 400 G)");
  });

  describe("Claim - Cap", () => {
    it.todo("caps total payout at 2x insurance sum (sword cap = 2000 G)");
    it.todo("exhausts cap across successive claims (two 1500 G claims: first 1400, second 600)");
  });

  describe("Claim - Errors", () => {
    it.todo("rejects claim for item not in policy");
    it.todo("rejects claim with negative damage amount");
    it.todo("rejects claim with more damages of a type than policy covers");
  });

  describe("Claim - Rounding", () => {
    it.todo("rounds payout down in MHPCO's favor");
  });
});
