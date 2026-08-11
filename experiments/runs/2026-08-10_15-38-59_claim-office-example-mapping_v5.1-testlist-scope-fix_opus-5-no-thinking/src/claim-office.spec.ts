import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario, type Damage, type Item } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

/** Runs the claim-office CLI as a real subprocess, feeding `input` to stdin. */
function runCli(input: string): { status: number | null; stdout: string; stderr: string } {
  const run = spawnSync("npx", ["tsx", CLI_PATH], { input, encoding: "utf8" });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/** Premium for a single quote of `items`, for a customer with `yearsWithMHPCO` years. */
function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

/** Result of claiming `damages` against a policy covering `items`. */
function claimOn(items: Item[], damages: Damage[]): { payout: number; remainingCap: number } {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1] as { payout: number; remainingCap: number };
}

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(premiumFor([])).toBe(5);
    });
    it("single sword → base premium 100 G (+10 first insurance +5 fee = 115 G)", () => {
      expect(premiumFor([{ type: "sword" }])).toBe(115);
    });
    it("single amulet → base premium 60 G (+6 first insurance +5 fee = 71 G)", () => {
      expect(premiumFor([{ type: "amulet" }])).toBe(71);
    });
    it("single staff → base premium 80 G (+8 first insurance +5 fee = 93 G)", () => {
      expect(premiumFor([{ type: "staff" }])).toBe(93);
    });
    it("single potion → base premium 40 G (+4 first insurance +5 fee = 49 G)", () => {
      expect(premiumFor([{ type: "potion" }])).toBe(49);
    });
    it("single rune (component) → base premium 25 G (+2.5 first insurance +5 fee = 32.5 → 33 G)", () => {
      expect(premiumFor([{ type: "rune" }])).toBe(33);
    });
    it("single moonstone (component) → base premium 25 G (+2.5 first insurance +5 fee = 32.5 → 33 G)", () => {
      expect(premiumFor([{ type: "moonstone" }])).toBe(33);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium (no block) (+5 first insurance +5 fee = 60 G)", () => {
      expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium (block applies) (+6 first insurance +5 fee = 71 G)", () => {
      expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3) (+10 +5 = 115 G)", () => {
      const fourRunes: Item[] = Array.from({ length: 4 }, () => ({ type: "rune" }));

      expect(premiumFor(fourRunes)).toBe(115);
    });
    it("7 runes → 175 G base premium (no stacked blocks) (+17.5 +5 = 197.5 → 198 G)", () => {
      const sevenRunes: Item[] = Array.from({ length: 7 }, () => ({ type: "rune" }));

      expect(premiumFor(sevenRunes)).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) (+7.5 +5 = 87.5 → 88 G)", () => {
      expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (+12 +5 = 137 G)", () => {
      const items: Item[] = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];

      expect(premiumFor(items)).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds 50 % of that item's base premium (100 base + 50 curse + 10 first insurance + 5 fee = 165 G)", () => {
      expect(premiumFor([{ type: "sword", cursed: true }])).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (100 + 10 + 5 = 115 G)", () => {
      expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(premiumFor([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → 20 % loyalty discount (100 − 20 + 10 + 5 = 95 G)", () => {
      expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (100 + 10 + 5 = 115 G)", () => {
      expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
    });
    it("first insurance surcharge is 10 % of the whole policy base (sword + amulet: 160 + 16 + 5 = 181 G)", () => {
      expect(premiumFor([{ type: "sword" }, { type: "amulet" }])).toBe(181);
    });
    it("second quote in a scenario → 15 % follow-up discount (100 − 15 + 10 + 5 = 100 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → curse is 50 % of the sword only, not of the policy total (160 + 50 = 210, +16 +5 = 231 G)", () => {
      const items: Item[] = [{ type: "sword", cursed: true }, { type: "amulet" }];

      expect(premiumFor(items)).toBe(231);
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("a premium of 98.5 G rounds up to 99 G (a half is rounded in the MHPCO's favour)", () => {
      const items: Item[] = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        { type: "moonstone" },
      ];

      // 60 (block) + 25 = 85 base, +8.5 first insurance, +5 fee = 98.5
      expect(premiumFor(items)).toBe(99);
    });
    it("keeps intermediates fractional and rounds only the total (highly enchanted rune → exactly 40 G)", () => {
      // 25 base + 7.5 enchantment + 2.5 first insurance + 5 fee = 40.0 exactly.
      // Rounding each fractional part up on its own would give 25 + 8 + 3 + 5 = 41.
      expect(premiumFor([{ type: "rune", enchantment: 5 }])).toBe(40);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword (steel, enchantment 3) → 165 G", () => {
      const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };

      // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165
      expect(premiumFor([sword], 0)).toBe(165);
    });
    it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 30 enchantment − 20 loyalty + 10 first insurance
      // − 15 follow-up = 155, + 5 fee = 160. First insurance still applies.
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — errors", () => {
    it("item with an unknown type (e.g. broomstick) → throws, so the CLI can fail the run", () => {
      expect(() => premiumFor([{ type: "broomstick" }])).toThrowError(/broomstick/);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
      const sword: Item = { type: "sword", material: "steel", enchantment: 3 };

      expect(claimOn([sword], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("rune (no enchantment or material), damage 200 G → payout 100 G (no special clause)", () => {
      expect(claimOn([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const sword: Item = { type: "sword", material: "dragon", enchantment: 5 };

      expect(claimOn([sword], [{ itemType: "sword", amount: 800 }])).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const sword: Item = { type: "sword", material: "steel", enchantment: 9 };

      expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both apply; the 50 % rule wins)", () => {
      const sword: Item = { type: "sword", material: "dragon", enchantment: 9 };

      expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (threshold is inclusive)", () => {
      const sword: Item = { type: "sword", material: "dragon", enchantment: 8 };

      expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per damaged item)", () => {
      const result = claimOn(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );

      // 400 + 200 = 600; a single policy-wide deductible would give 700
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("policy with sword + amulet → insurance sum 1600 G, so cap 3200 G", () => {
      const result = claimOn(
        [{ type: "sword" }, { type: "amulet" }],
        [{ itemType: "sword", amount: 100 }],
      );

      // A 100 G damage is entirely absorbed by the deductible, leaving the cap intact
      expect(result).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("policy with a cursed sword (premium 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const result = claimOn([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 100 }]);

      // Cap follows the unmodified insurance value of 1000 G, not the premium
      expect(result).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("policy with sword + 3 runes (a block) → insurance sum 1750 G, cap 3500 G (block affects only the premium)", () => {
      const items: Item[] = [
        { type: "sword" },
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ];

      const result = claimOn(items, [{ itemType: "sword", amount: 100 }]);

      // 1000 + 3×250 = 1750; the block discount does not shrink the insurance sum
      expect(result).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      expect(claimOn([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }])).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("sword policy, second claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };

      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });

      // The desired 1400 G is cut down to the 600 G of cap that is left
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = claimOn(
        [{ type: "sword" }, { type: "sword" }],
        [{ itemType: "sword", amount: 100 }],
      );

      expect(result).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("two sword damage entries → each is a separate damage with its own deductible (400 + 200 = 600 G)", () => {
      const result = claimOn(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      );

      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("two sword damages but only one sword insured → throws, rejecting the whole claim", () => {
      expect(() =>
        claimOn(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrowError(/sword/);
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout of 350.5 G rounds down to 350 G, and the cap drops by exactly that", () => {
      const sword: Item = { type: "sword", enchantment: 9 };

      // 901 halved = 450.5, − 100 deductible = 350.5 → 350
      const result = claimOn([sword], [{ itemType: "sword", amount: 901 }]);

      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
      expect(Number.isInteger(result.remainingCap)).toBe(true);
    });
  });

  describe("claim — errors", () => {
    it("damage to an item not part of the policy (amulet when only a sword is insured) → throws", () => {
      expect(() => claimOn([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrowError(
        /amulet/,
      );
    });
    it("damage entry with an unknown item type → throws", () => {
      expect(() =>
        claimOn([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
      ).toThrowError(/broomstick/);
    });
    it("damage entry with amount -200 → throws", () => {
      expect(() => claimOn([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrowError(
        /-200/,
      );
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes {results} JSON to stdout", () => {
      // The schema example from the spec
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      const run = runCli(JSON.stringify(scenario));

      expect(run.status).toBe(0);
      // 60 base − 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 − 100 = 100
      expect(JSON.parse(run.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("exits non-zero with an error on stderr and no results on stdout for an unknown item type", () => {
      const run = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expect(run.status).not.toBe(0);
      expect(run.stdout).not.toMatch(/results/);
      // A description of the problem, not a stack trace
      expect(run.stderr.trim()).toBe("Unknown item type: broomstick");
    });
  });
});
