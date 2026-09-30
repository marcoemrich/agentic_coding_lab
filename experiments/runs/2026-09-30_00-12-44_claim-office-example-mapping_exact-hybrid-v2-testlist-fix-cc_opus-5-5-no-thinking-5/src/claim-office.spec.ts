import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario, type Item } from "./claim-office.js";

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number =>
  processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  }).results[0].premium;

type Damage = { itemType: string; amount: number };

const claimResults = (items: Item[], ...claims: Damage[][]) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

const claimResult = (items: Item[], damages: Damage[]) => claimResults(items, damages)[0];

const swordPayout = (sword: Omit<Item, "type">, amount: number): number =>
  claimResult([{ type: "sword", ...sword }], [{ itemType: "sword", amount }]).payout;

const runCli = (input: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input, encoding: "utf8" });

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
    it("single rune → 25 G base premium (25 + 2.5 + 5 = 32.5 → 33 G)", () => {
      expect(quotePremium([{ type: "rune" }])).toBe(33);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium (premium 60 G)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (premium 71 G)", () => {
      expect(quotePremium(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (premium 115 G)", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base premium (premium 197.5 → 198 G)", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, different types (premium 87.5 → 88 G)", () => {
      expect(quotePremium([...runes(2), { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (premium 137 G)", () => {
      const moonstones: Item[] = [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }];
      expect(quotePremium([...runes(3), ...moonstones])).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword for a newcomer → 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment exactly 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (115 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 4 → only curse surcharge (165 G)", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → surcharge only on the sword: 160 base + 50 curse + 16 first + 5 fee = 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (115 G)", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario gets 15 % follow-up discount (100 + 10 − 15 + 5 = 100 G)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("premium fractions are rounded up in the MHPCO's favor (loyal customer, 1 rune: 27.5 → 28 G)", () => {
      expect(quotePremium(runes(1), 2)).toBe(28);
    });
  });

  describe("claim — reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G, remainingCap 1600 G", () => {
      expect(
        claimResult([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damaged by 200 G → payout 100 G (cap 2 × 250 = 500, remaining 400)", () => {
      expect(claimResult(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      expect(swordPayout({ material: "steel", enchantment: 9 }, 1000)).toBe(400);
    });
    it("dragon-material sword enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(swordPayout({ material: "dragon", enchantment: 8 }, 1000)).toBe(400);
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      expect(swordPayout({ material: "dragon", enchantment: 9 }, 1000)).toBe(400);
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(swordPayout({ material: "dragon", enchantment: 5 }, 800)).toBe(700);
    });
    it("damage smaller than the deductible → payout 0 G", () => {
      expect(swordPayout({ material: "steel", enchantment: 3 }, 60)).toBe(0);
    });
    it("payout fractions are rounded down in the MHPCO's favor (enchantment 9, damage 901 → 350.5 → 350 G)", () => {
      expect(swordPayout({ material: "steel", enchantment: 9 }, 901)).toBe(350);
    });
  });

  describe("claim — deductible per damaged item", () => {
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(600);
    });
    it("two swords insured, both damaged → each entry has its own deductible (400 + 200 = 600, remaining 3400)", () => {
      const result = claimResult(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim — cap", () => {
    it("sword + amulet policy → cap 3200 G (remainingCap after small claim reflects it)", () => {
      const result = claimResult([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(results).toEqual([{ premium: 165 }, { payout: 400, remainingCap: 1600 }]);
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
      const result = claimResult([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = claimResult([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("two successive claims of 1500 G on a sword → payouts 1400 then 600, remainingCap 600 then 0", () => {
      const damages = [{ itemType: "sword", amount: 1500 }];
      expect(claimResults([{ type: "sword" }], damages, damages)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/unknown item type.*broomstick/i);
    });
    it("claim for an item not in the policy (amulet when only a sword is insured) → throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("claim for an unknown item type → throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("claim with more damages of a type than insured (two swords, one insured) → throws", () => {
      expect(() =>
        claimResult(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow(/sword/);
    });
    it("claim with negative amount (-200) → throws", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("scenario", () => {
    it("schema example: returns results for quote and claim steps in order", () => {
      const outcome = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(outcome).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
    it("CLI: reads scenario JSON from stdin and writes results JSON to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      };
      const { stdout, status } = runCli(JSON.stringify(scenario));
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
      expect(status).toBe(0);
    });
    it("CLI: invalid scenario → non-zero exit code, error on stderr, nothing on stdout", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { stdout, stderr, status } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr.trim()).toBe("Error: Unknown item type: broomstick");
    });
  });
});
