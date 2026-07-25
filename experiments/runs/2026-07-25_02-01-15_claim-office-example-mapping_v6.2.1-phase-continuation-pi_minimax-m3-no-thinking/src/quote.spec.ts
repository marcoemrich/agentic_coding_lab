import { describe, it, expect } from "vitest";
import { quotePremium } from "./quote.js";

describe("quotePremium", () => {
  // -- Edge case: empty --
  it("empty item list → premium 5 (only processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 })).toBe(5);
  });

  // -- Main items: base premiums --
  it("plain sword (new customer, no follow-up) → premium 115 (100 + 10 first + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 })).toBe(115);
  });
  it("plain staff (new customer, no follow-up) → premium 93 (80 + 8 first + 5 fee)", () => {
    expect(quotePremium([{ type: "staff" }], { yearsWithMHPCO: 0 })).toBe(93);
  });
  it("plain amulet (new customer, no follow-up) → premium 71 (60 + 6 first + 5 fee)", () => {
    expect(quotePremium([{ type: "amulet" }], { yearsWithMHPCO: 0 })).toBe(71);
  });
  it("plain potion (new customer, no follow-up) → premium 49 (40 + 4 first + 5 fee)", () => {
    expect(quotePremium([{ type: "potion" }], { yearsWithMHPCO: 0 })).toBe(49);
  });

  // -- Components: no block --
  it("one rune (new customer, no follow-up) → premium 33 (25 + 2.5 first + 5 fee = 32.5 → 33, rounding up)", () => {
    expect(quotePremium([{ type: "rune" }], { yearsWithMHPCO: 0 })).toBe(33);
  });
  it("two runes (no block, new customer, no follow-up) → premium 60 (50 + 5 first + 5 fee)", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 })).toBe(60);
  });
  it("four runes (no block, new customer, no follow-up) → premium 115 (100 + 10 first + 5 fee)", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" as const }));
    expect(quotePremium(items, { yearsWithMHPCO: 0 })).toBe(115);
  });
  it("seven runes (no block, new customer, no follow-up) → premium 198 (175 + 17.5 first + 5 fee = 197.5 → 198, rounding up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" as const }));
    expect(quotePremium(items, { yearsWithMHPCO: 0 })).toBe(198);
  });

  // -- Components: with block --
  it("three runes (block, new customer, no follow-up) → premium 73 (60 base + 7.5 first + 5 fee = 72.5 → 73)", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" as const }));
    expect(quotePremium(items, { yearsWithMHPCO: 0 })).toBe(73);
  });
  it("six runes (2 blocks, new customer, no follow-up) → premium 140 (120 base + 15 first + 5 fee)", () => {
    const items = Array.from({ length: 6 }, () => ({ type: "rune" as const }));
    expect(quotePremium(items, { yearsWithMHPCO: 0 })).toBe(140);
  });

  // -- Mixed components --
  it("two runes + one moonstone (no block: different types) → premium 88 (75 base + 7.5 first + 5 fee = 87.5 → 88)", () => {
    expect(quotePremium(
      [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      { yearsWithMHPCO: 0 },
    )).toBe(88);
  });
  it("three runes + three moonstones (two separate blocks) → premium 140 (120 base + 15 first + 5 fee)", () => {
    expect(quotePremium(
      [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      { yearsWithMHPCO: 0 },
    )).toBe(140);
  });

  // -- Item-specific modifiers: enchantment --
  it("sword enchantment 5 (not cursed, new customer, no follow-up) → premium 145 (100 + 30 enchant + 10 first + 5 fee)", () => {
    expect(quotePremium(
      [{ type: "sword", enchantment: 5 }],
      { yearsWithMHPCO: 0 },
    )).toBe(145);
  });
  it("sword enchantment 4 (not cursed, new customer, no follow-up) → premium 115 (no enchant surcharge)", () => {
    expect(quotePremium(
      [{ type: "sword", enchantment: 4 }],
      { yearsWithMHPCO: 0 },
    )).toBe(115);
  });
  it("sword enchantment 5 + cursed (new customer, no follow-up) → premium 195 (100 + 30 enchant + 50 curse + 10 first + 5 fee)", () => {
    expect(quotePremium(
      [{ type: "sword", enchantment: 5, cursed: true }],
      { yearsWithMHPCO: 0 },
    )).toBe(195);
  });

  // -- Item-specific modifiers: curse --
  it("cursed sword + plain amulet (new customer, no follow-up) → premium 231 (160 + 66 + 5 fee)", () => {
    expect(quotePremium(
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      { yearsWithMHPCO: 0 },
    )).toBe(231);
  });

  // -- Customer modifiers --
  it("plain sword, customer with 2 years (no follow-up) → premium 95 (100 + 10 first - 20 loyalty + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("plain sword, follow-up contract, 0 years → premium 100 (100 + 10 first - 15 follow-up + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, { isFollowup: true })).toBe(100);
  });
  it("plain sword, customer with 2 years + follow-up contract → premium 80 (100 + 10 first - 20 loyalty - 15 follow-up + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, { isFollowup: true })).toBe(80);
  });

  // -- Integration examples from spec --
  it("integration: newcomer cursed sword (0y, no follow-up, enchantment 3, steel) → premium 165", () => {
    expect(quotePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 })).toBe(165);
  });
  it("integration: long-standing 2nd contract cursed sword (3y, follow-up, enchantment 7, steel) → premium 160", () => {
    expect(quotePremium([{ type: "sword", cursed: true, enchantment: 7 }], { yearsWithMHPCO: 3 }, { isFollowup: true })).toBe(160);
  });

  // -- Errors --
  it("unknown item type → throws Error", () => {
    expect(() => quotePremium([{ type: "broomstick" }], { yearsWithMHPCO: 0 })).toThrow();
  });
});
