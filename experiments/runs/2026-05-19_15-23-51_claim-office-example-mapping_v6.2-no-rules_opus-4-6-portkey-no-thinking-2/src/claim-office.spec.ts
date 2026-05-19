import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("computes base premium for a single sword (100 G + 10 G first insurance + 5 G fee = 115 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("computes base premium for a single amulet (60 G + 6 G first insurance + 5 G fee = 71 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("computes base premium for a single staff (80 G + 8 G first insurance + 5 G fee = 93 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("computes base premium for a single potion (40 G + 4 G first insurance + 5 G fee = 49 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("computes base premium for a single rune component (25 G + 3 G first insurance + 5 G fee = 33 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("Quote - component building blocks", () => {
    it("computes 50 G base premium for 2 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("computes 60 G base premium for 3 alike runes (block applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("computes 100 G base premium for 4 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("computes 175 G base premium for 7 runes", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: runes }],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("does not form a block from different component types (2 runes + 1 moonstone = 75 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("forms two separate blocks for 3 runes + 3 moonstones (120 G)", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to a cursed item's base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 203 }] });
    });
    it("does not apply high-enchantment surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second quote in a scenario", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("applies first insurance surcharge to every quote regardless of customer history", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
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
      });
      expect(result).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
    });
  });

  describe("Quote - multi-item policies", () => {
    it("sums item base premiums for a multi-item policy", () => {
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
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
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
      expect(result).toEqual({ results: [{ premium: 236 }] });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premiums up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 5, cursed: false }],
          },
        ],
      });
      // Second quote: 78 base × 0.95 (follow-up) + 5 fee = 79.1 → ceil = 80
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 80 }] });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160 G");
  });

  describe("Claim - basic processing", () => {
    it.todo("applies 100 G deductible to a simple claim");
    it.todo("fully reimburses dragon-material item damage minus deductible");
    it.todo("reimburses 50% for enchantment >= 8 then applies deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
    it.todo("fully reimburses dragon-material item with enchantment < 8 minus deductible");
    it.todo("applies deductible per damaged item in a multi-damage claim");
    it.todo("applies standard reimbursement to component damage (no enchantment/material)");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on the same policy");
    it.todo("returns remainingCap in claim results");
  });

  describe("Error handling", () => {
    it.todo("rejects quote with unknown item type");
    it.todo("rejects claim with damage to an uninsured item type");
    it.todo("rejects claim with negative damage amount");
    it.todo("rejects claim when damages exceed insured item count for a type");
  });
});
