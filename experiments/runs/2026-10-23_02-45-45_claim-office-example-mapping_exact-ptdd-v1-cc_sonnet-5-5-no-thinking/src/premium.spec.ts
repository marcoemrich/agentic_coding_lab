import { describe, expect, it } from "vitest";
import { ClaimOfficeError } from "./claim-office-error.js";
import { basePremium, quotePremium } from "./premium.js";

const newcomer = { yearsWithMHPCO: 0, followUp: false };

const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));

describe("Quote premium", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });
});

describe("Base premium", () => {
  it("sword -> 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });

  it("amulet -> 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });

  it("staff -> 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });

  it("potion -> 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  it("1 rune -> 25 G", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });

  it("1 moonstone -> 25 G", () => {
    expect(basePremium([{ type: "moonstone" }])).toBe(25);
  });

  it("2 runes -> 50 G", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });

  it("3 runes -> 60 G (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("4 runes -> 100 G (no block: block requires exactly 3)", () => {
    expect(basePremium(runes(4))).toBe(100);
  });

  it("7 runes -> 175 G", () => {
    expect(basePremium(runes(7))).toBe(175);
  });

  it("2 runes + 1 moonstone -> 75 G (no block: alike means the same type)", () => {
    expect(basePremium([...runes(2), { type: "moonstone" }])).toBe(75);
  });

  it("3 runes + 3 moonstones -> 120 G (two separate blocks)", () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });

  it("sword + amulet -> 160 G (sum of the item base premiums)", () => {
    expect(basePremium([{ type: "sword" }, { type: "amulet" }])).toBe(160);
  });

  it("3 swords -> 300 G (the building block applies to components only)", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "sword" })))).toBe(300);
  });

  it("unknown item type broomstick -> throws ClaimOfficeError (chosen reading of 'rejected')", () => {
    expect(() => basePremium([{ type: "broomstick" }])).toThrow(ClaimOfficeError);
  });
});

describe("Premium modifiers", () => {
  it("newcomer, plain sword -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], newcomer)).toBe(115);
  });

  it("newcomer, cursed sword -> 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword", cursed: true }], newcomer)).toBe(165);
  });

  it("newcomer, sword enchantment 5 -> 145 G (high-enchantment surcharge applies at exactly 5)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5 }], newcomer)).toBe(145);
  });

  it("newcomer, cursed sword enchantment 5 -> 195 G (both surcharges apply)", () => {
    expect(quotePremium([{ type: "sword", cursed: true, enchantment: 5 }], newcomer)).toBe(195);
  });

  it("newcomer, sword enchantment 4 -> 115 G (no high-enchantment surcharge)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4 }], newcomer)).toBe(115);
  });

  it("newcomer, cursed sword enchantment 4 -> 165 G (curse surcharge only)", () => {
    expect(quotePremium([{ type: "sword", cursed: true, enchantment: 4 }], newcomer)).toBe(165);
  });

  it("2 years with MHPCO, plain sword -> 95 G (loyalty discount applies at exactly 2 years)", () => {
    const loyal = { yearsWithMHPCO: 2, followUp: false };
    expect(quotePremium([{ type: "sword" }], loyal)).toBe(95);
  });

  it("1 year with MHPCO, plain sword -> 115 G (no loyalty discount)", () => {
    const almostLoyal = { yearsWithMHPCO: 1, followUp: false };
    expect(quotePremium([{ type: "sword" }], almostLoyal)).toBe(115);
  });

  it("newcomer, plain sword on a follow-up contract -> 100 G (15 % follow-up discount)", () => {
    const secondContract = { yearsWithMHPCO: 0, followUp: true };
    expect(quotePremium([{ type: "sword" }], secondContract)).toBe(100);
  });

  it("3 years, follow-up contract, cursed sword enchantment 7 -> 160 G (first insurance still applies)", () => {
    const loyalSecondContract = { yearsWithMHPCO: 3, followUp: true };
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quotePremium([item], loyalSecondContract)).toBe(160);
  });

  it("newcomer, cursed sword + plain amulet -> 231 G (curse applies to the sword's 100 G only: 160 + 50 + 16 + 5)", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quotePremium(items, newcomer)).toBe(231);
  });

  it("newcomer, sword enchantment 5 + plain amulet -> 211 G (high enchantment applies to the sword's 100 G only)", () => {
    const items = [{ type: "sword", enchantment: 5 }, { type: "amulet" }];
    expect(quotePremium(items, newcomer)).toBe(211);
  });

  it("newcomer, sword + 2 runes + 1 moonstone -> 198 G (197.5 rounded up in the MHPCO's favor)", () => {
    const items = [{ type: "sword" }, ...runes(2), { type: "moonstone" }];
    expect(quotePremium(items, newcomer)).toBe(198);
  });

});
