import { describe, it, expect } from "vitest";
import { computeQuote } from "./quote.js";

describe("Quote - Item values and base premiums", () => {
  it("should compute empty policy: premium 5 G (only fee), insurance sum 0", () => {
    const result = computeQuote({
      items: [],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(5);
    expect(result.insuranceSum).toBe(0);
  });

  it("should compute single sword base: premium 115 G (100 base + 10 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(115);
    expect(result.insuranceSum).toBe(1000);
  });

  it("should compute single amulet base: premium 71 G (60 base + 6 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(71);
    expect(result.insuranceSum).toBe(600);
  });

  it("should compute single staff base: premium 93 G (80 base + 8 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(93);
    expect(result.insuranceSum).toBe(800);
  });

  it("should compute single potion base: premium 49 G (40 base + 4 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "potion" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(49);
    expect(result.insuranceSum).toBe(400);
  });

  it("should compute single rune base: premium 33 G (25 + 2.5 first ins + 5 fee, rounded up)", () => {
    const result = computeQuote({
      items: [{ type: "rune" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(33);
    expect(result.insuranceSum).toBe(250);
  });

  it("should compute single moonstone base: premium 33 G (25 + 2.5 first ins + 5 fee, rounded up)", () => {
    const result = computeQuote({
      items: [{ type: "moonstone" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(33);
    expect(result.insuranceSum).toBe(250);
  });
});

describe("Quote - Component blocks", () => {
  it("should compute 2 runes: premium 60 G (50 base + 5 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "rune" }, { type: "rune" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(60);
    expect(result.insuranceSum).toBe(500);
  });

  it("should compute 3 runes: premium 71 G (60 base block + 6 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(71);
    expect(result.insuranceSum).toBe(750);
  });

  it("should compute 4 runes: premium 115 G (100 base + 10 first ins + 5 fee, no block)", () => {
    const result = computeQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(115);
    expect(result.insuranceSum).toBe(1000);
  });

  it("should compute 7 runes: premium 198 G (175 base + 17.5 first ins + 5 fee, ceil 197.5)", () => {
    const result = computeQuote({
      items: Array(7).fill({ type: "rune" }),
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(198);
    expect(result.insuranceSum).toBe(1750);
  });

  it("should compute 2 runes + 1 moonstone: premium 88 G (75 base + 7.5 first ins + 5 fee, ceil 87.5)", () => {
    const result = computeQuote({
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(88);
    expect(result.insuranceSum).toBe(750);
  });

  it("should compute 3 runes + 3 moonstones: premium 137 G (120 base + 12 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(137);
    expect(result.insuranceSum).toBe(1500);
  });
});

describe("Quote - Item-specific modifiers (cursed, high enchantment)", () => {
  it("should add 50% curse surcharge to cursed sword: premium 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", cursed: true }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(165);
  });

  it("should add 30% high enchantment surcharge to sword with enchantment 5: premium 145 G (100 + 30 + 10 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", enchantment: 5 }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(145);
  });

  it("should NOT add high enchantment surcharge to sword with enchantment 4: premium 115 G (no enchantment modifier)", () => {
    const result = computeQuote({
      items: [{ type: "sword", enchantment: 4 }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(115);
  });

  it("should apply both surcharges to cursed sword with enchantment 5: premium 195 G (100 + 50 curse + 30 high ench + 10 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", enchantment: 5, cursed: true }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(195);
  });

  it("should apply curse only on affected item (50% of sword base, not policy base): premium 275 G for cursed sword + plain sword (200 base + 50 curse + 20 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", cursed: true }, { type: "sword" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(275);
  });

  it("should compute cursed sword + plain amulet (0 years, 1st contract): premium 231 G (160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", cursed: true }, { type: "amulet" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(231);
  });
});

describe("Quote - Policy-wide modifiers (loyalty, first insurance, follow-up)", () => {
  it("should apply loyalty discount for customer with exactly 2 years: single sword premium 95 G (100 base - 20 loyalty + 10 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword" }],
      customerYears: 2,
      contractIndex: 0,
    });
    expect(result.premium).toBe(95);
  });

  it("should NOT apply loyalty discount for customer with 1 year: single sword premium 115 G", () => {
    const result = computeQuote({
      items: [{ type: "sword" }],
      customerYears: 1,
      contractIndex: 0,
    });
    expect(result.premium).toBe(115);
  });

  it("should apply first insurance surcharge on every quote: two swords premium 225 G (200 base + 20 first ins + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword" }, { type: "sword" }],
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(225);
  });

  it("should apply follow-up discount on 2nd contract: cursed sword (steel, enchant 7) for 3-year customer premium 160 G (100 + 50 curse + 30 high ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee)", () => {
    const result = computeQuote({
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      customerYears: 3,
      contractIndex: 1,
    });
    expect(result.premium).toBe(160);
  });

  it("should NOT apply follow-up discount on 1st contract: sword premium 95 G (100 base - 20 loyalty + 10 first ins + 5 fee, 2-year customer, contract 0)", () => {
    const result = computeQuote({
      items: [{ type: "sword" }],
      customerYears: 2,
      contractIndex: 0,
    });
    expect(result.premium).toBe(95);
  });
});

describe("Quote - Rounding in MHPCO's favor", () => {
  it("should round premium up to whole G (7 runes -> 198 G from 197.5)", () => {
    const result = computeQuote({
      items: Array(7).fill({ type: "rune" }),
      customerYears: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(198);
  });
});

describe("Quote - Error cases", () => {
  it("should reject quote with unknown item type", () => {
    expect(() =>
      computeQuote({
        items: [{ type: "broomstick" as any }],
        customerYears: 0,
        contractIndex: 0,
      })
    ).toThrow();
  });
});
