import { describe, expect, it } from "vitest";
import { quote } from "./quote.js";

describe("MHPCO premium quotation", () => {
  const NEWCOMER = { yearsWithMHPCO: 0 };
  const FIRST_CONTRACT = 0;
  const itemsOfType = (type: string, count: number) =>
    Array.from({ length: count }, () => ({ type }));
  const sword = (
    traits: { cursed?: boolean; enchantment?: number; material?: string } = {},
  ) => ({
    type: "sword",
    ...traits,
  });
  const runes = (count: number) => itemsOfType("rune", count);
  const moonstones = (count: number) => itemsOfType("moonstone", count);

  // --- Processing fee and single-item base premiums ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote(NEWCOMER, [], FIRST_CONTRACT)).toBe(5);
  });
  it("quotes a plain sword for a customer with 0 years, first contract -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [sword()], FIRST_CONTRACT)).toBe(115);
  });
  it("quotes a plain amulet for a customer with 0 years, first contract -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "amulet" }], FIRST_CONTRACT)).toBe(71);
  });
  it("quotes a plain staff for a customer with 0 years, first contract -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "staff" }], FIRST_CONTRACT)).toBe(93);
  });
  it("quotes a plain potion for a customer with 0 years, first contract -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote(NEWCOMER, [{ type: "potion" }], FIRST_CONTRACT)).toBe(49);
  });
  it("quotes a single rune -- base premium 25 G, premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    expect(quote(NEWCOMER, runes(1), FIRST_CONTRACT)).toBe(33);
  });
  it("quotes a single moonstone -- base premium 25 G, premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    expect(quote(NEWCOMER, moonstones(1), FIRST_CONTRACT)).toBe(33);
  });

  // --- Component building blocks ---
  it("quotes 2 runes -- base premium 50 G (no block), premium 60 G", () => {
    expect(quote(NEWCOMER, runes(2), FIRST_CONTRACT)).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies), premium 71 G", () => {
    expect(quote(NEWCOMER, runes(3), FIRST_CONTRACT)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3), premium 115 G", () => {
    expect(quote(NEWCOMER, runes(4), FIRST_CONTRACT)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block at 7), premium 198 G", () => {
    expect(quote(NEWCOMER, runes(7), FIRST_CONTRACT)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: alike means same type), premium 88 G", () => {
    expect(
      quote(NEWCOMER, [...runes(2), ...moonstones(1)], FIRST_CONTRACT),
    ).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks of alike components), premium 137 G", () => {
    expect(
      quote(NEWCOMER, [...runes(3), ...moonstones(3)], FIRST_CONTRACT),
    ).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("quotes a cursed sword -- adds a 50 G curse surcharge to the item base premium, premium 165 G", () => {
    expect(
      quote(NEWCOMER, [sword({ cursed: true })], FIRST_CONTRACT),
    ).toBe(165);
  });
  it("quotes a sword with enchantment 5 -- adds a 30 G high-enchantment surcharge (threshold is inclusive), premium 145 G", () => {
    expect(
      quote(NEWCOMER, [sword({ enchantment: 5 })], FIRST_CONTRACT),
    ).toBe(145);
  });
  it("quotes a sword with enchantment 4 -- no high-enchantment surcharge, premium 115 G", () => {
    expect(
      quote(NEWCOMER, [sword({ enchantment: 4 })], FIRST_CONTRACT),
    ).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 -- both surcharges apply (50 G + 30 G), premium 195 G", () => {
    expect(
      quote(NEWCOMER, [sword({ cursed: true, enchantment: 5 })], FIRST_CONTRACT),
    ).toBe(195);
  });

  // --- Policy-wide modifiers ---
  it("quotes a sword for a customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies, premium 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [sword()], FIRST_CONTRACT)).toBe(95);
  });
  it("quotes a sword for a customer with 1 year with MHPCO -- no loyalty discount, premium 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [sword()], FIRST_CONTRACT)).toBe(115);
  });
  it("applies the 10 % first insurance surcharge to every quote regardless of customer history -- 3-year customer's sword: 100 + 10 - 20 + 5 = 95 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [sword()], FIRST_CONTRACT)).toBe(95);
  });
  it("applies a 15 % follow-up discount on the customer's second quote -- 3-year customer, cursed sword enchantment 7: premium 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [sword({ cursed: true, enchantment: 7 })], 1),
    ).toBe(160);
  });
  it("applies the 15 % follow-up discount on the third quote as well -- 3-year customer, plain sword: 100 + 10 - 20 - 15 + 5 = 80 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [sword()], 2)).toBe(80);
  });

  // --- Modifier scope on multi-item policies ---
  it("quotes a cursed sword plus a plain amulet -- policy base 160 G, curse surcharge 50 G (50 % of the cursed item only) = 210 G, plus 16 G first insurance and 5 G fee = 231 G", () => {
    expect(
      quote(
        NEWCOMER,
        [sword({ cursed: true }), { type: "amulet" }],
        FIRST_CONTRACT,
      ),
    ).toBe(231);
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in MHPCO's favor) -- 7 runes yield 175 + 17.5 + 5 = 197.5", () => {
    expect(quote(NEWCOMER, runes(7), FIRST_CONTRACT)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 1 rune, 2-year customer, follow-up contract: 25 + 2.5 - 5 - 3.75 + 5 = 23.75 -> 24 G (rounding each modifier in MHPCO's favor first would give 25)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, runes(1), 1)).toBe(24);
  });

  // --- Integration examples ---
  it("integration: newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 -- premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quote(
        NEWCOMER,
        [sword({ material: "steel", enchantment: 3, cursed: true })],
        FIRST_CONTRACT,
      ),
    ).toBe(165);
  });
  it("integration: 3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [sword({ material: "steel", enchantment: 7, cursed: true })],
        1,
      ),
    ).toBe(160);
  });
});
