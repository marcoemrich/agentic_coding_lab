import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quoting a premium", () => {
    it("should quote a single sword for a new customer on their first contract", () => {
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
    it("should quote other main item types (amulet, staff, potion) with correct base premiums", () => {
      const amuletResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] }],
      });
      expect(amuletResult).toEqual({ results: [{ premium: 71 }] });

      const staffResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
      });
      expect(staffResult).toEqual({ results: [{ premium: 93 }] });

      const potionResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
      });
      expect(potionResult).toEqual({ results: [{ premium: 49 }] });
    });
    it("should quote a single component at 25 G base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
          },
        ],
      });
      // base 25 + ceil(25 * 0.10) = 25 + 3 = 28 + 5 fee = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should apply a special 60 G base premium for a triple of the same component", () => {
      const result = processScenario({
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
      // triple component: special base 60 G + ceil(60 * 0.10) = 66 G + 5 fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should add a 50 % risk surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      // base 100 + ceil(100*0.10) first-contract + ceil(100*0.50) cursed + 5 fee
      // = 100 + 10 + 50 + 5 = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add a 30 % risk surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      // base 100 + ceil(100*0.10) first-contract + ceil(100*0.30) high-enchant + 5 fee
      // = 100 + 10 + 30 + 5 = 145
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should apply a 20 % loyalty discount for a long-standing customer (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });
      // base 100 + ceil(100*0.10) first-contract - floor(100*0.20) loyalty + 5 fee
      // = 100 + 10 - 20 + 5 = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should apply 10 % initial assessment surcharge on a customer's first contract and 15 % discount on subsequent contracts", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
          },
        ],
      });
      // First contract (sword): 100 + ceil(100*0.10) + 5 = 115
      // Subsequent contract (amulet): 60 - floor(60*0.15) + 5 = 60 - 9 + 5 = 56
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 56 }] });
    });
    it("should quote multiple items and sum their premiums with a single 5 G processing fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // sword: 100 + ceil(100*0.10) = 110
      // amulet: 60 + ceil(60*0.10) = 66
      // combined + single 5 G fee: 110 + 66 + 5 = 181
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("processing a claim", () => {
    it("should deduct 100 G deductible from damage and return payout and remainingCap", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Quote: sword, new customer, first contract: 100 + ceil(100*0.10) + 5 = 115
      // Claim: damage 400 - 100 deductible = 300 payout, remainingCap = 2*1000 - 300 = 1700
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 300, remainingCap: 1700 },
        ],
      });
    });
    it("should cap total payout at twice the insurance sum across multiple claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
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
      // Quote: amulet, new customer, first contract: 60 + ceil(60*0.10) + 5 = 71
      // insuranceSum = 600, cap = 1200
      // Claim 1: damage 800 - 100 deductible = 700, remainingCap = 1200 - 700 = 500
      // Claim 2: damage 700 - 100 deductible = 600, but remaining cap is 500 → payout = 500, remainingCap = 0
      expect(result).toEqual({
        results: [
          { premium: 71 },
          { payout: 700, remainingCap: 500 },
          { payout: 500, remainingCap: 0 },
        ],
      });
    });
    it("should reimburse at 50 % of damage for items with enchantment level >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon breath",
              damages: [{ itemType: "sword", amount: 500, enchantment: 8 }],
            },
          },
        ],
      });
      // Quote: sword, new customer, first contract: 100 + ceil(100*0.10) + 5 = 115
      // Claim: enchantment >= 8 → 50% reimbursement rate: floor(500 * 0.50) = 250
      // payout = 250 - 100 deductible = 150, remainingCap = 2000 - 150 = 1850
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 150, remainingCap: 1850 },
        ],
      });
    });
    it("should reimburse 100 % of damage for items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon breath",
              damages: [{ itemType: "sword", amount: 600, enchantment: 8, material: "dragon" }],
            },
          },
        ],
      });
      // Quote: sword, new customer, first contract: 100 + ceil(100*0.10) + 5 = 115
      // Claim: dragon material → 100% reimbursement overrides enchantment >= 8 reduction
      // Without dragon: reimbursable = floor(600 * 0.50) = 300, payout = 300 - 100 = 200
      // With dragon:    reimbursable = 600 (full), payout = 600 - 100 = 500, remainingCap = 2000 - 500 = 1500
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 500, remainingCap: 1500 },
        ],
      });
    });
  });
});
