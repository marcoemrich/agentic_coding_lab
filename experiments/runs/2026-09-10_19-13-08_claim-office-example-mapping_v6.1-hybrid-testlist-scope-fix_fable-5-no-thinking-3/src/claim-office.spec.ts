import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

// Note on expected premiums: every quote step carries the 10 % first
// insurance surcharge (10 % of the policy base premium) and the 5 G
// processing fee; quotes after the first also get the 15 % follow-up
// discount. Claims: 100 G deductible per damage entry, cap = 2 × insurance
// sum. Final amounts round in the MHPCO's favor (premiums up, payouts down).

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(output).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword (base 100) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("single amulet (base 60) → premium 71 G (60 + 6 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("single staff (base 80) → premium 93 G (80 + 8 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 93 }] });
    });
    it("single potion (base 40) → premium 49 G (40 + 4 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("quote: component blocks (block of 3 alike components)", () => {
    it("2 runes (base 50) → premium 60 G (50 + 5 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes form a block (base 60) → premium 71 G (60 + 6 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes: no block, block requires exactly 3 (base 100) → premium 115 G", () => {
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
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes (base 175) → premium 198 G (175 + 17.5 + 5 = 197.5, rounded up)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array(7).fill({ type: "rune" }) },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone: no block across different types (base 75) → premium 88 G (87.5 rounded up)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones: two separate blocks (base 120) → premium 137 G (120 + 12 + 5)", () => {
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
      expect(output).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote: premium modifiers", () => {
    it("newcomer with a cursed sword → premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
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
      expect(output).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → premium 145 G (100 + 30 + 10 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 5 }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 4 }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years → loyalty discount applies → sword premium 95 G (100 − 20 + 10 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 0 years → no loyalty discount → sword premium 115 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("modifier scope: cursed sword + plain amulet → curse surcharge on the sword's base only → premium 231 G (160 + 50 + 16 + 5)", () => {
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
      expect(output).toEqual({ results: [{ premium: 231 }] });
    });
    it("long-standing customer's second contract (cursed sword, enchantment 7) → premium 160 G (100 + 50 + 30 − 20 + 10 − 15 + 5)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500 → payout 400 G (500 − 100 deductible)", () => {
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
      expect(output).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (no enchantment/material), damage 200 → payout 100 G", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "chipped",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
    it("deductible applies once per damaged item: sword 500 + amulet 300 in one incident → payout 600 G", () => {
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
      expect(output).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
  });

  describe("claim: special reimbursement clauses", () => {
    it("steel sword, enchantment 9, damage 1000 → payout 400 G (50 % clause, then deductible)", () => {
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
              cause: "backfired spell",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword, enchantment 5, damage 800 → payout 700 G (full reimbursement, then deductible)", () => {
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
              cause: "lightning",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 → payout 400 G (50 % rule wins over dragon material)", () => {
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
      expect(output).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 → payout 400 G (high-enchantment clause applies)", () => {
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
              cause: "wild magic",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("claim: payout cap (twice the insurance sum)", () => {
    it("sword + amulet policy → insurance sum 1600, cap 3200: sword damage 600 → payout 500, remainingCap 2700", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "troll",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 181 }, { payout: 500, remainingCap: 2700 }],
      });
    });
    it("sword + 3 runes → insurance sum 1750 (block affects premium only), cap 3500: rune damage 200 → payout 100, remainingCap 3400", () => {
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
              cause: "acid",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
      });
    });
    it("cursed sword → cap 2000 based on unmodified insurance value: claim 1500 → payout 1400, remainingCap 600", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "curse backlash",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 165 }, { payout: 1400, remainingCap: 600 }],
      });
    });
    it("cap exhaustion: sword (cap 2000), two claims of 1500 → first payout 1400 (cap 600), second payout 600 (cap 0)", () => {
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
      expect(output).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim: multiple items of the same type", () => {
    it("two swords insured → insurance sum 2000, cap 4000: both damaged 500 each → payout 800 (own deductible each), remainingCap 3200", () => {
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
      expect(output).toEqual({
        results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
      });
    });
  });

  describe("rounding in the MHPCO's favor", () => {
    it("payout of 350.5 G rounds down → steel sword enchantment 9, damage 901 → payout 350 G (450.5 − 100 = 350.5)", () => {
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
              cause: "misfire",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout (schema example: amulet quote then claim)", () => {
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
    it("quote with unknown item type (broomstick) → exits non-zero, error on stderr, no results on stdout", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim for an item not covered by the policy (amulet damaged, only sword insured) → exits non-zero with stderr", () => {
      const result = runCli({
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
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("claim with more damage entries of a type than insured (two sword damages, one sword) → exits non-zero, whole claim rejected", () => {
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
    it("claim with negative damage amount (−200) → exits non-zero with stderr", () => {
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
