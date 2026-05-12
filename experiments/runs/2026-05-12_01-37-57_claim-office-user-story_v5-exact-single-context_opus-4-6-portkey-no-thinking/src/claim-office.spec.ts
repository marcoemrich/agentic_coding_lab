import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword for a first-time customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 100G, first-insurance surcharge +10% = 110G, + 5G fee = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should calculate base premium for a single amulet for a first-time customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 60G, first-insurance surcharge +10% = 66G, + 5G fee = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should calculate base premium for a single staff and a single potion together for a first-time customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 80G + 40G = 120G, first-insurance surcharge +10% = 132G, + 5G fee = 137G
      expect(result.results[0]).toEqual({ premium: 137 });
    });
    it("should calculate base premium for a single component for a first-time customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // component base 25G, first-insurance surcharge +10% = 27.5 → ceil 28G, + 5G fee = 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply building block discount when 3 alike components are present (60G instead of 75G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 3 alike components = building block: 60G instead of 75G
      // first-insurance surcharge +10% = 66G, + 5G fee = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should add 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // base 100G, cursed +50% = 150G, first-insurance surcharge +10% = 165G, + 5G fee = 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for an item with enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // base 60G, enchantment >= 5 +30% = 78G, first-insurance +10% = 85.8 → round 86G, + 5G fee = 91G
      expect(result.results[0]).toEqual({ premium: 91 });
    });
    it("should apply both cursed and high-enchantment surcharges on the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 6, cursed: true },
            ],
          },
        ],
      });
      // base 80G, cursed +50% = 120G, enchantment >= 5 +30% = 156G
      // first-insurance +10% = 171.6 → round 172G, + 5G fee = 177G
      expect(result.results[0]).toEqual({ premium: 177 });
    });
    it("should apply 20% loyalty discount for a customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 100G, first-insurance +10% = 110G, loyalty -20% = 88G, + 5G fee = 93G
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 10% initial assessment surcharge for a first insurance (0 prior contracts)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 40G, first-insurance surcharge +10% = 44G, + 5G fee = 49G
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should apply 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First contract: base 100G, first-insurance +10% = 110G, + 5G = 115G
      // Second contract: base 100G, 15% discount = 85G, + 5G = 90G
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should round premiums in MHPCO's favor (ceiling)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // base 40G, enchantment +30% = 52G, first-insurance +10% = 57.2G
      // ceiling → 58G, + 5G fee = 63G
      expect(result.results[0]).toEqual({ premium: 63 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible to a single damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 300 },
            ],
          },
        ],
      });
      // Quote result: premium 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Claim result: 300G damage - 100G deductible = 200G payout
      // Cap = 2 × 1000G = 2000G, remainingCap = 2000 - 200 = 1800G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 2500 },
            ],
          },
        ],
      });
      // Cap = 2 × 1000G = 2000G
      // Damage 2500G - 100G deductible = 2400G, capped at 2000G
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should reimburse damage to items with enchantment >= 8 at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 300 },
            ],
          },
        ],
      });
      // Enchantment >= 8: reimbursed at 50% of damage
      // 300G × 50% = 150G reimbursable, - 100G deductible = 50G payout
      // Cap = 2 × 1000G = 2000G, remainingCap = 2000 - 50 = 1950G
      expect(result.results[1]).toEqual({ payout: 50, remainingCap: 1950 });
    });
    it("should fully reimburse damage to items made of dragon material regardless of enchantment", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 10, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 300 },
            ],
          },
        ],
      });
      // Dragon material: fully reimbursed regardless of enchantment >= 8
      // 300G - 100G deductible = 200G payout (no 50% reduction)
      // Cap = 2 × 1000G = 2000G, remainingCap = 2000 - 200 = 1800G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 300 },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 500 },
            ],
          },
        ],
      });
      // Cap = 2 × 1000G = 2000G
      // First claim: 300 - 100 deductible = 200G payout, remainingCap = 1800G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
      // Second claim: 500 - 100 deductible = 400G payout, remainingCap = 1800 - 400 = 1400G
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 1400 });
    });
    it("should round payouts in MHPCO's favor (floor)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 301 },
            ],
          },
        ],
      });
      // Enchantment >= 8: 301 × 0.5 = 150.5G, - 100G deductible = 50.5G
      // Floor (MHPCO's favor) → 50G payout
      // Cap = 2 × 1000G = 2000G, remainingCap = 2000 - 50 = 1950G
      expect(result.results[1]).toEqual({ payout: 50, remainingCap: 1950 });
    });
  });

  describe("Scenario processing", () => {
    it("should process a quote step and return premium in results", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Verify the result structure: results array with premium object
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty("premium");
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should process a claim step referencing a prior quote and return payout and remainingCap", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 200 },
            ],
          },
        ],
      });
      // Quote result: premium for staff
      expect(result.results[0]).toHaveProperty("premium");
      // Claim result: 200 - 100 deductible = 100G payout
      // Cap = 2 × 800G = 1600G, remainingCap = 1600 - 100 = 1500G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("should process multiple steps sequentially in a single scenario", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policyStepIndex: 0,
            damageEvents: [
              { itemIndex: 0, amount: 300 },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results).toHaveLength(3);
      // Step 0: quote sword, first insurance +10%: 100 × 1.1 = 110, + 5 = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Step 1: claim 300G on sword, 300 - 100 deductible = 200G payout
      // Cap = 2 × 1000 = 2000, remainingCap = 1800
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
      // Step 2: quote amulet, subsequent contract -15%: 60 × 0.85 = 51, + 5 = 56G
      expect(result.results[2]).toEqual({ premium: 56 });
    });
  });
});
