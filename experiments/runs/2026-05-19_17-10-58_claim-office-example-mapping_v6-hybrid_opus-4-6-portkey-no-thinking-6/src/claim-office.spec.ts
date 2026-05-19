import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5 G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns premium of 105 G for a single sword (100 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns premium of 65 G for a single amulet (60 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns premium of 85 G for a single staff (80 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "staff", material: "oak", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns premium of 45 G for a single potion (40 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "potion", material: "glass", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns premium of 30 G for a single rune component (25 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("returns premium of 165 G for a sword and an amulet (100 + 60 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component block pricing", () => {
    it("returns 60 G for 2 runes (50 base + 5 first ins + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
          { type: "rune" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("returns 71 G for 3 runes (60 base block + 6 first ins + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 115 G for 4 runes (100 base + 10 first ins + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 88 G for 2 runes and 1 moonstone (75 base + 7.5 first ins + 5 fee, ceil = 88)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("returns 137 G for 3 runes and 3 moonstones (two blocks: 120 base + 12 first ins + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% surcharge for a cursed sword (100 + 50 curse + 10 first ins + 5 fee = 165 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% surcharge for a highly enchanted sword with enchantment 5 (100 + 30 + 10 first ins + 5 = 145 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 5, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add enchantment surcharge for enchantment 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 4, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both cursed and high enchantment surcharges on same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 5, cursed: true },
        ] }],
      });
      // 100 base + 50 curse + 30 ench + 10 first ins + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] }],
      });
      // sword: 100 + 50 curse, amulet: 60, base=160, +16 first ins + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] }],
      });
      // 100 base + 10 first ins - 20 loyalty + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customer with 1 year", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 10% first insurance surcharge on policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] }],
      });
      // 100 base + 10 first insurance (10% of 100 policy base) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 15% follow-up discount on second quote", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ] },
          { op: "quote" as const, items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ] },
        ],
      });
      // First quote: 100 + 10 first ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 + 10 first ins - 15 follow-up + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up in MHPCO's favor (ceiling)");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 165 G");
    it.todo("long-standing customer second contract with cursed highly-enchanted sword: 160 G");
  });

  describe("Claim - basic payout", () => {
    it.todo("applies 100 G deductible to a simple damage claim");
    it.todo("reimburses damage to a regular sword minus deductible");
    it.todo("reimburses damage to a rune component minus deductible");
  });

  describe("Claim - enchantment and material clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon material items, then deductible");
    it.todo("applies 50% when both dragon material and enchantment >= 8");
    it.todo("fully reimburses dragon material with enchantment < 8, then deductible");
  });

  describe("Claim - multiple damages and deductible", () => {
    it.todo("applies deductible per damaged item in same event");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims");
  });

  describe("Claim - errors", () => {
    it.todo("rejects claim with more damage entries than insured items of that type");
    it.todo("rejects claim referencing item type not in policy");
    it.todo("rejects claim with negative damage amount");
  });

  describe("Quote - errors", () => {
    it.todo("rejects unknown item type");
  });

  describe("CLI - scenario processing", () => {
    it.todo("processes a quote step and returns premium in results");
    it.todo("processes a claim step referencing a prior quote and returns payout and remainingCap");
    it.todo("processes multiple sequential steps");
  });
});
