import { describe, expect, it } from "vitest";
import type { Damage } from "./claim.js";
import { processScenario } from "./claim-office.js";
import type { Customer } from "./premium.js";
import type { Item } from "./price-list.js";

const newcomer = { yearsWithMHPCO: 0 };

function several(count: number, type: string): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

function quoteStep(items: Item[]) {
  return { op: "quote" as const, items };
}

function quoteResults(items: Item[], customer: Customer = newcomer) {
  return processScenario({ customer, steps: [quoteStep(items)] }).results;
}

function secondQuoteResult(items: Item[], customer: Customer = newcomer) {
  return processScenario({ customer, steps: [quoteStep([]), quoteStep(items)] }).results[1];
}

function claimStep(damages: Damage[]) {
  return { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } };
}

function claimResult(items: Item[], damages: Damage[]) {
  return processScenario({ customer: newcomer, steps: [quoteStep(items), claimStep(damages)] }).results[1];
}

describe("MHPCO claim office", () => {
  describe("quote: price list (newcomer's first quote: base premium + 10 % first insurance + 5 G fee)", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(quoteResults([])).toEqual([{ premium: 5 }]);
    });

    it("sword -> base premium 100 G -> premium 115 G (100 + 10 + 5)", () => {
      expect(quoteResults([{ type: "sword" }])).toEqual([{ premium: 115 }]);
    });

    it("amulet -> base premium 60 G -> premium 71 G (60 + 6 + 5)", () => {
      expect(quoteResults([{ type: "amulet" }])).toEqual([{ premium: 71 }]);
    });

    it("staff -> base premium 80 G -> premium 93 G (80 + 8 + 5)", () => {
      expect(quoteResults([{ type: "staff" }])).toEqual([{ premium: 93 }]);
    });

    it("potion -> base premium 40 G -> premium 49 G (40 + 4 + 5)", () => {
      expect(quoteResults([{ type: "potion" }])).toEqual([{ premium: 49 }]);
    });

    it("sword and amulet -> policy base premium 160 G -> premium 181 G (160 + 16 + 5)", () => {
      expect(quoteResults([{ type: "sword" }, { type: "amulet" }])).toEqual([{ premium: 181 }]);
    });

    it("2 runes -> base premium 50 G -> premium 60 G (50 + 5 + 5)", () => {
      expect(quoteResults(several(2, "rune"))).toEqual([{ premium: 60 }]);
    });

    it("2 moonstones -> base premium 50 G -> premium 60 G (50 + 5 + 5)", () => {
      expect(quoteResults(several(2, "moonstone"))).toEqual([{ premium: 60 }]);
    });

    it("7 runes -> base premium 175 G -> 197.5 G -> final premium 198 G (rounded up)", () => {
      expect(quoteResults(several(7, "rune"))).toEqual([{ premium: 198 }]);
    });

    it("3 runes -> base premium 60 G (block applies) -> premium 71 G (60 + 6 + 5)", () => {
      expect(quoteResults(several(3, "rune"))).toEqual([{ premium: 71 }]);
    });

    it("4 runes -> base premium 100 G (no block: requires exactly 3) -> premium 115 G", () => {
      expect(quoteResults(several(4, "rune"))).toEqual([{ premium: 115 }]);
    });

    it("2 runes + 1 moonstone -> base premium 75 G (no block: different types) -> 87.5 G -> premium 88 G", () => {
      expect(quoteResults([...several(2, "rune"), { type: "moonstone" }])).toEqual([{ premium: 88 }]);
    });

    it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks) -> premium 137 G (120 + 12 + 5)", () => {
      expect(quoteResults([...several(3, "rune"), ...several(3, "moonstone")])).toEqual([{ premium: 137 }]);
    });

    it("unknown item type broomstick -> throws an Error naming the type (reading: rejection is a thrown Error describing the offending input)", () => {
      expect(() => quoteResults([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("quote: item-specific risk surcharges", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (100 + 50 curse + 10 + 5)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };

      expect(quoteResults([cursedSword])).toEqual([{ premium: 165 }]);
    });

    it("cursed sword + plain amulet -> curse adds 50 G (50 % of the sword only) -> 210 G -> premium 231 G (+ 16 + 5)", () => {
      expect(quoteResults([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual([{ premium: 231 }]);
    });

    it("sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 G (100 + 30 + 10 + 5)", () => {
      expect(quoteResults([{ type: "sword", enchantment: 5 }])).toEqual([{ premium: 145 }]);
    });

    it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
      expect(quoteResults([{ type: "sword", enchantment: 4 }])).toEqual([{ premium: 115 }]);
    });

    it("plain sword + amulet with enchantment 6 -> surcharge 18 G (30 % of the amulet only) -> premium 199 G (160 + 18 + 16 + 5)", () => {
      expect(quoteResults([{ type: "sword" }, { type: "amulet", enchantment: 6 }])).toEqual([{ premium: 199 }]);
    });

    it("cursed sword with exactly enchantment 5 -> both surcharges apply -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      expect(quoteResults([{ type: "sword", enchantment: 5, cursed: true }])).toEqual([{ premium: 195 }]);
    });

    it("cursed sword with enchantment 4 -> only the curse surcharge applies -> premium 165 G", () => {
      expect(quoteResults([{ type: "sword", enchantment: 4, cursed: true }])).toEqual([{ premium: 165 }]);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO -> loyalty discount applies -> sword premium 95 G (100 - 20 + 10 + 5)", () => {
      expect(quoteResults([{ type: "sword" }], { yearsWithMHPCO: 2 })).toEqual([{ premium: 95 }]);
    });

    it("customer with 1 year with MHPCO -> no loyalty discount -> sword premium 115 G", () => {
      expect(quoteResults([{ type: "sword" }], { yearsWithMHPCO: 1 })).toEqual([{ premium: 115 }]);
    });

    it("loyal customer, cursed sword + plain amulet -> loyalty is 20 % of the policy base premium 160 G, not of surcharges -> premium 199 G (160 + 50 - 32 + 16 + 5)", () => {
      const items = [{ type: "sword", cursed: true }, { type: "amulet" }];

      expect(quoteResults(items, { yearsWithMHPCO: 2 })).toEqual([{ premium: 199 }]);
    });

    it("each contract after the first gets the 15 % follow-up discount -> three sword quotes cost 115 G, 100 G, 100 G (100 + 10 - 15 + 5)", () => {
      const swordQuote = quoteStep([{ type: "sword" }]);

      const { results } = processScenario({ customer: newcomer, steps: [swordQuote, swordQuote, swordQuote] });

      expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
    });

    it("long-standing customer's second contract: 3 years, cursed sword (steel, enchantment 7) -> premium 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5); first insurance still applies", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };

      expect(secondQuoteResult([cursedSword], { yearsWithMHPCO: 3 })).toEqual({ premium: 160 });
    });

    it("rounding is always up, not to nearest: second contract for 2 runes + 1 moonstone -> 76.25 G -> premium 77 G", () => {
      expect(secondQuoteResult([...several(2, "rune"), { type: "moonstone" }])).toEqual({ premium: 77 });
    });

    it("intermediate amounts stay fractional: second contract for 1 rune -> 25 + 2.5 - 3.75 + 5 = 28.75 G -> premium 29 G", () => {
      expect(secondQuoteResult([{ type: "rune" }])).toEqual({ premium: 29 });
    });
  });

  describe("claim: standard reimbursement and insurance values", () => {
    it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (minus 100 G deductible), remaining cap 1600 G (cap 2 x 1000)", () => {
      const regularSword = { type: "sword", material: "steel", enchantment: 3 };

      expect(claimResult([regularSword], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("rune, damage 200 G -> payout 100 G, remaining cap 400 G (insurance value 250 G, cap 500 G)", () => {
      expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });

    it("amulet, damage 200 G -> payout 100 G, remaining cap 1100 G (insurance value 600 G, cap 1200 G)", () => {
      expect(claimResult([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 1100,
      });
    });

    it("staff, damage 200 G -> payout 100 G, remaining cap 1500 G (insurance value 800 G, cap 1600 G)", () => {
      expect(claimResult([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 1500,
      });
    });

    it("potion, damage 200 G -> payout 100 G, remaining cap 700 G (insurance value 400 G, cap 800 G)", () => {
      expect(claimResult([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 700,
      });
    });

    it("moonstone, damage 200 G -> payout 100 G, remaining cap 400 G (insurance value 250 G, cap 500 G)", () => {
      expect(claimResult([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });

    it("dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (deductible once per damaged item), remaining cap 2600 G (insurance sum 1600 G, cap 3200 G)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];

      expect(claimResult([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({
        payout: 600,
        remainingCap: 2600,
      });
    });

    it("two swords, both damaged by 500 G -> each entry has its own deductible -> payout 800 G, remaining cap 3200 G (insurance sum 2000 G, cap 4000 G)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ];

      expect(claimResult(several(2, "sword"), damages)).toEqual({ payout: 800, remainingCap: 3200 });
    });

    it("cursed sword -> cap 2000 G (premium modifiers do not raise the cap): damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
      expect(claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("sword + 3 runes (a block) -> insurance sum 1750 G, cap 3500 G: sword damage 500 G -> payout 400 G, remaining cap 3100 G", () => {
      const items = [{ type: "sword" }, ...several(3, "rune")];

      expect(claimResult(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
    });

    it("damage below the deductible (sword, 50 G) -> payout 0 G, remaining cap 2000 G (reading: a deductible cannot make a payout negative)", () => {
      expect(claimResult([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({
        payout: 0,
        remainingCap: 2000,
      });
    });
  });

  describe("claim: special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible: 500 - 100)", () => {
      const steelSword = { type: "sword", material: "steel", enchantment: 9 };

      expect(claimResult([steelSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };

      expect(claimResult([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment 8 threshold: full reimbursement minus deductible)", () => {
      const steelSword = { type: "sword", material: "steel", enchantment: 7 };

      expect(claimResult([steelSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 900,
        remainingCap: 1100,
      });
    });

    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins)", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };

      expect(claimResult([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });

    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 5 };

      expect(claimResult([dragonSword], [{ itemType: "sword", amount: 800 }])).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });

    it("payout calculation that yields 350.5 G (enchantment 9, damage 901 G) -> final payout 350 G (rounded down)", () => {
      expect(claimResult([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }])).toEqual({
        payout: 350,
        remainingCap: 1650,
      });
    });

    it("intermediate payout amounts stay fractional: two enchantment-9 swords damaged by 901 G each -> 350.5 + 350.5 -> payout 701 G", () => {
      const swords = [
        { type: "sword", enchantment: 9 },
        { type: "sword", enchantment: 9 },
      ];
      const damages = [
        { itemType: "sword", amount: 901 },
        { itemType: "sword", amount: 901 },
      ];

      expect(claimResult(swords, damages)).toEqual({ payout: 701, remainingCap: 3299 });
    });

    it("two swords of different enchantment (9 then 3), damages 1000 G then 500 G -> payout 800 G (reading: damage entries are matched to the policy's items of that type in policy order)", () => {
      const swords = [
        { type: "sword", enchantment: 9 },
        { type: "sword", enchantment: 3 },
      ];
      const damages = [
        { itemType: "sword", amount: 1000 },
        { itemType: "sword", amount: 500 },
      ];

      expect(claimResult(swords, damages)).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim: cap exhaustion", () => {
    it("sword (cap 2000 G), two successive claims of 1500 G -> payout 1400 G, remaining cap 600 G; then payout 600 G, remaining cap 0 G", () => {
      const claim = claimStep([{ itemType: "sword", amount: 1500 }]);

      const { results } = processScenario({
        customer: newcomer,
        steps: [quoteStep([{ type: "sword" }]), claim, claim],
      });

      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("claim: rejections (reading: a thrown Error describing the offending input)", () => {
    it("damage to an amulet when only a sword is insured -> throws an Error naming the amulet", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });

    it("damage to an item with an unknown type (broomstick) -> throws an Error naming the type", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });

    it("two sword damages but only one sword insured -> throws an Error naming the sword; the whole claim is rejected", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ];

      expect(() => claimResult([{ type: "sword" }], damages)).toThrow(/sword/);
    });

    it("damage entry with amount -200 -> throws an Error naming the amount", () => {
      expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });

    it("claim against policy 5 when no quote step 5 exists -> throws an Error naming policy 5 (reading: a claim needs a policy created by an earlier quote step)", () => {
      const claimOnMissingPolicy = { ...claimStep([{ itemType: "sword", amount: 500 }]), policy: 5 };
      const steps = [quoteStep([{ type: "sword" }]), claimOnMissingPolicy];

      expect(() => processScenario({ customer: newcomer, steps })).toThrow(/policy 5/);
    });
  });
});
