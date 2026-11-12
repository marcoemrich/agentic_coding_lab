import { describe, expect, it } from "vitest";
import { processScenario, type ClaimStep, type QuoteStep, type Scenario } from "./claim-office.js";
import type { Damage } from "./policy.js";
import type { Item } from "./item.js";

const NEWCOMER = { yearsWithMHPCO: 0 };

function quote(...items: Item[]): QuoteStep {
  return { op: "quote", items };
}

function claim(policy: number, ...damages: Damage[]): ClaimStep {
  return { op: "claim", policy, incident: { cause: "dragon attack", damages } };
}

function damage(itemType: string, amount: number): Damage {
  return { itemType, amount };
}

function copies(count: number, item: Item): Item[] {
  return Array.from({ length: count }, () => ({ ...item }));
}

const runes = (count: number) => copies(count, { type: "rune" });
const moonstones = (count: number) => copies(count, { type: "moonstone" });

function resultsOf(steps: Scenario["steps"], customer = NEWCOMER) {
  return processScenario({ customer, steps }).results;
}

describe("MHPCO claim office scenario", () => {
  describe("quote: base premium, first insurance surcharge and processing fee", () => {
    it("empty item list -> premium 5 (only the processing fee)", () => {
      expect(resultsOf([quote()])).toEqual([{ premium: 5 }]);
    });
    it("sword -> premium 115 (100 base + 10 first insurance + 5 fee)", () => {
      expect(resultsOf([quote({ type: "sword" })])).toEqual([{ premium: 115 }]);
    });
    it("amulet -> premium 71 (60 base + 6 first insurance + 5 fee)", () => {
      expect(resultsOf([quote({ type: "amulet" })])).toEqual([{ premium: 71 }]);
    });
    it("staff -> premium 93 (80 base + 8 first insurance + 5 fee)", () => {
      expect(resultsOf([quote({ type: "staff" })])).toEqual([{ premium: 93 }]);
    });
    it("potion -> premium 49 (40 base + 4 first insurance + 5 fee)", () => {
      expect(resultsOf([quote({ type: "potion" })])).toEqual([{ premium: 49 }]);
    });
    it("sword and amulet -> policy base premium 160 -> premium 181 (160 + 16 first insurance + 5 fee)", () => {
      expect(resultsOf([quote({ type: "sword" }, { type: "amulet" })])).toEqual([{ premium: 181 }]);
    });
  });

  describe("quote: components and building blocks", () => {
    it("2 runes -> 50 base premium -> premium 60 (50 + 5 first insurance + 5 fee)", () => {
      expect(resultsOf([quote(...runes(2))])).toEqual([{ premium: 60 }]);
    });
    it("2 moonstones -> 50 base premium -> premium 60 (50 + 5 first insurance + 5 fee)", () => {
      expect(resultsOf([quote(...moonstones(2))])).toEqual([{ premium: 60 }]);
    });
    it("1 rune -> 25 + 2.5 + 5 = 32.5 -> premium 33 (rounded up in the MHPCO's favor)", () => {
      expect(resultsOf([quote(...runes(1))])).toEqual([{ premium: 33 }]);
    });
    it("3 runes -> 60 base premium (block applies) -> premium 71 (60 + 6 + 5)", () => {
      expect(resultsOf([quote(...runes(3))])).toEqual([{ premium: 71 }]);
    });
    it("4 runes -> 100 base premium (no block: block requires exactly 3) -> premium 115 (100 + 10 + 5)", () => {
      expect(resultsOf([quote(...runes(4))])).toEqual([{ premium: 115 }]);
    });
    it("7 runes -> 175 base premium -> calculation yields 197.5 -> premium 198 (rounded up)", () => {
      expect(resultsOf([quote(...runes(7))])).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone -> 75 base premium (no block: different types) -> premium 88 (75 + 7.5 + 5 = 87.5 rounded up)", () => {
      expect(resultsOf([quote(...runes(2), ...moonstones(1))])).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones -> 120 base premium (two separate blocks) -> premium 137 (120 + 12 + 5)", () => {
      expect(resultsOf([quote(...runes(3), ...moonstones(3))])).toEqual([{ premium: 137 }]);
    });
    it("3 swords -> 300 base premium (the block is offered for components only) -> premium 335 (300 + 30 + 5)", () => {
      expect(resultsOf([quote(...copies(3, { type: "sword" }))])).toEqual([{ premium: 335 }]);
    });
  });

  describe("quote: premium modifiers", () => {
    it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };

      expect(resultsOf([quote(cursedSword)], NEWCOMER)).toEqual([{ premium: 165 }]);
    });
    it("cursed sword + plain amulet -> curse adds 50 (50 % of the sword's base premium only): 210 before further modifiers -> premium 231 (+ 16 first insurance + 5 fee)", () => {
      const items = [{ type: "sword", cursed: true }, { type: "amulet" }];

      expect(resultsOf([quote(...items)])).toEqual([{ premium: 231 }]);
    });
    it("sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 (100 + 30 + 10 + 5)", () => {
      expect(resultsOf([quote({ type: "sword", enchantment: 5 })])).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115", () => {
      expect(resultsOf([quote({ type: "sword", enchantment: 4 })])).toEqual([{ premium: 115 }]);
    });
    it("plain sword + amulet with enchantment 5 -> surcharge adds 18 (30 % of the amulet's base premium only) -> premium 199 (160 + 18 + 16 + 5)", () => {
      const items = [{ type: "sword" }, { type: "amulet", enchantment: 5 }];

      expect(resultsOf([quote(...items)])).toEqual([{ premium: 199 }]);
    });
    it("cursed sword with exactly enchantment 5 -> both surcharges apply -> premium 195 (100 + 50 + 30 + 10 + 5)", () => {
      expect(resultsOf([quote({ type: "sword", enchantment: 5, cursed: true })])).toEqual([{ premium: 195 }]);
    });
    it("cursed sword with enchantment 4 -> only the curse surcharge applies -> premium 165", () => {
      expect(resultsOf([quote({ type: "sword", enchantment: 4, cursed: true })])).toEqual([{ premium: 165 }]);
    });
    it("customer with exactly 2 years with MHPCO -> loyalty discount applies -> sword premium 95 (100 - 20 loyalty + 10 + 5)", () => {
      expect(resultsOf([quote({ type: "sword" })], { yearsWithMHPCO: 2 })).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO -> no loyalty discount -> sword premium 115", () => {
      expect(resultsOf([quote({ type: "sword" })], { yearsWithMHPCO: 1 })).toEqual([{ premium: 115 }]);
    });
    it("loyalty discount applies to the policy base premium, not to surcharges: 2 years, cursed sword + amulet -> premium 199 (160 + 50 - 32 + 16 + 5)", () => {
      const items = [{ type: "sword", cursed: true }, { type: "amulet" }];

      expect(resultsOf([quote(...items)], { yearsWithMHPCO: 2 })).toEqual([{ premium: 199 }]);
    });
    it("second quote in the scenario -> 15 % follow-up contract discount -> sword premium 100 (100 + 10 - 15 + 5); the first quote stays 115", () => {
      const steps = [quote({ type: "sword" }), quote({ type: "sword" })];

      expect(resultsOf(steps)).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("third quote in the scenario -> follow-up discount applies to each contract after the first -> sword premium 100", () => {
      const steps = [quote({ type: "sword" }), quote({ type: "sword" }), quote({ type: "sword" })];

      expect(resultsOf(steps)).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract: 3 years, cursed sword (steel, enchantment 7) -> premium 160 (100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 fee)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      const steps = [quote({ type: "amulet" }), quote(cursedSword)];

      expect(resultsOf(steps, { yearsWithMHPCO: 3 })[1]).toEqual({ premium: 160 });
    });
    it("intermediate amounts are kept as fractions: loyal customer's second contract for 1 rune -> 25 - 5 + 2.5 - 3.75 + 5 = 23.75 -> premium 24", () => {
      const steps = [quote({ type: "amulet" }), quote(...runes(1))];

      expect(resultsOf(steps, { yearsWithMHPCO: 2 })[1]).toEqual({ premium: 24 });
    });
  });

  describe("claim: standard reimbursement, deductible and cap", () => {
    it("regular sword (steel, enchantment 3), damage 500 -> payout 400 (minus 100 deductible), remainingCap 1600 (cap 2000 = 2 x 1000)", () => {
      const steps = [quote({ type: "sword", material: "steel", enchantment: 3 }), claim(0, damage("sword", 500))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("amulet, damage 200 -> payout 100, remainingCap 1100 (cap 1200 = 2 x 600)", () => {
      const steps = [quote({ type: "amulet" }), claim(0, damage("amulet", 200))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("staff, damage 200 -> payout 100, remainingCap 1500 (cap 1600 = 2 x 800)", () => {
      const steps = [quote({ type: "staff" }), claim(0, damage("staff", 200))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("potion, damage 200 -> payout 100, remainingCap 700 (cap 800 = 2 x 400)", () => {
      const steps = [quote({ type: "potion" }), claim(0, damage("potion", 200))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 100, remainingCap: 700 });
    });
    it("rune (insurance value 250), damage 200 -> payout 100, remainingCap 400 (cap 500)", () => {
      const steps = [quote(...runes(1)), claim(0, damage("rune", 200))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("moonstone (insurance value 250), damage 200 -> payout 100, remainingCap 400 (cap 500)", () => {
      const steps = [quote(...moonstones(1)), claim(0, damage("moonstone", 200))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("damage 60 below the deductible -> payout 0, remainingCap 2000 (chosen reading: the deductible never makes a payout negative)", () => {
      const steps = [quote({ type: "sword" }), claim(0, damage("sword", 60))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
  });

  describe("claim: enchantment threshold vs. dragon material", () => {
    it("steel sword, enchantment 9, damage 1000 -> payout 400 (50 % first, then deductible: 500 - 100)", () => {
      const steps = [quote({ type: "sword", material: "steel", enchantment: 9 }), claim(0, damage("sword", 1000))];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 -> payout 400 (high-enchantment clause applies, then deductible)", () => {
      const steps = [quote({ type: "sword", material: "dragon", enchantment: 8 }), claim(0, damage("sword", 1000))];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 400 });
    });
    it("steel sword, enchantment 7, damage 1000 -> payout 900 (below the enchantment >= 8 threshold: full reimbursement minus deductible)", () => {
      const steps = [quote({ type: "sword", material: "steel", enchantment: 7 }), claim(0, damage("sword", 1000))];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 900 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 -> payout 400 (both clauses apply; the 50 % rule wins)", () => {
      const steps = [quote({ type: "sword", material: "dragon", enchantment: 9 }), claim(0, damage("sword", 1000))];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 400 });
    });
    it("dragon-material sword, enchantment 5, damage 800 -> payout 700 (full reimbursement, then deductible)", () => {
      const steps = [quote({ type: "sword", material: "dragon", enchantment: 5 }), claim(0, damage("sword", 800))];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 700 });
    });
    it("payout calculation that yields 350.5 (enchantment 9 sword, damage 901) -> payout 350 (rounded down), remainingCap 1650", () => {
      const steps = [quote({ type: "sword", enchantment: 9 }), claim(0, damage("sword", 901))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim: several damages and insurance sum", () => {
    it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per damaged item), remainingCap 2600 (insurance sum 1600, cap 3200)", () => {
      const steps = [
        quote({ type: "sword" }, { type: "amulet" }),
        claim(0, damage("sword", 500), damage("amulet", 300)),
      ];

      expect(resultsOf(steps)[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("policy covers two swords, both damaged (500 and 300) -> each damage entry has its own deductible: payout 600, remainingCap 3400 (insurance sum 2000, cap 4000)", () => {
      const steps = [
        quote(...copies(2, { type: "sword" })),
        claim(0, damage("sword", 500), damage("sword", 300)),
      ];

      expect(resultsOf(steps)[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("intermediate payouts are kept as fractions: two enchantment-9 swords, each damage 901 -> 350.5 + 350.5 -> payout 701", () => {
      const steps = [
        quote(...copies(2, { type: "sword", enchantment: 9 })),
        claim(0, damage("sword", 901), damage("sword", 901)),
      ];

      expect(resultsOf(steps)[1]).toMatchObject({ payout: 701 });
    });
    it("cursed sword -> cap 2000 (premium modifiers do not raise the cap): damage 500 -> payout 400, remainingCap 1600", () => {
      const steps = [quote({ type: "sword", cursed: true }), claim(0, damage("sword", 500))];

      expect(resultsOf(steps)).toEqual([{ premium: 165 }, { payout: 400, remainingCap: 1600 }]);
    });
    it("sword and 3 runes (a block) -> insurance sum 1750, cap 3500 (block discount does not affect the insurance sum): sword damage 500 -> payout 400, remainingCap 3100", () => {
      const steps = [quote({ type: "sword" }, ...runes(3)), claim(0, damage("sword", 500))];

      expect(resultsOf(steps)[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
  });

  describe("claim: cap exhaustion across steps", () => {
    it("sword, two successive claims of 1500 -> first: payout 1400, remainingCap 600; second: payout 600, remainingCap 0 (reduced to the remaining cap)", () => {
      const steps = [quote({ type: "sword" }), claim(0, damage("sword", 1500)), claim(0, damage("sword", 1500))];

      expect(resultsOf(steps).slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("the cap is tracked per policy, referenced by the quote's step index: sword (step 0) and amulet (step 1) policies keep separate caps", () => {
      const steps = [
        quote({ type: "sword" }),
        quote({ type: "amulet" }),
        claim(1, damage("amulet", 200)),
        claim(0, damage("sword", 500)),
      ];

      expect(resultsOf(steps).slice(2)).toEqual([
        { payout: 100, remainingCap: 1100 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("schema example (5 years, silver amulet, fire damage 200) -> results in step order: [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
  });
});
