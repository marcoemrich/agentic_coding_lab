import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote", () => {
    it("returns empty results for empty steps", () => {
      const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
      expect(result).toEqual({ results: [] });
    });
    it("quotes a single sword for a new customer (base + first insurance + processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes other main item types (amulet, staff, potion)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const amulet = runScenario({
        customer,
        steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
      });
      expect(amulet).toEqual({ results: [{ premium: 71 }] });
      const staff = runScenario({
        customer,
        steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }] }],
      });
      expect(staff).toEqual({ results: [{ premium: 93 }] });
      const potion = runScenario({
        customer,
        steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
      });
      expect(potion).toEqual({ results: [{ premium: 49 }] });
    });
    it("sums multiple main items in one quote", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("quotes a single component (rune) at component pricing", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("bundles 3 alike components at the special base premium of 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("does not bundle 3 components of different kinds", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 2 runes (50) + 1 moonstone (25) = 75 base; *1.1 = 82.5 → ceil 83; +5 = 88
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("applies 50% cursed surcharge per item", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        ],
      });
      // base 100 *1.5 cursed = 150 *1.1 first insurance = 165 +5 = 170
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("applies 30% enchantment surcharge for enchantment >= 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        ],
      });
      // base 100 *1.3 = 130 *1.1 first ins = 143 +5 = 148
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      // base 100 *0.8 loyalty = 80 *1.1 first ins = 88 +5 = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies 15% subsequent-contract discount to quotes after the first", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      // 1st: 100*1.1 +5 = 115
      // 2nd (subsequent, no first-ins): 100*0.85 +5 = 90
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
    it("rounds the final premium up to whole G (in MHPCO favor)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        ],
      });
      // base 100 *1.3 enchant = 130 *0.8 loyalty = 104 *1.1 first ins = 114.4 → ceil 115; +5 = 120
      expect(result).toEqual({ results: [{ premium: 120 }] });
    });
  });

  describe("Claim", () => {
    it("applies 100 G deductible to a basic claim", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      });
      // 1st result: quote premium (not asserted precisely here, but present)
      // 2nd: damage 300 - 100 deductible = 200
      expect(result).toEqual({
        results: [
          expect.objectContaining({ premium: expect.any(Number) }),
          { payout: 200 },
        ],
      });
    });
    it("reimburses 50% for items with enchantment >= 8 (after deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "staff", amount: 400 }] },
          },
        ],
      });
      // damage 400 reimbursed at 50% = 200; -100 deductible = 100
      expect((result as { results: Array<{ payout?: number }> }).results[1]).toEqual({ payout: 100 });
    });
    it("fully reimburses items made of dragon material (after deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      // damage 500 fully reimbursed; -100 deductible = 400
      expect((result as { results: Array<{ payout?: number }> }).results[1]).toEqual({ payout: 400 });
    });
    it("returns 0 payout when deductible exceeds reimbursable amount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "scratch", damages: [{ itemType: "amulet", amount: 50 }] },
          },
        ],
      });
      expect((result as { results: Array<{ payout?: number }> }).results[1]).toEqual({ payout: 0 });
    });
  });
});
