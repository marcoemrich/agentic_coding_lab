import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("Quote", () => {
  // Simplest cases
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [], 0);
    expect(result.premium).toBe(5);
  });

  // Base premiums for main items (first insurance, newcomer, no modifiers)
  it("single sword (newcomer) → base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0);
    expect(result.premium).toBe(115);
  });
  it("single amulet (newcomer) → base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0);
    expect(result.premium).toBe(71);
  });
  it("single staff (newcomer) → base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0);
    expect(result.premium).toBe(93);
  });
  it("single potion (newcomer) → base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0);
    expect(result.premium).toBe(49);
  });

  // Component block-of-3 rules
  it("2 runes → 50 G base premium (no block)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "rune" }, { type: "rune" }],
      0
    );
    // base 50 + 10% first insurance (5) + 5 fee = 60
    expect(result.premium).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      0
    );
    // base 60 (block) + 10% first insurance (6) + 5 fee = 71
    expect(result.premium).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      0
    );
    // base 100 + 10% first insurance (10) + 5 fee = 115
    expect(result.premium).toBe(115);
  });
  it("7 runes → 175 G base premium", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      Array.from({ length: 7 }, () => ({ type: "rune" })),
      0
    );
    // base 175 + 10% first insurance (17.5) = 192.5 + 5 fee = 197.5 -> rounds up to 198
    expect(result.premium).toBe(198);
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      0
    );
    // base 75 + 10% first insurance (7.5) = 82.5 + 5 fee = 87.5 -> rounds up to 88
    expect(result.premium).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ],
      0
    );
    // base 120 (two blocks of 60) + 10% first insurance (12) = 132 + 5 fee = 137
    expect(result.premium).toBe(137);
  });

  // Item-specific modifiers in isolation
  it("cursed sword → curse surcharge is 50% of the cursed item's base premium, not the policy total", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      0
    );
    // policy base 160 (100 sword + 60 amulet); curse surcharge 50 (50% of sword's 100, item-specific)
    // + first insurance 16 (10% of policy base 160, policy-wide) = 160 + 50 + 16 = 226 + 5 fee = 231
    expect(result.premium).toBe(231);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", enchantment: 5 }],
      0
    );
    // policy base 100; enchantment surcharge 30 (30% of base, item-specific)
    // + first insurance 10 (10% of policy base 100, policy-wide) = 100 + 30 + 10 = 140 + 5 fee = 145
    expect(result.premium).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", enchantment: 4 }],
      0
    );
    // base 100, no surcharge, + 10% first insurance (10) = 110 + 5 fee = 115
    expect(result.premium).toBe(115);
  });
  it("sword with exactly enchantment 5 and cursed → both surcharges apply", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", enchantment: 5, cursed: true }],
      0
    );
    // policy base 100; curse 50 + enchantment 30 = 80 item-specific surcharges
    // + first insurance 10 (10% of policy base 100, policy-wide) = 100 + 80 + 10 = 190 + 5 fee = 195
    expect(result.premium).toBe(195);
  });

  // Policy-wide modifiers in isolation
  it("customer with exactly 2 years with MHPCO → loyalty discount applies", () => {
    const result = quote(
      { yearsWithMHPCO: 2 },
      [{ type: "sword" }],
      0
    );
    // base 100 + 10 first insurance - 20 loyalty = 90 + 5 fee = 95
    expect(result.premium).toBe(95);
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const result = quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0);
    // base 100 + 10 first insurance = 110 + 5 fee = 115
    expect(result.premium).toBe(115);
  });
  it("newcomer's first quote → first insurance surcharge applies to policy", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0);
    // base 60 + 6 first insurance = 66 + 5 fee = 71
    expect(result.premium).toBe(71);
  });
  it("customer's second quote in a scenario → follow-up contract discount applies", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 1);
    // base 60 + 6 first insurance - 9 follow-up (15% of 60) = 57 + 5 fee = 62
    expect(result.premium).toBe(62);
  });

  // Modifier scope on multi-item policies
  // (modifier-scope example already covered by the "cursed sword → curse
  // surcharge" test above; rounding example already covered by the
  // "7 runes → 175 G base premium" test above)

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", enchantment: 3, cursed: true }],
      0
    );
    expect(result.premium).toBe(165);
  });
  it(
    "long-standing customer's (3 years) second quote with cursed sword (enchantment 7) → premium 160 G " +
      "(100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee); " +
      "each item in a quote is treated as first insurance regardless of customer history",
    () => {
      const result = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", enchantment: 7, cursed: true }],
        1
      );
      expect(result.premium).toBe(160);
    }
  );

  // Edge case: unknown item type
  it("quote includes an item with an unknown type (e.g. {type: 'broomstick'}) → quote() throws (surfaces as CLI non-zero exit + stderr)", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)
    ).toThrow();
  });
});
