import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("computes base premium for a single sword (100G + 5G fee = 105G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("computes base premium for each main item type (amulet, staff, potion)", () => {
      const makeScenario = (type: string) => ({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type, material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(processScenario(makeScenario("amulet")).results[0]).toEqual({ premium: 71 });
      expect(processScenario(makeScenario("staff")).results[0]).toEqual({ premium: 93 });
      expect(processScenario(makeScenario("potion")).results[0]).toEqual({ premium: 49 });
    });
    it("computes base premium for a single component (rune: 25G + 5G fee = 30G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("computes base premium for multiple components (2 runes: 50G + 5G fee = 55G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("applies building block discount for exactly 3 alike components (3 runes: 60G + 5G fee = 65G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block discount for 4 alike components (4 runes: 100G + 5G fee = 105G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("treats different component types separately for block discount (2 runes + 1 moonstone: 75G + 5G fee = 80G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("applies two separate block discounts for 3 runes + 3 moonstones (120G + 5G fee = 125G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 137 });
    });
    it("computes base premium for a multi-item policy (sword + amulet: 160G + 5G fee = 165G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% curse surcharge to a cursed item's base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both curse and high-enchantment surcharges to the same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
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
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 10% first-insurance surcharge on policy base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up contract discount on second quote", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies first-insurance surcharge even for long-standing customers", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // Second quote: 100 base + 50 curse + 30 enchant + 10 first-ins - 20 loyalty - 15 follow-up = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165G (100 + 50 curse + 10 first = 160 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it.todo("long-standing customer second contract with cursed enchanted sword: 160G");
    it.todo("rounds premium up in MHPCO's favor");
  });

  describe("Quote - errors", () => {
    it.todo("rejects unknown item type with an error");
  });

  describe("Claim - basic reimbursement", () => {
    it.todo("reimburses damage minus 100G deductible for a standard item");
    it.todo("reimburses damage to a component minus 100G deductible");
    it.todo("applies deductible per damaged item in a multi-item claim");
  });

  describe("Claim - special clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon-material items, then deductible");
    it.todo("applies 50% rule when both enchantment >= 8 and dragon material");
  });

  describe("Claim - cap and policy tracking", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across successive claims");
    it.todo("bases cap on unmodified insurance values, not premiums");
  });

  describe("Claim - errors", () => {
    it.todo("rejects claim for item not in policy");
    it.todo("rejects claim with more damage entries than items covered");
    it.todo("rejects claim with negative damage amount");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down in MHPCO's favor");
  });
});
