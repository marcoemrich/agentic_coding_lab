import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base item premiums", () => {
    it("quotes a sword at base premium plus processing fee for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes an amulet at its base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("quotes a staff at its base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("quotes a potion at its base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("quotes multiple main items by summing their base premiums", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ]},
        ],
      });
      // (100 + 40) * 1.10 = 154 + 5 = 159
      expect(result).toEqual({ results: [{ premium: 159 }] });
    });
  });

  describe("Quote - components", () => {
    it("quotes a single rune component at 25 G base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
        ],
      });
      // 25 * 1.10 = 27.5 -> ceil 28 + 5 = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("quotes a single moonstone component at 25 G base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "moonstone" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("quotes three alike components as a building block at 60 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ]},
        ],
      });
      // 60 * 1.10 = 66, +5 = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("quotes four alike components as a block of 3 plus one single", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          ]},
        ],
      });
      // (60 + 25) * 1.10 = 93.5 -> ceil 94 + 5 = 99
      expect(result).toEqual({ results: [{ premium: 99 }] });
    });
  });

  describe("Quote - surcharges and discounts", () => {
    it("applies 50% cursed surcharge to a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }] },
        ],
      });
      // 100 * 1.5 = 150, * 1.10 = 165, +5 = 170
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("applies 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        ],
      });
      // 100 * 1.3 = 130, * 1.10 = 143, +5 = 148
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies 20% loyalty discount for yearsWithMHPCO >= 2", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        ],
      });
      // 100 * 0.8 = 80, * 1.10 = 88, +5 = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies 10% first-insurance surcharge on the first quote", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        ],
      });
      // 60 * 1.10 = 66 + 5 = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("applies 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        ],
      });
      // First: 100 * 1.10 + 5 = 115
      // Second: 100 * 0.85 = 85, +5 = 90
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
    it("rounds the final premium up (in MHPCO's favor) to whole G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
        ],
      });
      // 25 * 1.10 = 27.5 -> ceil to 28 + 5 = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("Claim - payout rules", () => {
    it("subtracts the 100 G deductible from the damage amount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      });
      // Insurance sum = 600, cap = 1200. Damage 300 - 100 deductible = 200 payout.
      // Round in MHPCO's favor = round down for payouts; 200 is exact.
      // remainingCap = 1200 - 200 = 1000
      const r = result.results[1] as { payout: number; remainingCap: number };
      expect(r.payout).toBe(200);
      expect(r.remainingCap).toBe(1000);
    });
    it("caps total payout per policy at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] },
          // Insurance 400, cap 800. Damage 2000 - 100 = 1900, but capped at 800.
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "potion", amount: 2000 }] } },
        ],
      });
      const r = result.results[1] as { payout: number; remainingCap: number };
      expect(r.payout).toBe(800);
      expect(r.remainingCap).toBe(0);
    });
    it("reimburses damage to items with enchantment level >= 8 at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      // (500 - 100) * 0.5 = 200
      const r = result.results[1] as { payout: number; remainingCap: number };
      expect(r.payout).toBe(200);
    });
    it("fully reimburses damage to dragon-material items (ignores the 50% enchantment reduction)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      // 500 - 100 = 400 (no 50% reduction because dragon)
      const r = result.results[1] as { payout: number; remainingCap: number };
      expect(r.payout).toBe(400);
    });
    it("reports remainingCap after a claim", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
          { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      });
      // cap = 1200. First claim: 300-100=200 -> cap now 1000. Second: 200 -> cap 800.
      const r1 = result.results[1] as { payout: number; remainingCap: number };
      const r2 = result.results[2] as { payout: number; remainingCap: number };
      expect(r1.remainingCap).toBe(1000);
      expect(r2.remainingCap).toBe(800);
    });
  });

  describe("CLI/scenario integration", () => {
    it("processes a quote-only scenario and returns a premium result", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        ],
      });
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty("premium");
    });
    it("processes a quote followed by a claim referencing the policy by index", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
          { op: "claim", policy: 0, incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] } },
        ],
      });
      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toHaveProperty("premium");
      expect(result.results[1]).toHaveProperty("payout");
      expect(result.results[1]).toHaveProperty("remainingCap");
      expect(result.results[2]).toHaveProperty("payout");
      expect(result.results[2]).toHaveProperty("remainingCap");
    });
  });
});
