import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

// Unless stated otherwise, quotes are for a newcomer (0 years, first quote):
// premium = base + item surcharges + 10 % first insurance (of base) + 5 G fee.

type Scenario = Parameters<typeof runScenario>[0];
type QuoteItems = Extract<Scenario["steps"][number], { op: "quote" }>["items"];

const quotePremium = (items: QuoteItems, yearsWithMHPCO = 0): number =>
  (runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  }).results[0] as { premium: number }).premium;

type Damage = { itemType: string; amount: number };

// Quotes the items, then files one claim per damage list against that policy.
const claimResults = (items: QuoteItems, ...claims: Damage[][]) =>
  runScenario({
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

describe("Claim Office — quote", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });

  describe("main item base premiums", () => {
    it("plain sword (base 100 G) → premium 115 G", () => {
      expect(quotePremium([{ type: "sword" }])).toBe(115);
    });
    it("plain amulet (base 60 G) → premium 71 G", () => {
      expect(quotePremium([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff (base 80 G) → premium 93 G", () => {
      expect(quotePremium([{ type: "staff" }])).toBe(93);
    });
    it("plain potion (base 40 G) → premium 49 G", () => {
      expect(quotePremium([{ type: "potion" }])).toBe(49);
    });
  });

  describe("components and building blocks", () => {
    it("2 runes → base 50 G → premium 60 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → base 60 G (block applies) → premium 71 G", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → base 100 G (no block — requires exactly 3) → premium 115 G", () => {
      const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
      expect(quotePremium(runes)).toBe(115);
    });
    it("7 runes → base 175 G → 197.5 G rounded up in MHPCO's favor → premium 198 G", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quotePremium(runes)).toBe(198);
    });
    it("2 runes + 1 moonstone → base 75 G (no block: different types) → premium 88 G", () => {
      expect(
        quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      ).toBe(88);
    });
    it("3 runes + 3 moonstones → base 120 G (two separate blocks) → premium 137 G", () => {
      const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quotePremium([...runes, ...moonstones])).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("newcomer with cursed steel sword, enchantment 3 → premium 165 G", () => {
      expect(
        quotePremium([
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
        ]),
      ).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → premium 145 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4, not cursed → no surcharge → premium 115 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("cursed sword with enchantment 4 → only curse surcharge → premium 165 G", () => {
      expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → curse surcharge only on sword's base (160 + 50 + 16 + 5) → premium 231 G", () => {
      expect(
        quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }]),
      ).toBe(231);
    });
  });

  describe("customer modifiers", () => {
    it("customer with 1 year → no loyalty discount → plain sword premium 115 G", () => {
      expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
    });
    it("customer with exactly 2 years → loyalty discount applies → plain sword premium 95 G", () => {
      expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
    });
    it("schema example: 5-year customer, silver amulet enchantment 2 → premium 59 G", () => {
      expect(
        quotePremium(
          [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          5,
        ),
      ).toBe(59);
    });
    it("newcomer's second quote gets 15 % follow-up discount, first insurance still applies → plain sword premium 100 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("3-year customer's second quote, cursed sword enchantment 7 → premium 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  it("quote with unknown item type (broomstick) → rejected with an error", () => {
    expect(() => quotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("Claim Office — claim", () => {
  describe("standard reimbursement", () => {
    it("steel sword enchantment 3, damage 500 G → payout 400 G, remaining cap 1600 G", () => {
      expect(
        claimResults([{ type: "sword", material: "steel", enchantment: 3 }], [
          { itemType: "sword", amount: 500 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("rune, damage 200 G → payout 100 G, remaining cap 400 G", () => {
      expect(
        claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]),
      ).toEqual([{ payout: 100, remainingCap: 400 }]);
    });
    it("schema example: amulet damaged 200 G → payout 100 G, remaining cap 1100 G", () => {
      const { results } = runScenario({
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
  });

  describe("enchantment threshold vs. dragon material", () => {
    it("dragon sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(
        claimResults([{ type: "sword", material: "dragon", enchantment: 8 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon sword enchantment 9, damage 1000 G → 50 % rule wins → payout 400 G", () => {
      expect(
        claimResults([{ type: "sword", material: "dragon", enchantment: 9 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon sword enchantment 5, damage 800 G → payout 700 G, remaining cap 1300 G", () => {
      expect(
        claimResults([{ type: "sword", material: "dragon", enchantment: 5 }], [
          { itemType: "sword", amount: 800 },
        ]),
      ).toEqual([{ payout: 700, remainingCap: 1300 }]);
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(
        claimResults([{ type: "sword", material: "steel", enchantment: 9 }], [
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("payout of 350.5 G (enchantment 9, damage 901 G) is rounded down → payout 350 G", () => {
      expect(
        claimResults([{ type: "sword", enchantment: 9 }], [
          { itemType: "sword", amount: 901 },
        ]),
      ).toEqual([{ payout: 350, remainingCap: 1650 }]);
    });
  });

  describe("deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G, remaining cap 2600 G", () => {
      expect(
        claimResults([{ type: "sword" }, { type: "amulet" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
    it("two swords insured (cap 4000 G), both damaged 500 G → each own deductible → payout 800 G, remaining cap 3200 G", () => {
      expect(
        claimResults([{ type: "sword" }, { type: "sword" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ).toEqual([{ payout: 800, remainingCap: 3200 }]);
    });
  });

  describe("cap", () => {
    it("cursed sword cap is 2000 G based on unmodified insurance value → damage 3000 G → payout 2000 G, remaining cap 0 G", () => {
      expect(
        claimResults([{ type: "sword", cursed: true }], [
          { itemType: "sword", amount: 3000 },
        ]),
      ).toEqual([{ payout: 2000, remainingCap: 0 }]);
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G → sword damage 500 G → remaining cap 3100 G", () => {
      const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      expect(
        claimResults([{ type: "sword" }, ...runes], [
          { itemType: "sword", amount: 500 },
        ]),
      ).toEqual([{ payout: 400, remainingCap: 3100 }]);
    });
    it("two successive 1500 G claims on a sword → payouts 1400 G then 600 G, remaining caps 600 G then 0 G", () => {
      expect(
        claimResults(
          [{ type: "sword" }],
          [{ itemType: "sword", amount: 1500 }],
          [{ itemType: "sword", amount: 1500 }],
        ),
      ).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("invalid claims", () => {
    it("more sword damages than insured swords → whole claim rejected", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ).toThrow(/sword/);
    });
    it("damage to an amulet when only a sword is insured → rejected", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
      ).toThrow(/amulet/);
    });
    it("damage to an unknown item type → rejected", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
      ).toThrow(/broomstick/);
    });
    it("damage with negative amount (-200) → rejected", () => {
      expect(() =>
        claimResults([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow(/-200/);
    });
  });
});

describe("Claim Office — CLI", () => {
  const runCli = (input: unknown) =>
    spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });

  it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
    expect(cli.status).toBe(0);
  });
  it("exits non-zero with error on stderr and no results on stdout for an unknown item type", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    expect(cli.stderr.trim()).toBe("Error: Unknown item type: broomstick");
  });
});
