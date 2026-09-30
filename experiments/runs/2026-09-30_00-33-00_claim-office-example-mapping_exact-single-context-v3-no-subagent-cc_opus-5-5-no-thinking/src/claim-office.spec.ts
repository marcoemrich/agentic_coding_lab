import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { basePremium, runScenario, type Damage, type Item } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  const plainSword: Item = { type: "sword" };
  const quoteStep = (...items: Item[]) => ({ op: "quote" as const, items });
  const quote = (items: Item[], yearsWithMHPCO = 0) =>
    runScenario({ customer: { yearsWithMHPCO }, steps: [quoteStep(...items)] }).results[0];

  describe("quote", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toEqual({ premium: 5 });
    });
    it("newcomer with a cursed steel sword (enchantment 3) → premium 165 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
    });
  });

  const many = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
  const runes = (count: number) => many("rune", count);
  const moonstones = (count: number) => many("moonstone", count);

  describe("base premiums", () => {
    it("sword → 100 G, amulet → 60 G, staff → 80 G, potion → 40 G", () => {
      expect(basePremium([plainSword])).toBe(100);
      expect(basePremium([{ type: "amulet" }])).toBe(60);
      expect(basePremium([{ type: "staff" }])).toBe(80);
      expect(basePremium([{ type: "potion" }])).toBe(40);
    });
    it("2 runes → 50 G base premium", () => {
      expect(basePremium(runes(2))).toBe(50);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(basePremium(runes(3))).toBe(60);
    });
    it("4 runes → 100 G base premium (block requires exactly 3)", () => {
      expect(basePremium(runes(4))).toBe(100);
    });
    it("7 runes → 175 G base premium", () => {
      expect(basePremium(runes(7))).toBe(175);
    });
    it("2 runes + 1 moonstone → 75 G base premium (different types, no block)", () => {
      expect(basePremium([...runes(2), ...moonstones(1)])).toBe(75);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      expect(basePremium([...runes(3), ...moonstones(3)])).toBe(120);
    });
  });

  describe("premium modifiers", () => {
    it("cursed sword + plain amulet, curse applies only to the sword's base → 210 G before policy modifiers and fee (231 G premium)", () => {
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (145 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
    });
    it("cursed sword with enchantment 5 → both surcharges apply (195 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (115 G); cursed → 165 G", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
      expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
    });
    it("customer with exactly 2 years with MHPCO → loyalty discount applies (95 G for a plain sword)", () => {
      expect(quote([plainSword], 2)).toEqual({ premium: 95 });
    });
    it("customer's second quote gets 15 % follow-up discount, first insurance still applies", () => {
      const sword = quoteStep(plainSword);
      const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword] });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          quoteStep({ type: "amulet" }),
          quoteStep({ type: "sword", material: "steel", enchantment: 7, cursed: true }),
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("fractional premium is rounded up (1 rune: 32.5 G → 33 G)", () => {
      expect(quote(runes(1))).toEqual({ premium: 33 });
    });
  });

  const claimStep = (damages: Damage[], policy = 0) => ({
    op: "claim" as const,
    policy,
    incident: { cause: "dragon attack", damages },
  });
  const claim = (items: Item[], damages: Damage[]) =>
    runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [quoteStep(...items), claimStep(damages)] }).results[1];

  const swordDamage = (amount: number) => ({ itemType: "sword", amount });

  describe("claim", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G, remaining cap 1600 G", () => {
      expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [swordDamage(500)])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("rune damage 200 G → payout 100 G", () => {
      expect(claim(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [swordDamage(1000)])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [swordDamage(1000)])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [swordDamage(1000)])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [swordDamage(800)])).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G, cap based on insurance sum 1600 G → remaining 2600 G", () => {
      expect(claim([plainSword, { type: "amulet" }], [swordDamage(500), { itemType: "amulet", amount: 300 }])).toEqual({
        payout: 600,
        remainingCap: 2600,
      });
    });
    it("cursed sword → cap 2000 G, premium modifiers do not raise the cap", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteStep({ type: "sword", material: "steel", enchantment: 3, cursed: true }), claimStep([swordDamage(600)])],
      });
      expect(results).toEqual([{ premium: 165 }, { payout: 500, remainingCap: 1500 }]);
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
      expect(claim([plainSword, ...runes(3)], [swordDamage(500)])).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two swords → cap 4000 G; two sword damages each with own deductible", () => {
      expect(claim([plainSword, plainSword], [swordDamage(500), swordDamage(500)])).toEqual({
        payout: 800,
        remainingCap: 3200,
      });
    });
    it("two successive 1500 G claims on a sword → 1400 G (cap 600 G), then 600 G (cap 0 G)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteStep(plainSword), claimStep([swordDamage(1500)]), claimStep([swordDamage(1500)])],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("fractional payout is rounded down (enchantment 9, damage 901 G: 350.5 G → 350 G)", () => {
      expect(claim([{ type: "sword", enchantment: 9 }], [swordDamage(901)])).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type → throws", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/unknown item type: broomstick/i);
    });
    it("claim for an item not part of the policy → throws", () => {
      expect(() => claim([plainSword], [{ itemType: "amulet", amount: 300 }])).toThrow(/not covered/i);
    });
    it("claim with unknown item type → throws", () => {
      expect(() => claim([plainSword], [{ itemType: "broomstick", amount: 300 }])).toThrow(/not covered/i);
    });
    it("claim with more damages of a type than insured → throws", () => {
      expect(() => claim([plainSword], [swordDamage(500), swordDamage(500)])).toThrow(/not covered/i);
    });
    it("claim with negative amount → throws", () => {
      expect(() => claim([plainSword], [swordDamage(-200)])).toThrow(/negative/i);
    });
  });

  describe("CLI", () => {
    const runCli = (input: unknown) =>
      spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

    it("reads a scenario from stdin and writes results JSON to stdout", () => {
      const { stdout, status } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteStep({ type: "sword", cursed: true }), claimStep([swordDamage(500)])],
      });
      expect(status).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }] });
    });
    it("exits non-zero with an error on stderr and no results on stdout for invalid input", () => {
      const { stdout, stderr, status } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteStep({ type: "broomstick" })],
      });
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/unknown item type: broomstick/i);
      expect(stdout).toBe("");
    });
  });
});
