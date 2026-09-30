import { spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario, type Damage, type Item, type Scenario } from "./claim-office.js";

type Step = Scenario["steps"][number];

const run = (yearsWithMHPCO: number, ...steps: Step[]) => runScenario({ customer: { yearsWithMHPCO }, steps }).results;

const quoteStep = (items: Item[]): Step => ({ op: "quote", items });

const claimStep = (damages: Damage[], policy = 0): Step => ({
  op: "claim",
  policy,
  incident: { cause: "dragon attack", damages },
});

const quote = (items: Item[], yearsWithMHPCO = 0) => run(yearsWithMHPCO, quoteStep(items))[0];

const newcomerPremium = (basePremium: number) => ({
  premium: Math.ceil(basePremium + basePremium / 10 + 5),
});

const damage = (itemType: string, amount: number): Damage => ({ itemType, amount });

const claimAfterQuote = (items: Item[], damages: Damage[]) => run(0, quoteStep(items), claimStep(damages))[1];

const sword = (traits: Omit<Item, "type"> = {}): Item => ({ type: "sword", ...traits });

const singleSwordClaim = (traits: Omit<Item, "type">, amount: number) =>
  claimAfterQuote([sword(traits)], [damage("sword", amount)]);

const runCli = (stdin: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: stdin, encoding: "utf8" });

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toEqual({ premium: 5 });
    });
    it("plain sword for newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([sword({ material: "steel", enchantment: 3 })])).toEqual({ premium: 115 });
    });
    it("plain amulet / staff / potion use their base premiums 60 / 80 / 40 G", () => {
      expect(quote([{ type: "amulet" }])).toEqual(newcomerPremium(60));
      expect(quote([{ type: "staff" }])).toEqual(newcomerPremium(80));
      expect(quote([{ type: "potion" }])).toEqual(newcomerPremium(40));
    });
    it("2 runes → 50 G base premium", () => {
      expect(quote(runes(2))).toEqual(newcomerPremium(50));
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(quote(runes(3))).toEqual(newcomerPremium(60));
    });
    it("4 runes → 100 G base premium (block requires exactly 3)", () => {
      expect(quote(runes(4))).toEqual(newcomerPremium(100));
    });
    it("7 runes → 175 G base premium", () => {
      expect(quote(runes(7))).toEqual(newcomerPremium(175));
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      expect(quote([...runes(2), { type: "moonstone" }])).toEqual(newcomerPremium(75));
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const moonstones: Item[] = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quote([...runes(3), ...moonstones])).toEqual(newcomerPremium(120));
    });
    it("newcomer with a cursed sword (enchantment 3) → premium 165 G", () => {
      expect(quote([sword({ material: "steel", enchantment: 3, cursed: true })])).toEqual({ premium: 165 });
    });
    it("cursed surcharge applies only to cursed item: cursed sword + plain amulet → 210 G before policy modifiers", () => {
      const premium = quote([sword({ cursed: true }), { type: "amulet" }]);
      const policyBase = 100 + 60;
      const curseOnSwordOnly = 50;
      const firstInsurance = policyBase / 10;
      expect(premium).toEqual({ premium: policyBase + curseOnSwordOnly + firstInsurance + 5 });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(quote([sword({ enchantment: 4 })])).toEqual({ premium: 100 + 10 + 5 });
      expect(quote([sword({ enchantment: 4, cursed: true })])).toEqual({ premium: 100 + 50 + 10 + 5 });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      expect(quote([sword({ enchantment: 5 })])).toEqual({ premium: 100 + 30 + 10 + 5 });
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      expect(quote([sword({ enchantment: 5, cursed: true })])).toEqual({ premium: 100 + 50 + 30 + 10 + 5 });
    });
    it("customer with exactly 2 years → loyalty discount applies", () => {
      expect(quote([sword()], 2)).toEqual({ premium: 100 - 20 + 10 + 5 });
    });
    it("long-standing customer's second quote, cursed sword enchantment 7 → premium 160 G", () => {
      const results = run(
        3,
        quoteStep([{ type: "amulet" }]),
        quoteStep([sword({ material: "steel", enchantment: 7, cursed: true })]),
      );
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("premium yielding 197.5 G → rounded up to 198 G", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      expect(quote(runes(7))).toEqual({ premium: 198 });
    });
    it("quote with unknown item type (broomstick) → rejected with error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("claim", () => {
    it("regular steel sword, enchantment 3, damage 500 G → payout 400 G", () => {
      const result = singleSwordClaim({ material: "steel", enchantment: 3 }, 500);
      expect(result).toMatchObject({ payout: 400 });
    });
    it("rune damage 200 G → payout 100 G", () => {
      expect(claimAfterQuote(runes(1), [damage("rune", 200)])).toMatchObject({ payout: 100 });
    });
    it("claim reports remainingCap = 2 × insurance sum − payout", () => {
      const result = claimAfterQuote([sword()], [damage("sword", 500)]);
      expect(result).toEqual({ payout: 400, remainingCap: 2000 - 400 });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % clause)", () => {
      const result = singleSwordClaim({ material: "steel", enchantment: 9 }, 1000);
      expect(result).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 5, damage 800 G → payout 700 G", () => {
      const result = singleSwordClaim({ material: "dragon", enchantment: 5 }, 800);
      expect(result).toMatchObject({ payout: 700 });
    });
    it("dragon sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const result = singleSwordClaim({ material: "dragon", enchantment: 9 }, 1000);
      expect(result).toMatchObject({ payout: 400 });
    });
    it("dragon sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = singleSwordClaim({ material: "dragon", enchantment: 8 }, 1000);
      expect(result).toMatchObject({ payout: 400 });
    });
    it("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per damaged item)", () => {
      const result = claimAfterQuote([sword(), { type: "amulet" }], [damage("sword", 500), damage("amulet", 300)]);
      expect(result).toMatchObject({ payout: 600 });
    });
    it("payout yielding 350.5 G → rounded down to 350 G", () => {
      // 50 % of 901 = 450.5, minus 100 deductible = 350.5
      expect(singleSwordClaim({ enchantment: 9 }, 901)).toMatchObject({ payout: 350 });
    });
    it("sword + amulet policy → cap 3200 G", () => {
      const result = claimAfterQuote([sword(), { type: "amulet" }], [damage("sword", 500)]);
      expect(result).toEqual({ payout: 400, remainingCap: 3200 - 400 });
    });
    it("cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
      expect(singleSwordClaim({ cursed: true }, 500)).toEqual({ payout: 400, remainingCap: 2000 - 400 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
      const result = claimAfterQuote([sword(), ...runes(3)], [damage("sword", 500)]);
      expect(result).toEqual({ payout: 400, remainingCap: 3500 - 400 });
    });
    it("two swords → cap 4000 G; two sword damages each with own deductible", () => {
      const result = claimAfterQuote([sword(), sword()], [damage("sword", 1000), damage("sword", 800)]);
      expect(result).toEqual({ payout: 900 + 700, remainingCap: 4000 - 1600 });
    });
    it("two successive 1500 G claims on a sword → 1400 G (remaining 600), then 600 G (remaining 0)", () => {
      const claim = claimStep([damage("sword", 1500)]);
      const results = run(0, quoteStep([sword()]), claim, claim);
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("more damage entries of a type than insured → claim rejected", () => {
      expect(() => claimAfterQuote([sword()], [damage("sword", 500), damage("sword", 300)])).toThrow(/sword/);
    });
    it("damage to item not in the policy → rejected with error", () => {
      expect(() => claimAfterQuote([sword()], [damage("amulet", 300)])).toThrow(/amulet/);
    });
    it("damage with unknown item type → rejected with error", () => {
      expect(() => claimAfterQuote([sword()], [damage("broomstick", 300)])).toThrow(/broomstick/);
    });
    it("damage with negative amount → rejected with error", () => {
      expect(() => claimAfterQuote([sword()], [damage("sword", -200)])).toThrow(/-200/);
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
    it("exits non-zero with error on stderr and no results on stdout for invalid input", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { stdout, stderr, status } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/broomstick/);
      expect(stdout).toBe("");
    });
  });
});
