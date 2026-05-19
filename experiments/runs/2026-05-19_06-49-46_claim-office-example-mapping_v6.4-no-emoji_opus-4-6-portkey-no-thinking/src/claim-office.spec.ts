import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });
    it("returns 105G for a single sword (100G base + 5G fee)", () => {
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
    it("returns 65G for a single amulet (60G base + 5G fee)", () => {
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
    it("returns 85G for a single staff (80G base + 5G fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });
    it("returns 45G for a single potion (40G base + 5G fee)", () => {
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
    it("returns 165G for a sword and amulet (100+60 base + 5G fee)", () => {
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

  describe("Quote - component premiums", () => {
    it("returns 30G for 1 rune (25G base + 5G fee)", () => {
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
    it("returns 55G for 2 runes (50G base + 5G fee)", () => {
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
    it("returns 65G for 3 runes (60G block premium + 5G fee)", () => {
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
      expect(result.results[0].premium).toBe(73);
    });
    it("returns 105G for 4 runes (4x25G, no block + 5G fee)", () => {
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
    it("returns 80G for 2 runes + 1 moonstone (75G, no block - different types + 5G fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(88);
    });
    it("returns 125G for 3 runes + 3 moonstones (two blocks: 60+60 + 5G fee)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(140);
    });
  });

  describe("Quote - cursed surcharge", () => {
    it("adds 50% surcharge to a cursed sword (100+50 base + 5G fee = 155G)", () => {
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
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
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

  describe("Quote - high enchantment surcharge", () => {
    it("adds 30% surcharge for enchantment level 5 (100+30 base + 5G fee = 135G)", () => {
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
    it("does not add surcharge for enchantment level 4", () => {
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
      expect(result.results[0].premium).toBe(195);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with 2+ years", () => {
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
      // 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
      expect(result.results[0].premium).toBe(95);
    });
    it("does not apply loyalty discount for customer with 1 year", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
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
    it("applies 10% first insurance surcharge (always applies per item in a quote)", () => {
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
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });
    it("applies 15% follow-up contract discount on second quote", () => {
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
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: 100 + 10 first insurance + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
      // Second quote: 100 + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result.results[1].premium).toBe(100);
    });
  });

  describe("Quote - integration examples", () => {
    it.todo("newcomer with cursed sword: 165G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160G");
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up in MHPCO favor (e.g. 197.5G becomes 198G)");
  });

  describe("Quote - error handling", () => {
    it.todo("rejects unknown item type with an error");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("applies 100G deductible: sword damage 500G yields payout 400G");
    it.todo("applies deductible to component: rune damage 200G yields payout 100G");
    it.todo("applies deductible per item in multi-item damage event");
  });

  describe("Claim - enchantment and material clauses", () => {
    it.todo("reimburses at 50% for enchantment >= 8: steel sword ench 9 damage 1000G yields 400G");
    it.todo("fully reimburses dragon material: dragon sword ench 5 damage 800G yields 700G");
    it.todo("50% rule wins when both clauses apply: dragon sword ench 9 damage 1000G yields 400G");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims");
  });

  describe("Claim - error handling", () => {
    it.todo("rejects claim for item type not in policy");
    it.todo("rejects claim with more damages of a type than policy covers");
    it.todo("rejects claim with negative damage amount");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down in MHPCO favor");
  });
});
