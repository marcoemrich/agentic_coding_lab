import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword (100G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(115);
    });
    it("should calculate base premium for each main item type (amulet, staff, potion)", () => {
      const amuletResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(amuletResult.results[0].premium).toBe(71);

      const staffResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(staffResult.results[0].premium).toBe(93);

      const potionResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(potionResult.results[0].premium).toBe(49);
    });
    it("should sum base premiums for multiple different items plus processing fee", () => {
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
    it("should calculate base premium for a single component (25G + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "component", componentType: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0].premium).toBe(33);
    });
    it("should apply building block pricing for 3 alike components (60G instead of 75G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "component", componentType: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "component", componentType: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "component", componentType: "rune", material: "stone", enchantment: 0, cursed: false },
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
    it("should apply both cursed and enchantment surcharges on the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
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
      expect(result.results[0].premium).toBe(93);
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First insurance gets 10% initial assessment surcharge
      expect(result.results[0].premium).toBe(115);
      // Second insurance does NOT get the 10% surcharge, but gets 15% multi-contract discount
      expect(result.results[1].premium).toBe(90);
    });
    it("should apply 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Second contract gets 15% discount: 100 - floor(100 * 15/100) = 85, + 5 fee = 90
      expect(result.results[1].premium).toBe(90);
    });
    it("should round all amounts to whole G in MHPCO's favor", () => {
      // Amulet (60G base) for loyal customer: fractional surcharge and discount
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // itemTotal = 60
      // first insurance surcharge: ceil(60 * 10 / 100) = ceil(6) = 6 → premiumBeforeFee = 66
      // loyalty discount: floor(66 * 20 / 100) = floor(13.2) = 13 → premiumBeforeFee = 53
      // + 5 fee = 58
      expect(result.results[0].premium).toBe(58);
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
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
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // Payout = 500 - 100 (deductible) = 400
      expect(result.results[1].payout).toBe(400);
      // Cap = 2 * 1000 (sword insurance value) = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 2500 },
              ],
            },
          },
        ],
      });
      // Cap = 2 * 1000 = 2000, damage after deductible = 2400, capped at 2000
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reimburse damage to highly enchanted items (>= 8) at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
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
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // 50% of 500 = 250, minus 100 deductible = 150
      expect(result.results[1].payout).toBe(150);
      expect(result.results[1].remainingCap).toBe(1850);
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle damage",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // Dragon material: fully reimbursed (overrides enchantment >= 8 penalty)
      // 500 - 100 (deductible) = 400
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // First claim: 500 - 100 = 400, remainingCap = 2000 - 400 = 1600
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
      // Second claim: 300 - 100 = 200, remainingCap = 1600 - 200 = 1400
      expect(result.results[2].payout).toBe(200);
      expect(result.results[2].remainingCap).toBe(1400);
    });
  });

  describe("Scenario processing", () => {
    it("should process a quote step and return premium", () => {
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
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty("premium");
      // sword base 100 + 10% first = 110 + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });
    it("should process a claim step referencing a prior quote and return payout and remainingCap", () => {
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
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "amulet", amount: 250 }],
            },
          },
        ],
      });
      // Quote: 60 base + 6 (10% first) = 66 - 13 (20% loyalty) = 53 + 5 fee = 58
      expect(result.results[0].premium).toBe(58);
      // First claim: 200 - 100 deductible = 100, cap = 1200, remaining = 1100
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
      // Second claim: 250 - 100 deductible = 150, remaining = 1100 - 150 = 950
      expect(result.results[2].payout).toBe(150);
      expect(result.results[2].remainingCap).toBe(950);
    });
  });
});
