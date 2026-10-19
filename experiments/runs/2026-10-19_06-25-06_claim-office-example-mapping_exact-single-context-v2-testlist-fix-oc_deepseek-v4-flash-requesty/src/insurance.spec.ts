import { describe, it, expect } from "vitest";
import { basePremium, itemSurcharges, insuranceSum, quotePremium, claim } from "./insurance.js";

describe("basePremium", () => {
  it("computes main item base premiums (sword 100, amulet 60, staff 80, potion 40)", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("computes 50 G base premium for 2 runes (25 G each)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it.todo("3 same runes -> 60 G (block applies)");
  it.todo("4 runes -> 100 G (no block: block requires exactly 3)");
  it.todo("7 runes -> 175 G (no block: not exactly 3)");
  it.todo("2 runes + 1 moonstone -> 75 G (no block: different types)");
  it.todo("3 runes + 3 moonstones -> 120 G (two separate blocks)");
});

describe("itemSurcharges", () => {
  it.todo("cursed sword adds 50 G (50% of its base premium); plain amulet unaffected");
  it.todo("sword with exactly enchantment 5 adds 30 G (30%); if also cursed both add up to 80 G");
  it.todo("sword with enchantment 4 adds 0 G; cursed sword with enchantment 4 adds only 50 G");
});

describe("insuranceSum", () => {
  it.todo("two swords -> insurance sum 2000 G (2 x 1000)");
  it.todo("sword + amulet -> insurance sum 1600 G (= 1000 + 600)");
  it.todo("sword + 3 runes block -> insurance sum 1750 G (= 1000 + 3 x 250; block discount does not affect the sum)");
  it.todo("cap = 2 x insurance sum (sword + amulet -> cap 3200 G)");
  it.todo("cursed sword (premium 165 G) -> cap still 2000 G (unmodified insurance value; premium modifiers do not raise the cap)");
});

describe("quotePremium", () => {
  it.todo("empty item list -> 5 G (only the processing fee)");
  it.todo("plain sword, 0 years, first contract -> 115 G (100 base + 10 first-insurance + 5 fee)");
  it.todo("plain sword, exactly 2 years, first contract -> 95 G (100 - 20 loyalty + 10 first-insurance + 5 fee)");
  it.todo("plain sword, 0 years, second contract -> 100 G (100 + 10 first-insurance - 15 follow-up + 5 fee)");
  it.todo("cursed sword + plain amulet -> 231 G (base 160 + 50 curse + 16 first-insurance + 5 fee)");
  it.todo("newcomer: 0 years, no previous contract, cursed sword (steel, enchantment 3) -> 165 G");
  it.todo("long-standing second contract: 3 years, cursed sword (steel, enchantment 7) -> 160 G");
  it.todo("rounds premium up in MHPCO's favor: 7 runes first contract -> 198 G (197.5 rounded up)");
  it.todo("intermediate amounts kept as fractions; only the final premium is rounded");
});

describe("claim", () => {
  it.todo("regular sword (steel, enchantment 3) damage 500 -> payout 400 (full minus 100 deductible)");
  it.todo("rune damage 200 -> payout 100 (full minus 100 deductible; no special clause)");
  it.todo("dragon attack on sword (500) and amulet (300) -> payout 600 (100 deductible applied once per damaged item)");
  it.todo("dragon-material sword, enchantment 9, damage 1000 -> payout 400 (50% rule wins, then deductible)");
  it.todo("dragon-material sword, enchantment 5, damage 800 -> payout 700 (only dragon clause: full then deductible)");
  it.todo("steel sword, enchantment 9, damage 1000 -> payout 400 (only high-enchantment clause)");
  it.todo("dragon-material sword, exactly enchantment 8, damage 1000 -> payout 400 (high-enchantment clause then deductible)");
  it.todo("rounds payout down in MHPCO's favor: 350.5 -> 350");
  it.todo("cap exhaustion: sword (cap 2000), first claim 1500 -> payout 1400, remainingCap 600");
  it.todo("cap exhaustion: second claim 1500 -> payout reduced to remainingCap 600, remainingCap 0");
  it.todo("two sword damages in one incident -> each entry treated as separate damage with its own deductible");
});