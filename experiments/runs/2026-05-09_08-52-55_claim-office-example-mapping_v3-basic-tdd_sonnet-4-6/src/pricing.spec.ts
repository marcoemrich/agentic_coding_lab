import { describe, it, expect } from "vitest";
import { computeQuote } from "./pricing.js";
import type { ItemInput, Customer } from "./types.js";

const newcomer: Customer = { yearsWithMHPCO: 0 };
const loyalCustomer: Customer = { yearsWithMHPCO: 2 };
const veteranCustomer: Customer = { yearsWithMHPCO: 3 };

describe("base premiums", () => {
  it("sword: 100 G base + 5 fee + 10% first = 115 G", () => {
    const items: ItemInput[] = [{ type: "sword" }];
    expect(computeQuote(items, newcomer, true)).toBe(115);
  });

  it("amulet: 60 G base + 10% first + 5 fee = 71 G", () => {
    const items: ItemInput[] = [{ type: "amulet" }];
    expect(computeQuote(items, newcomer, true)).toBe(71);
  });

  it("staff: 80 G base + 10% first + 5 fee = 93 G", () => {
    const items: ItemInput[] = [{ type: "staff" }];
    expect(computeQuote(items, newcomer, true)).toBe(93);
  });

  it("potion: 40 G base + 10% first + 5 fee = 49 G", () => {
    const items: ItemInput[] = [{ type: "potion" }];
    expect(computeQuote(items, newcomer, true)).toBe(49);
  });

  it("single rune: 25 G base + 10% first + 5 fee = 33 G", () => {
    const items: ItemInput[] = [{ type: "rune" }];
    expect(computeQuote(items, newcomer, true)).toBe(33);
    // 25 + 2.5 + 5 = 32.5 → ceil = 33
  });

  it("single moonstone: 25 G base + 10% first + 5 fee = 33 G", () => {
    const items: ItemInput[] = [{ type: "moonstone" }];
    expect(computeQuote(items, newcomer, true)).toBe(33);
  });
});

describe("component block pricing", () => {
  it("2 runes → 50 G base premium (no block)", () => {
    // base = 50, first insurance = +5, fee = 5 → 60
    const items: ItemInput[] = [{ type: "rune" }, { type: "rune" }];
    expect(computeQuote(items, newcomer, true)).toBe(60);
    // 50 + 10% of 50 + 5 = 50 + 5 + 5 = 60
  });

  it("3 runes → 60 G base premium (block applies)", () => {
    // base = 60 (block), first insurance = +6, fee = 5 → 71
    const items: ItemInput[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(computeQuote(items, newcomer, true)).toBe(71);
    // 60 + 10% of 60 + 5 = 60 + 6 + 5 = 71
  });

  it("4 runes → 100 G base premium (no block)", () => {
    // base = 100, first = +10, fee = 5 → 115
    const items: ItemInput[] = [
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }
    ];
    expect(computeQuote(items, newcomer, true)).toBe(115);
  });

  it("7 runes → 175 G base premium", () => {
    // base = 175, first = +17.5, fee = 5 → 197.5 → ceil = 198
    const items: ItemInput[] = Array(7).fill({ type: "rune" });
    expect(computeQuote(items, newcomer, true)).toBe(198);
  });

  it("2 runes + 1 moonstone → 75 G base premium (different types, no block)", () => {
    // base = 75, first = +7.5, fee = 5 → 87.5 → ceil = 88
    const items: ItemInput[] = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(computeQuote(items, newcomer, true)).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // base = 120, first = +12, fee = 5 → 137
    const items: ItemInput[] = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(computeQuote(items, newcomer, true)).toBe(137);
  });
});

describe("item-specific modifiers", () => {
  it("cursed sword: base 100 + curse 50 + first 10 + fee 5 = 165 G", () => {
    const items: ItemInput[] = [{ type: "sword", cursed: true }];
    expect(computeQuote(items, newcomer, true)).toBe(165);
  });

  it("enchantment 5 sword: base 100 + high-enchant 30 + first 10 + fee 5 = 145 G", () => {
    const items: ItemInput[] = [{ type: "sword", enchantment: 5 }];
    expect(computeQuote(items, newcomer, true)).toBe(145);
  });

  it("enchantment 4 sword: no high-enchantment surcharge", () => {
    const items: ItemInput[] = [{ type: "sword", enchantment: 4 }];
    expect(computeQuote(items, newcomer, true)).toBe(115);
    // same as no enchantment: 100 + 10 + 5 = 115
  });

  it("cursed + enchantment 5 sword: base 100 + curse 50 + high-enchant 30 + first 10 + fee 5 = 195 G", () => {
    const items: ItemInput[] = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(computeQuote(items, newcomer, true)).toBe(195);
  });
});

describe("policy-wide modifiers", () => {
  it("loyalty discount: customer with exactly 2 years", () => {
    // sword: base 100, first +10, loyalty -20, fee +5 = 95 G
    const items: ItemInput[] = [{ type: "sword" }];
    expect(computeQuote(items, loyalCustomer, true)).toBe(95);
  });

  it("no loyalty discount for customer with 1 year", () => {
    const items: ItemInput[] = [{ type: "sword" }];
    expect(computeQuote(items, { yearsWithMHPCO: 1 }, true)).toBe(115);
  });

  it("follow-up contract discount: -15% on subsequent quotes", () => {
    // sword: base 100, first +10, follow-up -15, fee +5 = 100 G
    const items: ItemInput[] = [{ type: "sword" }];
    expect(computeQuote(items, newcomer, false)).toBe(100);
  });

  it("loyalty + follow-up for veteran customer on second contract", () => {
    // sword: base 100, first +10, loyalty -20, follow-up -15, fee = 80 G
    const items: ItemInput[] = [{ type: "sword" }];
    expect(computeQuote(items, veteranCustomer, false)).toBe(80);
  });
});

describe("multi-item policy modifier scope", () => {
  it("cursed sword + plain amulet: cursed surcharge on sword only, policy-wide on total base", () => {
    // policy base = 160, item surcharge: +50 (cursed sword)
    // first insurance: +16 (10% of 160), fee: +5
    // total = 160 + 50 + 16 + 5 = 231 G
    const items: ItemInput[] = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(computeQuote(items, newcomer, true)).toBe(231);
  });
});

describe("integration examples", () => {
  it("newcomer with a cursed sword: 165 G", () => {
    const items: ItemInput[] = [{ type: "sword", cursed: true }];
    expect(computeQuote(items, newcomer, true)).toBe(165);
  });

  it("long-standing customer second contract, cursed enchanted sword: 160 G", () => {
    const items: ItemInput[] = [{ type: "sword", cursed: true, enchantment: 7 }];
    expect(computeQuote(items, veteranCustomer, false)).toBe(160);
    // 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
  });
});

describe("rounding in MHPCO's favor", () => {
  it("premium yielding 197.5 G rounds up to 198 G", () => {
    // 7 runes: base 175, first +17.5, fee +5 = 197.5 → 198
    const items: ItemInput[] = Array(7).fill({ type: "rune" });
    expect(computeQuote(items, newcomer, true)).toBe(198);
  });
});

describe("edge cases", () => {
  it("empty item list → 5 G (only processing fee)", () => {
    expect(computeQuote([], newcomer, true)).toBe(5);
  });

  it("unknown item type → throws error", () => {
    const items: ItemInput[] = [{ type: "broomstick" }];
    expect(() => computeQuote(items, newcomer, true)).toThrow();
  });
});
