import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Damage, type Item, type QuoteResult } from "./claim-office.js";

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));

const quote = (items: Item[], yearsWithMHPCO = 0): number =>
  (runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as QuoteResult).premium;

const claims = (items: Item[], ...incidents: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...incidents.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
    ],
  }).results.slice(1);

describe("Claim Office", () => {
  describe("quote — edge cases", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toBe(5);
    });
    it("unknown item type (broomstick) in quote → throws an error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow();
    });
  });

  describe("quote — base premiums of main items (new customer: +10% first insurance, +5 G fee)", () => {
    it("plain sword → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet → 60 base + 6 first insurance + 5 fee = 71 G", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff → 80 base + 8 first insurance + 5 fee = 93 G", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("plain potion → 40 base + 4 first insurance + 5 fee = 49 G", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium → 50 + 5 + 5 = 60 G", () => {
      expect(quote(runes(2))).toBe(60);
    });
    it("3 runes → 60 G base premium (block) → 60 + 6 + 5 = 71 G", () => {
      expect(quote(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base premium (no block) → 100 + 10 + 5 = 115 G", () => {
      expect(quote(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base premium → 175 + 17.5 + 5 = 197.5 → rounded up to 198 G", () => {
      expect(quote(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (different types, no block) → 75 + 7.5 + 5 = 87.5 → 88 G", () => {
      expect(quote([...runes(2), ...moonstones(1)])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two blocks) → 120 + 12 + 5 = 137 G", () => {
      expect(quote([...runes(3), ...moonstones(3)])).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword (steel, enchantment 3), newcomer → 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", () => {
      expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge: 115 G", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword with enchantment 4 → only curse surcharge: 165 G", () => {
      expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → curse applies to sword only: 160 + 50 + 16 first + 5 fee = 231 G", () => {
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount: 100 − 20 + 10 + 5 = 95 G", () => {
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount: 115 G", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in the scenario gets 15% follow-up discount: sword 100 + 10 − 15 + 5 = 100 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
    });
    it("premium fraction is rounded up in MHPCO's favor: second quote of 2 runes 50 + 5 − 7.5 + 5 = 52.5 → 53 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: runes(2) },
          { op: "quote", items: runes(2) },
        ],
      });
      expect(results).toEqual([{ premium: 60 }, { premium: 53 }]);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 → payout 400, remainingCap 1600", () => {
      expect(
        claims([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("rune damage 200 → payout 100 (no enchantment or material); cap 500 → remainingCap 400", () => {
      expect(claims(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 400 }]);
    });
    it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per damaged item)", () => {
      expect(
        claims(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword enchantment 9, damage 1000 → payout 400 (50% then deductible)", () => {
      expect(
        claims([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 (50% rule wins)", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 5, damage 800 → payout 700 (full reimbursement)", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
      ).toEqual([{ payout: 700, remainingCap: 1300 }]);
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 → payout 400", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("payout fraction is rounded down in MHPCO's favor: enchantment 9 sword, damage 901 → 350.5 → 350", () => {
      expect(claims([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }])).toEqual([
        { payout: 350, remainingCap: 1650 },
      ]);
    });
  });

  describe("claim — cap", () => {
    it("sword + amulet policy → insurance sum 1600, cap 3200: remainingCap after 500 sword damage = 2800", () => {
      expect(claims([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }])).toEqual([
        { payout: 400, remainingCap: 2800 },
      ]);
    });
    it("cursed sword → cap 2000 based on unmodified insurance value", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "curse", damages: [{ itemType: "sword", amount: 300 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 165 }, { payout: 200, remainingCap: 1800 }]);
    });
    it("sword + 3 runes (block) → insurance sum 1750, cap 3500", () => {
      expect(claims([{ type: "sword" }, ...runes(3)], [{ itemType: "rune", amount: 200 }])).toEqual([
        { payout: 100, remainingCap: 3400 },
      ]);
    });
    it("two successive 1500 claims on a sword → payouts 1400 (remaining 600) then 600 (remaining 0)", () => {
      expect(
        claims([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]),
      ).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("two swords → insurance sum 2000, cap 4000; both damaged, each damage has its own deductible", () => {
      expect(
        claims(
          [{ type: "sword" }, { type: "sword" }],
          [
            { itemType: "sword", amount: 1500 },
            { itemType: "sword", amount: 1200 },
          ],
        ),
      ).toEqual([{ payout: 2500, remainingCap: 1500 }]);
    });
  });

  describe("claim — errors", () => {
    it("damage for an item type not in the policy → throws an error", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow();
    });
    it("damage for an unknown item type → throws an error", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow();
    });
    it("more damage entries of a type than items insured → throws an error", () => {
      expect(() =>
        claims(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        ),
      ).toThrow();
    });
    it("negative damage amount → throws an error", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow();
    });
  });

  describe("CLI", () => {
    const runCli = (input: unknown) =>
      spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

    it("reads the schema example scenario from stdin and writes results JSON to stdout", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    }, 20000);
    it("exits non-zero and writes an error to stderr (no stdout results) for an unknown item type", () => {
      const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Unknown item type: broomstick");
    }, 20000);
  });
});
