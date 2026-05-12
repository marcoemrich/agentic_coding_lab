import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - premium calculation", () => {
    it("quotes a single sword for a new customer on their first contract", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes other main item types: amulet, staff, potion", () => {
      const amulet = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
      });
      expect(amulet).toEqual({ results: [{ premium: 71 }] });

      const staff = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }] }],
      });
      expect(staff).toEqual({ results: [{ premium: 93 }] });

      const potion = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
      });
      expect(potion).toEqual({ results: [{ premium: 49 }] });
    });
    it("quotes a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "component", material: "rune", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("quotes 3 alike components at the special bundle premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "component", material: "rune", enchantment: 0, cursed: false },
              { type: "component", material: "rune", enchantment: 0, cursed: false },
              { type: "component", material: "rune", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("applies a 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("applies a 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies a 20% loyalty discount for customers with 2 or more years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies a 15% discount for contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
  });

  describe("Claim - damage reimbursement", () => {
    it("processes a basic claim applying the 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 71 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("caps total payout at twice the policy insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "amulet", amount: 700 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 71 },
          { payout: 700, remainingCap: 500 },
          { payout: 500, remainingCap: 0 },
        ],
      });
    });
  });
});
