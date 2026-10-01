import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Item, type QuoteResult } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0): number =>
  (runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  }).results[0] as QuoteResult).premium;

const claim = (
  items: Item[],
  damages: { itemType: string; amount: number }[],
) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toBe(5);
    });
    it("plain sword, newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet, newcomer → 60 + 6 + 5 = 71 G", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff, newcomer → 80 + 8 + 5 = 93 G", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("plain potion, newcomer → 40 + 4 + 5 = 49 G", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and blocks", () => {
    it("2 runes → 50 G base premium (55 + 5 = 60 G premium)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (66 + 5 = 71 G premium)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (110 + 5 = 115 G premium)", () => {
      expect(quote(Array(4).fill({ type: "rune" }))).toBe(115);
    });
    it("7 runes → 175 G base premium (192.5 + 5 → 198 G premium, rounded up)", () => {
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, different types do not form a block (82.5 + 5 → 88 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (132 + 5 = 137 G)", () => {
      const runes = Array(3).fill({ type: "rune" });
      const moonstones = Array(3).fill({ type: "moonstone" });
      expect(quote([...runes, ...moonstones])).toBe(137);
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) → 165 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (115 G)", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("customer with exactly 2 years → loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (115 G)", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("cursed sword + plain amulet → curse surcharge only on the sword's base premium (160 + 50 + 16 + 5 = 231 G)", () => {
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
    it("second quote in scenario gets 15 % follow-up discount (sword newcomer: 100 + 10 − 15 + 5 = 100 G)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("rounds fractional premium up in the MHPCO's favor (197.5 → 198 G)", () => {
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
      expect(quote([{ type: "potion" }, { type: "rune" }])).toBe(77);
    });
  });

  describe("claim — payouts", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 3 }], [
          { itemType: "sword", amount: 500 },
        ]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (value 250 G), damage 200 G → payout 100 G", () => {
      expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 9 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 5 }], [
          { itemType: "sword", amount: 800 },
        ]),
      ).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 9 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 8 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage below the deductible → payout 0 G", () => {
      expect(claim([{ type: "sword" }], [{ itemType: "sword", amount: 60 }])).toEqual({
        payout: 0,
        remainingCap: 2000,
      });
    });
    it("dragon attack on sword (500 G) and amulet (300 G) → payout 600 G, deductible per damaged item", () => {
      expect(
        claim([{ type: "sword" }, { type: "amulet" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords insured → cap 4000 G; damage to both swords each has its own deductible", () => {
      expect(
        claim([{ type: "sword" }, { type: "sword" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      ).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("sword + amulet policy → cap 3200 G", () => {
      expect(
        claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "amulet", amount: 150 }]),
      ).toEqual({ payout: 50, remainingCap: 3150 });
    });
    it("cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
      expect(
        claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
      const runes = Array(3).fill({ type: "rune" });
      expect(
        claim([{ type: "sword" }, ...runes], [{ itemType: "rune", amount: 300 }]),
      ).toEqual({ payout: 200, remainingCap: 3300 });
    });
    it("staff + potion + moonstone policy → insurance sum 1450 G, cap 2900 G", () => {
      expect(
        claim([{ type: "staff" }, { type: "potion" }, { type: "moonstone" }], [
          { itemType: "staff", amount: 50 },
        ]),
      ).toEqual({ payout: 0, remainingCap: 2900 });
    });
    it("two successive 1500 G claims on a sword → 1400 G (cap remaining 600 G), then 600 G (cap remaining 0 G)", () => {
      const incident = {
        cause: "troll",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 0, incident },
        ],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("rounds fractional payout down in the MHPCO's favor (350.5 → 350 G)", () => {
      expect(
        claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]),
      ).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim for an item not covered by the policy (amulet when only sword insured) → throws", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
      ).toThrow(/amulet/);
    });
    it("claim for an unknown item type → throws", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
      ).toThrow(/broomstick/);
    });
    it("claim with more damage entries of a type than the policy covers → throws", () => {
      expect(() =>
        claim([{ type: "sword" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      ).toThrow(/sword/);
    });
    it("claim with negative damage amount (-200) → throws", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads the schema example scenario from stdin and writes results JSON to stdout", () => {
      const result = runCli({
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
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
      expect(result.status).toBe(0);
    });
    it("exits non-zero with an error on stderr and no results on stdout for an unknown item type", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/broomstick/);
      expect(result.stdout).toBe("");
    });
  });
});
