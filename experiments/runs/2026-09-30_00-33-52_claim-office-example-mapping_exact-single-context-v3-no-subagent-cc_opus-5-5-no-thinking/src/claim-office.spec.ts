import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type ClaimResult, type Damage, type Item } from "./claim-office.js";

const newcomer = { yearsWithMHPCO: 0 };

const many = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number): Item[] => many("rune", count);

const moonstones = (count: number): Item[] => many("moonstone", count);

const sword = (props: Omit<Item, "type"> = {}): Item => ({ type: "sword", ...props });

const quote = (items: Item[], customer = newcomer) =>
  runScenario({ customer, steps: [{ op: "quote", items }] }).results[0];

const claim = (items: Item[], damages: Damage[]) =>
  runScenario({
    customer: newcomer,
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];

const payoutFor = (items: Item[], damages: Damage[]) =>
  (claim(items, damages) as ClaimResult).payout;

const runCli = (input: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input, encoding: "utf8" });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toEqual({ premium: 5 });
    });
    it("plain sword for a newcomer → 115 G (100 base + 10 first insurance + 5 fee)", () => {
      expect(quote([sword()])).toEqual({ premium: 115 });
    });
    it("plain amulet, staff and potion use their price-list base premiums (60/80/40 G)", () => {
      // 180 base + 18 first insurance + 5 fee
      expect(quote([{ type: "amulet" }, { type: "staff" }, { type: "potion" }])).toEqual({ premium: 203 });
    });
    it("2 runes → 50 G base premium", () => {
      // 50 base + 5 first insurance + 5 fee
      expect(quote(runes(2))).toEqual({ premium: 60 });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      // 60 base + 6 first insurance + 5 fee
      expect(quote(runes(3))).toEqual({ premium: 71 });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      // 100 base + 10 first insurance + 5 fee
      expect(quote(runes(4))).toEqual({ premium: 115 });
    });
    it("7 runes → 175 G base premium", () => {
      // 175 base + 17.5 first insurance + 5 fee = 197.5 → rounded up to 198
      expect(quote(runes(7))).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88
      expect(quote([...runes(2), ...moonstones(1)])).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      // 120 base + 12 first insurance + 5 fee
      expect(quote([...runes(3), ...moonstones(3)])).toEqual({ premium: 137 });
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed steel sword, enchantment 3 → 165 G", () => {
      // 100 base + 50 curse + 10 first insurance + 5 fee
      expect(quote([sword({ material: "steel", enchantment: 3, cursed: true })])).toEqual({ premium: 165 });
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(quote([sword({ enchantment: 5 })])).toEqual({ premium: 145 });
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(quote([sword({ enchantment: 5, cursed: true })])).toEqual({ premium: 195 });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(quote([sword({ enchantment: 4 })])).toEqual({ premium: 115 });
      expect(quote([sword({ enchantment: 4, cursed: true })])).toEqual({ premium: 165 });
    });
    it("customer with exactly 2 years with MHPCO → loyalty discount applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(quote([sword()], { yearsWithMHPCO: 2 })).toEqual({ premium: 95 });
    });
    it("cursed sword + plain amulet → cursed surcharge applies only to the sword's base (210 G before policy modifiers and fee)", () => {
      // 160 policy base + 50 curse (sword only) + 16 first insurance + 5 fee
      expect(quote([sword({ cursed: true }), { type: "amulet" }])).toEqual({ premium: 231 });
    });
    it("fractional premium is rounded up in the MHPCO's favor", () => {
      // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33
      expect(quote(runes(1))).toEqual({ premium: 33 });
    });
    it("follow-up contract gets 15 % discount; first insurance still applies (3-year customer, second quote, cursed sword ench 7 → 160 G)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [sword({ material: "steel", enchantment: 7, cursed: true })] },
        ],
      });
      // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — payouts", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G", () => {
      expect(payoutFor([sword({ material: "steel", enchantment: 3 })], [{ itemType: "sword", amount: 500 }])).toBe(400);
    });
    it("rune damage 200 G → payout 100 G", () => {
      expect(payoutFor(runes(1), [{ itemType: "rune", amount: 200 }])).toBe(100);
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(payoutFor([sword({ material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }])).toBe(700);
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([sword({ material: "steel", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([sword({ material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(payoutFor([sword({ material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }])).toBe(400);
    });
    it("fractional payout is rounded down (350.5 G → 350 G)", () => {
      // 50 % of 901 = 450.5, minus 100 deductible = 350.5 → 350
      expect(payoutFor([sword({ enchantment: 9 })], [{ itemType: "sword", amount: 901 }])).toBe(350);
    });
    it("dragon attack on sword (500 G) and amulet (300 G) → payout 600 G (deductible per damaged item)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(payoutFor([sword(), { type: "amulet" }], damages)).toBe(600);
    });
    it("two swords insured, both damaged → each damage has its own deductible, cap 4000 G", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      // (500 − 100) + (300 − 100) = 600; cap 2 × 2000 = 4000 → 3400 remaining
      expect(claim([sword(), sword()], damages)).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim — cap", () => {
    it("sword + amulet → cap 3200 G (remainingCap reflects insurance sum 1600 G)", () => {
      // cap 2 × (1000 + 600) = 3200; payout 300 − 100 = 200 → 3000 remaining
      expect(claim([sword(), { type: "amulet" }], [{ itemType: "amulet", amount: 300 }])).toEqual({
        payout: 200,
        remainingCap: 3000,
      });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      expect(claim([sword({ cursed: true })], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G", () => {
      // cap 2 × (1000 + 3 × 250) = 3500; payout 200 − 100 = 100 → 3400 remaining
      expect(claim([sword(), ...runes(3)], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 3400,
      });
    });
    it("two successive 1500 G claims on a sword → 1400 G (remaining 600 G), then 600 G (remaining 0 G)", () => {
      const incident = { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] };
      const { results } = runScenario({
        customer: newcomer,
        steps: [
          { op: "quote", items: [sword()] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 0, incident },
        ],
      });
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) is rejected", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim for an item not part of the policy is rejected", () => {
      expect(() => claim([sword()], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
      expect(() => claim([sword()], [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
    });
    it("claim with more damages of a type than insured is rejected", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(() => claim([sword()], damages)).toThrow(/sword/);
    });
    it("claim with negative damage amount is rejected", () => {
      expect(() => claim([sword()], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads the scenario from stdin and writes results JSON to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const { status, stdout } = runCli(JSON.stringify(scenario));
      expect(status).toBe(0);
      // 60 − 12 loyalty + 6 first insurance + 5 fee = 59; cap 1200 − payout 100
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    }, 20000);
    it("exits non-zero with an error on stderr and no results on stdout for an invalid scenario", () => {
      const scenario = { customer: newcomer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/broomstick/);
      expect(stdout).toBe("");
    }, 20000);
  });
});
