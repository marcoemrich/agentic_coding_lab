import { describe, it, expect } from "vitest";
import { processScenario } from "./cli.js";

describe("Claim Office CLI", () => {
  it.todo("empty item list -- premium 5 G (only processing fee)");
  it.todo("single sword -- premium 115 G (100 base + 10 first insurance + 5 fee)");
  it.todo("single amulet -- premium 71 G (60 base + 6 first insurance + 5 fee)");
  it.todo("single staff -- premium 93 G (80 base + 8 first insurance + 5 fee)");
  it.todo("single potion -- premium 49 G (40 base + 4 first insurance + 5 fee)");
  it.todo("single rune -- premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)");
  it.todo("single moonstone -- premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)");

  it.todo("2 runes -- base premium 50 G before modifiers");
  it.todo("3 runes -- base premium 60 G (3-alike component block)");
  it.todo("4 runes -- base premium 100 G (block requires exactly 3)");
  it.todo("7 runes -- base premium 175 G (two full blocks + one extra)");
  it.todo("2 runes + 1 moonstone -- base premium 75 G (different types, no block)");
  it.todo("3 runes + 3 moonstones -- base premium 120 G (two separate blocks)");

  it.todo("cursed sword -- premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)");
  it.todo("sword with enchantment 5 -- premium 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)");
  it.todo("sword with enchantment 4 -- premium 115 G (no high-enchantment surcharge)");
  it.todo("cursed sword with enchantment 5 -- premium 195 G (100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee)");

  it.todo("loyalty discount at exactly 2 years -- 20% discount on policy base premium");
  it.todo("no loyalty discount below 2 years -- no discount");

  it.todo("first quote -- 10% first insurance surcharge applies");
  it.todo("second quote -- 15% follow-up contract discount applies");
  it.todo("newcomer with a cursed sword -- premium 165 G");
  it.todo("long-standing customer's second contract with cursed enchanted sword -- premium 160 G");

  it.todo("policy with cursed sword and plain amulet -- item-specific curse applies only to cursed item");
  it.todo("premium rounding up in MHPCO's favor -- 197.5 G becomes 198 G");

  it.todo("standard claim -- steel sword enchantment 3, damage 500 G -- payout 400 G");
  it.todo("claim on rune -- damage 200 G -- payout 100 G");
  it.todo("claim with dragon-material sword enchantment 9, damage 1000 G -- high-enchantment 50% wins, payout 400 G");
  it.todo("claim with dragon-material sword enchantment 5, damage 800 G -- dragon material full reimbursement, payout 700 G");
  it.todo("claim with steel sword enchantment 9, damage 1000 G -- high-enchantment 50%, payout 400 G");
  it.todo("claim with dragon-material sword exactly enchantment 8, damage 1000 G -- high-enchantment 50% wins, payout 400 G");

  it.todo("deductible applies per damaged item -- dragon attack on sword 500 G and amulet 300 G -- payout 600 G");
  it.todo("multiple items of same type insured -- insurance sum 2000 G, cap 4000 G");
  it.todo("multiple damages of same type -- each entry treated as separate damage with own deductible");

  it.todo("cap based on unmodified insurance value -- cursed sword cap 2000 G");
  it.todo("component block discount does not affect insurance sum -- sword + 3 runes sum 1750 G, cap 3500 G");
  it.todo("cap exhaustion -- two 1500 G claims on sword cap 2000 G: first 1400/600, second 600/0");

  it.todo("payout rounding down in MHPCO's favor -- 350.5 G becomes 350 G");

  it.todo("unknown quote item type -- exits non-zero with stderr error, no stdout results");
  it.todo("claim damage item type not in policy -- exits non-zero with stderr error");
  it.todo("claim with more damages of a type than policy covers -- exits non-zero with stderr error");
  it.todo("claim with negative damage amount -- exits non-zero with stderr error");
});
