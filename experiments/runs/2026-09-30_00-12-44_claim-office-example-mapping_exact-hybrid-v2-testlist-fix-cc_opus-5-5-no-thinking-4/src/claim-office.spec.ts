import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

// Unless stated otherwise: newcomer customer (0 years), first quote in scenario,
// so premium = (base + item surcharges + 10 % first insurance of base) + 5 G fee.

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

describe("Claim Office — quote", () => {
  describe("edge cases", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
  });

  describe("main item base premiums", () => {
    it("sword (base 100) → premium 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("amulet (base 60) → premium 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("staff (base 80) → premium 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("potion (base 40) → premium 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("components and building blocks", () => {
    const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
    const moonstones = (count: number): Item[] =>
      Array.from({ length: count }, () => ({ type: "moonstone" }));

    it("2 runes (base 50) → premium 60 G", () => {
      expect(quotePremium(runes(2))).toBe(60);
    });
    it("3 runes (block, base 60) → premium 71 G", () => {
      expect(quotePremium(runes(3))).toBe(71);
    });
    it("4 runes (no block, base 100) → premium 115 G", () => {
      expect(quotePremium(runes(4))).toBe(115);
    });
    it("7 runes (base 175 → 197.5 G) → premium 198 G (rounded up in MHPCO's favor)", () => {
      expect(quotePremium(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone (no block: different types, base 75 → 87.5) → premium 88 G", () => {
      expect(quotePremium([...runes(2), ...moonstones(1)])).toBe(88);
    });
    it("3 runes + 3 moonstones (two separate blocks, base 120) → premium 137 G", () => {
      expect(quotePremium([...runes(3), ...moonstones(3)])).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("cursed sword (steel, enchantment 3) → premium 165 G", () => {
      expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → premium 145 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 4 → only curse surcharge → premium 165 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → curse surcharge only on sword's base (210 before policy modifiers) → premium 231 G", () => {
      expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies → sword premium 95 G", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount → sword premium 115 G", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in scenario gets 15 % follow-up discount → sword premium 100 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G (first insurance still applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws", () => {
      expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });
});

type Damage = { itemType: string; amount: number };

// Quotes the items (step 0), then files each claim against that policy.
const claimResults = (items: Item[], claims: Damage[][]): unknown[] => {
  const { results } = processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  });
  return results.slice(1);
};

describe("Claim Office — claim", () => {
  describe("standard reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 → payout 400, remainingCap 1600", () => {
      expect(
        claimResults([{ type: "sword", material: "steel", enchantment: 3 }], [[{ itemType: "sword", amount: 500 }]]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("rune, damage 200 → payout 100, remainingCap 400", () => {
      expect(claimResults([{ type: "rune" }], [[{ itemType: "rune", amount: 200 }]])).toEqual([
        { payout: 100, remainingCap: 400 },
      ]);
    });
  });

  describe("enchantment threshold vs. dragon material", () => {
    const swordPayout = (material: string, enchantment: number, amount: number): number => {
      const [result] = claimResults([{ type: "sword", material, enchantment }], [[{ itemType: "sword", amount }]]);
      return (result as { payout: number }).payout;
    };

    it("dragon-material sword enchantment 5, damage 800 → payout 700", () => {
      expect(swordPayout("dragon", 5, 800)).toBe(700);
    });
    it("steel sword enchantment 9, damage 1000 → payout 400 (50 % then deductible)", () => {
      expect(swordPayout("steel", 9, 1000)).toBe(400);
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 (50 % rule wins)", () => {
      expect(swordPayout("dragon", 9, 1000)).toBe(400);
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 → payout 400", () => {
      expect(swordPayout("dragon", 8, 1000)).toBe(400);
    });
    it("payout of 350.5 (enchantment 8 sword, damage 901) → payout 350 (rounded down)", () => {
      expect(swordPayout("steel", 8, 901)).toBe(350);
    });
  });

  describe("deductible per damage event", () => {
    it("dragon attack damages sword (500) and amulet (300) → payout 600, remainingCap 2600", () => {
      expect(
        claimResults(
          [{ type: "sword" }, { type: "amulet" }],
          [[{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]],
        ),
      ).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
    it("two insured swords both damaged (500 each) → each with own deductible → payout 800, remainingCap 3200", () => {
      expect(
        claimResults(
          [{ type: "sword" }, { type: "sword" }],
          [[{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]],
        ),
      ).toEqual([{ payout: 800, remainingCap: 3200 }]);
    });
  });

  describe("cap", () => {
    it("cursed sword cap is based on insurance value: damage 1500 → payout 1400, remainingCap 600", () => {
      expect(claimResults([{ type: "sword", cursed: true }], [[{ itemType: "sword", amount: 1500 }]])).toEqual([
        { payout: 1400, remainingCap: 600 },
      ]);
    });
    it("sword + 3 runes insurance sum 1750 (cap 3500): sword damage 500 → payout 400, remainingCap 3100", () => {
      expect(
        claimResults(
          [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          [[{ itemType: "sword", amount: 500 }]],
        ),
      ).toEqual([{ payout: 400, remainingCap: 3100 }]);
    });
    it("two successive claims of 1500 on a sword → payouts 1400 then 600, remainingCap 600 then 0", () => {
      expect(
        claimResults([{ type: "sword" }], [[{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]]),
      ).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("errors", () => {
    it("damage to an item type not in the policy (amulet when only sword insured) → throws", () => {
      expect(() => claimResults([{ type: "sword" }], [[{ itemType: "amulet", amount: 200 }]])).toThrow(/amulet/);
    });
    it("damage to an unknown item type → throws", () => {
      expect(() => claimResults([{ type: "sword" }], [[{ itemType: "broomstick", amount: 200 }]])).toThrow(/broomstick/);
    });
    it("more damage entries of a type than insured (two swords damaged, one insured) → throws", () => {
      expect(() =>
        claimResults(
          [{ type: "sword" }],
          [[{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]],
        ),
      ).toThrow(/sword/);
    });
    it("damage with negative amount (-200) → throws", () => {
      expect(() => claimResults([{ type: "sword" }], [[{ itemType: "sword", amount: -200 }]])).toThrow(/-200/);
    });
  });
});

describe("Claim Office — CLI", () => {
  const runCli = (input: unknown) =>
    spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

  it("schema example (5-year customer, silver amulet quote, fire claim 200) → {results:[{premium:59},{payout:100,remainingCap:1100}]}", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(status).toBe(0);
  });
  it("quote with unknown item type → non-zero exit, error on stderr, nothing on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.trim()).toBe("Error: Unknown item type: broomstick");
  });
  it("claim with negative amount → non-zero exit, error on stderr", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.trim()).toBe("Error: Damage amount must not be negative: -200");
  });
});
