import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a single sword with base premium plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Sword base premium: 100G
      // First insurance surcharge: +10% → 110G
      // Processing fee: +5G → 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should quote different item types with their respective base premiums", () => {
      const amuletScenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet" as const, material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      };
      // Amulet base premium: 60G
      // First insurance surcharge: +10% → 66G
      // Processing fee: +5G → 71G
      expect(processScenario(amuletScenario).results[0]).toEqual({ premium: 71 });

      const staffScenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff" as const, material: "oak", enchantment: 1, cursed: false },
            ],
          },
        ],
      };
      // Staff base premium: 80G
      // First insurance surcharge: +10% → 88G
      // Processing fee: +5G → 93G
      expect(processScenario(staffScenario).results[0]).toEqual({ premium: 93 });

      const potionScenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion" as const, material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      // Potion base premium: 40G
      // First insurance surcharge: +10% → 44G
      // Processing fee: +5G → 49G
      expect(processScenario(potionScenario).results[0]).toEqual({ premium: 49 });
    });
    it("should quote multiple items by summing their base premiums plus processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
              { type: "amulet" as const, material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Sword base: 100G + Amulet base: 60G = 160G total base
      // First insurance surcharge: +10% of 160 = 16G → 176G
      // Processing fee: +5G → 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should quote components at 25G base premium each", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "component" as const, componentType: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "component" as const, componentType: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 2 components × 25G = 50G base
      // First insurance surcharge: +10% of 50 = 5G → 55G
      // Processing fee: +5G → 60G
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should quote a building block of 3 alike components at 60G instead of 75G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "component" as const, componentType: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "component" as const, componentType: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "component" as const, componentType: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 3 alike components (runes) = building block at 60G (not 3 × 25G = 75G)
      // First insurance surcharge: +10% of 60 = 6G → 66G
      // Processing fee: +5G → 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should add 50% risk surcharge for cursed items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Sword base premium: 100G
      // Cursed surcharge: +50% of 100 = 50G → 150G
      // First insurance surcharge: +10% of 150 = 15G → 165G
      // Processing fee: +5G → 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% risk surcharge for highly enchanted items (enchantment >= 5)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 6, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Sword base premium: 100G
      // Enchantment surcharge (>=5): +30% of 100 = 30G → 130G
      // First insurance surcharge: +10% of 130 = 13G → 143G
      // Processing fee: +5G → 148G
      expect(result.results[0]).toEqual({ premium: 148 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Sword base premium: 100G
      // First insurance surcharge: +10% of 100 = 10G → 110G
      // Loyalty discount (>= 2 years): -20% of 110 = 22G → 88G
      // Processing fee: +5G → 93G
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote gets +10% first insurance surcharge: 100 + 10 + 5 = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote does NOT get the surcharge: 100 + 5 = 105G
      expect(result.results[1]).toEqual({ premium: 105 });
    });
    it("should apply 15% discount on each contract after the first", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: 100G base + 10% first insurance = 110G + 5G fee = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100G base - 15% returning discount = 85G + 5G fee = 90G
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it.todo("should round premiums up (ceiling) in MHPCO's favor");
  });

  describe("Processing a claim", () => {
    it.todo("should apply 100G deductible per damage event");
    it.todo("should cap total payout per policy at twice the insurance sum");
    it.todo("should reimburse damage to highly enchanted items (enchantment >= 8) at 50%");
    it.todo("should fully reimburse damage to dragon material items");
    it.todo("should round payouts down (floor) in MHPCO's favor");
  });

  describe("CLI integration", () => {
    it.todo("should process a scenario with a quote step and return results array");
  });
});
