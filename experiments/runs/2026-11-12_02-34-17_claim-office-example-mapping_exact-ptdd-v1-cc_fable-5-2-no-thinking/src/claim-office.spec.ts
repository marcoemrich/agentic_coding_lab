import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  processScenario,
  type Customer,
  type Damage,
  type Item,
  type Step,
  type StepResult,
} from "./claim-office.js";

// Unless a test says otherwise, the customer is a newcomer (0 years with MHPCO)
// and the quote is the customer's first contract, so the premium is
// policy base premium + item surcharges + 10 % first insurance + 5 G fee.
//
// Rejection contract: the specification only defines the CLI outcome (non-zero
// exit status, error description on stderr). Chosen reading for the scenario
// processor: a rejected step throws an Error; type and message are unspecified.

const newcomer: Customer = { yearsWithMHPCO: 0 };

const quote = (...items: Item[]): Step => ({ op: "quote", items });

const claim = (policy: number, ...damages: Damage[]): Step => ({
  op: "claim",
  policy,
  incident: { cause: "dragon attack", damages },
});

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

const resultsFor = (customer: Customer, ...steps: Step[]): StepResult[] => processScenario({ customer, steps }).results;

const claimOfficeExecutable = fileURLToPath(new URL("../claim-office", import.meta.url));

const runClaimOffice = (scenario: unknown) =>
  spawnSync(claimOfficeExecutable, { input: JSON.stringify(scenario), encoding: "utf8" });

describe("MHPCO claim office", () => {
  describe("quote", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(resultsFor(newcomer, quote())).toEqual([{ premium: 5 }]);
    });

    it("sword -> 100 G base premium -> premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      expect(resultsFor(newcomer, quote({ type: "sword" }))).toEqual([{ premium: 115 }]);
    });

    it("amulet -> 60 G base premium -> premium 71 G (60 + 6 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "amulet" }))).toEqual([{ premium: 71 }]);
    });

    it("staff -> 80 G base premium -> premium 93 G (80 + 8 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "staff" }))).toEqual([{ premium: 93 }]);
    });

    it("potion -> 40 G base premium -> premium 49 G (40 + 4 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "potion" }))).toEqual([{ premium: 49 }]);
    });

    it("sword and amulet -> policy base premium 160 G -> premium 181 G (160 + 16 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "sword" }, { type: "amulet" }))).toEqual([{ premium: 181 }]);
    });

    it("item with an unknown type (broomstick) -> the quote is rejected by throwing an Error", () => {
      expect(() => resultsFor(newcomer, quote({ type: "broomstick" }))).toThrow(Error);
    });

    it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (100 + 50 curse + 10 + 5)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };

      expect(resultsFor(newcomer, quote(cursedSword))).toEqual([{ premium: 165 }]);
    });

    it("cursed sword and plain amulet -> curse surcharge 50 G on the sword only -> premium 231 G (160 + 50 + 16 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "sword", cursed: true }, { type: "amulet", cursed: false }))).toEqual([
        { premium: 231 },
      ]);
    });

    it("sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 G (100 + 30 + 10 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "sword", enchantment: 5 }))).toEqual([{ premium: 145 }]);
    });

    it("cursed sword with enchantment 5 -> both surcharges apply -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      expect(resultsFor(newcomer, quote({ type: "sword", enchantment: 5, cursed: true }))).toEqual([{ premium: 195 }]);
    });

    it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
      expect(resultsFor(newcomer, quote({ type: "sword", enchantment: 4 }))).toEqual([{ premium: 115 }]);
    });

    it("cursed sword with enchantment 4 -> only the curse surcharge -> premium 165 G", () => {
      expect(resultsFor(newcomer, quote({ type: "sword", enchantment: 4, cursed: true }))).toEqual([{ premium: 165 }]);
    });

    it("customer with exactly 2 years with MHPCO -> loyalty discount applies -> sword premium 95 G (100 - 20 + 10 + 5)", () => {
      expect(resultsFor({ yearsWithMHPCO: 2 }, quote({ type: "sword" }))).toEqual([{ premium: 95 }]);
    });

    it("customer with 1 year with MHPCO -> no loyalty discount -> sword premium 115 G", () => {
      expect(resultsFor({ yearsWithMHPCO: 1 }, quote({ type: "sword" }))).toEqual([{ premium: 115 }]);
    });

    it("each contract after the first gets the 15 % follow-up discount -> three sword quotes cost 115 G, 100 G, 100 G (100 + 10 - 15 + 5)", () => {
      const sword = { type: "sword" };

      expect(resultsFor(newcomer, quote(sword), quote(sword), quote(sword))).toEqual([
        { premium: 115 },
        { premium: 100 },
        { premium: 100 },
      ]);
    });

    it("long-standing customer's second contract, cursed sword (steel, enchantment 7) -> premium 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };

      const results = resultsFor({ yearsWithMHPCO: 3 }, quote({ type: "potion" }), quote(cursedSword));

      expect(results).toEqual([{ premium: 41 }, { premium: 160 }]);
    });

    it("2 runes -> 50 G base premium -> premium 60 G (50 + 5 + 5)", () => {
      expect(resultsFor(newcomer, quote(...runes(2)))).toEqual([{ premium: 60 }]);
    });

    it("3 runes -> 60 G base premium (block applies) -> premium 71 G (60 + 6 + 5)", () => {
      expect(resultsFor(newcomer, quote(...runes(3)))).toEqual([{ premium: 71 }]);
    });

    it("4 runes -> 100 G base premium (no block: a block requires exactly 3) -> premium 115 G (100 + 10 + 5)", () => {
      expect(resultsFor(newcomer, quote(...runes(4)))).toEqual([{ premium: 115 }]);
    });

    it("fractional premium is rounded up in the MHPCO's favor -> 1 rune: 25 + 2.5 + 5 = 32.5 -> premium 33 G", () => {
      expect(resultsFor(newcomer, quote(...runes(1)))).toEqual([{ premium: 33 }]);
    });

    it("7 runes -> 175 G base premium -> premium 198 G (175 + 17.5 + 5 = 197.5, rounded up)", () => {
      expect(resultsFor(newcomer, quote(...runes(7)))).toEqual([{ premium: 198 }]);
    });

    it("2 runes and 1 moonstone -> 75 G base premium (no block: different types) -> premium 88 G (75 + 7.5 + 5 = 87.5)", () => {
      expect(resultsFor(newcomer, quote(...runes(2), { type: "moonstone" }))).toEqual([{ premium: 88 }]);
    });

    it("3 runes and 3 moonstones -> 120 G base premium (two separate blocks) -> premium 137 G (120 + 12 + 5)", () => {
      const moonstone = { type: "moonstone" };

      expect(resultsFor(newcomer, quote(...runes(3), moonstone, moonstone, moonstone))).toEqual([{ premium: 137 }]);
    });

    it("intermediate amounts stay fractional, only the final premium is rounded -> follow-up contract for 1 rune: 25 + 2.5 - 3.75 + 5 = 28.75 -> premium 29 G (not 30)", () => {
      expect(resultsFor(newcomer, quote(...runes(1)), quote(...runes(1)))).toEqual([{ premium: 33 }, { premium: 29 }]);
    });
  });

  describe("claim", () => {
    it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
      const steelSword = { type: "sword", material: "steel", enchantment: 3 };

      const results = resultsFor(newcomer, quote(steelSword), claim(0, { itemType: "sword", amount: 500 }));

      expect(results[1]).toMatchObject({ payout: 400 });
    });

    it("rune, damage 200 G -> payout 100 G (no special clause applies)", () => {
      const results = resultsFor(newcomer, quote(...runes(1)), claim(0, { itemType: "rune", amount: 200 }));

      expect(results[1]).toMatchObject({ payout: 100 });
    });

    it("damage below the deductible, sword damage 50 G -> payout 0 G (chosen reading: the deductible never makes a payout negative)", () => {
      const results = resultsFor(newcomer, quote({ type: "sword" }), claim(0, { itemType: "sword", amount: 50 }));

      expect(results[1]).toMatchObject({ payout: 0 });
    });

    it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 1000 }));

      expect(results[1]).toMatchObject({ payout: 400 });
    });

    it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 1000 }));

      expect(results[1]).toMatchObject({ payout: 400 });
    });

    it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment 8 threshold)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 7 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 1000 }));

      expect(results[1]).toMatchObject({ payout: 900 });
    });

    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (the 50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 1000 }));

      expect(results[1]).toMatchObject({ payout: 400 });
    });

    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 800 }));

      expect(results[1]).toMatchObject({ payout: 700 });
    });

    it("one incident damages a sword (500 G) and an amulet (300 G) -> payout 600 G (deductible once per damaged item)", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }, { type: "amulet" }),
        claim(0, { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }),
      );

      expect(results[1]).toMatchObject({ payout: 600 });
    });

    it("one incident damages both insured swords (500 G each) -> payout 800 G (each entry has its own deductible)", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }, { type: "sword" }),
        claim(0, { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }),
      );

      expect(results[1]).toMatchObject({ payout: 800 });
    });

    it("two swords with different enchantment (9 and 3), both damaged 1000 G -> payout 1300 G (chosen reading: the n-th damage entry of a type belongs to the n-th insured item of that type)", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword", enchantment: 9 }, { type: "sword", enchantment: 3 }),
        claim(0, { itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 }),
      );

      expect(results[1]).toMatchObject({ payout: 1300 });
    });

    it("fractional payout is rounded down in the MHPCO's favor -> steel sword, enchantment 9, damage 901 G: 350.5 -> payout 350 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };

      const results = resultsFor(newcomer, quote(sword), claim(0, { itemType: "sword", amount: 901 }));

      expect(results[1]).toMatchObject({ payout: 350 });
    });

    it("intermediate amounts stay fractional, only the final payout is rounded -> two enchantment 9 swords, damage 901 G each: 350.5 + 350.5 -> payout 701 G (not 700)", () => {
      const sword = { type: "sword", enchantment: 9 };

      const results = resultsFor(
        newcomer,
        quote(sword, sword),
        claim(0, { itemType: "sword", amount: 901 }, { itemType: "sword", amount: 901 }),
      );

      expect(results[1]).toMatchObject({ payout: 701 });
    });

    it("sword -> insurance sum 1000 G, cap 2000 G -> damage 500 G leaves remaining cap 1600 G", () => {
      const results = resultsFor(newcomer, quote({ type: "sword" }), claim(0, { itemType: "sword", amount: 500 }));

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("amulet -> insurance sum 600 G, cap 1200 G -> damage 200 G leaves remaining cap 1100 G", () => {
      const results = resultsFor(newcomer, quote({ type: "amulet" }), claim(0, { itemType: "amulet", amount: 200 }));

      expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });

    it("staff -> insurance sum 800 G, cap 1600 G -> damage 200 G leaves remaining cap 1500 G", () => {
      const results = resultsFor(newcomer, quote({ type: "staff" }), claim(0, { itemType: "staff", amount: 200 }));

      expect(results[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });

    it("potion -> insurance sum 400 G, cap 800 G -> damage 200 G leaves remaining cap 700 G", () => {
      const results = resultsFor(newcomer, quote({ type: "potion" }), claim(0, { itemType: "potion", amount: 200 }));

      expect(results[1]).toEqual({ payout: 100, remainingCap: 700 });
    });

    it("rune -> insurance sum 250 G, cap 500 G -> damage 200 G leaves remaining cap 400 G", () => {
      const results = resultsFor(newcomer, quote({ type: "rune" }), claim(0, { itemType: "rune", amount: 200 }));

      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });

    it("moonstone -> insurance sum 250 G, cap 500 G -> damage 200 G leaves remaining cap 400 G", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "moonstone" }),
        claim(0, { itemType: "moonstone", amount: 200 }),
      );

      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });

    it("sword and amulet -> insurance sum 1600 G, cap 3200 G -> amulet damage 200 G leaves remaining cap 3100 G", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }, { type: "amulet" }),
        claim(0, { itemType: "amulet", amount: 200 }),
      );

      expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });

    it("two swords -> insurance sum 2000 G, cap 4000 G -> one sword damage 500 G leaves remaining cap 3600 G", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }, { type: "sword" }),
        claim(0, { itemType: "sword", amount: 500 }),
      );

      expect(results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });

    it("cursed sword -> cap 2000 G (premium modifiers do not raise the cap) -> damage 500 G leaves remaining cap 1600 G", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword", cursed: true }),
        claim(0, { itemType: "sword", amount: 500 }),
      );

      expect(results).toEqual([{ premium: 165 }, { payout: 400, remainingCap: 1600 }]);
    });

    it("sword and 3 runes -> insurance sum 1750 G, cap 3500 G (the block does not reduce the insurance sum) -> sword damage 500 G leaves remaining cap 3100 G", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }, ...runes(3)),
        claim(0, { itemType: "sword", amount: 500 }),
      );

      expect(results).toEqual([{ premium: 181 }, { payout: 400, remainingCap: 3100 }]);
    });

    it("two successive claims of 1500 G on a sword -> payout 1400 G with remaining cap 600 G, then payout 600 G with remaining cap 0 G", () => {
      const swordDamage = { itemType: "sword", amount: 1500 };

      const results = resultsFor(newcomer, quote({ type: "sword" }), claim(0, swordDamage), claim(0, swordDamage));

      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });

    it("a claim refers to its policy by the zero-based index of the quote step -> each policy keeps its own cap (amulet policy 1100 G, sword policy 1600 G)", () => {
      const results = resultsFor(
        newcomer,
        quote({ type: "sword" }),
        quote({ type: "amulet" }),
        claim(1, { itemType: "amulet", amount: 200 }),
        claim(0, { itemType: "sword", amount: 500 }),
      );

      expect(results.slice(2)).toEqual([
        { payout: 100, remainingCap: 1100 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });

    it("more damage entries of a type than the policy covers (two sword damages, one sword) -> the whole claim is rejected by throwing an Error", () => {
      const swordDamage = { itemType: "sword", amount: 500 };

      expect(() => resultsFor(newcomer, quote({ type: "sword" }), claim(0, swordDamage, swordDamage))).toThrow(Error);
    });

    it("damage entry for an item that is not part of the policy (amulet, only a sword insured) -> the claim is rejected by throwing an Error", () => {
      const amuletDamage = { itemType: "amulet", amount: 200 };

      expect(() => resultsFor(newcomer, quote({ type: "sword" }), claim(0, amuletDamage))).toThrow(Error);
    });

    it("damage entry with an unknown item type (broomstick) -> the claim is rejected by throwing an Error", () => {
      const broomstickDamage = { itemType: "broomstick", amount: 200 };

      expect(() => resultsFor(newcomer, quote({ type: "sword" }), claim(0, broomstickDamage))).toThrow(Error);
    });

    it("damage entry with amount -200 -> the claim is rejected by throwing an Error", () => {
      const negativeDamage = { itemType: "sword", amount: -200 };

      expect(() => resultsFor(newcomer, quote({ type: "sword" }), claim(0, negativeDamage))).toThrow(Error);
    });

    it("claim against a step that did not create a policy -> the claim is rejected by throwing an Error (chosen reading: the specification only describes claims against earlier quote steps)", () => {
      const swordDamage = { itemType: "sword", amount: 500 };

      expect(() => resultsFor(newcomer, quote({ type: "sword" }), claim(1, swordDamage))).toThrow(Error);
    });
  });

  describe("claim-office CLI", () => {
    it("schema example on stdin (5 years, silver amulet quote, fire claim 200 G) -> exit status 0, empty stderr, stdout {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", () => {
      const run = runClaimOffice({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });

      expect({ status: run.status, stderr: run.stderr }).toEqual({ status: 0, stderr: "" });
      expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });

    it("quote with an unknown item type -> non-zero exit status, no results on stdout, error description on stderr (chosen reading: one line prefixed claim-office: that names the unknown type, no stack trace)", () => {
      const run = runClaimOffice({ customer: newcomer, steps: [quote({ type: "broomstick" })] });

      expect(run.status).not.toBe(0);
      expect(run.stdout).toBe("");
      expect(run.stderr).toMatch(/^claim-office: .*broomstick.*\n$/);
    });

    it("rejected claim (damaged item not part of the policy) -> non-zero exit status, error description on stderr", () => {
      const run = runClaimOffice({
        customer: newcomer,
        steps: [quote({ type: "sword" }), claim(0, { itemType: "amulet", amount: 200 })],
      });

      expect(run.status).not.toBe(0);
      expect(run.stderr).toMatch(/^claim-office: .*amulet.*\n$/);
    });
  });
});
