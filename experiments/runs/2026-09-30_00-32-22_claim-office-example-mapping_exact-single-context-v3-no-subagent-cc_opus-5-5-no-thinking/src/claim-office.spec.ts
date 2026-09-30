import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { policyBasePremium, runScenario, type ClaimStep, type Damage, type Item } from "./claim-office.js";

const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));

const moonstones = (count: number) => Array.from({ length: count }, () => ({ type: "moonstone" }));

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

const claimStep = (damages: Damage[]): ClaimStep => ({
  op: "claim",
  policy: 0,
  incident: { cause: "dragon attack", damages },
});

const claimResult = (items: Item[], damages: Damage[]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }, claimStep(damages)],
  }).results[1];

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
    it("plain sword for a newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet, staff, potion use their base premiums 60/80/40 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
      expect(quotePremium([{ type: "staff" }])).toBe(93);
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
    it("2 runes → 50 G base premium", () => {
      expect(policyBasePremium(runes(2))).toBe(50);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(policyBasePremium(runes(3))).toBe(60);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      expect(policyBasePremium(runes(4))).toBe(100);
    });
    it("7 runes → 175 G base premium", () => {
      expect(policyBasePremium(runes(7))).toBe(175);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      expect(policyBasePremium([...runes(2), ...moonstones(1)])).toBe(75);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      expect(policyBasePremium([...runes(3), ...moonstones(3)])).toBe(120);
    });
    it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      expect(
        quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
      ).toBe(165);
    });
    it("cursed sword + plain amulet → curse surcharge only on the sword: 210 G before policy modifiers and fee", () => {
      // 160 base + 50 curse = 210; + 16 first insurance (10 % of 160) + 5 fee = 231
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("customer with exactly 2 years → loyalty discount applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("second quote in the scenario gets 15 % follow-up discount", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      // second: 100 base + 10 first insurance − 15 follow-up + 5 fee
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("premium yielding a fraction (e.g. 197.5) is rounded up", () => {
      // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33
      expect(quotePremium(runes(1))).toBe(33);
    });
    it("unknown item type in a quote → throws an error", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("claim", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 500 }])).toMatchObject({ payout: 400 });
    });
    it("rune damage 200 G → payout 100 G", () => {
      expect(claimResult(runes(1), [{ itemType: "rune", amount: 200 }])).toMatchObject({ payout: 100 });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 });
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("sword 500 G + amulet 300 G damaged → payout 600 G (deductible per damaged item)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(claimResult([{ type: "sword" }, { type: "amulet" }], damages)).toMatchObject({ payout: 600 });
    });
    it("sword + amulet policy → insurance sum 1600, cap 3200 → remainingCap after claim", () => {
      expect(
        claimResult([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      expect(
        claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750, cap 3500", () => {
      expect(
        claimResult([{ type: "sword" }, ...runes(3)], [{ itemType: "rune", amount: 200 }]),
      ).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("two swords damaged → each entry has its own deductible, cap 4000", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 700 },
      ];
      expect(claimResult([{ type: "sword" }, { type: "sword" }], damages)).toEqual({
        payout: 1000,
        remainingCap: 3000,
      });
    });
    it("two successive 1500 G claims on a sword → payouts 1400 then 600, remainingCap 600 then 0", () => {
      const damages = [{ itemType: "sword", amount: 1500 }];
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep(damages), claimStep(damages)],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("payout yielding a fraction (e.g. 350.5) is rounded down", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      // 50 % of 901 = 450.5, − 100 deductible = 350.5 → 350
      expect(claimResult([sword], [{ itemType: "sword", amount: 901 }])).toEqual({
        payout: 350,
        remainingCap: 1650,
      });
    });
    it("more damage entries of a type than insured → throws an error", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ];
      expect(() => claimResult([{ type: "sword" }], damages)).toThrow();
    });
    it("damage to an item not in the policy → throws an error", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow();
    });
    it("damage with unknown item type → throws an error", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow();
    });
    it("damage with negative amount → throws an error", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow();
    });
  });

  describe("CLI", () => {
    const runCli = (input: unknown) =>
      spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
        input: JSON.stringify(input),
        encoding: "utf8",
      });

    it("reads scenario from stdin and writes results JSON to stdout", () => {
      const { stdout, status } = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
      // 60 − 12 loyalty + 6 first insurance + 5 fee = 59; payout 100, cap 1200 − 100
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
      expect(status).toBe(0);
    });
    it("exits non-zero and writes to stderr on an invalid scenario", () => {
      const { stdout, stderr, status } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(status).not.toBe(0);
      expect(stderr).toContain("broomstick");
      expect(stdout).toBe("");
    });
  });
});
