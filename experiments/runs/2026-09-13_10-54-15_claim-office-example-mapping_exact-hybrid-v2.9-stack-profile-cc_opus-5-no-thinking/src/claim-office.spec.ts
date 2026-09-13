import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Base premiums", () => {
    it.todo("should charge only the processing fee for an empty item list — premium 5 G");
    it.todo("should quote a plain sword — base 100 G + 10 G first insurance + 5 G fee = 115 G");
    it.todo("should quote a plain amulet — base 60 G + 6 G first insurance + 5 G fee = 71 G");
    it.todo("should quote a plain staff — base 80 G + 8 G first insurance + 5 G fee = 93 G");
    it.todo("should quote a plain potion — base 40 G + 4 G first insurance + 5 G fee = 49 G");
    it.todo("should quote a single rune at component rate — base 25 G + 2.5 G first insurance + 5 G fee = 33 G");
    it.todo("should quote a single moonstone at component rate — base 25 G + 2.5 G first insurance + 5 G fee = 33 G");
  });

  describe("Building block of 3 alike components", () => {
    it.todo("should charge 2 runes at 50 G base premium (no block)");
    it.todo("should charge 3 runes at 60 G base premium (block applies)");
    it.todo("should charge 4 runes at 100 G base premium (no block — block requires exactly 3)");
    it.todo("should charge 7 runes at 175 G base premium (no block)");
  });

  describe("'Alike' components means exactly the same type", () => {
    it.todo("should charge 2 runes + 1 moonstone at 75 G base premium (no block: different types)");
    it.todo("should charge 3 runes + 3 moonstones at 120 G base premium (two separate blocks)");
  });

  describe("Item-specific modifiers", () => {
    it.todo("should add a 50 % curse surcharge to the cursed item's base premium — cursed sword base 100 G + 50 G");
    it.todo("should add a 30 % surcharge for enchantment exactly 5 — sword base 100 G + 30 G");
    it.todo("should add no high-enchantment surcharge for enchantment 4 — sword base 100 G");
    it.todo("should stack curse and high-enchantment surcharges — cursed sword enchantment 5 → 100 G + 50 G + 30 G");
  });

  describe("Policy-wide modifiers", () => {
    it.todo("should apply a 20 % loyalty discount for exactly 2 years with MHPCO");
    it.todo("should apply no loyalty discount for 1 year with MHPCO");
    it.todo("should apply a 10 % first insurance surcharge to every item in a quote");
    it.todo("should apply a 15 % follow-up discount on the customer's second contract");
    it.todo("should apply the 15 % follow-up discount on every contract after the first");
    it.todo("should add the 5 G processing fee at the very end of every premium");
  });

  describe("Modifier scope on multi-item policies", () => {
    it.todo("should apply the curse surcharge only to the cursed item — cursed sword + plain amulet → base 160 G, curse adds 50 G → 210 G before further modifiers and fee");
  });

  describe("Rounding in the MHPCO's favor", () => {
    it.todo("should round a premium of 197.5 G up to 198 G");
    it.todo("should round a payout of 350.5 G down to 350 G");
    it.todo("should keep intermediate amounts as fractions and round only the final amount");
  });

  describe("Claim — standard reimbursement", () => {
    it.todo("should reimburse a regular sword (steel, enchantment 3) damage 500 G → payout 400 G");
    it.todo("should reimburse a damaged rune (insurance value 250 G) damage 200 G → payout 100 G");
    it.todo("should apply the 100 G deductible once per damaged item — sword 500 G + amulet 300 G → payout 600 G");
  });

  describe("Claim — enchantment threshold vs. dragon material", () => {
    it.todo("should reimburse a dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (50 % rule, then deductible)");
    it.todo("should reimburse a dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)");
    it.todo("should reimburse a dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)");
    it.todo("should reimburse a steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)");
  });

  describe("Claim — insurance sum and cap", () => {
    it.todo("should compute insurance sum 1600 G and cap 3200 G for a sword + amulet policy");
    it.todo("should compute insurance sum 1750 G for a sword + 3 runes policy (block affects premium only)");
    it.todo("should compute insurance sum 2000 G and cap 4000 G for a two-sword policy");
    it.todo("should base the cap on the unmodified insurance value — cursed sword (premium 165 G) → cap 2000 G");
    it.todo("should pay 1400 G and leave cap remaining 600 G for a first claim of 1500 G on a sword policy");
    it.todo("should reduce the second claim of 1500 G to the remaining cap — payout 600 G, remaining cap 0 G");
  });

  describe("Claim — multiple items of the same type", () => {
    it.todo("should treat two sword damage entries against two insured swords as separate damages with their own deductible");
    it.todo("should reject a claim with more damage entries of a type than the policy covers");
  });

  describe("Errors", () => {
    it.todo("should reject a quote containing an item with an unknown type (e.g. broomstick)");
    it.todo("should reject a claim referencing a damaged item that is not part of the policy");
    it.todo("should reject a claim referencing a damaged item with an unknown type");
    it.todo("should reject a claim containing a damage entry with a negative amount (-200)");
  });

  describe("Integration examples", () => {
    it.todo("should quote 165 G for a newcomer (0 years) with a cursed steel sword, enchantment 3");
    it.todo("should quote 160 G for a long-standing customer's (3 years) second contract with a cursed steel sword, enchantment 7");
  });

  describe("Scenario processing", () => {
    it.todo("should return one result per step in the same order as the input steps");
    it.todo("should let a claim step refer to the policy created by an earlier quote step via its zero-based index");
    it.todo("should process the schema example scenario — amulet quote then a 200 G amulet claim");
  });
});

describe("claim-office CLI", () => {
  it.todo("should read a JSON scenario from stdin and write {results:[...]} to stdout");
  it.todo("should exit with a non-zero status and write an error to stderr, writing no results to stdout, on an invalid scenario");
});
