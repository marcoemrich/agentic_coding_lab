import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { runScenario, type Scenario } from "./claim-office.js";

interface CliRun {
  code: number;
  stdout: string;
  stderr: string;
}

// Drives the real executable so stdin, stdout and the exit code are exercised
// as the MHPCO's clerks would meet them.
const runCli = (input: unknown): Promise<CliRun> =>
  new Promise((resolve) => {
    const cli = execFile(
      "npx",
      ["tsx", "src/cli.ts"],
      (error, stdout, stderr) => {
        const code = (error as { code?: number } | null)?.code ?? 0;
        resolve({ code, stdout, stderr });
      },
    );
    cli.stdin?.end(JSON.stringify(input));
  });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a single sword → base premium 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 G base + 10 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      // 60 G base + 6 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      // 80 G base + 8 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      // 40 G base + 4 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → 33 G (rounded up)
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → 33 G (rounded up)
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
        ],
      });

      // 50 G base + 5 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      // 60 G block base + 6 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
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

      // 100 G base + 10 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 → 198 G
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });

      // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 → 88 G
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
            ],
          },
        ],
      });

      // (60 + 60) G base + 12 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("a cursed sword adds a 50 % surcharge on its own base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });

      // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("a sword with enchantment exactly 5 adds a 30 % surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("a sword with enchantment 4 adds no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      // 100 G base + 10 G first insurance + 5 G fee — no surcharge
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a cursed sword with enchantment exactly 5 gets both surcharges", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      });

      // 100 G base + 50 G curse + 30 G high enchantment
      //   + 10 G first insurance = 190 G + 5 G fee
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it.todo(
      "a cursed sword (100 G) plus a plain amulet (60 G) → curse adds 50 G on the sword only, 210 G before further modifiers and fee",
    );
  });

  describe("quote — policy-wide modifiers", () => {
    it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 G base − 20 G loyalty + 10 G first insurance = 90 G + 5 G fee
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("a customer with 1 year with MHPCO receives no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 G base + 10 G first insurance + 5 G fee — no loyalty discount
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it.todo("every quote carries the 10 % first insurance surcharge");
    it("the second quote in a scenario receives the 15 % follow-up contract discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 10 G first insurance + 5 G fee
          { premium: 115 },
          // 100 G base + 10 G first insurance − 15 G follow-up + 5 G fee
          { premium: 100 },
        ],
      });
    });
    it("a 5 G processing fee is added to every premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      // 80 G base − 16 G loyalty + 8 G first insurance = 72 G, + 5 G fee.
      // Without the fee this would be 72 G; the fee survives the discounts.
      expect(result).toEqual({ results: [{ premium: 77 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favour", () => {
    it.todo("a premium calculation yielding 197.5 G → final premium 198 G (rounded up)");
    it.todo("intermediate amounts are kept as fractions; only the final premium is rounded");
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      });

      // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // first contract: 60 G base − 12 G loyalty + 6 G first insurance
          //   = 54 G + 5 G fee
          { premium: 59 },
          // 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
          //   + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee
          { premium: 160 },
        ],
      });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular steel sword, enchantment 3, damage 500 G → payout 400 G", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          // full reimbursement 500 G − 100 G deductible;
          // cap 2000 G (2 × 1000 G insurance sum) − 400 G paid out
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("damage to a rune, damage 200 G → payout 100 G (no enchantment or material)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → 33 G
          { premium: 33 },
          // 200 G − 100 G deductible; cap 500 G (2 × 250 G) − 100 G paid out
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
          { premium: 145 },
          // enchantment 9 ≥ 8 → 50 % of 1000 G = 500 G, then 100 G deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full, then deductible)", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
          { premium: 145 },
          // enchantment 5 < 8, so only the dragon-material clause applies:
          // full reimbursement 800 G, then 100 G deductible
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
          { premium: 145 },
          // both clauses apply; the 50 % rule wins: 500 G, then 100 G deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G", () => {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
          { premium: 145 },
          // enchantment exactly 8 reaches the clause: 50 % of 1000 G,
          // then the 100 G deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damaging a sword (500 G) and an amulet (300 G) → payout 600 G", () => {
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

      expect(result).toEqual({
        results: [
          // 160 G base + 16 G first insurance + 5 G fee
          { premium: 181 },
          // the deductible applies once per damaged item:
          // (500 − 100) + (300 − 100); cap 3200 G (2 × 1600 G) − 600 G
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("claim — payout rounding", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 },
          // 901 × 0.5 = 450.5, − 100 deductible = 350.5 → rounded down
          { payout: 350, remainingCap: 1650 },
        ],
      });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 181 },
          // insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G;
          // a 100 G payout leaves 3100 G
          { payout: 100, remainingCap: 3100 },
        ],
      });
    });
    it("a policy covering a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
          { premium: 165 },
          // the cap follows the unmodified 1000 G insurance value, not the
          // curse-inflated premium: 2000 G − 200 G payout
          { payout: 200, remainingCap: 1800 },
        ],
      });
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount does not lower the sum)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          // base 100 G sword + 60 G block of 3 runes = 160 G,
          //   + 16 G first insurance + 5 G fee
          { premium: 181 },
          // the block discounts the premium only: insurance sum is still
          // 1000 + 3 × 250 = 1750 G, so cap 3500 G − 300 G payout
          { payout: 300, remainingCap: 3200 },
        ],
      });
    });
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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

      expect(result).toEqual({
        results: [
          // 200 G base (2 × 100; two is not a block) + 20 G first insurance
          //   + 5 G fee
          { premium: 225 },
          // insurance sum 2 × 1000 = 2000 G → cap 4000 G, less a 400 G payout
          { payout: 400, remainingCap: 3600 },
        ],
      });
    });
  });

  describe("claim — cap exhaustion across successive claims", () => {
    it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          // 1500 − 100 deductible = 1400, within the 2000 G cap
          { payout: 1400, remainingCap: 600 },
        ],
      });
    });
    it("sword policy (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claim,
          claim,
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          // the desired 1400 G is reduced to the 600 G of cap that remains
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("two swords insured, two sword damage entries → each entry is a separate damage with its own deductible", () => {
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 225 },
          // two entries of the same type, each with its own deductible:
          // (500 − 100) + (300 − 100); cap 4000 G − 600 G
          { payout: 600, remainingCap: 3400 },
        ],
      });
    });
    it("more damage entries of a type than the policy covers → the claim is rejected", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      };

      // only one sword is insured, so a second sword damage cannot be settled
      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (e.g. broomstick) → error, no results", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim referencing an item not part of the policy (amulet when only a sword is insured) → error", () => {
      const scenario: Scenario = {
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
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim referencing a damage entry with an unknown item type → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim referencing a policy that does not exist → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 5,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
      // an explanation the office could hand a customer, not a TypeError
      expect(() => runScenario(scenario)).toThrow(/policy/i);
    });

    it("claim containing a damage entry with amount -200 → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes {results: [...]} to stdout", async () => {
      const { code, stdout } = await runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    }, 30000);
    it("the schema example (5-year customer, amulet quote then amulet claim of 200 G) produces two results", async () => {
      const { code, stdout } = await runCli({
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
      });

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [
          // 60 G base − 12 G loyalty + 6 G first insurance = 54 G + 5 G fee
          { premium: 59 },
          // 200 G − 100 G deductible; cap 1200 G (2 × 600 G) − 100 G
          { payout: 100, remainingCap: 1100 },
        ],
      });
    }, 30000);
    it("exits with a non-zero status and writes to stderr when the scenario is invalid", async () => {
      const { code, stdout, stderr } = await runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

      expect(code).not.toBe(0);
      // the customer-facing refusal, not the internal invariant message
      expect(stderr).toContain("does not insure");
      expect(stderr).toContain("broomstick");
      expect(stdout).toBe("");
      // an error description, not a crash report
      expect(stderr).not.toContain("at ");
    }, 30000);
  });
});
