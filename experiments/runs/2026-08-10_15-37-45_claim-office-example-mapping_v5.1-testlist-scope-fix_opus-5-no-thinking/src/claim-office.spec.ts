import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword → base premium 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it.todo("single amulet → base premium 60 G + 6 G first insurance + 5 G fee = 71 G");
    it.todo("single staff → base premium 80 G + 8 G first insurance + 5 G fee = 93 G");
    it.todo("single potion → base premium 40 G + 4 G first insurance + 5 G fee = 49 G");
    it.todo("single rune → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)");
    it.todo("single moonstone → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)");
  });

  describe("quote — building block of 3 alike components", () => {
    it.todo("2 runes → 50 G base premium");
    it.todo("3 runes → 60 G base premium (block applies)");
    it.todo("4 runes → 100 G base premium (no block — block requires exactly 3)");
    it.todo("7 runes → 175 G base premium");
    it.todo("2 runes + 1 moonstone → 75 G base premium (no block: different types)");
    it.todo("3 runes + 3 moonstones → 120 G base premium (two separate blocks)");
  });

  describe("quote — item-specific modifiers", () => {
    it.todo("cursed sword adds 50 % risk surcharge → 50 G on top of 100 G base premium");
    it.todo("sword with enchantment 5 → high-enchantment surcharge 30 G applies (threshold is >= 5)");
    it.todo("sword with enchantment 4 → no high-enchantment surcharge");
    it.todo("cursed sword with enchantment 5 → both surcharges apply (50 G + 30 G)");
    it.todo("cursed sword and plain amulet → policy base premium 160 G, curse adds 50 G (only the cursed item's base) → 210 G before further modifiers and fee");
  });

  describe("quote — policy-wide modifiers", () => {
    it.todo("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies");
    it.todo("customer with 1 year with MHPCO → no loyalty discount");
    it.todo("first insurance carries 10 % initial assessment surcharge on the policy base premium");
    it.todo("second quote in a scenario → 15 % follow-up contract discount, and the 10 % first-insurance surcharge still applies to the new item");
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it.todo("premium calculation yielding 197.5 G → final premium 198 G (rounded up)");
    it.todo("intermediate amounts are kept as fractions; only the final premium is rounded");
  });

  describe("claim — standard reimbursement", () => {
    it.todo("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (damage minus 100 G deductible)");
    it.todo("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment level or material, so no special clause)");
  });

  describe("claim — special clauses", () => {
    it.todo("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)");
    it.todo("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)");
    it.todo("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over dragon material, then deductible)");
    it.todo("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold is >= 8)");
  });

  describe("claim — deductible per damage event", () => {
    it.todo("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (100 G deductible per damaged item)");
  });

  describe("claim — cap", () => {
    it.todo("policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G");
    it.todo("cursed sword (premium with modifiers 165 G) → cap 2000 G (based on the unmodified insurance value)");
    it.todo("policy covering a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects the premium only)");
    it.todo("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G");
    it.todo("sword insured (cap 2000 G), second successive claim of 1500 G → payout 600 G, remainingCap 0 G (desired 1400 G reduced to the remaining cap)");
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it.todo("payout calculation yielding 350.5 G → final payout 350 G (rounded down)");
  });

  describe("claim — multiple items of the same type", () => {
    it.todo("policy covers two swords → insurance sum 2000 G, cap 4000 G");
    it.todo("two sword damage entries against a policy covering two swords → each entry is a separate damage with its own deductible");
    it.todo("more damage entries of a type than the policy covers (two sword damages, one sword insured) → error, whole claim rejected");
  });

  describe("integration examples", () => {
    it.todo("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 → premium 165 G");
    it.todo("long-standing customer (3 years), second quote, cursed steel sword with enchantment 7 → premium 160 G");
  });

  describe("errors", () => {
    it.todo("quote with an item of unknown type (e.g. broomstick) → error, no results");
    it.todo("claim referencing a damage entry whose item is not part of the policy (amulet damaged when only a sword is insured) → error");
    it.todo("claim referencing a damage entry with an unknown item type → error");
    it.todo("claim with a damage entry with amount: -200 → error");
  });
});

describe("claim-office CLI", () => {
  it.todo("reads the schema example scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout");
  it.todo("exits with a non-zero status code and writes an error description to stderr for an unknown item type, with no results on stdout");
});
