import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword with first insurance surcharge and processing fee", () => {
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

      // base premium 100G + 10% first insurance surcharge (10G) + 5G fee = 115G
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should calculate correct base premium for each main item type", () => {
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

      // amulet: 60 + 10% (6) + 5 fee = 71G
      expect(processScenario(amuletScenario)).toEqual({ results: [{ premium: 71 }] });
      // staff: 80 + 10% (8) + 5 fee = 93G
      expect(processScenario(staffScenario)).toEqual({ results: [{ premium: 93 }] });
      // potion: 40 + 10% (4) + 5 fee = 49G
      expect(processScenario(potionScenario)).toEqual({ results: [{ premium: 49 }] });
    });
    it("should calculate premium for a single component", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" as const, material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // component base premium 25G + 10% first insurance surcharge (2.5 → ceil to 3G) + 5G fee = 33G
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should sum premiums for multiple items in a quote", () => {
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

      // sword 100 + amulet 60 = 160, +10% first insurance = 176, +5 fee = 181G
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("should apply block pricing of 60G for 3 alike components", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" as const, material: "stone", enchantment: 0, cursed: false },
              { type: "rune" as const, material: "stone", enchantment: 0, cursed: false },
              { type: "rune" as const, material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // 3 alike components = block pricing 60G, +10% = 66, +5 fee = 71G
      expect(result).toEqual({ results: [{ premium: 71 }] });
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

      // sword 100 + 50% cursed surcharge = 150, +10% first insurance = 165, +5 fee = 170G
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add 30% risk surcharge for highly enchanted items with enchantment level >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff" as const, material: "oak", enchantment: 5, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // staff 80 + 30% enchantment surcharge = 104, +10% first insurance = 114.4 → ceil 115, +5 fee = 120G
      expect(result).toEqual({ results: [{ premium: 120 }] });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years of business", () => {
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

      // sword 100, loyalty -20% = 80, +5 fee = 85G (no first insurance surcharge)
      expect(result).toEqual({ results: [{ premium: 85 }] });
    });
    it("should apply 15% discount on contracts after the first with no first insurance surcharge", () => {
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
              { type: "amulet" as const, material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // 1st quote: sword 100 + 10% first insurance = 110 + 5 fee = 115G
      // 2nd quote: amulet 60 - 15% multi-contract = 51 + 5 fee = 56G
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 56 }],
      });
    });
    it("should round amounts in MHPCO's favor", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet" as const, material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // amulet 60 + 30% enchantment = 78, +10% first insurance = 85.8 → ceil to 86 (MHPCO's favor), +5 fee = 91G
      expect(result).toEqual({ results: [{ premium: 91 }] });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // quote: sword 100 - 20% loyalty = 80 + 5 fee = 85G
      // claim: 300 damage - 100 deductible = 200 payout, cap = 2×1000 = 2000, remaining = 2000 - 200 = 1800
      expect(result).toEqual({
        results: [
          { premium: 85 },
          { payout: 200, remainingCap: 1800 },
        ],
      });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion" as const, material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 600 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // potion insurance = 400G, cap = 2×400 = 800G
      // claim 1: 500 - 100 deductible = 400 payout, remaining cap = 800 - 400 = 400
      // claim 2: 600 - 100 deductible = 500, but capped at 400, remaining cap = 0
      expect(result).toEqual({
        results: [
          { premium: 37 },
          { payout: 400, remainingCap: 400 },
          { payout: 400, remainingCap: 0 },
        ],
      });
    });
    it("should reimburse damage to items with enchantment >= 8 at 50%", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet" as const, material: "silver", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // amulet 60 + 30% enchantment surcharge = 78, -20% loyalty = 62.4 → ceil 63, +5 fee = 68G
      // amulet insurance = 600G, cap = 1200G
      // enchantment >= 8 → reimbursed at 50%: 400 * 50% = 200 eligible
      // 200 - 100 deductible = 100 payout, remaining cap = 1200 - 100 = 1100
      expect(result).toEqual({
        results: [
          { premium: 68 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword" as const, material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // sword insurance = 1000G, cap = 2000G
      // dragon material → fully reimbursed (overrides enchantment >= 8 rule)
      // 500 full reimbursement - 100 deductible = 400 payout, remaining = 2000 - 400 = 1600
      expect(result).toEqual({
        results: [
          { premium: 109 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });

  describe("CLI", () => {
    it("should read JSON scenario from stdin and write results to stdout", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
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

      const output = execSync("npx tsx src/cli.ts", {
        input,
        encoding: "utf-8",
      });

      expect(JSON.parse(output)).toEqual({ results: [{ premium: 115 }] });
    });
  });
});
