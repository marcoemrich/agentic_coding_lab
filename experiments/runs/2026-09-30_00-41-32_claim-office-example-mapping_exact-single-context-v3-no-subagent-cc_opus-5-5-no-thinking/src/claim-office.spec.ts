import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, policyBasePremium, type Item, type Damage } from "./claim-office.js";

const claimResult = (items: Item[], damages: Damage[]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1] as { payout: number; remainingCap: number };

const swordPayout = (material: string, enchantment: number, amount: number): number =>
  claimResult([{ type: "sword", material, enchantment }], [{ itemType: "sword", amount }]).payout;

const swordPolicyClaim = (...damages: Damage[]) => () => claimResult([{ type: "sword" }], damages);

const runCli = (input: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input, encoding: "utf8" });

const many = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number): Item[] => many("rune", count);
const moonstones = (count: number): Item[] => many("moonstone", count);

const singleQuotePremium = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("plain sword for newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(singleQuotePremium([{ type: "sword", material: "steel", enchantment: 3 }])).toBe(115);
    });
    it("amulet, staff and potion use their base premiums (60/80/40 G)", () => {
      expect(singleQuotePremium([{ type: "amulet" }])).toBe(71);
      expect(singleQuotePremium([{ type: "staff" }])).toBe(93);
      expect(singleQuotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium", () => {
      expect(policyBasePremium(runes(2))).toBe(50);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(policyBasePremium(runes(3))).toBe(60);
    });
    it("4 runes → 100 G base premium (block requires exactly 3)", () => {
      expect(policyBasePremium(runes(4))).toBe(100);
    });
    it("7 runes → 175 G base premium", () => {
      expect(policyBasePremium(runes(7))).toBe(175);
    });
    it("2 runes + 1 moonstone → 75 G base premium (different types, no block)", () => {
      expect(policyBasePremium([...runes(2), ...moonstones(1)])).toBe(75);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      expect(policyBasePremium([...runes(3), ...moonstones(3)])).toBe(120);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword + plain amulet → curse surcharge only on sword: 210 G before policy modifiers and fee", () => {
      // 160 base + 50 curse (sword only) + 16 first insurance (10 % of 160) + 5 fee
      expect(singleQuotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(singleQuotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply", () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(singleQuotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(singleQuotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
      expect(singleQuotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(singleQuotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("second quote in scenario → 15 % follow-up discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      // second: 100 base + 10 first insurance − 15 follow-up + 5 fee
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("newcomer with cursed steel sword (enchantment 3) → 165 G", () => {
      expect(singleQuotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
    });
    it("3-year customer's second quote, cursed sword enchantment 7 → 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — rounding", () => {
    it("premium yielding a fraction (e.g. 197.5 G) is rounded up", () => {
      // 25 base − 5 loyalty + 2.5 first insurance + 5 fee = 27.5 → 28
      expect(singleQuotePremium(runes(1), 2)).toBe(28);
    });
  });

  describe("claim — reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G", () => {
      expect(swordPayout("steel", 3, 500)).toBe(400);
    });
    it("rune damage 200 G → payout 100 G", () => {
      expect(claimResult(runes(1), [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % clause)", () => {
      expect(swordPayout("steel", 9, 1000)).toBe(400);
    });
    it("dragon sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(swordPayout("dragon", 5, 800)).toBe(700);
    });
    it("dragon sword enchantment 9, damage 1000 G → payout 400 G (50 % wins)", () => {
      expect(swordPayout("dragon", 9, 1000)).toBe(400);
    });
    it("dragon sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(swordPayout("dragon", 8, 1000)).toBe(400);
    });
    it("payout yielding a fraction (e.g. 350.5 G) is rounded down", () => {
      // 50 % of 901 = 450.5 − 100 deductible = 350.5 → 350
      expect(swordPayout("steel", 9, 901)).toBe(350);
    });
  });

  describe("claim — deductible and cap", () => {
    it("dragon attack damaging sword (500) and amulet (300) → payout 600 G, deductible per item", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(600);
    });
    it("sword + amulet policy → cap 3200 G reported as remaining cap", () => {
      const result = claimResult([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G, based on unmodified insurance value", () => {
      const result = claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
      const result = claimResult([{ type: "sword" }, ...runes(3)], [{ itemType: "rune", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("two swords, both damaged → each damage with own deductible, cap 4000 G", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("two successive 1500 G claims on a sword → 1400/600 then 600/0", () => {
      const swordClaim = { op: "claim" as const, policy: 0, incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] } };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, swordClaim, swordClaim],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with unknown item type → rejected", () => {
      expect(() => singleQuotePremium([{ type: "broomstick" }])).toThrow(/unknown item type: broomstick/i);
    });
    it("claim for item not part of policy → rejected", () => {
      expect(swordPolicyClaim({ itemType: "amulet", amount: 200 })).toThrow(/not insured/i);
    });
    it("claim with unknown item type → rejected", () => {
      expect(swordPolicyClaim({ itemType: "broomstick", amount: 200 })).toThrow(/not insured/i);
    });
    it("claim with negative amount → rejected", () => {
      expect(swordPolicyClaim({ itemType: "sword", amount: -200 })).toThrow(/negative/i);
    });
    it("claim with more damages of a type than insured → whole claim rejected", () => {
      expect(swordPolicyClaim({ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 })).toThrow(
        /more .*than insured/i,
      );
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const { stdout, status } = runCli(JSON.stringify(scenario));
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
      expect(status).toBe(0);
    });
    it("exits non-zero and writes error to stderr for invalid scenario, no results on stdout", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { stdout, stderr, status } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/unknown item type: broomstick/i);
      expect(stdout).toBe("");
    });
  });
});
