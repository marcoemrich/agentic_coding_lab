import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Damage, type Item, type Result } from "./claim-office.js";

const many = (count: number, item: Item): Item[] => Array.from({ length: count }, () => ({ ...item }));

const quotePremiums = (quotes: Item[][], yearsWithMHPCO = 0): number[] =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: quotes.map((items) => ({ op: "quote" as const, items })),
  }).results.map((result) => (result as { premium: number }).premium);

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number => quotePremiums([items], yearsWithMHPCO)[0];

const claimResults = (items: Item[], claims: Damage[][]): Result[] =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote" as const, items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

const payoutFor = (items: Item[], damages: Damage[]): number =>
  (claimResults(items, [damages])[0] as { payout: number }).payout;

const runCli = (stdin: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: stdin, encoding: "utf8" });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(results).toEqual({ results: [{ premium: 5 }] });
    });
    it("newcomer, plain sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("newcomer, plain amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("newcomer, plain staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("newcomer, plain potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and blocks", () => {
    it("2 runes → 50 G base premium (premium 60 G)", () => {
      expect(quotePremium(many(2, { type: "rune" }))).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (premium 71 G)", () => {
      expect(quotePremium(many(3, { type: "rune" }))).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (premium 115 G)", () => {
      expect(quotePremium(many(4, { type: "rune" }))).toBe(115);
    });
    it("7 runes → 175 G base premium (premium 198 G, 197.5 rounded up)", () => {
      expect(quotePremium(many(7, { type: "rune" }))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block for different types (premium 88 G)", () => {
      expect(quotePremium([...many(2, { type: "rune" }), { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two blocks (premium 137 G)", () => {
      expect(quotePremium([...many(3, { type: "rune" }), ...many(3, { type: "moonstone" })])).toBe(137);
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (premium 115 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (premium 145 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply (premium 195 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years → loyalty discount applies (plain sword premium 95 G)", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("cursed sword + plain amulet → curse surcharge only on the sword's base (210 G before policy modifiers; premium 231 G)", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
    it("second quote in a scenario receives 15 % follow-up discount (plain sword: 115 G, then 100 G)", () => {
      expect(quotePremiums([[{ type: "sword" }], [{ type: "sword" }]])).toEqual([115, 100]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
      const premiums = quotePremiums(
        [[{ type: "amulet" }], [{ type: "sword", material: "steel", enchantment: 7, cursed: true }]],
        3,
      );
      expect(premiums[1]).toBe(160);
    });
    it("premium yielding 197.5 G is rounded up to 198 G", () => {
      expect(quotePremium(many(7, { type: "moonstone" }))).toBe(198);
    });
  });

  describe("claim — reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      expect(payoutFor([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toBe(400);
    });
    it("rune, damage 200 G → payout 100 G", () => {
      expect(payoutFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toBe(100);
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
      expect(payoutFor([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toBe(700);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("payout yielding 350.5 G is rounded down to 350 G (enchantment 9, damage 901 G)", () => {
      expect(payoutFor([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }])).toBe(350);
    });
  });

  describe("claim — deductible and cap", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G, deductible per item", () => {
      expect(
        payoutFor(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toBe(600);
    });
    it("claim result reports remainingCap: sword + amulet policy → cap 3200 G", () => {
      expect(claimResults([{ type: "sword" }, { type: "amulet" }], [[{ itemType: "sword", amount: 500 }]])).toEqual([
        { payout: 400, remainingCap: 2800 },
      ]);
    });
    it("cursed sword policy → cap 2000 G based on unmodified insurance value", () => {
      expect(claimResults([{ type: "sword", cursed: true }], [[{ itemType: "sword", amount: 500 }]])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("sword + 3 runes policy → insurance sum 1750 G, cap 3500 G", () => {
      expect(claimResults([{ type: "sword" }, ...many(3, { type: "rune" })], [[{ itemType: "sword", amount: 500 }]])).toEqual([
        { payout: 400, remainingCap: 3100 },
      ]);
    });
    it("two swords policy → cap 4000 G; damage to both swords handled with separate deductibles", () => {
      expect(
        claimResults(many(2, { type: "sword" }), [
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 700 },
          ],
        ]),
      ).toEqual([{ payout: 1000, remainingCap: 3000 }]);
    });
    it("two successive 1500 G claims on a sword → payouts 1400 G (cap 600 G) then 600 G (cap 0 G)", () => {
      expect(
        claimResults([{ type: "sword" }], [[{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]]),
      ).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (broomstick) is rejected", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim damaging an item not in the policy is rejected", () => {
      expect(() => payoutFor([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("claim damaging an unknown item type (broomstick) is rejected", () => {
      expect(() => payoutFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("claim with more damages of a type than the policy covers is rejected", () => {
      expect(() =>
        payoutFor(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow(/sword/);
    });
    it("claim with a negative damage amount is rejected", () => {
      expect(() => payoutFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes results JSON to stdout", () => {
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
    it("exits non-zero and writes an error to stderr with no results on invalid input", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { stdout, stderr, status } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/broomstick/);
      expect(stdout).toBe("");
    });
  });
});
