import { describe, it, expect } from "vitest";
import {
  calculatePayout,
  calculateTotalPayout,
  processClaim,
  calculateInsuranceCap,
} from "./claim.js";

describe("Claim processing", () => {
  // --- Standard reimbursement (no special clauses) ---
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    expect(
      calculatePayout(
        { type: "sword", material: "steel", enchantment: 3 },
        500
      )
    ).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus 100 G deductible)", () => {
    expect(calculatePayout({ type: "rune" }, 200)).toBe(100);
  });

  // --- Deductible per damage event ---
  it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G (100 G deductible applies once per damaged item)", () => {
    expect(
      calculateTotalPayout([
        { item: { type: "sword" }, amount: 500 },
        { item: { type: "amulet" }, amount: 300 },
      ])
    ).toBe(600);
  });

  // --- Enchantment threshold vs dragon material ---
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; 50% rule wins, then deductible: 500-100)", () => {
    expect(
      calculatePayout(
        { type: "sword", material: "dragon", enchantment: 9 },
        1000
      )
    ).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause applies: full reimbursement, then deductible: 800-100)", () => {
    expect(
      calculatePayout(
        { type: "sword", material: "dragon", enchantment: 5 },
        800
      )
    ).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause applies: 50% first, then deductible: 500-100)", () => {
    expect(
      calculatePayout(
        { type: "sword", material: "steel", enchantment: 9 },
        1000
      )
    ).toBe(400);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies at threshold, then deductible)", () => {
    expect(
      calculatePayout(
        { type: "sword", material: "dragon", enchantment: 8 },
        1000
      )
    ).toBe(400);
  });

  // --- Multiple items of the same type ---
  it("policy with two swords, dragon attack damages both (two separate {itemType: sword} damage entries) -> each entry treated as separate damage with its own deductible", () => {
    expect(
      calculateTotalPayout([
        { item: { type: "sword" }, amount: 500 },
        { item: { type: "sword" }, amount: 300 },
      ])
    ).toBe(600);
  });
  it("damages array contains more entries of a given type than policy covers (two sword damages but only one sword insured) -> throws an error and the whole claim is rejected", () => {
    expect(() =>
      processClaim([{ type: "sword" }], [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ])
    ).toThrow(/sword/i);
  });

  // --- Cap exhaustion ---
  it("policy covers a sword and an amulet -> insurance sum 1600 G, cap 3200 G", () => {
    expect(
      calculateInsuranceCap([{ type: "sword" }, { type: "amulet" }])
    ).toBe(3200);
  });
  it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (based on unmodified insurance value)", () => {
    expect(
      calculateInsuranceCap([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ])
    ).toBe(2000);
  });
  it("policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    expect(
      calculateInsuranceCap([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(3500);
  });
  it("sword insured (insurance sum 1000 G, cap 2000 G); first claim of 1500 G -> payout 1400 G, remaining cap 600 G", () => {
    expect(
      processClaim([{ type: "sword" }], [
        { itemType: "sword", amount: 1500 },
      ])
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("same policy, second successive claim of 1500 G -> payout 600 G, remaining cap 0 G (desired 1400 G reduced to remaining cap)", () => {
    expect(
      processClaim(
        [{ type: "sword" }],
        [{ itemType: "sword", amount: 1500 }],
        600
      )
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding ---
  it("payout calculation yielding 350.5 G -> final payout rounds down to 350 G", () => {
    expect(
      calculatePayout({ type: "sword", enchantment: 9 }, 901)
    ).toBe(350);
  });

  // --- Edge cases (claim-specific) ---
  it("claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only sword insured) -> throws an error", () => {
    expect(() =>
      processClaim([{ type: "sword" }], [
        { itemType: "amulet", amount: 300 },
      ])
    ).toThrow(/amulet/i);
  });
  it("claim references a damage entry with an unknown item type -> throws an error", () => {
    expect(() =>
      processClaim([{ type: "sword" }], [
        { itemType: "broomstick", amount: 300 },
      ])
    ).toThrow(/broomstick/i);
  });
  it("claim contains a damage entry with amount: -200 -> throws an error", () => {
    expect(() =>
      processClaim([{ type: "sword" }], [
        { itemType: "sword", amount: -200 },
      ])
    ).toThrow(/amount/i);
  });
});
