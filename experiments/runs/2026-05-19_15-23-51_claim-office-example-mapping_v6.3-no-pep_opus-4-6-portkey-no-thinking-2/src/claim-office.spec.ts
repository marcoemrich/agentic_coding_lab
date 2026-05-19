import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium plus fee for a single sword", () => {
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
    it("returns base premium plus fee for a single amulet", () => {
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
    it("returns base premium plus fee for a single staff", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns base premium plus fee for a single potion", () => {
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
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns base premium plus fee for a single component (rune)", () => {
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
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("sums base premiums for multiple different items", () => {
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
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component blocks", () => {
    it("charges 60 G for a block of exactly 3 alike components", () => {
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
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("charges individual premiums for 2 alike components (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("charges individual premiums for 4 alike components (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("treats different component types separately for block eligibility", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("applies two separate blocks for 3 runes and 3 moonstones", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item base premium", () => {
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
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment >= 5", () => {
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
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
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
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
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
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
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
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customer with < 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
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
    it("applies 10% first insurance surcharge to every quote", () => {
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
      // 60 base + 6 first insurance (10% of 60) = 66 + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("applies 15% follow-up discount on second and subsequent contracts", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO's favor", () => {
      // 2 runes + 1 moonstone: 25+25+25=75 base. First ins: 7.5. Total: 82.5 -> ceil = 83 + 5 = 88
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword yields 165 G", () => {
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
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchantment sword yields 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
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
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // Second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible to a single damage event", () => {
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
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses damage to a regular item fully minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      // rune: 200 damage - 100 deductible = 100 payout
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("applies deductible per damaged item in a multi-damage event", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      // sword: 500-100=400, amulet: 300-100=200, total=600
      // cap = 2*(1000+600) = 3200, remaining = 3200-600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - enchantment and material clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8", () => {
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
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // 1000 * 50% = 500, minus 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses fully for dragon-material items", () => {
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
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // dragon material: full reimbursement, 800 - 100 deductible = 700
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when both high-enchantment and dragon-material apply", () => {
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
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // both clauses: 50% wins. 1000 * 0.5 = 500, minus 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses dragon-material item fully when enchantment < 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "dragon", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "staff", amount: 600 }],
            },
          },
        ],
      });
      // dragon material, enchantment < 8: full reimbursement. 600 - 100 deductible = 500
      // cap = 2*800 = 1600, remaining = 1600 - 500 = 1100
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1100 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "potion", amount: 900 }],
            },
          },
        ],
      });
      // potion: 400 G insurance value, cap = 2*400 = 800
      // claim: 900 - 100 = 800, but cap is 800, so payout = 800, remaining = 0
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
        ],
      });
      // potion: 400 G insurance, cap = 2*400 = 800
      // claim 1: 400 - 100 = 300, remaining = 800 - 300 = 500
      // claim 2: 400 - 100 = 300, remaining = 500 - 300 = 200
      // claim 3: 400 - 100 = 300, but only 200 remaining, payout = 200, remaining = 0
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 500 });
      expect(result.results[2]).toEqual({ payout: 300, remainingCap: 200 });
      expect(result.results[3]).toEqual({ payout: 200, remainingCap: 0 });
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
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
              damages: [{ itemType: "sword", amount: 333 }],
            },
          },
        ],
      });
      // enchantment >= 8: 333 * 0.5 = 166.5, floor = 166, minus 100 deductible = 66
      // cap = 2*1000 = 2000, remaining = 2000 - 66 = 1934
      expect(result.results[1]).toEqual({ payout: 66, remainingCap: 1934 });
    });
  });

  describe("Validation", () => {
    it("rejects unknown item type in quote", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "banana", material: "peel", enchantment: 0, cursed: false },
              ],
            },
          ],
        })
      ).toThrow();
    });
    it("rejects claim referencing item not in policy", () => {
      expect(() =>
        processScenario({
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
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
      expect(() =>
        processScenario({
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
                damages: [{ itemType: "sword", amount: -100 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("rejects more damage entries of a type than policy covers", () => {
      expect(() =>
        processScenario({
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
                  { itemType: "sword", amount: 300 },
                  { itemType: "sword", amount: 200 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
  });

  describe("CLI", () => {
    it("processes a full scenario with quote and claim via CLI", async () => {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);
      const input = JSON.stringify({
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
        ],
      });
      const { stdout } = await execAsync(`echo '${input}' | npx tsx src/cli.ts`);
      const result = JSON.parse(stdout);
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });
});
