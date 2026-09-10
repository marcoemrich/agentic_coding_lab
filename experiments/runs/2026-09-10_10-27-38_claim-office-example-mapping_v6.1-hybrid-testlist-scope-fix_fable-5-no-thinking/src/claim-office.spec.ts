import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (stdin: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: stdin,
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  describe("Quote: base premiums and processing fee", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(output.results[0]).toEqual({ premium: 5 });
    });
    it("single sword, newcomer (0 years) → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 115 });
    });
    it("single amulet, newcomer → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 71 });
    });
    it("single staff, newcomer → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 93 });
    });
    it("single potion, newcomer → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 49 });
    });
    it("single rune, newcomer → premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Component blocks of 3 alike components", () => {
    it("2 runes → 50 G base premium (newcomer premium 60 G: 50 + 5 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 60 });
    });
    it("3 runes → 60 G base premium, block applies (newcomer premium 71 G: 60 + 6 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 71 });
    });
    it("4 runes → 100 G base premium, no block — block requires exactly 3 (newcomer premium 115 G: 100 + 10 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 115 });
    });
    it("7 runes → 175 G base premium (newcomer premium 198 G: 175 + 17.5 + 5 = 197.5, rounded up in MHPCO's favor)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array(7).fill({ type: "rune" }) },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block: different types (newcomer premium 88 G: 75 + 7.5 + 5 = 87.5, rounded up)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (newcomer premium 137 G: 120 + 12 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array(3).fill({ type: "rune" }),
              ...Array(3).fill({ type: "moonstone" }),
            ],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Premium modifiers", () => {
    it("cursed surcharge applies to the cursed item's base premium only: cursed sword + plain amulet → 160 base + 50 curse + 16 first insurance + 5 fee = 231 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "amulet", cursed: false },
            ],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 231 });
    });
    it("customer with exactly 2 years → loyalty discount applies: sword → 100 + 10 first − 20 loyalty + 5 fee = 95 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 95 });
    });
    it("customer with 1 year → no loyalty discount: sword → 115 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output.results[0]).toEqual({ premium: 115 });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(output.results[0]).toEqual({ premium: 145 });
    });
    it("cursed sword with enchantment 5 → both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 195 });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge: 115 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(output.results[0]).toEqual({ premium: 115 });
    });
    it("integration: newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      expect(output.results[0]).toEqual({ premium: 165 });
    });
    it("integration: 3-year customer's second quote, cursed sword enchantment 7 → premium 160 G (loyalty, first insurance and follow-up discount all apply)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(output.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim: standard reimbursement and deductible", () => {
    it("regular steel sword (enchantment 3), damage 500 → payout 400 (full minus 100 deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune, damage 200 → payout 100 (no special clause for components)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "mishap",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("deductible applies once per damaged item: sword 500 + amulet 300 in one incident → payout 600", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
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
      expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim: special clauses (high enchantment vs. dragon material)", () => {
    it("steel sword enchantment 9, damage 1000 → payout 400 (50 % clause, then deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duel",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 → payout 700 (full reimbursement, then deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duel",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 (both clauses apply, 50 % rule wins)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duel",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 → payout 400 (threshold is ≥ 8)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duel",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("payout rounding down in MHPCO's favor: steel sword enchantment 9, damage 901 → 450.5 − 100 = 350.5 → payout 350", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duel",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Claim: payout cap (twice the insurance sum)", () => {
    it("sword insured (cap 2000): claim 1500 → payout 1400, remainingCap 600", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword insured: two successive 1500 claims → second payout reduced to remaining cap 600, remainingCap 0", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("sword + amulet → insurance sum 1600, cap 3200: sword damage 500 → payout 400, remainingCap 2800", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap based on unmodified insurance value 1000 (cap 2000): damage 500 → payout 400, remainingCap 1600", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "curse backlash",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes (block) → insurance sum 1750, cap 3500 (block discount affects premium only): sword damage 500 → payout 400, remainingCap 3100", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
  });

  describe("Multiple items of the same type", () => {
    it("policy with two swords → insurance sum 2000, cap 4000: both swords damaged 500 each → payout 800 (own deductible each), remainingCap 3200", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("more damage entries of a type than insured (two sword damages, one sword) → whole claim rejected with an error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Scenario errors", () => {
    it("quote with unknown item type (broomstick) → error, no results", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
    it("claim referencing an item not in the policy (amulet damaged, only sword insured) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("claim with negative damage amount (−200) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "paperwork error",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results to stdout: 5-year customer, amulet quote (premium 59) then claim 200 (payout 100, remainingCap 1100)", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [
                {
                  type: "amulet",
                  material: "silver",
                  enchantment: 2,
                  cursed: false,
                },
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
        }),
      );
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("unknown item type → exits non-zero, writes error to stderr, no results on stdout", () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
  });
});
