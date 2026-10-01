import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Scenario } from "./claim-office.js";

const run = (scenario: unknown) => runScenario(scenario as Scenario);

const runes = (count: number) =>
  Array.from({ length: count }, () => ({ type: "rune" }));

const quotePremium = (items: object[], yearsWithMHPCO = 0): number => {
  const { results } = run({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

const claimStep = (damages: object[]) => ({
  op: "claim",
  policy: 0,
  incident: { cause: "dragon attack", damages },
});

const claimResult = (items: object[], damages: object[]) =>
  run({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }, claimStep(damages)],
  }).results[1];

const runCli = (input: unknown) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

describe("Claim Office", () => {
  describe("quote — base premiums (newcomer, first quote: +10% first insurance, +5 G fee)", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
    it("plain sword → 100 base +10 first insurance +5 fee = 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet → 60 +6 +5 = 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff → 80 +8 +5 = 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion → 40 +4 +5 = 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
    it("1 rune → 25 +2.5 +5 = 32.5 → rounded up to 33 G", () => {
      expect(quotePremium([{ type: "rune" }])).toBe(33);
    });
    it("2 runes → 50 G base → 60 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base (block applies) → 71 G", () => {
      expect(quotePremium(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base (no block, requires exactly 3) → 115 G", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base → 197.5 rounded up to 198 G", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base (different types, no block) → 88 G", () => {
      expect(quotePremium([...runes(2), { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base (two blocks) → 137 G", () => {
      const moonstones = runes(3).map(() => ({ type: "moonstone" }));
      expect(quotePremium([...runes(3), ...moonstones])).toBe(137);
    });
    it("unknown item type (broomstick) → throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(
        /broomstick/,
      );
    });
  });

  describe("quote — premium modifiers", () => {
    it("cursed sword (steel, enchantment 3), newcomer → 165 G", () => {
      expect(
        quotePremium([
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
        ]),
      ).toBe(165);
    });
    it("sword with enchantment 4, not cursed → no surcharge → 115 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 4 → only curse surcharge → 165 G", () => {
      expect(
        quotePremium([{ type: "sword", enchantment: 4, cursed: true }]),
      ).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge → 145 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges → 195 G", () => {
      expect(
        quotePremium([{ type: "sword", enchantment: 5, cursed: true }]),
      ).toBe(195);
    });
    it("customer with 1 year → no loyalty discount → 115 G for plain sword", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("customer with exactly 2 years → loyalty discount → 95 G for plain sword", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("item surcharge applies only to the cursed item: cursed sword + plain amulet → 160 + 50 + 16 + 5 = 231 G", () => {
      expect(
        quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }]),
      ).toBe(231);
    });
    it("second quote in scenario gets 15% follow-up discount: plain sword, 0 years → 100 G", () => {
      const { results } = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7, 3 years → 160 G", () => {
      const { results } = run({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim", () => {
    it("schema example: amulet quote for 5-year customer → 59 G; amulet damage 200 → payout 100, remainingCap 1100", () => {
      const { results } = run({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      expect(results).toEqual([
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
    it("regular steel sword enchantment 3, damage 500 → payout 400, remainingCap 1600", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "steel", enchantment: 3 }],
          [{ itemType: "sword", amount: 500 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 → payout 100, remainingCap 400", () => {
      expect(
        claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]),
      ).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon-material sword enchantment 8, damage 1000 → payout 400", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "dragon", enchantment: 8 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 (50% rule wins)", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "dragon", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword enchantment 5, damage 800 → payout 700", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "dragon", enchantment: 5 }],
          [{ itemType: "sword", amount: 800 }],
        ),
      ).toMatchObject({ payout: 700 });
    });
    it("steel sword enchantment 9, damage 1000 → payout 400", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "steel", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toMatchObject({ payout: 400 });
    });
    it("payout rounded down: steel sword enchantment 9, damage 901 → 350.5 → 350", () => {
      expect(
        claimResult(
          [{ type: "sword", material: "steel", enchantment: 9 }],
          [{ itemType: "sword", amount: 901 }],
        ),
      ).toMatchObject({ payout: 350 });
    });
    it("deductible per damaged item: sword 500 + amulet 300 → payout 600, remainingCap 2600 (cap 3200)", () => {
      expect(
        claimResult(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords insured, both damaged 500 each → payout 800, remainingCap 3200 (cap 4000)", () => {
      expect(
        claimResult(
          [{ type: "sword" }, { type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        ),
      ).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("cursed sword cap based on insurance value: damage 500 → payout 400, remainingCap 1600", () => {
      expect(
        claimResult(
          [{ type: "sword", cursed: true }],
          [{ itemType: "sword", amount: 500 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes insurance sum 1750: sword damage 500 → payout 400, remainingCap 3100", () => {
      expect(
        claimResult(
          [{ type: "sword" }, ...runes(3)],
          [{ itemType: "sword", amount: 500 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("successive claims of 1500 on a sword → 1400 (remaining 600), then 600 (remaining 0)", () => {
      const damage = [{ itemType: "sword", amount: 1500 }];
      const { results } = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claimStep(damage),
          claimStep(damage),
        ],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("damage to item not in policy (amulet when only sword insured) → throws", () => {
      expect(() =>
        claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
      ).toThrow();
    });
    it("damage to unknown item type → throws", () => {
      expect(() =>
        claimResult(
          [{ type: "sword" }],
          [{ itemType: "broomstick", amount: 200 }],
        ),
      ).toThrow();
    });
    it("more damages of a type than insured (two swords, one insured) → throws", () => {
      expect(() =>
        claimResult(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 200 },
            { itemType: "sword", amount: 200 },
          ],
        ),
      ).toThrow();
    });
    it("negative damage amount → throws", () => {
      expect(() =>
        claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow();
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claimStep([{ itemType: "sword", amount: 500 }]),
        ],
      });
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    }, 20000);
    it("exits non-zero with error on stderr and no results on stdout for invalid scenario", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr.trim()).toBe("Unknown item type: broomstick");
    }, 20000);
  });
});
