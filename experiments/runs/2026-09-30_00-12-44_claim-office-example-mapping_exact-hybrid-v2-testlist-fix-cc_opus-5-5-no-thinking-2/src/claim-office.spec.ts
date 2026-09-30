import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const quotePremium = (items: object[], yearsWithMHPCO = 0): number =>
  (runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] })
    .results[0] as { premium: number }).premium;

type ClaimResult = { payout: number; remainingCap: number };

const claimResult = (items: object[], damages: object[]): ClaimResult =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1] as ClaimResult;

const runCli = (input: object) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quotePremium([])).toBe(5);
    });
    it("plain sword for a newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet for a newcomer → 60 + 6 + 5 = 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff for a newcomer → 80 + 8 + 5 = 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion for a newcomer → 40 + 4 + 5 = 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium (55 + 5 = 60 G for a newcomer)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (66 + 5 = 71 G)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (110 + 5 = 115 G)", () => {
      expect(quotePremium(Array(4).fill({ type: "rune" }))).toBe(115);
    });
    it("7 runes → 175 G base premium (192.5 + 5 = 197.5 → 198 G, rounded up)", () => {
      expect(quotePremium(Array(7).fill({ type: "rune" }))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block across types (82.5 + 5 → 88 G)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (132 + 5 = 137 G)", () => {
      const runes = Array(3).fill({ type: "rune" });
      const moonstones = Array(3).fill({ type: "moonstone" });
      expect(quotePremium([...runes, ...moonstones])).toBe(137);
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed steel sword, enchantment 3 → 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("cursed surcharge applies only to the cursed item: cursed sword + plain amulet → 160 + 50 = 210 base, +16 first insurance +5 fee = 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (115 G for a newcomer)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years → loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (115 G)", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario gets the 15 % follow-up discount (first 115 G, second 100 G)", () => {
      const quote = { op: "quote", items: [{ type: "sword" }] };
      const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [quote, quote] });
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
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — reimbursement", () => {
    it("regular steel sword, enchantment 3, damage 500 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
    });
    it("rune (no enchantment/material), damage 200 G → payout 100 G", () => {
      expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("damage below the deductible pays nothing (sword damage 50 G → payout 0)", () => {
      expect(claimResult([{ type: "sword" }], [{ itemType: "sword", amount: 50 }]).payout).toBe(0);
    });
    it("payout calculation of 350.5 G is rounded down to 350 G (enchantment 9 sword, damage 901 G)", () => {
      const sword = { type: "sword", enchantment: 9 };
      expect(claimResult([sword], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
    });
    it("deductible applies once per damaged item: sword 500 G + amulet 300 G → payout 600 G", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("claim — cap", () => {
    it("remainingCap for a single sword is 2000 minus payout (damage 500 → payout 400, remainingCap 1600)", () => {
      const result = claimResult([{ type: "sword" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + amulet → cap 3200 G (damage 500 on sword → remainingCap 2800)", () => {
      const result = claimResult([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G, based on unmodified insurance value (damage 500 → remainingCap 1600)", () => {
      const result = claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes (a block) → insurance sum 1750, cap 3500 (damage 500 on sword → remainingCap 3100)", () => {
      const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
      const result = claimResult(items, [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two swords → cap 4000; two sword damages are separate, each with its own deductible", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("two successive claims of 1500 G on a sword → payouts 1400 then 600, remainingCap 600 then 0", () => {
      const claim = {
        op: "claim",
        policy: 0,
        incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (broomstick) throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/unknown item type/i);
    });
    it("claim for an item not in the policy (amulet when only a sword is insured) throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(
        /not insured/i,
      );
    });
    it("claim for an unknown item type throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow();
    });
    it("claim with a negative damage amount (-200) throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(
        /negative/i,
      );
    });
    it("claim with more damages of a type than insured (two swords, one insured) throws", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(() => claimResult([{ type: "sword" }], damages)).toThrow(/more .* than insured/i);
    });
  });

  describe("CLI", () => {
    it("reads the schema example from stdin and writes {results: [{premium}, {payout, remainingCap}]} to stdout", () => {
      const cli = runCli({
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
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
      expect(cli.status).toBe(0);
    });
    it("exits non-zero and writes to stderr with no results on stdout for an unknown item type", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stdout).toBe("");
      expect(cli.stderr.trim()).toBe("Error: Unknown item type: broomstick");
    });
    it("exits non-zero and writes to stderr for an invalid claim (negative amount)", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stdout).toBe("");
      expect(cli.stderr).toMatch(/negative/i);
    });
  });
});
