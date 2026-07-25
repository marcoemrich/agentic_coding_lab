import { describe, it, expect } from "vitest";
import { computeQuote } from "./quote.js";

describe("Quote", () => {
  // --- Edge cases: simplest first ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, []);
    expect(result.premium).toBe(5);
  });

  // --- Base premiums for main items (isolation) ---
  it("single sword, no modifiers, first quote -> base 100 G + 10% first insurance = 110 + 5 fee = 115 G", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
    expect(result.premium).toBe(115);
  });
  it("single amulet, no modifiers, first quote -> base 60 G + 10% first insurance = 66 + 5 fee = 71 G", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }]);
    expect(result.premium).toBe(71);
  });
  it("single staff, no modifiers, first quote -> base 80 G + 10% first insurance = 88 + 5 fee = 93 G", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [{ type: "staff" }]);
    expect(result.premium).toBe(93);
  });
  it("single potion, no modifiers, first quote -> base 40 G + 10% first insurance = 44 + 5 fee = 49 G", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [{ type: "potion" }]);
    expect(result.premium).toBe(49);
  });

  // --- Building block of 3 alike components ---
  it("2 runes -> base premium 50 G (no block) -> final premium 60 G (50*1.1=55, +5 fee)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(60);
  });
  it("3 runes -> base premium 60 G (block applies) -> final premium 71 G (60*1.1=66, +5 fee)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(71);
  });
  it("4 runes -> base premium 100 G (no block, requires exactly 3) -> final premium 115 G (100*1.1=110, +5 fee)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(115);
  });
  it("7 runes -> base premium 175 G -> final premium 198 G (175*1.1=192.5, +5 fee=197.5, rounded up)", () => {
    const result = computeQuote(
      { yearsWithMHPCO: 0 },
      Array.from({ length: 7 }, () => ({ type: "rune" }))
    );
    expect(result.premium).toBe(198);
  });

  // --- "Alike" components: same type required for block ---
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types) -> final premium 88 G (75*1.1=82.5, +5=87.5, rounded up)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ]);
    expect(result.premium).toBe(88);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks) -> final premium 137 G (120*1.1=132, +5=137)", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ]);
    expect(result.premium).toBe(137);
  });

  // --- Modifier scope on multi-item policies ---
  it(
    "policy with cursed sword (100 G) + plain amulet (60 G) -> item-specific curse surcharge (50 G) applies only to cursed sword's base premium; policy base 160 + 50 curse + 16 first-insurance(10% of 160) = 226, +5 fee = 231 G",
    () => {
      const result = computeQuote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]);
      expect(result.premium).toBe(231);
    }
  );

  // --- Modifier thresholds ---
  it("customer with exactly 2 years with MHPCO -> loyalty discount (20%) applies: sword base 100, +10 first insurance -20 loyalty = 90, +5 fee = 95", () => {
    const result = computeQuote({ yearsWithMHPCO: 2 }, [{ type: "sword" }]);
    expect(result.premium).toBe(95);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge (30%) applies: base 100 +30 ench +10 first ins =140, +5 fee=145", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "sword", enchantment: 5 },
    ]);
    expect(result.premium).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 -> both curse (50%) and high-enchantment (30%) surcharges apply: base 100 +50 curse +30 ench +10 first ins=190, +5 fee=195", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "sword", cursed: true, enchantment: 5 },
    ]);
    expect(result.premium).toBe(195);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge: base 100 +10 first ins=110, +5 fee=115", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "sword", enchantment: 4 },
    ]);
    expect(result.premium).toBe(115);
  });
  it("cursed sword with enchantment 4 -> curse surcharge applies, no high-enchantment surcharge: base 100 +50 curse +10 first ins=160, +5 fee=165", () => {
    const result = computeQuote({ yearsWithMHPCO: 0 }, [
      { type: "sword", cursed: true, enchantment: 4 },
    ]);
    expect(result.premium).toBe(165);
  });

  // --- Rounding in MHPCO's favor ---
  it("premium calculation yielding 197.5 G -> rounds up to 198 G", () => {
    const result = computeQuote(
      { yearsWithMHPCO: 0 },
      Array.from({ length: 7 }, () => ({ type: "rune" }))
    );
    expect(result.premium).toBe(198);
  });

  // --- Integration examples ---
  it(
    "newcomer with cursed sword (steel, enchantment 3): 100 base + 50 curse + 10 first insurance = 160 -> +5 fee = 165 G",
    () => {
      const result = computeQuote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]);
      expect(result.premium).toBe(165);
    }
  );
  it(
    "long-standing customer's (3 years) second quote with cursed sword (steel, enchantment 7): " +
      "100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 -> +5 fee = 160 G " +
      "(first insurance surcharge still applies per item, regardless of customer history)",
    () => {
      const result = computeQuote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1
      );
      expect(result.premium).toBe(160);
    }
  );

  // --- Error case ---
  it("quote includes an item with unknown type (e.g. broomstick) -> throws an error", () => {
    expect(() =>
      computeQuote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])
    ).toThrow();
  });
});
