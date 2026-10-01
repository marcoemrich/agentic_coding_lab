import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number) => Array.from({ length: count }, () => ({ type: "moonstone" }));

const quotePremium = (items: object[], yearsWithMHPCO = 0): number =>
  (
    processScenario({
      customer: { yearsWithMHPCO },
      steps: [{ op: "quote", items }],
    }).results[0] as { premium: number }
  ).premium;

type Damage = { itemType: string; amount: number };

const claimResults = (items: object[], claims: Damage[][]) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

const runCli = (input: object) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  describe("quote — edge cases", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
  });

  describe("quote — base premiums of main items (newcomer, first contract)", () => {
    it("plain sword → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet → 60 base + 6 first insurance + 5 fee = 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff → 80 base + 8 first insurance + 5 fee = 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion → 40 base + 4 first insurance + 5 fee = 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium → 50 + 5 first insurance + 5 fee = 60 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium (block) → 60 + 6 + 5 = 71 G", () => {
      expect(quotePremium(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base premium (no block, block requires exactly 3) → 100 + 10 + 5 = 115 G", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base premium → 175 + 17.5 + 5 = 197.5 → 198 G (rounded up)", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → 75 + 7.5 + 5 = 87.5 → 88 G", () => {
      expect(quotePremium([...runes(2), ...moonstones(1)])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → 120 + 12 + 5 = 137 G", () => {
      expect(quotePremium([...runes(3), ...moonstones(3)])).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("newcomer with cursed steel sword, enchantment 3 → 100 + 50 curse + 10 first = 160 + 5 fee = 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 4, not cursed → no high-enchantment surcharge → 115 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → 100 + 30 + 10 + 5 = 145 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword with enchantment 4 → only curse surcharge → 165 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → curse applies only to sword: 160 base + 50 curse + 16 first + 5 fee = 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies: sword 100 − 20 + 10 + 5 = 95 G", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount: sword 115 G", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario gets 15 % follow-up discount: sword 100 + 10 − 15 + 5 = 100 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("long-standing customer's second contract: cursed sword enchantment 7, 3 years → 160 G (first insurance surcharge still applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
    });
  });

  describe("claim — reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 → payout 400 G, remaining cap 1600 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [[{ itemType: "sword", amount: 500 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune (no enchantment/material), damage 200 → payout 100 G, remaining cap 400 G", () => {
      const [result] = claimResults([{ type: "rune" }], [[{ itemType: "rune", amount: 200 }]]);
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 G (50 % rule wins)", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [[{ itemType: "sword", amount: 1000 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 → payout 700 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [[{ itemType: "sword", amount: 800 }]],
      );
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword enchantment 9, damage 1000 → payout 400 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [[{ itemType: "sword", amount: 1000 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 → payout 400 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [[{ itemType: "sword", amount: 1000 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("payout yielding 350.5 G → rounded down to 350 G (e.g. enchantment 9, damage 901)", () => {
      const [result] = claimResults(
        [{ type: "sword", enchantment: 9 }],
        [[{ itemType: "sword", amount: 901 }]],
      );
      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per damaged item)", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "amulet" }],
        [[{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords insured → cap 4000 G; damages to both swords each have own deductible", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "sword" }],
        [[{ itemType: "sword", amount: 1500 }, { itemType: "sword", amount: 1500 }]],
      );
      expect(result).toEqual({ payout: 2800, remainingCap: 1200 });
    });
  });

  describe("claim — cap", () => {
    it("sword + amulet → insurance sum 1600, cap 3200: remaining cap after 500 damage to sword is 2800", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "amulet" }],
        [[{ itemType: "sword", amount: 500 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      const [result] = claimResults(
        [{ type: "sword", cursed: true }],
        [[{ itemType: "sword", amount: 300 }]],
      );
      expect(result).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G", () => {
      const [result] = claimResults(
        [{ type: "sword" }, ...runes(3)],
        [[{ itemType: "sword", amount: 500 }]],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two successive claims of 1500 G on a sword → payouts 1400 (remaining 600) then 600 (remaining 0)", () => {
      const results = claimResults(
        [{ type: "sword" }],
        [[{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]],
      );
      expect(results).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim with damage to item not in policy (amulet when only sword insured) → throws", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [[{ itemType: "amulet", amount: 300 }]]),
      ).toThrow(/amulet/);
    });
    it("claim with damage to item of unknown type → throws", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [[{ itemType: "broomstick", amount: 300 }]]),
      ).toThrow(/broomstick/);
    });
    it("claim with more damage entries of a type than insured (two swords damaged, one insured) → throws", () => {
      expect(() =>
        claimResults(
          [{ type: "sword" }],
          [[{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]],
        ),
      ).toThrow(/sword/);
    });
    it("claim with negative damage amount (-200) → throws", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [[{ itemType: "sword", amount: -200 }]]),
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout (schema example)", () => {
      const run = runCli({
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
      });
      expect(run.status).toBe(0);
      expect(JSON.parse(run.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("exits non-zero and writes error to stderr, nothing to stdout, for unknown item type", () => {
      const run = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(run.status).not.toBe(0);
      expect(run.stdout).toBe("");
      expect(run.stderr.trim()).toBe("Error: Unknown item type: broomstick");
    });
  });
});
