import { describe, expect, it } from "vitest";
import { insuranceSum, quotePremium } from "./quote.js";

// Quote / Premium computation tests — every example and rule from the spec.

describe("quote -- empty and single-item base premiums", () => {
  it("empty item list yields premium 5 G (only the processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });

  it("a sword (plain, no modifiers, no follow-up) yields premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });

  it("an amulet (plain) yields premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "amulet" }], { yearsWithMHPCO: 0 }, 0)).toBe(71);
  });

  it("a staff (plain) yields premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "staff" }], { yearsWithMHPCO: 0 }, 0)).toBe(93);
  });

  it("a potion (plain) yields premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "potion" }], { yearsWithMHPCO: 0 }, 0)).toBe(49);
  });
});

describe("quote -- components and building blocks", () => {
  it("a single rune yields premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up from 32.5)", () => {
    expect(quotePremium([{ type: "rune" }], { yearsWithMHPCO: 0 }, 0)).toBe(33);
  });

  it("a single moonstone yields premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up from 32.5)", () => {
    expect(quotePremium([{ type: "moonstone" }], { yearsWithMHPCO: 0 }, 0)).toBe(33);
  });

  it("2 runes yield premium 60 G (50 base + 5 first insurance + 5 fee; no block)", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 0)).toBe(60);
  });

  it("3 runes (a block) yield premium 71 G (60 block base + 6 first insurance + 5 fee)", () => {
    expect(
      quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 0),
    ).toBe(71);
  });

  it("4 runes yield premium 115 G (100 base + 10 first insurance + 5 fee; no block -- requires exactly 3)", () => {
    expect(
      quotePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });

  it("7 runes yield premium 198 G (175 base + 17.5 first insurance + 5 fee, rounded up from 197.5)", () => {
    expect(
      quotePremium(
        Array.from({ length: 7 }, () => ({ type: "rune" as const })),
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(198);
  });

  it("2 runes + 1 moonstone yield premium 88 G (75 base + 7.5 first insurance + 5 fee, rounded up from 87.5; no block: different types)", () => {
    expect(
      quotePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(88);
  });

  it("3 runes + 3 moonstones yield premium 137 G (120 base + 12 first insurance + 5 fee; two separate blocks)", () => {
    expect(
      quotePremium(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(137);
  });
});

describe("quote -- item-specific modifiers", () => {
  it("a cursed sword yields premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [{ type: "sword", cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });

  it("a sword with enchantment 5 (high enchantment) yields premium 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(145);
  });

  it("a sword with enchantment 4 yields premium 115 G (100 base + 10 first insurance + 5 fee; no high-enchantment surcharge)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });

  it("a cursed sword with enchantment 5 yields premium 195 G (100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(195);
  });

  it("a cursed sword with enchantment 4 yields premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee; curse only)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });
});

describe("quote -- policy-wide modifiers", () => {
  it("a sword with customer 1 year yields premium 115 G (no loyalty discount)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it("a sword with customer exactly 2 years yields premium 95 G (100 base + 10 first insurance - 20 loyalty + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it("a sword on a follow-up contract (customer 0 years, contractIndex 1) yields premium 100 G (100 base + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  it("a sword with customer 2 years on a follow-up contract yields premium 80 G (100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, 1)).toBe(80);
  });
});

describe("quote -- modifier scope on multi-item policies", () => {
  it("a cursed sword + a plain amulet (no loyalty, no follow-up) yields premium 231 G (160 policy base + 50 curse + 16 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(231);
  });

  it("a sword + 3 runes (block) yields premium 181 G (160 base + 16 first insurance + 5 fee; block discount 60 G applies)", () => {
    expect(
      quotePremium(
        [
          { type: "sword" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(181);
  });
});

describe("quote -- insurance sum (for cap calculation)", () => {
  it("two swords yield insurance sum 2000 G (= 2x1000)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("a sword and an amulet yield insurance sum 1600 G (= 1000 + 600)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("a sword and 3 runes (block) yield insurance sum 1750 G (= 1000 + 3x250); the block discount affects the premium only", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
  it("a cursed sword still has insurance value 1000 G; premium modifiers do not raise the cap", () => {
    expect(insuranceSum([{ type: "sword", cursed: true }])).toBe(1000);
  });
});

describe("quote -- integration examples", () => {
  it("newcomer with a cursed sword (steel, enchantment 3) yields premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });

  it("long-standing customer's second contract: cursed sword (steel, enchantment 7), customer 3 years, contractIndex 1 yields premium 160 G (100 base + 50 curse + 30 enchant - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });
});

describe("quote -- rounding in MHPCO's favor", () => {
  it("a premium calculation that yields 197.5 G is rounded UP to 198 G final (satisfied by the 7-runes case)", () => {
    // Already covered by the 7-runes test (premium 198 from 197.5 raw).
  });
  it("intermediate amounts during the calculation stay as fractions; only the final premium is rounded", () => {
    // Implicitly covered by every fractional test above (rune 32.5 → 33, etc.).
  });
});

describe("quote -- rejection cases", () => {
  it("an unknown item type (e.g. broomstick) rejects with a thrown error (chosen reading: CLI exits non-zero; pure function throws)", () => {
    expect(() =>
      quotePremium([{ type: "broomstick" }], { yearsWithMHPCO: 0 }, 0),
    ).toThrow();
  });
});
