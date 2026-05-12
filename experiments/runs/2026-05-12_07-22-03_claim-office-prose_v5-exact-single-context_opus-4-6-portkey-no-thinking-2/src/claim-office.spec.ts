import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting premiums", () => {
    it("should compute base premium for a single sword with processing fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // sword base premium = 100G, first insurance +10% = 110G, + 5G fee = 115G
      expect(result.results[0].premium).toBe(115);
    });
    it("should compute base premium for each item type (amulet, staff, potion)", () => {
      const makeScenario = (type: string) => ({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type, material: "steel", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // amulet base 60G, +10% first = 66G, +5G fee = 71G
      expect(processScenario(makeScenario("amulet")).results[0].premium).toBe(71);
      // staff base 80G, +10% first = 88G, +5G fee = 93G
      expect(processScenario(makeScenario("staff")).results[0].premium).toBe(93);
      // potion base 40G, +10% first = 44G, +5G fee = 49G
      expect(processScenario(makeScenario("potion")).results[0].premium).toBe(49);
    });
    it("should compute base premium for a single component", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // component base 25G, +10% first = 27.5 → ceil = 28G, +5G fee = 33G
      expect(result.results[0].premium).toBe(33);
    });
    it("should sum premiums for multiple different items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // sword 100 + amulet 60 = 160 base, +10% first = 176, +5 fee = 181
      expect(result.results[0].premium).toBe(181);
    });
    it("should apply component bundle pricing for 3 alike components", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // 3 alike components bundle = 60G base, +10% first = 66G, +5G fee = 71G
      expect(result.results[0].premium).toBe(71);
    });
    it("should add cursed item surcharge of 50%", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // sword 100G + 50% cursed = 150G base, +10% first = 165G, +5G fee = 170G
      expect(result.results[0].premium).toBe(170);
    });
    it("should add high enchantment surcharge of 30% for enchantment >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // amulet 60G + 30% enchantment = 78G base, +10% first = 85.8 → ceil 86G, +5G = 91G
      expect(result.results[0].premium).toBe(91);
    });
    it("should apply loyalty discount of 20% for customers with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // sword 100G base, +10% first insurance = 110G, -20% loyalty = 88G, +5G fee = 93G
      expect(result.results[0].premium).toBe(93);
    });
    it("should add initial assessment surcharge of 10% for first insurance", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // potion 40G base, +10% first insurance = 44G, +5G fee = 49G
      expect(result.results[0].premium).toBe(49);
    });
    it("should apply 15% discount on each contract after the first", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: sword 100G, +10% first = 110G, +5G = 115G
      expect(result.results[0].premium).toBe(115);
      // Second quote: amulet 60G, -15% discount = 51G, +5G = 56G
      expect(result.results[1].premium).toBe(56);
    });
    it("should round amounts in MHPCO's favor (ceiling)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // potion 40G, +10% first = 44G, -20% loyalty = 35.2G → ceil = 36G, +5G = 41G
      expect(result.results[0].premium).toBe(41);
    });
    it("should combine multiple surcharges and discounts correctly", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // staff 80G, +50% cursed = 120G, +30% ench = 156G base
      // +10% first = 171.6, -20% loyalty = 137.28 → ceil = 138G, +5G = 143G
      expect(result.results[0].premium).toBe(143);
    });
  });

  describe("Processing claims", () => {
    it("should apply 100G deductible per damage event", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // claim: 300G damage - 100G deductible = 200G payout
      // sword insurance value = 1000G, cap = 2000G, remaining = 2000 - 200 = 1800G
      expect(result.results[1].payout).toBe(200);
      expect(result.results[1].remainingCap).toBe(1800);
    });
    it("should pay nothing when damage is less than deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "minor scratch",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 50G damage < 100G deductible → payout = 0
      // sword insurance = 1000G, cap = 2000G, remaining = 2000G (no payout)
      expect(result.results[1].payout).toBe(0);
      expect(result.results[1].remainingCap).toBe(2000);
    });
    it("should reimburse damage to normal items fully minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 400G damage - 100G deductible = 300G payout (full reimbursement for normal item)
      // amulet insurance = 600G, cap = 1200G, remaining = 1200 - 300 = 900G
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(900);
    });
    it("should reimburse dragon material items fully minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle damage",
              damages: [{ itemType: "sword", amount: 500, material: "dragon" }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material → fully reimbursed: 500G - 100G deductible = 400G
      // sword insurance = 1000G, cap = 2000G, remaining = 2000 - 400 = 1600G
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should reimburse high enchantment items (>= 8) at 50% minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "arcane overload",
              damages: [{ itemType: "staff", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // enchantment 9 >= 8 → 50% reimbursement: 500 * 0.5 = 250, - 100G deductible = 150G
      // staff insurance = 800G, cap = 1600G, remaining = 1600 - 150 = 1450G
      expect(result.results[1].payout).toBe(150);
      expect(result.results[1].remainingCap).toBe(1450);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // potion insurance = 400G, cap = 800G
      // 1000G damage - 100G deductible = 900G, but capped at 800G
      expect(result.results[1].payout).toBe(800);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // sword insurance = 1000G, cap = 2000G
      // Claim 1: 300 - 100 deductible = 200G payout, remaining = 2000 - 200 = 1800G
      expect(result.results[1].payout).toBe(200);
      expect(result.results[1].remainingCap).toBe(1800);
      // Claim 2: 500 - 100 deductible = 400G payout, remaining = 1800 - 400 = 1400G
      expect(result.results[2].payout).toBe(400);
      expect(result.results[2].remainingCap).toBe(1400);
    });
  });

  describe("CLI integration", () => {
    it("should process a full scenario with quote and claims from JSON input", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
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
      const output = execSync(`npx tsx src/cli.ts`, {
        input,
        encoding: "utf-8",
      });
      const result = JSON.parse(output);
      // amulet 60G base, +10% first = 66, -20% loyalty = 52.8 → ceil 53, +5 fee = 58G
      expect(result.results[0].premium).toBe(58);
      // 200 - 100 deductible = 100G payout
      // amulet insurance = 600G, cap = 1200G, remaining = 1200 - 100 = 1100G
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
  });
});
