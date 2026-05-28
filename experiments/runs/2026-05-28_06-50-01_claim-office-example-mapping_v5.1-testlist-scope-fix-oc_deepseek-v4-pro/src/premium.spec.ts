import { describe, it, expect } from "vitest";
import { calculatePremium } from "./premium.js";

describe("Premium Calculation", () => {
  it("empty item list → premium 5 G (processing fee only)", () => {
    expect(calculatePremium([], 0, 0)).toBe(5);
  });
  it("single sword, new customer (0 years, first contract) → 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword" }], 0, 0)).toBe(115);
  });
  it("single amulet, new customer → 71 G (60 + 6 + 5)", () => {
    expect(calculatePremium([{ type: "amulet" }], 0, 0)).toBe(71);
  });
  it("single staff, new customer → 93 G (80 + 8 + 5)", () => {
    expect(calculatePremium([{ type: "staff" }], 0, 0)).toBe(93);
  });
  it("single potion, new customer → 49 G (40 + 4 + 5)", () => {
    expect(calculatePremium([{ type: "potion" }], 0, 0)).toBe(49);
  });
  it("single rune, new customer → 33 G (25 + 2.5 + 5 → ceil 33)", () => {
    expect(calculatePremium([{ type: "rune" }], 0, 0)).toBe(33);
  });
  it("single moonstone, new customer → 33 G (25 + 2.5 + 5 → ceil 33)", () => {
    expect(calculatePremium([{ type: "moonstone" }], 0, 0)).toBe(33);
  });
  it("2 runes (no block) → 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "rune" }, { type: "rune" }], 0, 0)).toBe(60);
  });
  it("3 runes (block applies) → 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, 0)).toBe(71);
  });
  it("4 runes (no block, block requires exactly 3) → 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0, 0)).toBe(115);
  });
  it("7 runes → 198 G (175 base + 17.5 first-insurance + 5 = 197.5 → ceil 198)", () => {
    const items = Array(7).fill({ type: "rune" });
    expect(calculatePremium(items, 0, 0)).toBe(198);
  });
  it("2 runes + 1 moonstone (no block, different types) → 88 G (75 base + 7.5 first-insurance + 5 = 87.5 → ceil 88)", () => {
    expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, 0)).toBe(88);
  });
  it("3 runes + 3 moonstones (two separate blocks) → 137 G (120 base + 12 first-insurance + 5)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(calculatePremium(items, 0, 0)).toBe(137);
  });
  it("cursed sword, new customer → 165 G (100 base + 50 curse + 10 first-insurance + 5)", () => {
    expect(calculatePremium([{ type: "sword", cursed: true }], 0, 0)).toBe(165);
  });
  it("sword enchantment 5 (high enchantment), new customer → 145 G (100 base + 30 enchant + 10 first-insurance + 5)", () => {
    expect(calculatePremium([{ type: "sword", enchantment: 5 }], 0, 0)).toBe(145);
  });
  it("sword enchantment 4 (no high enchantment), not cursed, new customer → 115 G", () => {
    expect(calculatePremium([{ type: "sword", enchantment: 4 }], 0, 0)).toBe(115);
  });
  it("cursed sword enchantment 7, new customer → 195 G (100 base + 50 curse + 30 enchant + 10 first-insurance + 5)", () => {
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 7 }], 0, 0)).toBe(195);
  });
  it("cursed sword + plain amulet, new customer → 231 G (160 base + 50 curse + 16 first-insurance + 5)", () => {
    expect(calculatePremium([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ], 0, 0)).toBe(231);
  });
  it("long-standing customer (exactly 2 years), single sword, first contract → 95 G (100 base - 20 loyalty + 10 first-insurance + 5)", () => {
    expect(calculatePremium([{ type: "sword" }], 2, 0)).toBe(95);
  });
  it("long-standing customer (3 years), single sword, first contract → 95 G", () => {
    expect(calculatePremium([{ type: "sword" }], 3, 0)).toBe(95);
  });
  it("follow-up contract (second quote), single sword, 0 years → 100 G (100 base + 10 first-insurance - 15 follow-up + 5)", () => {
    expect(calculatePremium([{ type: "sword" }], 0, 1)).toBe(100);
  });
  it("long-standing customer (3 years), second contract, cursed sword enchantment 7 → 160 G (integration example)", () => {
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 7 }], 3, 1)).toBe(160);
  });
  it("premium rounding up: intermediate fraction kept, final rounds up → e.g. 197.5 G → 198 G (verified via 7 runes)", () => {
    const items = Array(7).fill({ type: "rune" });
    expect(calculatePremium(items, 0, 0)).toBe(198);
  });
});