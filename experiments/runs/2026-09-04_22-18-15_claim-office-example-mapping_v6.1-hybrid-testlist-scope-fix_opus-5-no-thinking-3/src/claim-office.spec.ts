import { spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result.results).toEqual([{ premium: 5 }]);
    });
    it("a single sword → base premium 100 G (+ 10 G first insurance + 5 G fee = 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a single amulet → base premium 60 G (+ 6 G first insurance + 5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("a single staff → base premium 80 G (+ 8 G first insurance + 5 G fee = 93 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("a single potion → base premium 40 G (+ 4 G first insurance + 5 G fee = 49 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result.results).toEqual([{ premium: 49 }]);
    });
    it("a single rune (component) → base premium 25 G (+ 2.5 G first insurance + 5 G fee = 32.5 → 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a single moonstone (component) → base premium 25 G (+ 2.5 G first insurance + 5 G fee = 32.5 → 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium (no block; + 5 G first insurance + 5 G fee = 60 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 60 }]);
    });
    it("3 runes → 60 G base premium (block applies; + 6 G first insurance + 5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3; total 115 G)", () => {
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

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("7 runes → 175 G base premium (no block for 7; 197.5 → 198 G total)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types; total 88 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks; total 137 G)", () => {
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

      expect(result.results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds 50 % risk surcharge on the item base premium (100 → +50 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("sword with exactly enchantment 5 adds 30 % high-enchantment surcharge (100 → +30 G; total 145 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (total 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30; total 195 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 195 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies (total 95 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO → no loyalty discount (total 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("each contract after the first receives a 15 % follow-up discount (second quote: 100 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (not 50 % of the policy total); total 231 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("intermediate amounts are kept as fractions; only the final premium is rounded (rune, 3-year customer, second contract → 23.75 → 24 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "rune" }] },
        ],
      });

      // 25 base + 2.5 first insurance − 5 loyalty − 3.75 follow-up = 18.75, + 5 fee
      // = 23.75 → 24. Rounding each modifier on its own would give 25 instead.
      expect(result.results[1]).toEqual({ premium: 24 });
    });
  });

  describe("quote — integration examples", () => {
    it("long-standing customer (3 years), second quote, cursed sword (steel, ench 7) → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — errors", () => {
    it("quote includes an item with an unknown type (e.g. broomstick) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(/broomstick/);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment or material, so no special clause)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 2 },
            ],
          },
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

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only the dragon clause applies: full reimbursement, then deductible)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50 % rule wins)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold is >= 8)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3400 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
    });

    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2200 }] },
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 165 });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (the block discount affects the premium only)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3700 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
    it("sword (cap 2000 G), two successive claims of 1500 G → 1400 G (cap 600 left), then 600 G (cap 0; desired 1400 reduced to the remaining cap)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claim,
          claim,
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covers two swords → insurance sum 2000 G, cap 4000 G; a dragon attack damaging both is two separate damages, each with its own deductible", () => {
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
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → the whole claim is rejected", () => {
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
      ).toThrow(/sword/);
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — errors", () => {
    const claimAgainstInsuredSword = (damages: { itemType: string; amount: number }[]) => () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages } },
        ],
      });

    it("claim references a damage whose item is not part of the policy (amulet damaged, only sword insured) → error", () => {
      expect(claimAgainstInsuredSword([{ itemType: "amulet", amount: 200 }])).toThrow(
        /amulet/,
      );
    });

    it("claim references a damage entry with an unknown item type → error", () => {
      expect(claimAgainstInsuredSword([{ itemType: "broomstick", amount: 200 }])).toThrow(
        /broomstick/,
      );
    });

    it("claim contains a damage entry with amount: -200 → error", () => {
      expect(claimAgainstInsuredSword([{ itemType: "sword", amount: -200 }])).toThrow();
    });
  });

  describe("CLI", () => {
    const runCli = (scenario: unknown) =>
      spawnSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });

    it("reads a scenario JSON from stdin and writes {results:[...]} to stdout in step order, with payout and remainingCap for the claim step", () => {
      const cli = runCli({
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

      expect(cli.status).toBe(0);
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });

    it("on an invalid scenario the CLI exits with a non-zero status code and writes an error to stderr, with no results on stdout", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

      expect(cli.status).not.toBe(0);
      expect(cli.stderr).toMatch(/broomstick/);
      expect(cli.stdout).not.toMatch(/results/);
    });
  });
});
