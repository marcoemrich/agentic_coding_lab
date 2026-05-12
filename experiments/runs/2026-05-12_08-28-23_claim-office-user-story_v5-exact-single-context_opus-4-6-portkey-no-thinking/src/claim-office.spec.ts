import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should return base premium plus processing fee for a single sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(115);
    });
    it("should return correct base premium for each item type (amulet, staff, potion)", () => {
      const quote = (type: string) =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type, material: "silver", enchantment: 0, cursed: false }],
            },
          ],
        }).results[0].premium;

      expect(quote("amulet")).toBe(71);
      expect(quote("staff")).toBe(93);
      expect(quote("potion")).toBe(49);
    });
    it("should sum premiums for multiple different items", () => {
      const result = processScenario({
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
      expect(result.results[0].premium).toBe(181);
    });
    it("should charge 25G base premium per component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(60);
    });
    it("should charge 60G for a building block of 3 alike components", () => {
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
      expect(result.results[0].premium).toBe(71);
    });
    it("should add 50% surcharge for cursed items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(170);
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(148);
    });
    it("should apply both cursed and enchantment surcharges when both apply", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 6, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(203);
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(85);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(71);
    });
    it("should apply 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(225);
      expect(result.results[1].premium).toBe(192);
    });
    it("should round premium up to whole G in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(63);
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible to damage amount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
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
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
    it("should return zero payout when damage is less than deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "scratch",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(0);
      expect(result.results[1].remainingCap).toBe(2000);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(800);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reduce remaining cap after each claim", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(200);
      expect(result.results[1].remainingCap).toBe(1000);
      expect(result.results[2].payout).toBe(300);
      expect(result.results[2].remainingCap).toBe(700);
    });
    it("should reimburse enchantment >= 8 items at 50% of damage amount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1900);
    });
    it("should fully reimburse dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(1700);
    });
    it("should round payout down to whole G in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", amount: 301 }],
            },
          },
        ],
      });
      expect(result.results[1].payout).toBe(50);
      expect(result.results[1].remainingCap).toBe(1950);
    });
  });
});
