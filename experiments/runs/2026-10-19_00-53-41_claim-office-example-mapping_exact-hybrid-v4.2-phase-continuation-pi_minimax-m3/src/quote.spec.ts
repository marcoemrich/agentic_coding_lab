import { describe, it, expect } from "vitest";
import { calculatePremium } from "./quote.js";

const customer = (yearsWithMHPCO: number) => ({ yearsWithMHPCO });

describe("Premium calculation", () => {
  // ----- Edge case: empty list -----
  it("should return 5 G for empty item list (only processing fee)", () => {
    expect(calculatePremium([], customer(0), true)).toBe(5);
  });

  it("should compute 3 runes total premium as 73 G (60 base block + 7.5 first insurance + 5 fee = 72.5 rounded up)", () => {
    expect(
      calculatePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer(0),
        true,
      ),
    ).toBe(73);
  });

  // ----- Component block pricing (no policy modifiers) -----
  it("should compute 2 runes total premium as 60 G (50 base + 5 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "rune" }, { type: "rune" }],
        customer(0),
        true,
      ),
    ).toBe(60);
  });

  it("should compute 4 runes total premium as 115 G (no block, 4 x 25 = 100 base + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer(0),
        true,
      ),
    ).toBe(115);
  });

  it("should compute 7 runes total premium as 198 G (no block, 7 x 25 = 175 base + 17.5 first insurance + 5 fee = 197.5 rounded up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(calculatePremium(runes, customer(0), true)).toBe(198);
  });
  it("should compute 2 runes + 1 moonstone total premium as 88 G (no block, different types; 3 x 25 = 75 base + 7.5 first insurance + 5 fee = 87.5 rounded up)", () => {
    expect(
      calculatePremium(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ],
        customer(0),
        true,
      ),
    ).toBe(88);
  });

  it("should compute 3 runes + 3 moonstones total premium as 140 G (two separate blocks of 60 G each = 120 base + 15 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        customer(0),
        true,
      ),
    ).toBe(140);
  });

  // ----- Item-specific modifiers -----
  it("should compute total premium for cursed sword + plain amulet as 231 G (160 base + 50 cursed + 16 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
        customer(0),
        true,
      ),
    ).toBe(231);
  });
  it("should apply high-enchantment surcharge of 30% when enchantment >= 5 (sword enchantment 5 -> 145 G: 100 base + 30 high ench + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        customer(0),
        true,
      ),
    ).toBe(145);
  });
  it("should NOT apply high-enchantment surcharge when enchantment < 5 (sword enchantment 4 -> 115 G: 100 base + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        customer(0),
        true,
      ),
    ).toBe(115);
  });
  it("should apply both cursed and high-enchantment surcharges (cursed sword enchantment 5 -> 195 G: 100 base + 50 curse + 30 high ench + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        customer(0),
        true,
      ),
    ).toBe(195);
  });

  // ----- Policy-wide modifiers -----
  it("should apply loyalty discount of 20% when yearsWithMHPCO >= 2 (sword, customer 2 years -> 95 G: 100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        customer(2),
        true,
      ),
    ).toBe(95);
  });
  it("should NOT apply loyalty discount when yearsWithMHPCO < 2 (sword, customer 1 year -> 115 G: 100 base + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        customer(1),
        true,
      ),
    ).toBe(115);
  });
  it("should apply first-insurance surcharge of 10% per item (cursed sword + plain amulet -> 231 G: 160 base + 50 cursed + 16 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
        customer(0),
        true,
      ),
    ).toBe(231);
  });
  it("should apply follow-up contract discount of 15% when isFirstContract is false (sword, customer 0 years, follow-up -> 100 G: 100 base + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        customer(0),
        false,
      ),
    ).toBe(100);
  });
  it("should NOT apply follow-up contract discount when isFirstContract is true (sword, customer 3 years, first contract -> 95 G: 100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        customer(3),
        true,
      ),
    ).toBe(95);
  });

  // ----- Processing fee -----
  it("should add 5 G processing fee (empty list returns 5, sword returns base+10+5)", () => {
    // Both check the fee is added: empty list returns just the fee (5),
    // and a sword with default customer returns 100 + 10 first insurance + 5 = 115.
    expect(calculatePremium([], customer(0), true)).toBe(5);
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        customer(0),
        true,
      ),
    ).toBe(115);
  });

  // ----- Rounding -----
  it("should round premium up to whole G in MHPCO's favor (3 runes: 72.5 -> 73)", () => {
    // Block-priced 3 runes: 60 base + 7.5 first insurance + 5 fee = 72.5 -> 73
    expect(
      calculatePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer(0),
        true,
      ),
    ).toBe(73);
  });

  // ----- Integration examples from the spec -----
  it("newcomer (0 years, first contract) with cursed sword (steel, enchantment 3) -> 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        customer(0),
        true,
      ),
    ).toBe(165);
  });
  it("long-standing customer's second contract (3 years, follow-up) with cursed sword (steel, enchantment 7) -> 160 G (100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(
      calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        customer(3),
        false,
      ),
    ).toBe(160);
  });

  // ----- Error cases -----
  it("should throw on unknown item type in the quote", () => {
    expect(() =>
      calculatePremium(
        [{ type: "broomstick" }],
        customer(0),
        true,
      ),
    ).toThrow();
  });
});
