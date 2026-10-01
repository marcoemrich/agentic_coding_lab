import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type ClaimResult, type Damage, type Item, type QuoteResult } from "./claim-office.js";

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number =>
  (runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as QuoteResult).premium;

const runCli = (input: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input, encoding: "utf8" });

const claimAgainst = (items: Item[], damages: Damage[], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1] as ClaimResult;

const itemsOfType = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number) => itemsOfType("rune", count);
const moonstones = (count: number) => itemsOfType("moonstone", count);

// newcomer premium = base + 10 % first insurance + 5 G fee, rounded up
const newcomerPremiumFor = (basePremium: number) => Math.ceil(basePremium + basePremium / 10 + 5);

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
    it("plain sword for a 0-year newcomer → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toBe(115);
    });
    it("plain amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and blocks", () => {
    it("2 runes → 50 G base premium", () => {
      expect(quotePremium(runes(2))).toBe(newcomerPremiumFor(50));
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(quotePremium(runes(3))).toBe(newcomerPremiumFor(60));
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      expect(quotePremium(runes(4))).toBe(newcomerPremiumFor(100));
    });
    it("7 runes → 175 G base premium", () => {
      expect(quotePremium(runes(7))).toBe(newcomerPremiumFor(175));
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      expect(quotePremium([...runes(2), ...moonstones(1)])).toBe(newcomerPremiumFor(75));
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      expect(quotePremium([...runes(3), ...moonstones(3)])).toBe(newcomerPremiumFor(120));
    });
  });

  describe("quote — modifiers", () => {
    it("cursed surcharge applies only to the cursed item: cursed sword + plain amulet → 210 G before policy-wide modifiers and fee", () => {
      // 160 base + 50 curse (50 % of sword only) + 16 first insurance (10 % of policy base) + 5 fee
      expect(
        quotePremium([
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ]),
      ).toBe(231);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply", () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      // cursed: 100 base + 50 curse + 10 first insurance + 5 fee (no 30 % enchantment surcharge)
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("customer with exactly 2 years with MHPCO → loyalty discount applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("premium yielding a fraction is rounded up in the MHPCO's favor (e.g. 197.5 → 198)", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
    });
    it("long-standing customer's (3 years) second quote, cursed sword enchantment 7 → premium 160 G (follow-up discount, first insurance still applies)", () => {
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

  describe("claim — reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
    });
    it("rune, damage 200 G → payout 100 G", () => {
      expect(claimAgainst([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("sword (500 G) and amulet (300 G) damaged in one event → payout 600 G (deductible per damaged item)", () => {
      const result = claimAgainst(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(600);
    });
    it("damage below the deductible pays nothing for that item (no negative payout)", () => {
      const result = claimAgainst(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 50 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(200);
    });

    it("payout yielding a fraction is rounded down in the MHPCO's favor (e.g. 350.5 → 350)", () => {
      // 50 % of 901 = 450.5, minus 100 deductible = 350.5
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
    });
  });

  describe("claim — cap", () => {
    it("sword insured, claim reports remainingCap = 2000 G minus payout", () => {
      expect(claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("sword + amulet policy → cap 3200 G", () => {
      const result = claimAgainst([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3200 - 400 });
    });
    it("cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      const result = claimAgainst([cursedSword], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2000 - 400 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
      const result = claimAgainst([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3500 - 400 });
    });
    it("two successive 1500 G claims on a sword → payouts 1400 G then 600 G, remaining cap 600 G then 0 G", () => {
      const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("two swords insured → cap 4000 G; two sword damages each get their own deductible", () => {
      const result = claimAgainst(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 700 },
        ],
      );
      expect(result).toEqual({ payout: 400 + 600, remainingCap: 4000 - 1000 });
    });
  });

  describe("scenario processing", () => {
    it("results array has the same length and order as the steps (quote then claim)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → rejected with error", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/unknown item type: broomstick/i);
    });
    it("claim damaging an item not in the policy (amulet when only sword insured) → rejected", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(
        /not covered by policy/i,
      );
    });
    it("claim damaging an unknown item type → rejected", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(
        /not covered by policy/i,
      );
    });
    it("claim with more damages of a type than insured (two swords, one insured) → rejected", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(() => claimAgainst([{ type: "sword" }], damages)).toThrow(/not covered by policy/i);
    });
    it("claim with negative damage amount (-200) → rejected", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(
        /negative damage amount/i,
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
      const { status, stdout } = runCli(JSON.stringify(scenario));
      expect(status).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
    it("exits non-zero and writes to stderr on an invalid scenario, no results on stdout", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr).toBe("Error: Unknown item type: broomstick\n");
    });
  });
});
