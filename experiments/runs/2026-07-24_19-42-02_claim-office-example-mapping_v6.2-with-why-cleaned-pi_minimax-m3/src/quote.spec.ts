import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote", () => {
  // -- empty / single items --
  it("empty items list → premium 5 G (processing fee only)", () => {
    expect(quote([], 0, false).premium).toBe(5);
  });
  it("single sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword" }], 0, false).premium).toBe(115);
  });
  it("single amulet → premium 71 G (60 base + 6 + 5 fee)", () => {
    expect(quote([{ type: "amulet" }], 0, false).premium).toBe(71);
  });
  it("single staff → premium 93 G (80 base + 8 + 5 fee)", () => {
    expect(quote([{ type: "staff" }], 0, false).premium).toBe(93);
  });
  it("single potion → premium 49 G (40 base + 4 + 5 fee)", () => {
    expect(quote([{ type: "potion" }], 0, false).premium).toBe(49);
  });
  it("single rune → premium 33 G (32.5 rounded up to 33)", () => {
    expect(quote([{ type: "rune" }], 0, false).premium).toBe(33);
  });
  it("single moonstone → premium 33 G (32.5 rounded up to 33)", () => {
    expect(quote([{ type: "moonstone" }], 0, false).premium).toBe(33);
  });

  // -- building blocks of 3 alike components --
  it("two runes → premium 60 G (50 base + 5 + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], 0, false).premium).toBe(60);
  });
  it("three runes (block applies) → premium 71 G (60 base + 6 + 5 fee)", () => {
    expect(
      quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false).premium,
    ).toBe(71);
  });
  it("four runes (no block — block requires exactly 3) → premium 115 G (100 base + 10 + 5 fee)", () => {
    const items = Array(4).fill({ type: "rune" });
    expect(quote(items, 0, false).premium).toBe(115);
  });
  it("seven runes (no block — 7 ≠ 3) → premium 198 G (175 base + 17.5 + 5 fee = 197.5 rounded up)", () => {
    const items = Array(7).fill({ type: "rune" });
    expect(quote(items, 0, false).premium).toBe(198);
  });

  // -- alike = same type only --
  it("two runes + one moonstone (no block: different types) → premium 88 G (87.5 rounded up)", () => {
    expect(
      quote(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        0,
        false,
      ).premium,
    ).toBe(88);
  });
  it("three runes + three moonstones (two separate blocks) → premium 137 G (120 base + 12 + 5 fee)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(quote(items, 0, false).premium).toBe(137);
  });

  // -- item-specific modifiers --
  it("cursed sword → premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", cursed: true }], 0, false).premium).toBe(165);
  });
  it("sword with enchantment 5 (high-enchantment threshold) → premium 145 G (100 + 30 + 10 + 5)", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], 0, false).premium).toBe(145);
  });
  it("sword with enchantment 4 (below threshold) → premium 115 G (no high-enchantment surcharge)", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], 0, false).premium).toBe(115);
  });
  it("sword with enchantment 8 → high-enchantment applies, premium 145 G", () => {
    expect(quote([{ type: "sword", enchantment: 8 }], 0, false).premium).toBe(145);
  });
  it("cursed + enchanted sword (enchantment 5) → both surcharges, premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    expect(
      quote([{ type: "sword", cursed: true, enchantment: 5 }], 0, false).premium,
    ).toBe(195);
  });

  // -- policy-wide modifiers --
  it("customer with 3 years → loyalty 20% discount, sword premium 95 G (100 - 20 + 10 + 5)", () => {
    expect(quote([{ type: "sword" }], 3, false).premium).toBe(95);
  });
  it("customer with exactly 2 years (loyalty threshold) → loyalty applies, sword premium 95 G", () => {
    expect(quote([{ type: "sword" }], 2, false).premium).toBe(95);
  });
  it("customer with 1 year (below loyalty threshold) → no loyalty, sword premium 115 G", () => {
    expect(quote([{ type: "sword" }], 1, false).premium).toBe(115);
  });
  it("follow-up contract (second quote) → 15% discount applies to policy base", () => {
    expect(quote([{ type: "sword" }], 3, true).premium).toBe(80);
  });

  // -- multi-item: item-specific vs policy-wide modifier scope --
  it(
    "cursed sword + plain amulet (0 years, first contract) → premium 231 G " +
      "(160 policy base + 50 curse on item + 16 first insurance on policy base + 5 fee)",
    () => {
      expect(
        quote([{ type: "sword", cursed: true }, { type: "amulet" }], 0, false).premium,
      ).toBe(231);
    },
  );

  // -- insurance sum and cap --
  it("two swords → insurance sum 2000, cap 4000", () => {
    const result = quote([{ type: "sword" }, { type: "sword" }], 0, false);
    expect(result.insuranceSum).toBe(2000);
    expect(result.cap).toBe(4000);
  });
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const result = quote([{ type: "sword" }, { type: "amulet" }], 0, false);
    expect(result.insuranceSum).toBe(1600);
    expect(result.cap).toBe(3200);
  });
  it("sword + three runes (block) → insurance sum 1750 (block discount affects premium only, not sum)", () => {
    const result = quote(
      [
        { type: "sword" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ],
      0,
      false,
    );
    expect(result.insuranceSum).toBe(1750);
  });
  it("cursed sword alone → insurance sum 1000, cap 2000 (cap based on unmodified insurance value)", () => {
    const result = quote([{ type: "sword", cursed: true }], 0, false);
    expect(result.insuranceSum).toBe(1000);
    expect(result.cap).toBe(2000);
  });
});
