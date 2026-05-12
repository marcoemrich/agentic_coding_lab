import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return base premium for a single sword plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return base premium for an amulet plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("should return base premium for a staff plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });
    it("should return base premium for a potion plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 2, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(49);
    });
  });

  describe("Quote - risk surcharges", () => {
    it("should add 50% surcharge for a cursed item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(170);
    });
    it("should add 30% surcharge for a highly enchanted item (level >= 5)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(148);
    });
    it("should add both surcharges when item is cursed and highly enchanted", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(220);
    });
  });

  describe("Quote - customer discounts and surcharges", () => {
    it("should add 10% initial assessment surcharge for first insurance", () => {
      // A customer's very first quote gets +10% initial assessment surcharge
      // Sword base 100G * 1.1 + 5G = 115G
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("should add 15% discount for each contract after the first", () => {
      // Second quote in a scenario gets -15% subsequent-contract discount (no first-insurance surcharge)
      // Sword second contract: 100 * 0.85 + 5 = 90G
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].premium).toBe(90);
    });
    it("should add 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      // Loyal customer (2 years): sword first contract = 100 * 1.1 * 0.8 + 5 = 93G
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });
  });

  describe("Quote - components", () => {
    it("should price a single component at 25G base premium plus processing fee", () => {
      // Component (rune): base 25G * 1.1 (first insurance) + 5G fee = Math.ceil(27.5) + 5 = 28 + 5 = 33G
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(33);
    });
    it("should apply special 60G premium for a group of 3 alike components", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
  });

  describe("Claim - basic payout", () => {
    it("should deduct 100G deductible from a damage claim", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1800 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(1700);
      expect(result.results[1].remainingCap).toBe(300);
      expect(result.results[2].payout).toBe(300);
      expect(result.results[2].remainingCap).toBe(0);
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell", damages: [{ itemType: "sword", enchantment: 8, amount: 300 }] },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(50);
      expect(result.results[1].remainingCap).toBe(1950);
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", material: "dragon", amount: 300 }] },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(1700);
    });
  });
});
