import { describe, it, expect } from "vitest";
import { spawnSync } from "child_process";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5G premium for empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("should return 115G for a single sword (100G base + 10G first insurance + 5G fee)", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 71G for a single amulet (60G base + 6G first insurance + 5G fee)", () => {
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
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 93G for a staff and 49G for a potion", () => {
      const staffResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(staffResult.results[0]).toEqual({ premium: 93 });

      const potionResult = processScenario({
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
      expect(potionResult.results[0]).toEqual({ premium: 49 });
    });
    it("should return 33G for a single rune (25G base + 2.5G first insurance + 5G fee, ceil)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should return 71G for 3 runes (60G block base + 6G first insurance + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 60G for 2 runes (50G base + 5G first insurance + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should return 115G for 4 runes (100G base, no block + 10G first insurance + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 88G for 2 runes + 1 moonstone (75G base + 7.5G first insurance + 5G fee, ceil)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("should return 137G for 3 runes + 3 moonstones (120G two blocks + 12G first insurance + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - premium modifiers", () => {
    it("should add 50% surcharge for cursed items on the item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // 100G base + 50G curse (50% of 100) + 10G first insurance (10% of 100) + 5G fee = 165G
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should add 30% surcharge for enchantment level >= 5 on the item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // 100G base + 30G enchantment (30% of 100) + 10G first insurance (10% of 100) + 5G fee = 145G
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should apply both cursed and high-enchantment surcharges on same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      // 100G base + 50G cursed (50% of 100) + 30G enchantment (30% of 100) + 10G first insurance (10% of 100) + 5G fee = 195G
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("should apply item-specific surcharges only to affected item in multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base: 100 + 60 = 160G, cursed surcharge on sword only: 50G (50% of 100)
      // first insurance: 10% of 160 = 16G, fee: 5G → 160 + 50 + 16 + 5 = 231G
      expect(result.results[0]).toEqual({ premium: 231 });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100G base - 20G loyalty (20% of 100) + 10G first insurance (10% of 100) + 5G fee = 95G
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should apply 10% first insurance surcharge to every quote", () => {
      // First insurance surcharge applies to every quote, even for loyal customers
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 60G base - 12G loyalty (20% of 60) + 6G first insurance (10% of 60) + 5G fee = 59G
      expect(result.results[0]).toEqual({ premium: 59 });
    });
    it("should apply 15% follow-up discount on each contract after the first", () => {
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
      // First quote: 100 base + 10 first insurance + 5 fee = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 base + 10 first insurance - 15 follow-up (15% of 100) + 5 fee = 100G
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("should always add 5G processing fee at the end", () => {
      // Verify fee is present even with all modifiers active
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [],
          },
        ],
      });
      // Empty items: 0 base, all modifiers are 0, fee = 5G
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("should round premiums up (in MHPCO's favor)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25G base - 5G loyalty (20% of 25) + 2.5G first insurance (10% of 25) + 5G fee = 27.5G → ceil = 28G
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - integration", () => {
    it("should compute 165G for newcomer with cursed sword (100+50+10+5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // 100G base + 50G curse (50% of 100) + 10G first insurance (10% of 100) + 5G fee = 165G
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should compute 160G for long-standing customer's second contract with cursed enchanted sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // Second quote: 100G base + 50G curse + 30G enchantment - 20G loyalty + 10G first insurance - 15G follow-up = 155G + 5G fee = 160G
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim - basic processing", () => {
    it("should apply 100G deductible per damaged item", () => {
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
      // Sword insurance value 1000G, cap = 2000G
      // Damage 500G - 100G deductible = 400G payout
      // remainingCap = 2000 - 400 = 1600G
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse regular item damage minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      // Regular steel sword, enchantment 3 (no special clause): full reimbursement minus deductible
      // 300G damage - 100G deductible = 200G payout
      // cap = 2 * 1000 = 2000, remainingCap = 2000 - 200 = 1800
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should reimburse at 50% for items with enchantment >= 8, then apply deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });
      // Enchantment 9 >= 8: 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon-material items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 800 },
              ],
            },
          },
        ],
      });
      // Dragon material: full reimbursement, enchantment 5 < 8 so no 50% clause
      // 800G damage - 100G deductible = 700G payout
      // cap = 2000, remainingCap = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% when item is both dragon-material and enchantment >= 8", () => {
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
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });
      // Both dragon-material and enchantment >= 8: 50% rule wins
      // 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should cap total payout at 2x insurance sum", () => {
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
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 2500 },
              ],
            },
          },
        ],
      });
      // Sword insurance value 1000G, cap = 2000G
      // Damage 2500 - 100 deductible = 2400, but capped at 2000
      // payout = 2000, remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across multiple claims on same policy", () => {
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
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // Cap = 2000. First claim: 1500 - 100 = 1400, remainingCap = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // Second claim: 1500 - 100 = 1400 desired, but capped at 600, remainingCap = 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should apply deductible per damaged item in multi-damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      // Sword: 500 - 100 = 400, Amulet: 300 - 100 = 200, total = 600
      // insurance sum = 1000 + 600 = 1600, cap = 3200
      // remainingCap = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should round payouts down (in MHPCO's favor)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 501 },
              ],
            },
          },
        ],
      });
      // Enchantment 9 >= 8: 50% of 501 = 250.5, minus 100 deductible = 150.5
      // Rounded down (MHPCO's favor) = 150
      // cap = 2000, remainingCap = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Claim - validation", () => {
    it("should reject claim with damage for item not in policy", () => {
      expect(() => processScenario({
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
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });
    it("should reject claim with more damage entries of a type than policy covers", () => {
      expect(() => processScenario({
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
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });
    it("should reject claim with negative damage amount", () => {
      expect(() => processScenario({
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
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: -200 },
              ],
            },
          },
        ],
      })).toThrow();
    });
  });

  describe("Quote - validation", () => {
    it("should reject unknown item type", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      })).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("should read JSON from stdin and write results JSON to stdout", () => {
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
      const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input,
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("should process multiple steps sequentially with claim referencing earlier quote", () => {
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
              damages: [
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input,
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      // Quote: 60 base - 12 loyalty (20% of 60) + 6 first insurance (10% of 60) + 5 fee = 59
      // Claim: 200 - 100 deductible = 100 payout, cap = 1200, remaining = 1100
      expect(output).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    });
    it("should exit with non-zero status on validation errors", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input,
        encoding: "utf-8",
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
  });
});
