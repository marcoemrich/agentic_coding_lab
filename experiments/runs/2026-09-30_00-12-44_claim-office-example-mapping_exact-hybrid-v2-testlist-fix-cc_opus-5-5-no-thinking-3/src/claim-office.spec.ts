import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Item } from "./claim-office.js";

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number =>
  (runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as { premium: number }).premium;

describe("Claim Office — quote", () => {
  describe("edge cases", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
  });

  describe("main item base premiums (newcomer: +10% first insurance, +5 G fee)", () => {
    it("plain sword, 0 years → 100 + 10 + 5 = 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet, 0 years → 60 + 6 + 5 = 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff, 0 years → 80 + 8 + 5 = 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion, 0 years → 40 + 4 + 5 = 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("components and building blocks", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    const moonstones = (count: number) => Array.from({ length: count }, () => ({ type: "moonstone" }));

    it("2 runes → 50 G base premium → 55 + 5 = 60 G", () => {
      expect(quotePremium(runes(2))).toBe(60);
    });
    it("3 runes → 60 G base premium (block) → 66 + 5 = 71 G", () => {
      expect(quotePremium(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base premium (no block, block requires exactly 3) → 110 + 5 = 115 G", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base premium → 192.5 + 5 = 197.5 → rounded up 198 G", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → 82.5 + 5 → 88 G", () => {
      expect(quotePremium([...runes(2), ...moonstones(1)])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → 132 + 5 = 137 G", () => {
      expect(quotePremium([...runes(3), ...moonstones(3)])).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("newcomer with cursed steel sword, enchantment 3 → 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → 115 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → (100+30)+10+5 = 145 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges → (100+50+30)+10+5 = 195 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword + plain amulet → surcharge only on sword's base: 210 G + 16 first insurance + 5 fee = 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies: plain sword → 100 − 20 + 10 + 5 = 95 G", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount: plain sword → 115 G", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario gets 15% follow-up discount: plain sword → 100 + 10 − 15 + 5 = 100 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 100 });
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });
});

type Damage = { itemType: string; amount: number };

const claimSteps = (...claims: Damage[][]) =>
  claims.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }));

const claimResults = (policyItems: Item[], ...claims: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items: policyItems }, ...claimSteps(...claims)],
  }).results.slice(1);

describe("Claim Office — claim", () => {
  describe("standard reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G, remainingCap 1600 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [{ itemType: "sword", amount: 500 }],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damaged 200 G → payout 100 G, remainingCap 400 G (cap 2×250)", () => {
      const [result] = claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("amulet damage 200 G (schema example) → payout 100 G, remainingCap 1100 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });

  describe("enchantment and dragon material clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }],
      );
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins)", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const [result] = claimResults(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two insured swords both damaged (500 G, 700 G) → each entry has its own deductible → payout 1000 G", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 700 },
        ],
      );
      expect(result).toEqual({ payout: 1000, remainingCap: 3000 });
    });
  });

  describe("rounding", () => {
    it("payout yielding 350.5 G is rounded down to 350 G (enchantment ≥ 8 sword, damage 901 G)", () => {
      const [result] = claimResults([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]);
      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("cap", () => {
    it("sword + amulet policy → cap 3200 G (remainingCap after small claim reflects it)", () => {
      const [result] = claimResults([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("staff + potion + moonstone → insurance sum 1450 G (800 + 400 + 250), cap 2900 G", () => {
      const [result] = claimResults(
        [{ type: "staff" }, { type: "potion" }, { type: "moonstone" }],
        [{ itemType: "staff", amount: 300 }],
      );
      expect(result).toEqual({ payout: 200, remainingCap: 2700 });
    });

    it("two swords → cap 4000 G", () => {
      const [result] = claimResults([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      const [result] = claimResults([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G", () => {
      const [result] = claimResults(
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        [{ itemType: "sword", amount: 200 }],
      );
      expect(result).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("two successive 1500 G claims on a sword → 1400 G (cap 600), then 600 G (cap 0)", () => {
      const results = claimResults(
        [{ type: "sword" }],
        [{ itemType: "sword", amount: 1500 }],
        [{ itemType: "sword", amount: 1500 }],
      );
      expect(results).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim for an item not in the policy (amulet when only sword insured) throws", () => {
      expect(() => claimResults([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("claim for an unknown item type throws", () => {
      expect(() => claimResults([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("claim with negative damage amount (-200) throws", () => {
      expect(() => claimResults([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
    it("claim with more damage entries of a type than insured (two swords, one insured) throws", () => {
      expect(() =>
        claimResults(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow(/sword/);
    });
  });
});

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

const schemaExample = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes results JSON to stdout", () => {
    const { stdout, status } = runCli(schemaExample);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("unknown item type → non-zero exit, error on stderr, no results on stdout", () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.trim()).toBe("Error: Unknown item type: broomstick");
  });
  it("negative damage amount → non-zero exit, error on stderr", () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/-200/);
  });
});
