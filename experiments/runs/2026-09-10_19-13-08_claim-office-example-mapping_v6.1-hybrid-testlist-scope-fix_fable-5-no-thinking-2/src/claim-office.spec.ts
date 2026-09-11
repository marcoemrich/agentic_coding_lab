import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

interface CliRun {
  stdout: string;
  stderr: string;
  exitCode: number;
}

const runCli = (input: unknown): CliRun => {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (error) {
    const failure = error as {
      stdout?: string;
      stderr?: string;
      status?: number;
    };
    return {
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
      exitCode: failure.status ?? 1,
    };
  }
};

// Helper conventions used across tests:
// - "newcomer" = { yearsWithMHPCO: 0 }, first quote step → +10% first-insurance
//   surcharge on the policy base premium, +5 G processing fee.
// - Expected premiums are full CLI-level totals (all modifiers + fee applied).

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums (newcomer, single quote: base + 10% first insurance + 5 G fee)", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("one sword (base 100 G) → premium 115 G (100 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("one amulet (base 60 G) → premium 71 G (60 + 6 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("one staff (base 80 G) → premium 93 G (80 + 8 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("one potion (base 40 G) → premium 49 G (40 + 4 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
  });

  describe("quote: components and the block of 3 alike components", () => {
    it("2 runes (base 50 G) → premium 60 G (50 + 5 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("3 runes (block, base 60 G) → premium 71 G (60 + 6 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("4 runes (no block — block requires exactly 3; base 100 G) → premium 115 G", () => {
      const result = runScenario({
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("7 runes (base 175 G) → premium 198 G (175 + 17.5 + 5 = 197.5 rounded up in MHPCO's favor)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone (no block: different types; base 75 G) → premium 88 G (75 + 7.5 + 5 = 87.5 rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones (two separate blocks, base 120 G) → premium 137 G (120 + 12 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("quote: item-specific modifiers (cursed, high enchantment)", () => {
    it("cursed sword, newcomer (integration example) → premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
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
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → premium 145 G (100 + 30 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("cursed sword with enchantment 4 → only curse surcharge → premium 165 G (100 + 50 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply → premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("cursed sword + plain amulet → curse surcharge applies only to the sword's base premium → 231 G (160 policy base + 50 curse + 16 first insurance + 5 fee)", () => {
      const result = runScenario({
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
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("quote: policy-wide modifiers (loyalty, first insurance, follow-up contract)", () => {
    it("customer with exactly 2 years → loyalty discount applies → sword premium 95 G (100 − 20 loyalty + 10 first + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("customer with 1 year → no loyalty discount → sword premium 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("second quote in scenario → follow-up contract discount: sword premium 100 G (100 + 10 first − 15 follow-up + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("long-standing customer's second contract (integration example): 3 years, cursed enchantment-7 sword on 2nd quote → premium 160 G", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("loyal customer (5 years) with 1 rune → premium 28 G (25 − 5 loyalty + 2.5 first + 5 fee = 27.5 rounded up; intermediate fractions kept)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G (cap 2000)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause; remainingCap 400 of cap 500)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim: special clauses (enchantment ≥ 8, dragon material)", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% clause, then deductible)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses; 50% rule wins)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (threshold boundary)", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("payout rounding in MHPCO's favor: enchantment-9 sword, damage 901 G → 450.5 − 100 = 350.5 → payout 350 G (rounded down)", () => {
      const result = runScenario({
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
              cause: "mishap",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim: multiple items of the same type", () => {
    it("policy with two swords → insurance sum 2000 G, cap 4000 G; both damaged 500 G each → payout 800 G (own deductible each), remainingCap 3200 G", () => {
      const result = runScenario({
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
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim: payout cap (twice the insurance sum)", () => {
    it("sword + amulet policy → cap 3200 G (2 × 1600); small claim shows remainingCap = 3200 − payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword (premium 165 G) → cap still 2000 G (unmodified value): damage 2500 G → payout capped at 2000 G, remainingCap 0", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "catastrophe",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G (block discount affects premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 3000 });
    });
    it("cap exhaustion across claims: sword, two claims of 1500 G → first payout 1400 G (cap left 600), second payout 600 G (cap left 0)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI: end-to-end and error handling", () => {
    it("schema example scenario via stdin/stdout: 5-year customer, amulet quote then claim of 200 G → results [{premium}, {payout, remainingCap}]", () => {
      const run = runCli({
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
      expect(run.exitCode).toBe(0);
      expect(JSON.parse(run.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("quote with unknown item type (broomstick) → exit code non-zero, error on stderr, no results on stdout", () => {
      const run = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
      expect(run.stdout).not.toContain("results");
    });
    it("claim for an item not in the policy (amulet damaged, only sword insured) → non-zero exit, error on stderr", () => {
      const run = runCli({
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
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
    it("claim with more damage entries of a type than insured (two sword damages, one sword) → non-zero exit, whole claim rejected", () => {
      const run = runCli({
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
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
    it("claim with negative damage amount (−200) → non-zero exit, error on stderr", () => {
      const run = runCli({
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
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
  });
});
