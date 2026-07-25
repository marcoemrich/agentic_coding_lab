import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([], customer, 0)).toEqual({ premium: 5, insuranceSum: 0 });
  });

  // Single main items, no modifiers
  it("single sword (steel, no enchantment, not cursed) -> premium 115 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "sword" }], customer, 0)).toEqual({
      premium: 115,
      insuranceSum: 1000,
    });
  });
  it("single amulet -> premium 71 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "amulet" }], customer, 0)).toEqual({
      premium: 71,
      insuranceSum: 600,
    });
  });
  it("single staff -> premium 93 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "staff" }], customer, 0)).toEqual({
      premium: 93,
      insuranceSum: 800,
    });
  });
  it("single potion -> premium 49 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "potion" }], customer, 0)).toEqual({
      premium: 49,
      insuranceSum: 400,
    });
  });

  // Single component
  it("single rune -> premium 33 G (25 + 2.5 + 5 = 32.5 -> 33)", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "rune" }], customer, 0)).toEqual({
      premium: 33,
      insuranceSum: 250,
    });
  });

  // Building block of 3 alike components
  it("2 runes (no block) -> premium 60 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "rune" }, { type: "rune" }], customer, 0)).toEqual({
      premium: 60,
      insuranceSum: 500,
    });
  });
  it("3 runes (block applies) -> premium 71 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      quote(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer,
        0,
      ),
    ).toEqual({
      premium: 71,
      insuranceSum: 750,
    });
  });
  it("4 runes (no block) -> premium 115 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const runes = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(quote(runes, customer, 0)).toEqual({
      premium: 115,
      insuranceSum: 1000,
    });
  });
  it("7 runes (no block) -> premium 198 G (rounding example: 197.5 -> 198)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(runes, customer, 0)).toEqual({
      premium: 198,
      insuranceSum: 1750,
    });
  });

  // Alike components means same type
  it("2 runes + 1 moonstone (different types, no block) -> premium 88 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      quote(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        customer,
        0,
      ),
    ).toEqual({
      premium: 88,
      insuranceSum: 750,
    });
  });
  it("3 runes + 3 moonstones (two separate blocks) -> premium 137 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(quote(items, customer, 0)).toEqual({
      premium: 137,
      insuranceSum: 1500,
    });
  });

  // Cursed modifier (applies only to the cursed item's base premium)
  it("cursed sword (0 years, 1st quote, integration example 1) -> premium 165 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "sword", cursed: true }], customer, 0)).toEqual({
      premium: 165,
      insuranceSum: 1000,
    });
  });

  // High enchantment modifier
  it("sword with enchantment 5 (boundary, high enchantment applies) -> premium 145 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "sword", enchantment: 5 }], customer, 0)).toEqual({
      premium: 145,
      insuranceSum: 1000,
    });
  });
  it("sword with enchantment 4 (no high enchantment) -> premium 115 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote([{ type: "sword", enchantment: 4 }], customer, 0)).toEqual({
      premium: 115,
      insuranceSum: 1000,
    });
  });

  // Combined item-specific modifiers
  it("cursed sword with enchantment 7 (0 years, 1st quote) -> premium 195 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      quote([{ type: "sword", cursed: true, enchantment: 7 }], customer, 0),
    ).toEqual({
      premium: 195,
      insuranceSum: 1000,
    });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet (multi-item) -> premium 231 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      quote([{ type: "sword", cursed: true }, { type: "amulet" }], customer, 0),
    ).toEqual({
      premium: 231,
      insuranceSum: 1600,
    });
  });

  // Loyalty discount threshold (exactly 2 years applies)
  it("customer with exactly 2 years (boundary) + sword -> premium 95 G", () => {
    const customer = { yearsWithMHPCO: 2 };
    expect(quote([{ type: "sword" }], customer, 0)).toEqual({
      premium: 95,
      insuranceSum: 1000,
    });
  });
  it("customer with 1 year (just below threshold) + sword -> premium 115 G", () => {
    const customer = { yearsWithMHPCO: 1 };
    expect(quote([{ type: "sword" }], customer, 0)).toEqual({
      premium: 115,
      insuranceSum: 1000,
    });
  });

  // Long-standing customer's follow-up contract
  it(
    "long-standing customer (3 years, 2nd quote) + cursed sword enchant 7 -> premium 160 G (integration example 2)",
    () => {
      const customer = { yearsWithMHPCO: 3 };
      expect(
        quote(
          [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }],
          customer,
          1,
        ),
      ).toEqual({
        premium: 160,
        insuranceSum: 1000,
      });
    },
  );

  // Edge cases / errors
  it("unknown item type -> throws", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(() => quote([{ type: "broomstick" }], customer, 0)).toThrow();
  });

  // Insurance sum computation examples from spec
  it("two swords -> insurance sum 2000, cap 4000", () => {
    const customer = { yearsWithMHPCO: 0 };
    const result = quote([{ type: "sword" }, { type: "sword" }], customer, 0);
    expect(result.insuranceSum).toBe(2000);
  });

  it("sword + amulet -> insurance sum 1600", () => {
    const customer = { yearsWithMHPCO: 0 };
    const result = quote([{ type: "sword" }, { type: "amulet" }], customer, 0);
    expect(result.insuranceSum).toBe(1600);
  });

  it("sword + 3 runes (block) -> insurance sum 1750 (block affects premium only, not sum)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const result = quote(
      [
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
      customer,
      0,
    );
    expect(result.insuranceSum).toBe(1750);
  });
});
