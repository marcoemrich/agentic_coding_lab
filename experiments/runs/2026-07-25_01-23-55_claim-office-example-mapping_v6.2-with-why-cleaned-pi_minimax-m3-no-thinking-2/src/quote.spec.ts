import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote", () => {
  it("returns 5 G (only processing fee) for empty item list", () => {
    expect(quote([], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 5, insuranceSum: 0 });
  });
  it("single sword (no modifiers, first contract): insurance sum 1000 G, premium 115 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 115, insuranceSum: 1000 });
  });
  it("single amulet (no modifiers, first contract): insurance sum 600 G, premium 71 G", () => {
    expect(quote([{ type: "amulet" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 71, insuranceSum: 600 });
  });
  it("single staff (no modifiers, first contract): insurance sum 800 G, premium 93 G", () => {
    expect(quote([{ type: "staff" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 93, insuranceSum: 800 });
  });
  it("single potion (no modifiers, first contract): insurance sum 400 G, premium 49 G", () => {
    expect(quote([{ type: "potion" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 49, insuranceSum: 400 });
  });
  it("single rune (first contract): insurance sum 250 G, premium 33 G (25 + 2.5 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 33, insuranceSum: 250 });
  });
  it("two runes (first contract): insurance sum 500 G, premium 60 G (50 + 5 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 60, insuranceSum: 500 });
  });
  it("three runes (first contract): insurance sum 750 G, premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 71, insuranceSum: 750 });
  });
  it("four runes (first contract): insurance sum 1000 G, premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 115, insuranceSum: 1000 });
  });
  it("seven runes (first contract): insurance sum 1750 G, premium 198 G (175 + 17.5 first insurance + 5 fee, rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(items, { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 198, insuranceSum: 1750 });
  });
  it("single moonstone (first contract): insurance sum 250 G, premium 33 G (25 + 2.5 first insurance + 5 fee)", () => {
    expect(quote([{ type: "moonstone" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 33, insuranceSum: 250 });
  });
  it("two runes + one moonstone (first contract): insurance sum 750 G, premium 88 G (75 + 7.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 88, insuranceSum: 750 });
  });
  it("three runes + three moonstones (first contract): insurance sum 1500 G, premium 137 G (120 + 12 first insurance + 5 fee)", () => {
    expect(quote(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }],
      { yearsWithMHPCO: 0 },
      1,
    )).toEqual({ premium: 137, insuranceSum: 1500 });
  });
  it("cursed sword (first contract, no loyalty): premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 165, insuranceSum: 1000 });
  });
  it("sword with enchantment 5 (first contract): premium 145 G (100 base + 30 high-enchantment + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 145, insuranceSum: 1000 });
  });
  it("sword with enchantment 4 (first contract): premium 115 G (no high-enchantment surcharge; same as plain sword)", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0 }, 1)).toEqual({ premium: 115, insuranceSum: 1000 });
  });
  it("sword for customer with exactly 2 years (first contract): premium 95 G (100 base − 20 loyalty + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2 }, 1)).toEqual({ premium: 95, insuranceSum: 1000 });
  });
  it("sword for customer with 1 year (first contract): premium 115 G (no loyalty discount)", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 1 }, 1)).toEqual({ premium: 115, insuranceSum: 1000 });
  });
  it("sword for newcomer (0 years) on second contract: premium 100 G (100 base + 10 first insurance − 15 follow-up + 5 fee)", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0 }, 2)).toEqual({ premium: 100, insuranceSum: 1000 });
  });
  it("multi-item: cursed sword + plain amulet (newcomer, first contract): premium 231 G (210 item-total + 16 first insurance + 5 fee)", () => {
    expect(quote(
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      { yearsWithMHPCO: 0 },
      1,
    )).toEqual({ premium: 231, insuranceSum: 1600 });
  });
  it("integration: long-standing customer (3 years, second contract) with cursed sword (enchantment 7) → premium 160 G", () => {
    expect(quote(
      [{ type: "sword", cursed: true, enchantment: 7 }],
      { yearsWithMHPCO: 3 },
      2,
    )).toEqual({ premium: 160, insuranceSum: 1000 });
  });
  it("throws on unknown item type", () => {
    expect(() => quote([{ type: "broomstick" }], { yearsWithMHPCO: 0 }, 1)).toThrow();
  });
});
