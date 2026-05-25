import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote", () => {
  // Simplest case
  it("empty item list returns 5 G (processing fee only)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [], contractIndex: 0 })).toBe(5);
  });

  // Single-item base premiums for a 0-year customer's 1st contract with no extras:
  // premium = base + 10% first insurance (on policy base) + 5 G fee
  it("single sword (no modifiers, newcomer 1st contract) returns 115 G (100 base + 10 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword" }], contractIndex: 0 })).toBe(115);
  });
  it("single amulet (no modifiers, newcomer 1st contract) returns 71 G (60 base + 6 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "amulet" }], contractIndex: 0 })).toBe(71);
  });
  it("single staff (no modifiers, newcomer 1st contract) returns 93 G (80 base + 8 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "staff" }], contractIndex: 0 })).toBe(93);
  });
  it("single potion (no modifiers, newcomer 1st contract) returns 49 G (40 base + 4 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "potion" }], contractIndex: 0 })).toBe(49);
  });

  // Components and the building block of 3 alike components
  it("1 rune (newcomer 1st) returns 33 G (25 base + 2.5 first = 27.5 + 5 fee = 32.5 -> 33)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }], contractIndex: 0 })).toBe(33);
  });
  it("2 runes (newcomer 1st) returns 60 G (50 base + 5 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }], contractIndex: 0 })).toBe(60);
  });
  it("3 runes (block applies, newcomer 1st) returns 71 G (60 block base + 6 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }], contractIndex: 0 })).toBe(71);
  });
  it("4 runes (no block, newcomer 1st) returns 115 G (100 base + 10 first + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: Array(4).fill({ type: "rune" }), contractIndex: 0 })).toBe(115);
  });
  it("7 runes (newcomer 1st) returns 198 G (175 base + 17.5 first + 5 fee = 197.5 -> 198)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: Array(7).fill({ type: "rune" }), contractIndex: 0 })).toBe(198);
  });

  // "Alike" components clarification: same type only
  it("2 runes + 1 moonstone (newcomer 1st) returns 88 G (75 base + 7.5 first + 5 fee = 87.5 -> 88)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      contractIndex: 0,
    })).toBe(88);
  });
  it("3 runes + 3 moonstones (newcomer 1st) returns 137 G (120 base + 12 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      contractIndex: 0,
    })).toBe(137);
  });

  // Modifier scope on multi-item policies
  // Spec: 160 base + 50 cursed = 210 G before further modifiers and fee
  // Newcomer 1st: + 16 first (10% of 160) + 5 fee = 231 G
  it("cursed sword + plain amulet (newcomer 1st contract) returns 231 G (160 base + 50 cursed + 16 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", cursed: true }, { type: "amulet" }],
      contractIndex: 0,
    })).toBe(231);
  });

  // Modifier thresholds
  it("sword with exactly enchantment 5 (newcomer 1st) returns 145 G (100 + 30 high + 10 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", enchantment: 5 }],
      contractIndex: 0,
    })).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 (newcomer 1st) returns 195 G (100 + 50 cursed + 30 high + 10 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", enchantment: 5, cursed: true }],
      contractIndex: 0,
    })).toBe(195);
  });
  it("sword with enchantment 4 not cursed (newcomer 1st) returns 115 G (no high-ench, 100 + 10 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", enchantment: 4 }],
      contractIndex: 0,
    })).toBe(115);
  });

  // Loyalty exactly 2 years
  it("long-standing customer (2 years), 1st contract, single sword returns 95 G (100 base - 20 loyalty + 10 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 2 },
      items: [{ type: "sword" }],
      contractIndex: 0,
    })).toBe(95);
  });

  // Newcomer with a cursed sword integration example: 165 G
  it("newcomer with cursed sword (steel, ench 3) returns 165 G (100 + 50 cursed + 10 first + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      contractIndex: 0,
    })).toBe(165);
  });

  // Long-standing 2nd contract integration example: 160 G
  it("long-standing customer (3 years), 2nd contract, cursed sword ench 7 returns 160 G (100 + 50 cursed + 30 high - 20 loyalty + 10 first - 15 follow-up + 5 fee)", () => {
    expect(quote({
      customer: { yearsWithMHPCO: 3 },
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      contractIndex: 1,
    })).toBe(160);
  });

  // Rounding in MHPCO's favor (already verified by 7 runes / 2 runes + moonstone)
  it("intermediate fractional amounts are kept as fractions; only final premium is rounded (7 runes -> 198)", () => {
    // 7 runes: base 175, first ins 17.5, fee 5 -> 197.5 -> ceil 198. Intermediate fraction preserved.
    expect(quote({
      customer: { yearsWithMHPCO: 0 },
      items: Array(7).fill({ type: "rune" }),
      contractIndex: 0,
    })).toBe(198);
  });

  // Unknown item type
  it("quote with unknown item type throws an error", () => {
    expect(() => quote({
      customer: { yearsWithMHPCO: 0 },
      items: [{ type: "broomstick" }],
      contractIndex: 0,
    })).toThrow();
  });
});
