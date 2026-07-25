import { describe, it, expect } from "vitest";
import { computePremium } from "./quote.js";

describe("Quote - Premium Calculation", () => {
  // --- Simplest cases ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, []);
    expect(result).toBe(5);
  });

  // --- Base premiums per item type ---
  it("single sword (no modifiers, newcomer) -> base premium 100 G contributes to total", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "sword" }]);
    // 100 base + 10 first insurance = 110, + 5 fee = 115
    expect(result).toBe(115);
  });
  it("single amulet (no modifiers, newcomer) -> base premium 60 G contributes to total", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "amulet" }]);
    // 60 base + 6 first insurance = 66, + 5 fee = 71
    expect(result).toBe(71);
  });
  it("single staff (no modifiers, newcomer) -> base premium 80 G contributes to total", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "staff" }]);
    // 80 base + 8 first insurance = 88, + 5 fee = 93
    expect(result).toBe(93);
  });
  it("single potion (no modifiers, newcomer) -> base premium 40 G contributes to total", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "potion" }]);
    // 40 base + 4 first insurance = 44, + 5 fee = 49
    expect(result).toBe(49);
  });

  // --- Components and building blocks ---
  it("2 runes -> base premium 50 G (25 G each, no block)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
    ]);
    // 50 base + 5 first insurance = 55, + 5 fee = 60
    expect(result).toBe(60);
  });
  it("3 runes -> base premium 60 G (block of 3 alike components applies)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    // 60 base (block) + 6 first insurance = 66, + 5 fee = 71
    expect(result).toBe(71);
  });
  it("4 runes -> base premium 100 G (no block - block requires exactly 3)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    // 100 base + 10 first insurance = 110, + 5 fee = 115
    expect(result).toBe(115);
  });
  it("7 runes -> base premium 175 G (no block - block requires exactly 3 total, not multiples)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    // 175 base (7 * 25, no block) + 17.5 first insurance = 192.5, + 5 fee = 197.5, rounds up to 198
    expect(result).toBe(198);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types not alike)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ]);
    // 75 base (2*25 + 1*25, no block since types differ) + 7.5 first insurance = 82.5, + 5 fee = 87.5, rounds up to 88
    expect(result).toBe(88);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks of 60 G each)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ]);
    // 120 base (60+60, two separate blocks) + 12 first insurance = 132, + 5 fee = 137
    expect(result).toBe(137);
  });

  // --- Modifier: cursed item surcharge (item-specific) ---
  it("cursed sword (base 100 G) -> curse surcharge adds 50 G (50% of item's base premium)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "sword", cursed: true },
    ]);
    // policy base 100, + 10 first insurance (10% of 100) = 110, + 50 curse surcharge = 160, + 5 fee = 165
    expect(result).toBe(165);
  });

  // --- Modifier: high enchantment surcharge (item-specific), thresholds ---
  it("sword with enchantment exactly 5 -> high-enchantment surcharge applies (30% of base)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "sword", enchantment: 5 },
    ]);
    // policy base 100, + 10 first insurance = 110, + 30 high-enchantment surcharge = 140, + 5 fee = 145
    expect(result).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge applies", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "sword", enchantment: 4 },
    ]);
    // policy base 100, + 10 first insurance = 110, no surcharge, + 5 fee = 115
    expect(result).toBe(115);
  });
  it("cursed sword with enchantment exactly 5 -> both curse and high-enchantment surcharges apply", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "sword", enchantment: 5, cursed: true },
    ]);
    // policy base 100, + 10 first insurance = 110, + 50 curse + 30 enchantment = 190, + 5 fee = 195
    expect(result).toBe(195);
  });

  // --- Modifier scope on multi-item policies ---
  it(
    "policy with cursed sword (100 G base) + plain amulet (60 G base) -> policy base 160 G, " +
      "curse surcharge +50 G (50% of cursed item's base only) -> 210 G before further modifiers and fee",
    () => {
      const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]);
      // policy base 160 (100+60), + 16 first insurance (10% of 160) = 176, + 50 curse = 226, + 5 fee = 231
      expect(result).toBe(231);
    }
  );

  // --- Policy-wide modifiers: loyalty discount ---
  it("customer with exactly 2 years with MHPCO -> loyalty discount (20%) applies to policy base premium", () => {
    const result = computePremium({ yearsWithMHPCO: 2, isFollowUpContract: false }, [{ type: "sword" }]);
    // policy base 100, + 10 first insurance = 110, - 20 loyalty (20% of 100) = 90, + 5 fee = 95
    expect(result).toBe(95);
  });

  // --- Policy-wide modifiers: first insurance surcharge / follow-up contract discount ---
  it("first quote for a customer -> first insurance surcharge (10%) applies to policy base premium", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "amulet" }]);
    // policy base 60, + 6 first insurance (10% of 60) = 66, + 5 fee = 71
    expect(result).toBe(71);
  });
  it("second quote for a customer in a scenario -> follow-up contract discount (15%) applies, " +
    "but first insurance surcharge still applies to each item (per spec clarification)", () => {
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: true }, [{ type: "amulet" }]);
    // policy base 60, + 6 first insurance = 66, - 9 follow-up (15% of 60) = 57, + 5 fee = 62
    expect(result).toBe(62);
  });

  // --- Processing fee ---
  it("processing fee of 5 G is added at the very end, after all other modifiers", () => {
    const withFee = computePremium({ yearsWithMHPCO: 2, isFollowUpContract: true }, [{ type: "amulet" }]);
    // policy base 60, + 6 first insurance = 66, - 12 loyalty (20% of 60) - 9 follow-up (15% of 60) = 45, + 5 fee = 50
    expect(withFee).toBe(50);
  });

  // --- Rounding in the MHPCO's favor ---
  it("premium calculation yielding 197.5 G rounds up to 198 G", () => {
    // 7 runes: 175 base (no block), + 17.5 first insurance = 192.5, + 5 fee = 197.5 -> rounds up to 198
    const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result).toBe(198);
  });

  // --- Integration examples from spec ---
  it(
    "Newcomer with a cursed sword (steel, enchantment 3), 0 years, no previous contract -> premium 165 G " +
      "(100 base + 50 curse + 10 first insurance = 160, +5 fee = 165)",
    () => {
      const result = computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]);
      expect(result).toBe(165);
    }
  );
  it(
    "Long-standing customer's second contract: 3 years, second quote in scenario, cursed sword " +
      "(steel, enchantment 7) -> premium 160 G " +
      "(100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155, +5 fee = 160)",
    () => {
      const result = computePremium({ yearsWithMHPCO: 3, isFollowUpContract: true }, [
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ]);
      expect(result).toBe(160);
    }
  );

  // --- Error case: unknown item type ---
  it("quote with an unknown item type (e.g. 'broomstick') -> throws an error", () => {
    expect(() =>
      computePremium({ yearsWithMHPCO: 0, isFollowUpContract: false }, [{ type: "broomstick" }])
    ).toThrow();
  });
});
