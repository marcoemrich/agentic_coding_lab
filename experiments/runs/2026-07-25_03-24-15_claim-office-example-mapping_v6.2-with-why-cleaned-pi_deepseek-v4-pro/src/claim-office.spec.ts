import { describe, it, expect } from "vitest";
import { quote, processClaim } from "./claim-office.js";

describe("Claim Office", () => {
  // === QUOTE TESTS ===

  // Empty item list
  it("should quote 5 G for empty item list (only processing fee)", () => {
    expect(quote([], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(5);
  });

  // Single items - base premiums (with first insurance 10%)
  it("should quote 115 G for a plain sword (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(115);
  });
  it("should quote 71 G for a plain amulet (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(71);
  });
  it("should quote 93 G for a plain staff (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote([{ type: "staff", material: "wood", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(93);
  });
  it("should quote 49 G for a plain potion (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote([{ type: "potion", material: "glass", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(49);
  });

  // Components (with first insurance 10% on base)
  it("should quote 33 G for a single rune (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote([{ type: "rune", material: "stone", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(33);
  });
  it("should quote 60 G for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune", material: "stone", enchantment: 0, cursed: false }, { type: "rune", material: "stone", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(60);
  });
  it("should quote 71 G for 3 runes (60 block base + 6 first insurance + 5 fee)", () => {
    expect(quote([{ type: "rune", material: "stone", enchantment: 0, cursed: false }, { type: "rune", material: "stone", enchantment: 0, cursed: false }, { type: "rune", material: "stone", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(71);
  });
  it("should quote 115 G for 4 runes (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(115);
  });
  it("should quote 198 G for 7 runes (175 base + 17.5 first insurance + 5 fee, rounded up = 197.5 → 198)", () => {
    const runes = Array(7).fill(null).map(() => ({ type: "rune", material: "stone", enchantment: 0, cursed: false }));
    expect(quote(runes, { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(198);
  });

  // "Alike" components - clarifying question test
  it("should quote 88 G for 2 runes + 1 moonstone (75 base + 7.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote([
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(88);
  });
  it("should quote 137 G for 3 runes + 3 moonstones (120 block base + 12 first insurance + 5 fee)", () => {
    const runes = Array(3).fill(null).map(() => ({ type: "rune", material: "stone", enchantment: 0, cursed: false }));
    const moonstones = Array(3).fill(null).map(() => ({ type: "moonstone", material: "stone", enchantment: 0, cursed: false }));
    expect(quote([...runes, ...moonstones], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(137);
  });

  // Modifier scope on multi-item policies
  it("should quote cursed sword (100 base) + plain amulet (60 base) = 160 base, 50 curse + 16 first insurance + 5 fee = 231 G", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 0, cursed: true },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(231);
  });

  // Cursed item surcharge (50%)
  // Newcomer with a cursed sword
  it("should quote 165 G for newcomer (0 years, first contract) with cursed sword (steel, enchantment 3)", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(165);
  });

  // High enchantment surcharge (≥5, 30%)
  it("should quote a highly enchanted (level 5) non-cursed sword: 100 base + 30 enchantment + 10 first insurance + 5 fee = 145 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(145);
  });

  // Thresholds
  it("should apply loyalty discount at exactly 2 years with MHPCO -- sword: 100 base + 10 first insurance - 20 loyalty + 5 fee = 95 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 2, contractsSoFar: 0 })).toBe(95);
  });
  it("should apply high-enchantment surcharge at exactly enchantment 5; also apply curse if cursed -- cursed sword enchant 5: 100 + 50 curse + 30 enchant + 10 first - 0 loyalty + 5 = 195 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(195);
  });
  it("should NOT apply high-enchantment surcharge at enchantment 4 -- sword enchant 4 cursed: 100 + 50 curse + 10 first + 5 = 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: true }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(165);
  });
  
  it("should quote a sword with loyalty discount (≥2 years) plus first insurance: 100 base + 10 first - 20 loyalty + 5 = 95 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 2, contractsSoFar: 0 })).toBe(95);
  });

  // First insurance surcharge (10%) — already tested in every quote
  it("should quote a sword for first insurance: 100 base + 10 first + 5 = 115 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(115);
  });

  // Follow-up contract discount (15% on each after first)
  // Follow-up contract discount (15% on each after first)
  it("should quote a sword for follow-up contract: 100 base + 10 first - 15 follow-up + 5 fee = 100 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 1 })).toBe(100);
  });

  // Multiple items of same type
  // Multiple items of same type
  it("should quote two swords: 200 base + 20 first insurance + 5 fee = 225 G", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(225);
  });

  // Long-standing customer integration
  it("should quote 160 G for long-standing customer (3 years), second contract, cursed sword (steel, enchantment 7)", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 7, cursed: true },
    ], { yearsWithMHPCO: 3, contractsSoFar: 1 })).toBe(160);
  });

  // Newcomer with cursed sword integration example
  it("should quote 165 G for newcomer with cursed sword (steel, enchantment 3)", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(165);
  });

  // Rounding in MHPCO's favor
  it("should round premium 197.5 G up to 198 G", () => {
    // 7 runes: 175 base - 0 block (7 not divisible by 3) + 17.5 first insurance + 5 fee = 197.5
    const runes = Array(7).fill(null).map(() => ({ type: "rune", material: "stone", enchantment: 0, cursed: false }));
    expect(quote(runes, { yearsWithMHPCO: 0, contractsSoFar: 0 })).toBe(198);
  });

  // Unknown item type
  it("should throw error for unknown item type (broomstick)", () => {
    expect(() => quote([{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 })).toThrow();
  });

  // Policy tracking for multi-step scenarios
  it("should support quoting two policies and referencing them correctly", () => {
    // Quote first policy (sword)
    const premium1 = quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 });
    expect(premium1).toBe(115);
    // Quote second policy (amulet)
    const premium2 = quote([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 1 });
    expect(premium2).toBe(62);
  });

  it("should process claim for regular steel sword (enchantment 3), damage 500 G → payout 400 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Standard reimbursement for rune (no special clause)
  it("should process claim for rune damage 200 G → payout 100 G", () => {
    const policy = { items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }], insuranceSum: 250 };
    const result = processClaim(policy, [{ itemType: "rune", amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Deductible per damage event (per damaged item)
  it("should process claim for dragon attack damaging sword (500) and amulet (300): payout 600 G", () => {
    const policy = { items: [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ], insuranceSum: 1600 };
    const result = processClaim(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Enchantment level ≥ 8: 50% reimbursement (items with enchantment ≥8 pay 50% before deductible)
  it("should process claim for enchantment 8 steel sword, damage 1000 G → payout 400 G (500 half - 100 ded)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Dragon material: full reimbursement
  it("should process claim for dragon-material sword (enchantment 5), damage 800 G → payout 700 G", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 800 }]);
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Both clauses: enchantment 9, dragon material → 50% wins
  it("should process claim for dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Enchantment 8 dragon → 50% first
  it("should process claim for dragon-material sword enchantment 8, damage 1000 G → payout 400 G", () => {
    const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Steel enchantment 9 — only high enchantment clause applies
  it("should process claim for steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("should enforce insurance cap: sword + amulet policy (sum 1600, cap 3200) with single claim of 1500 G → payout 1400, remainingCap 1800", () => {
    const policy = { items: [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ], insuranceSum: 1600 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(result).toEqual({ payout: 1400, remainingCap: 1800 });
  });

  it("should exhaust cap over two successive claims: first 1500 G claim → payout 1400 remaining 600; second 1500 G claim → payout 600 remaining 0", () => {
    const policy = { items: [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ], insuranceSum: 1000 };
    const result1 = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
    const result2 = processClaim({ ...policy, remainingCap: result1.remainingCap }, [{ itemType: "sword", amount: 1500 }]);
    expect(result2).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple damages of a type exceeding insured count
  it("should reject claim when damages array has more entries of a type than the policy covers", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    expect(() => processClaim(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ])).toThrow();
  });

  it("should reject claim with damage to item not in the policy", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    expect(() => processClaim(policy, [{ itemType: "amulet", amount: 200 }])).toThrow();
  });

  it("should reject claim with negative damage amount", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    expect(() => processClaim(policy, [{ itemType: "sword", amount: -200 }])).toThrow();
  });

  it("should round payout 350.5 G down to 350 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 450 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it("should reject claim referencing item with unknown type", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    expect(() => processClaim(policy, [{ itemType: "broomstick", amount: 300 }])).toThrow();
  });

  // Multi-step scenario
  it("should handle multi-step scenario: quote then claim against policy by step index", () => {
    // Quote a sword
    const premium = quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 0, contractsSoFar: 0 });
    expect(premium).toBe(115);
    // Claim against it
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], insuranceSum: 1000 };
    const result = processClaim(policy, [{ itemType: "sword", amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 1900 });
  });
});