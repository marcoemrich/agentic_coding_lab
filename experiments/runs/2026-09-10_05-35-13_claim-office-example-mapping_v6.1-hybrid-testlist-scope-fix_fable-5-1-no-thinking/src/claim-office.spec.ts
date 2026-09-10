import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import {
  runScenario,
  type ClaimResult,
  type Damage,
  type Item,
} from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0): number => {
  const result = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (result.results[0] as { premium: number }).premium;
};

const claim = (
  items: Item[],
  damages: Damage[],
  yearsWithMHPCO = 0,
): ClaimResult => {
  const result = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  });
  return result.results[1] as ClaimResult;
};

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums and fee", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword, newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword" }])).toBe(115);
    });
    it("amulet base premium 60 G (newcomer: 60 + 6 + 5 = 71 G)", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("staff base premium 80 G (newcomer: 80 + 8 + 5 = 93 G)", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("potion base premium 40 G (newcomer: 40 + 4 + 5 = 49 G)", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and blocks of 3 alike", () => {
    it("2 runes → 50 G base premium", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      expect(quote(Array(4).fill({ type: "rune" }))).toBe(115);
    });
    it("7 runes → 175 G base premium (total 197.5 → rounded up to 198)", () => {
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
      expect(quote(items)).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds 50 % of its base premium (newcomer: 100 + 50 + 10 + 5 = 165 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 5 → high-enchantment surcharge applies (30 %)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword + plain amulet → surcharge applies only to the cursed sword's base (210 G before policy modifiers and fee)", () => {
      // 160 base + 50 curse + 16 first insurance + 5 fee
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount 20 % applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in the scenario → 15 % follow-up discount, first insurance surcharge still applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      // first: 100 − 20 loyalty + 10 first insurance + 5 = 95
      // second: 100 − 20 loyalty + 10 first insurance − 15 follow-up + 5 = 80
      expect(result.results).toEqual([{ premium: 95 }, { premium: 80 }]);
    });
    it("premium yielding 197.5 G → rounded up to 198 G", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) → 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      // 100 + 50 curse + 30 enchantment − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
    });
    it("rune damage 200 G → payout 100 G (no special clause)", () => {
      expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
    });
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per damaged item)", () => {
      const result = claim(
        [{ type: "sword" }, { type: "amulet" }],
        [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
    });
    it("payout yielding 350.5 G → rounded down to 350 G", () => {
      // enchantment 9: 901 × 50 % = 450.5, minus 100 deductible = 350.5
      const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
      expect(claim([sword], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("sword + amulet → insurance sum 1600 G, cap 3200 G; after a 400 G payout remainingCap is 2800 G", () => {
      const result = claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 G (modifiers do not raise the cap)", () => {
      const result = claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
      const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
      const result = claim(items, [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two swords → cap 4000 G; two sword damages each get their own deductible", () => {
      const result = claim(
        [{ type: "sword" }, { type: "sword" }],
        [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
      );
      expect(result).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("two successive 1500 G claims on a sword → 1400 G (cap 600 left), then 600 G (cap 0)", () => {
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 0, incident },
        ],
      });
      expect(result.results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws an error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim for an item not in the policy (amulet when only sword insured) → throws an error", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
    });
    it("claim with more damages of a type than insured (two sword damages, one sword) → throws an error", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
      expect(() => claim([{ type: "sword" }], damages)).toThrow(/sword/);
    });
    it("claim with negative damage amount → throws an error", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    const runCli = (stdin: string) =>
      spawnSync("npx", ["tsx", "src/cli.ts"], { input: stdin, encoding: "utf8" });

    it("reads scenario JSON from stdin and writes {results: [...]} to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const { status, stdout } = runCli(JSON.stringify(scenario));
      expect(status).toBe(0);
      // premium: 60 − 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 − 100; cap 1200 − 100
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("unknown item type → non-zero exit, error on stderr, nothing on stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };
      const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr).toMatch(/broomstick/);
    });
  });
});
