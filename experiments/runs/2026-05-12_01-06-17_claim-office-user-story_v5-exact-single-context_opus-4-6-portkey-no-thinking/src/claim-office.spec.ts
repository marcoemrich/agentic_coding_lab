import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function item(type: string, overrides: { material?: string; enchantment?: number; cursed?: boolean } = {}) {
  return {
    type,
    material: overrides.material ?? "steel",
    enchantment: overrides.enchantment ?? 0,
    cursed: overrides.cursed ?? false,
  };
}

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword with first-insurance surcharge and processing fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("sword")] }],
      });
      // Sword base premium: 100G
      // First insurance surcharge: +10% = +10G → 110G
      // Processing fee: +5G → 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should calculate base premium for a single amulet", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("amulet")] }],
      });
      // Amulet base premium: 60G
      // First insurance surcharge: +10% = +6G → 66G
      // Processing fee: +5G → 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should sum premiums for multiple items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("sword"), item("amulet")] }],
      });
      // Sword: 100G + Amulet: 60G = 160G base
      // First insurance surcharge: +10% = +16G → 176G
      // Processing fee: +5G → 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should calculate base premium for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("rune")] }],
      });
      // Rune (component) base premium: 25G
      // First insurance surcharge: +10% = ceil(2.5) = 3G → 28G
      // Processing fee: +5G → 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply building block pricing for 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("rune"), item("rune"), item("rune")] }],
      });
      // 3 alike runes = building block: 60G (instead of 3 × 25G = 75G)
      // First insurance surcharge: +10% = +6G → 66G
      // Processing fee: +5G → 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should apply 50% cursed surcharge to a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("sword", { cursed: true })] }],
      });
      // Sword base premium: 100G
      // Cursed surcharge: +50% = +50G → 150G
      // First insurance surcharge: +10% = +15G → 165G
      // Processing fee: +5G → 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should apply 30% surcharge for highly enchanted item (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("amulet", { enchantment: 5 })] }],
      });
      // Amulet base premium: 60G
      // Enchantment surcharge: +30% = +18G → 78G
      // First insurance surcharge: +10% = ceil(7.8) = 8G → 86G
      // Processing fee: +5G → 91G
      expect(result.results[0]).toEqual({ premium: 91 });
    });
    it("should apply both cursed and enchantment surcharges", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [item("sword", { cursed: true, enchantment: 6 })] }],
      });
      // Sword base premium: 100G
      // Cursed surcharge: +50% = +50G
      // Enchantment surcharge: +30% = +30G
      // Item premium: 100 + 50 + 30 = 180G
      // First insurance surcharge: +10% = +18G → 198G
      // Processing fee: +5G → 203G
      expect(result.results[0]).toEqual({ premium: 203 });
    });
    it("should apply 20% loyalty discount for long-standing customer (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote" as const, items: [item("sword")] }],
      });
      // Sword base premium: 100G
      // First insurance surcharge: +10% = +10G → 110G
      // Loyalty discount: -20% = -22G → 88G
      // Processing fee: +5G → 93G
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 15% discount on second contract instead of first-insurance surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("sword")] },
          { op: "quote" as const, items: [item("amulet")] },
        ],
      });
      // Quote 1 (first insurance): Sword 100G + 10% surcharge (10G) + 5G fee = 115G
      // Quote 2 (second contract): Amulet 60G - 15% discount (floor(9)) + 5G fee = 56G
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 56 });
    });
    it("should round amounts in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("sword")] },
          { op: "quote" as const, items: [item("rune")] },
        ],
      });
      // Quote 2 (second contract): Rune 25G
      // Second contract discount: 15% of 25 = 3.75 → floor(3.75) = 3G (MHPCO's favor: less discount)
      // 25 - 3 = 22G
      // Processing fee: +5G → 27G
      expect(result.results[1]).toEqual({ premium: 27 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible to a claim", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("sword")] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // Sword insurance value: 1000G, cap = 2 × 1000 = 2000G
      // Damage: 300G - 100G deductible = 200G payout
      // Remaining cap: 2000 - 200 = 1800G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("amulet")] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "amulet", amount: 1400 }],
            },
          },
        ],
      });
      // Amulet insurance value: 600G, cap = 2 × 600 = 1200G
      // Damage: 1400G - 100G deductible = 1300G
      // Capped at 1200G → payout = 1200G
      // Remaining cap: 1200 - 1200 = 0G
      expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
    });
    it("should reimburse at 50% for items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("sword", { enchantment: 8 })] },
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
      // Sword insurance value: 1000G, cap = 2 × 1000 = 2000G
      // Damage: 400G, enchantment >= 8 → reimbursed at 50% = 200G
      // After deductible: 200 - 100 = 100G payout
      // Remaining cap: 2000 - 100 = 1900G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("sword", { material: "dragon", enchantment: 9 })] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "tavern brawl",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword insurance value: 1000G, cap = 2 × 1000 = 2000G
      // Damage: 400G, dragon material → fully reimbursed (overrides enchantment >= 8 reduction)
      // After deductible: 400 - 100 = 300G payout
      // Remaining cap: 2000 - 300 = 1700G
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should reduce remaining cap across multiple claims on the same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [item("amulet")] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      });
      // Amulet insurance value: 600G, cap = 2 × 600 = 1200G
      // Claim 1: 300G - 100G deductible = 200G payout, remaining cap: 1200 - 200 = 1000G
      // Claim 2: 400G - 100G deductible = 300G payout, remaining cap: 1000 - 300 = 700G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
      expect(result.results[2]).toEqual({ payout: 300, remainingCap: 700 });
    });
  });
});
