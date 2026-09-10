// MHPCO Claim Office kata — test list derived from prompt.md
//
// Unless stated otherwise, quote scenarios use a newcomer customer
// (yearsWithMHPCO: 0) making their first quote, so the policy-wide
// modifiers are: +10 % first insurance (of the policy base premium)
// and the +5 G processing fee, with final rounding up.
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums (newcomer, first quote)", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(results).toEqual([{ premium: 5 }]);
    });
    it("single sword (base 100 G) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("single amulet (base 60 G) → premium 71 G (60 + 6 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(results).toEqual([{ premium: 71 }]);
    });
    it("single staff (base 80 G) → premium 93 G (80 + 8 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(results).toEqual([{ premium: 93 }]);
    });
    it("single potion (base 40 G) → premium 49 G (40 + 4 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(results).toEqual([{ premium: 49 }]);
    });
  });

  describe("quote — component blocks of 3 alike components", () => {
    it("2 runes (base 50 G, no block) → premium 60 G (50 + 5 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 60 }]);
    });
    it("3 runes (base 60 G, block applies) → premium 71 G (60 + 6 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(results).toEqual([{ premium: 71 }]);
    });
    it("4 runes (base 100 G, no block — block requires exactly 3) → premium 115 G (100 + 10 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("7 runes (base 175 G) → premium 198 G (175 + 17.5 + 5 = 197.5 rounded up in MHPCO's favor)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });
      expect(results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone (base 75 G, no block: different types) → premium 88 G (75 + 7.5 + 5 = 87.5 rounded up)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });
      expect(results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones (base 120 G, two separate blocks) → premium 137 G (120 + 12 + 5)", () => {
      const { results } = runScenario({
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
      expect(results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed steel sword, enchantment 3 → premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → premium 145 G (100 + 30 + 10 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with enchantment 4 → only curse surcharge applies → premium 165 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 195 }]);
    });
    it("customer with exactly 2 years with MHPCO → loyalty discount applies: sword → premium 95 G (100 − 20 loyalty + 10 first insurance + 5 fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 95 }]);
    });
    it("modifier scope: cursed sword + plain amulet → item surcharge on the cursed item's base only → premium 231 G (160 policy base + 50 curse + 16 first insurance + 5 fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true }, { type: "amulet" }],
          },
        ],
      });
      expect(results).toEqual([{ premium: 231 }]);
    });
    it("long-standing customer's second contract: 3 years, second quote, cursed sword enchantment 7 → premium 160 G (100 + 50 + 30 − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — reimbursement and deductible", () => {
    it("regular steel sword (enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible), remainingCap 1600 G", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (no enchantment/material), damage 200 G → payout 100 G (full reimbursement minus deductible)", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % high-enchantment clause, then deductible)", () => {
      const { results } = runScenario({
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
              cause: "explosion",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full reimbursement clause, then deductible)", () => {
      const { results } = runScenario({
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
              cause: "battle",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (both clauses apply, the 50 % rule wins)", () => {
      const { results } = runScenario({
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
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies at the threshold)", () => {
      const { results } = runScenario({
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
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (100 G deductible once per damaged item)", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("payout rounding in MHPCO's favor: enchantment-9 sword, damage 901 G → 450.5 − 100 = 350.5 → payout 350 G (rounded down)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "mishap",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — insurance sum and payout cap", () => {
    it("policy with two swords → insurance sum 2000 G, cap 4000 G; both damaged 500 G each → payout 800 G, remainingCap 3200 G", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("cap exhaustion: sword (cap 2000 G), first claim 1500 G → payout 1400 G, remainingCap 600 G; second claim 1500 G → payout 600 G, remainingCap 0 G", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value (premium modifiers do not raise the cap)", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G (block discount affects the premium only, not the insurance sum)", () => {
      const { results } = runScenario({
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
      expect(results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
  });

  describe("CLI", () => {
    const runCli = (input: unknown) =>
      spawnSync("node", ["node_modules/tsx/dist/cli.mjs", "src/cli.ts"], {
        input: JSON.stringify(input),
        encoding: "utf8" as const,
      });

    it("reads scenario JSON from stdin, writes results to stdout: 5-year customer, amulet quote → premium 59 G; claim 200 G → payout 100 G, remainingCap 1100 G", () => {
      const result = runCli({
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
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("quote with an unknown item type (broomstick) → non-zero exit, error on stderr, no results on stdout", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim for an item not part of the policy (amulet damaged, only sword insured) → non-zero exit, error on stderr", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → non-zero exit, error on stderr", () => {
      const result = runCli({
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
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("damage entry with amount −200 → non-zero exit, error on stderr", () => {
      const result = runCli({
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
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
  });
});
