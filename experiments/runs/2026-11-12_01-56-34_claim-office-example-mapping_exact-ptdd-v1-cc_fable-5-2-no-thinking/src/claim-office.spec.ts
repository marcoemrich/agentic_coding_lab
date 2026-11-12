import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";
import type { Item } from "./price-list.js";

// Adopted readings where the specification leaves the observable contract open:
// - Rejections: the specification defines the CLI contract (non-zero exit, error
//   description on stderr). At the domain level a rejected scenario throws an
//   Error; the CLI translates that into the specified exit status and stderr.
// - A newcomer is a customer with 0 years with MHPCO. Unless stated otherwise a
//   quote is the customer's first contract, so its premium is
//   base premium + 10 % first insurance + 5 G processing fee.

const newcomer = { yearsWithMHPCO: 0 };

const rune: Item = { type: "rune" };
const runes = (count: number) => Array<Item>(count).fill(rune);
const moonstone: Item = { type: "moonstone" };
const moonstones = (count: number) => Array<Item>(count).fill(moonstone);

const quote = (...items: Item[]) => ({ op: "quote" as const, items });

const damage = (itemType: string, amount: number) => ({ itemType, amount });

const claim = (policy: number, ...damages: ReturnType<typeof damage>[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "dragon attack", damages },
});

const claimAgainst = (items: Item[], ...damages: ReturnType<typeof damage>[]) =>
  processScenario({ customer: newcomer, steps: [quote(...items), claim(0, ...damages)] }).results[1];

const newcomerQuote = (...items: Item[]) =>
  processScenario({ customer: newcomer, steps: [quote(...items)] }).results[0];

describe("MHPCO claim office", () => {
  describe("quote: base premiums from the price list", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(newcomerQuote()).toEqual({ premium: 5 });
    });

    it("sword -> 100 G base premium (newcomer premium 115 G)", () => {
      expect(newcomerQuote({ type: "sword" })).toEqual({ premium: 115 });
    });

    it("amulet -> 60 G base premium (newcomer premium 71 G)", () => {
      expect(newcomerQuote({ type: "amulet" })).toEqual({ premium: 71 });
    });

    it("staff -> 80 G base premium (newcomer premium 93 G)", () => {
      expect(newcomerQuote({ type: "staff" })).toEqual({ premium: 93 });
    });

    it("potion -> 40 G base premium (newcomer premium 49 G)", () => {
      expect(newcomerQuote({ type: "potion" })).toEqual({ premium: 49 });
    });

    it("2 runes -> 50 G base premium (newcomer premium 60 G)", () => {
      expect(newcomerQuote(...runes(2))).toEqual({ premium: 60 });
    });

    it("3 runes -> 60 G base premium, block applies (newcomer premium 71 G)", () => {
      expect(newcomerQuote(...runes(3))).toEqual({ premium: 71 });
    });

    it("4 runes -> 100 G base premium, block requires exactly 3 (newcomer premium 115 G)", () => {
      expect(newcomerQuote(...runes(4))).toEqual({ premium: 115 });
    });

    it("7 runes -> 175 G base premium; calculation yields 197.5 G -> premium 198 G (rounded up)", () => {
      expect(newcomerQuote(...runes(7))).toEqual({ premium: 198 });
    });

    it("2 runes + 1 moonstone -> 75 G base premium, no block for different types (87.5 G -> premium 88 G)", () => {
      expect(newcomerQuote(...runes(2), moonstone)).toEqual({ premium: 88 });
    });

    it("3 runes + 3 moonstones -> 120 G base premium, two separate blocks (newcomer premium 137 G)", () => {
      expect(newcomerQuote(...runes(3), ...moonstones(3))).toEqual({ premium: 137 });
    });
  });

  describe("quote: premium modifiers", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };

      expect(newcomerQuote(cursedSword)).toEqual({ premium: 165 });
    });

    it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (100 + 30 + 10 + 5 = premium 145 G)", () => {
      expect(newcomerQuote({ type: "sword", enchantment: 5 })).toEqual({ premium: 145 });
    });

    it("cursed sword with exactly enchantment 5 -> both surcharges apply (100 + 50 + 30 + 10 + 5 = premium 195 G)", () => {
      expect(newcomerQuote({ type: "sword", enchantment: 5, cursed: true })).toEqual({ premium: 195 });
    });

    it("sword with enchantment 4 -> no high-enchantment surcharge (premium 115 G)", () => {
      expect(newcomerQuote({ type: "sword", enchantment: 4 })).toEqual({ premium: 115 });
    });

    it("cursed sword with enchantment 4 -> only the curse surcharge applies (premium 165 G)", () => {
      expect(newcomerQuote({ type: "sword", enchantment: 4, cursed: true })).toEqual({ premium: 165 });
    });

    it("cursed sword + plain amulet -> curse surcharge 50 G on the sword only: 210 G before policy-wide modifiers (+ 16 first insurance + 5 fee = premium 231 G)", () => {
      expect(newcomerQuote({ type: "sword", cursed: true }, { type: "amulet" })).toEqual({ premium: 231 });
    });

    it("sword with enchantment 5 + plain amulet -> high-enchantment surcharge 30 G on the sword only (160 + 30 + 16 + 5 = premium 211 G)", () => {
      expect(newcomerQuote({ type: "sword", enchantment: 5 }, { type: "amulet" })).toEqual({ premium: 211 });
    });

    it("customer with exactly 2 years with MHPCO -> loyalty discount applies (sword: 100 - 20 + 10 + 5 = premium 95 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [quote({ type: "sword" })] };

      expect(processScenario(scenario).results).toEqual([{ premium: 95 }]);
    });

    it("customer with 1 year with MHPCO -> no loyalty discount (sword: premium 115 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 1 }, steps: [quote({ type: "sword" })] };

      expect(processScenario(scenario).results).toEqual([{ premium: 115 }]);
    });

    it("each quote after the customer's first gets the 15 % follow-up discount (newcomer, three sword quotes -> premiums 115 G, 100 G, 100 G)", () => {
      const sword = { type: "sword" };
      const scenario = { customer: newcomer, steps: [quote(sword), quote(sword), quote(sword)] };

      expect(processScenario(scenario).results).toEqual([
        { premium: 115 },
        { premium: 100 },
        { premium: 100 },
      ]);
    });

    it("long-standing customer's second contract: 3 years, second quote, cursed sword (steel, enchantment 7) -> premium 160 G (first insurance surcharge still applies)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [quote({ type: "amulet" }), quote(cursedSword)],
      };

      expect(processScenario(scenario).results).toEqual([{ premium: 59 }, { premium: 160 }]);
    });

    it("intermediate amounts are kept as fractions: newcomer's second quote for a single rune -> 25 + 2.5 - 3.75 + 5 = 28.75 G -> premium 29 G", () => {
      const scenario = { customer: newcomer, steps: [quote(rune), quote(rune)] };

      expect(processScenario(scenario).results).toEqual([{ premium: 33 }, { premium: 29 }]);
    });

    it("quote with an unknown item type (broomstick) -> the scenario is rejected: throws an Error naming the unknown type", () => {
      const scenario = { customer: newcomer, steps: [quote({ type: "broomstick" })] };

      expect(() => processScenario(scenario)).toThrow(/broomstick/);
    });
  });

  describe("claim: reimbursement and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible), remaining cap 1600 G", () => {
      const regularSword = { type: "sword", material: "steel", enchantment: 3 };

      expect(claimAgainst([regularSword], damage("sword", 500))).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("rune, damage 200 G -> payout 100 G (no special clause), remaining cap 400 G", () => {
      expect(claimAgainst([rune], damage("rune", 200))).toEqual({ payout: 100, remainingCap: 400 });
    });

    it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };

      expect(claimAgainst([sword], damage("sword", 1000))).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };

      expect(claimAgainst([sword], damage("sword", 1000))).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment 8 threshold: full reimbursement minus deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 7 };

      expect(claimAgainst([sword], damage("sword", 1000))).toEqual({
        payout: 900,
        remainingCap: 1100,
      });
    });

    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };

      expect(claimAgainst([sword], damage("sword", 1000))).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };

      expect(claimAgainst([sword], damage("sword", 800))).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });

    it("dragon attack damages a sword (500 G) and an amulet (300 G) -> payout 600 G (deductible applies once per damaged item)", () => {
      const insured = [{ type: "sword" }, { type: "amulet" }];

      expect(claimAgainst(insured, damage("sword", 500), damage("amulet", 300))).toMatchObject({
        payout: 600,
      });
    });

    it("two swords both damaged (500 G each) -> payout 800 G (each damage entry has its own deductible)", () => {
      const insured = [{ type: "sword" }, { type: "sword" }];

      expect(claimAgainst(insured, damage("sword", 500), damage("sword", 500))).toEqual({
        payout: 800,
        remainingCap: 3200,
      });
    });

    it("adopted reading: the n-th damage entry of a type refers to the n-th insured item of that type (swords with enchantment 9 and 3, 1000 G each -> payout 400 + 900 = 1300 G)", () => {
      const insured = [
        { type: "sword", enchantment: 9 },
        { type: "sword", enchantment: 3 },
      ];

      expect(claimAgainst(insured, damage("sword", 1000), damage("sword", 1000))).toEqual({
        payout: 1300,
        remainingCap: 2700,
      });
    });

    it("adopted reading: a damage below the deductible pays nothing and does not reduce other payouts (sword 50 G + amulet 300 G -> payout 200 G)", () => {
      const insured = [{ type: "sword" }, { type: "amulet" }];

      expect(claimAgainst(insured, damage("sword", 50), damage("amulet", 300))).toMatchObject({
        payout: 200,
      });
    });

    it("payout calculation that yields 350.5 G -> payout 350 G (rounded down; enchantment 9 sword, damage 901 G)", () => {
      const sword = { type: "sword", enchantment: 9 };

      expect(claimAgainst([sword], damage("sword", 901))).toEqual({
        payout: 350,
        remainingCap: 1650,
      });
    });

    it("intermediate payout amounts are kept as fractions: two enchantment 9 swords, 901 G each -> 350.5 + 350.5 = payout 701 G", () => {
      const sword = { type: "sword", enchantment: 9 };

      expect(claimAgainst([sword, sword], damage("sword", 901), damage("sword", 901))).toEqual({
        payout: 701,
        remainingCap: 3299,
      });
    });
  });

  describe("claim: insurance sum and payout cap", () => {
    it("two swords -> insurance sum 2000 G, cap 4000 G (one sword damaged 500 G -> payout 400 G, remaining cap 3600 G)", () => {
      const insured = [{ type: "sword" }, { type: "sword" }];

      expect(claimAgainst(insured, damage("sword", 500))).toEqual({
        payout: 400,
        remainingCap: 3600,
      });
    });

    it("sword and amulet -> insurance sum 1600 G, cap 3200 G (amulet damaged 300 G -> payout 200 G, remaining cap 3000 G)", () => {
      const insured = [{ type: "sword" }, { type: "amulet" }];

      expect(claimAgainst(insured, damage("amulet", 300))).toEqual({
        payout: 200,
        remainingCap: 3000,
      });
    });

    it("cursed sword -> cap 2000 G, premium modifiers do not raise the cap (damage 500 G -> payout 400 G, remaining cap 1600 G)", () => {
      const cursedSword = { type: "sword", cursed: true };

      expect(claimAgainst([cursedSword], damage("sword", 500))).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("sword and 3 runes (a block) -> insurance sum 1750 G, cap 3500 G (rune damaged 200 G -> payout 100 G, remaining cap 3400 G)", () => {
      const insured = [{ type: "sword" }, ...runes(3)];

      expect(claimAgainst(insured, damage("rune", 200))).toEqual({
        payout: 100,
        remainingCap: 3400,
      });
    });

    it("staff -> insurance value 800 G, cap 1600 G (damage 300 G -> payout 200 G, remaining cap 1400 G)", () => {
      expect(claimAgainst([{ type: "staff" }], damage("staff", 300))).toEqual({
        payout: 200,
        remainingCap: 1400,
      });
    });

    it("potion -> insurance value 400 G, cap 800 G (damage 300 G -> payout 200 G, remaining cap 600 G)", () => {
      expect(claimAgainst([{ type: "potion" }], damage("potion", 300))).toEqual({
        payout: 200,
        remainingCap: 600,
      });
    });

    it("moonstone -> insurance value 250 G, cap 500 G (damage 200 G -> payout 100 G, remaining cap 400 G)", () => {
      expect(claimAgainst([moonstone], damage("moonstone", 200))).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });

    it("cap exhaustion: sword, two successive claims of 1500 G -> payout 1400 G / remaining cap 600 G, then payout 600 G / remaining cap 0 G", () => {
      const scenario = {
        customer: newcomer,
        steps: [
          quote({ type: "sword" }),
          claim(0, damage("sword", 1500)),
          claim(0, damage("sword", 1500)),
        ],
      };

      expect(processScenario(scenario).results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });

    it("claims against different policies deplete only their own cap (sword policy and amulet policy)", () => {
      const scenario = {
        customer: newcomer,
        steps: [
          quote({ type: "sword" }),
          quote({ type: "amulet" }),
          claim(0, damage("sword", 500)),
          claim(1, damage("amulet", 300)),
          claim(0, damage("sword", 500)),
        ],
      };

      expect(processScenario(scenario).results.slice(2)).toEqual([
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 1000 },
        { payout: 400, remainingCap: 1200 },
      ]);
    });
  });

  describe("claim: rejections", () => {
    it("damage entry for an item that is not part of the policy (amulet damaged, only a sword insured) -> the whole claim is rejected: throws an Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], damage("amulet", 300))).toThrow(/amulet/);
    });

    it("damage entry with an unknown item type (broomstick) -> the whole claim is rejected: throws an Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], damage("broomstick", 300))).toThrow(
        /broomstick/,
      );
    });

    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) -> the whole claim is rejected: throws an Error", () => {
      expect(() =>
        claimAgainst([{ type: "sword" }], damage("sword", 500), damage("sword", 500)),
      ).toThrow(/sword/);
    });

    it("damage entry with amount -200 -> the claim is rejected: throws an Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], damage("sword", -200))).toThrow(/-200/);
    });

    it("adopted reading: a claim whose policy index does not refer to an earlier quote step -> rejected: throws an Error", () => {
      const scenario = {
        customer: newcomer,
        steps: [quote({ type: "sword" }), claim(1, damage("sword", 500))],
      };

      expect(() => processScenario(scenario)).toThrow(/policy 1/);
    });
  });
});
