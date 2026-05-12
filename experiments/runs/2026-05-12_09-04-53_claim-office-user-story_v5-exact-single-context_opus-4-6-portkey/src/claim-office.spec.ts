import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quote(items: any[], yearsWithMHPCO = 0) {
  return processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote" as const, items }],
  });
}

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a single sword for a new customer with first-insurance surcharge and processing fee", () => {
      const result = quote([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);
      // Sword base: 100G, first insurance +10% = 110G, processing fee +5G = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should quote a single amulet for a new customer", () => {
      const result = quote([
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]);
      // Amulet base: 60G, first insurance +10% = 66G, processing fee +5G = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should quote multiple items summing their base premiums", () => {
      const result = quote([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]);
      // Sword 100G + Amulet 60G = 160G, first insurance +10% = 176G, fee +5G = 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should quote a single component at 25G base premium", () => {
      const result = quote([
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]);
      // Rune (component) base: 25G, first insurance +10% = 27.5 → ceil 28G, fee +5G = 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should quote a building block of 3 alike components at 60G special premium", () => {
      const result = quote([
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]);
      // 3 alike runes = building block at 60G, first insurance +10% = 66G, fee +5G = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should apply 50% cursed-item surcharge to the item base premium", () => {
      const result = quote([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ]);
      // Sword base: 100G, cursed +50% = 150G, first insurance +10% = 165G, fee +5G = 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should apply 30% surcharge for enchantment level 5 or higher", () => {
      const result = quote([
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ]);
      // Sword base: 100G, enchantment ≥5 +30% = 130G, first insurance +10% = 143G, fee +5G = 148G
      expect(result.results[0]).toEqual({ premium: 148 });
    });
    it("should apply 20% loyalty discount for customers with 2 or more years", () => {
      const result = quote([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 3);
      // Sword base: 100G, after-first -15% = 85G, loyalty -20% = 68G, fee +5G = 73G
      expect(result.results[0]).toEqual({ premium: 73 });
    });
    it("should apply 15% after-first-contract discount on the second quote in a scenario", () => {
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
      // First quote: first insurance +10% → 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: after-first -15% → 100 * 0.85 = 85, ceil = 85 + 5 = 90G
      expect(result.results[1]).toEqual({ premium: 90 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible to a basic claim", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      // Amulet insurance value: 600G, cap: 1200G
      // Damage 200G - deductible 100G = payout 100G, remaining cap 1100G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
        ],
      });
      // Amulet insurance value: 600G, cap: 2 × 600 = 1200G
      // Claim 1: 800G - 100G deductible = 700G payout, remaining cap: 1200 - 700 = 500G
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 500 });
      // Claim 2: 800G - 100G deductible = 700G, but capped at remaining 500G
      expect(result.results[2]).toEqual({ payout: 500, remainingCap: 0 });
    });
    it("should reimburse at 50% for items with enchantment level 8 or higher", () => {
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
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword insurance value: 1000G, cap: 2000G
      // Enchantment ≥ 8: reimburse at 50% → 400 * 50% = 200G effective damage
      // 200G - 100G deductible = 100G payout, remaining cap: 2000 - 100 = 1900G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword insurance value: 1000G, cap: 2000G
      // Dragon material: fully reimbursed (enchantment ≥8 halving does NOT apply)
      // 400G - 100G deductible = 300G payout, remaining cap: 2000 - 300 = 1700G
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
  });

  describe("CLI", () => {
    it("should read JSON from stdin and write results JSON to stdout", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
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
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
        cwd: process.cwd(),
      });
      const result = JSON.parse(output.trim());
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });
});
