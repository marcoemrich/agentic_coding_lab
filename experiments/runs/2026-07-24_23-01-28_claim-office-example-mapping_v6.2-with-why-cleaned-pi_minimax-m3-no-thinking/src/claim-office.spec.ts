import { describe, it, expect } from "vitest";
import { processScenario, runCLI } from "./claim-office.js";
import type { Scenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - empty and single items", () => {
    it.todo("empty items list -> premium 5 (only processing fee)");
    it.todo("single sword (no modifiers) -> premium 105 (100 base + 5 fee)");
    it.todo("single amulet (no modifiers) -> premium 65");
    it.todo("single staff (no modifiers) -> premium 85");
    it.todo("single potion (no modifiers) -> premium 45");
  });

  describe("Quote - components and building blocks", () => {
    it.todo("2 runes -> premium 55 (50 base + 5 fee)");
    it.todo("3 runes -> premium 65 (60 base + 5 fee, block applies)");
    it.todo("4 runes -> premium 105 (100 base + 5 fee, no block)");
    it.todo("7 runes -> premium 180 (175 base + 5 fee)");
    it.todo("2 runes + 1 moonstone -> premium 80 (75 base, no block: different types)");
    it.todo("3 runes + 3 moonstones -> premium 125 (120 base, two separate blocks)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("cursed sword: 50% surcharge on item base -> premium 155");
    it.todo("sword with enchantment 5: 30% surcharge -> premium 135");
    it.todo("sword with enchantment 4: no high-enchantment surcharge");
    it.todo("cursed sword with enchantment 5: both surcharges -> premium 185");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("customer with 2 years receives 20% loyalty discount");
    it.todo("customer with 1 year does NOT receive loyalty discount");
    it.todo("follow-up contract (second quote) gives 15% discount");
    it.todo("first insurance surcharge applies per item (10% of item base premium)");
  });

  describe("Quote - integration examples from spec", () => {
    it.todo("newcomer (0 years, first contract) with cursed sword -> premium 165");
    it.todo("long-standing customer (3 years, 2nd contract) with cursed sword enchant 7 -> premium 160");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("regular sword (steel, enchant 3), damage 500 -> payout 400 (cap 2000)");
    it.todo("rune damage 200 -> payout 100 (cap 500)");
  });

  describe("Claim - enchantment and dragon material clauses", () => {
    it.todo("dragon-material sword, enchant 8, damage 1000 -> payout 400 (high enchantment wins, then deductible)");
    it.todo("dragon-material sword, enchant 5, damage 800 -> payout 700 (dragon material only)");
    it.todo("steel sword, enchant 9, damage 1000 -> payout 400 (high enchantment only)");
  });

  describe("Claim - multiple damages and cap", () => {
    it.todo("dragon attack damages sword 500 + amulet 300 -> payout 600 (one deductible per item)");
    it.todo("policy with two swords: insurance sum 2000, cap 4000");
    it.todo("two sword damages in one incident: each gets its own deductible");
    it.todo("first claim of 1500 on regular sword -> payout 1400, remaining cap 600");
    it.todo("second claim of 1500 on regular sword -> payout 600, remaining cap 0");
    it.todo("policy with sword + amulet: insurance sum 1600, cap 3200");
    it.todo("policy with sword + 3 runes (block): insurance sum 1750 (block discount affects premium only)");
  });

  describe("Errors", () => {
    it.todo("quote with unknown item type throws an error");
    it.todo("claim with damage to item not in policy throws an error");
    it.todo("claim with damage to unknown item type throws an error");
    it.todo("claim with negative damage amount throws an error");
    it.todo("claim with more damages of a type than policy covers throws an error");
  });

  describe("CLI behavior", () => {
    it.todo("CLI: valid scenario writes JSON results to stdout");
    it.todo("CLI: error case writes to stderr and exits non-zero");
  });
});
