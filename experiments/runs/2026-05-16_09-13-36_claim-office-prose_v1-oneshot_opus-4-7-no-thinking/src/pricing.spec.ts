import { describe, it, expect } from "vitest";
import { computePremium, totalInsuranceSum } from "./pricing.js";

describe("computePremium - basic items", () => {
  it("first contract, sword, non-cursed, low enchantment, new customer", () => {
    // base 100, no surcharges -> 100
    // first contract +10% -> 110
    // + 5 processing fee -> 115
    const p = computePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(115);
  });

  it("amulet, loyal customer (5 years), first contract", () => {
    // base 60, loyalty 0.8 = 48, first +10% = 52.8, + 5 = 57.8 -> 58
    const p = computePremium(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      { yearsWithMHPCO: 5, contractIndex: 0 },
    );
    expect(p).toBe(58);
  });

  it("cursed sword, first contract, new customer", () => {
    // base 100 * 1.5 = 150, first +10% = 165, +5 = 170
    const p = computePremium(
      [{ type: "sword", material: "steel", enchantment: 1, cursed: true }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(170);
  });

  it("high enchantment staff, first contract, new customer", () => {
    // base 80 * 1.3 = 104, first +10% = 114.4, +5 = 119.4 -> 120
    const p = computePremium(
      [{ type: "staff", material: "wood", enchantment: 7, cursed: false }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(120);
  });

  it("cursed + high enchantment potion", () => {
    // base 40 * (1 + 0.5 + 0.3) = 40 * 1.8 = 72; first +10% = 79.2; +5 = 84.2 -> 85
    const p = computePremium(
      [{ type: "potion", material: "glass", enchantment: 5, cursed: true }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(85);
  });

  it("second contract gets 15% discount instead of first surcharge", () => {
    // base 100 * 0.85 = 85; +5 = 90
    const p = computePremium(
      [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
      { yearsWithMHPCO: 0, contractIndex: 1 },
    );
    expect(p).toBe(90);
  });
});

describe("computePremium - components", () => {
  it("single rune component", () => {
    // base 25, first +10% = 27.5, +5 = 32.5 -> 33
    const p = computePremium(
      [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(33);
  });

  it("three alike runes get bundle base", () => {
    // bundle base 60, first +10% = 66, +5 = 71
    const p = computePremium(
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(71);
  });

  it("four alike runes: bundle of 3 + 1 leftover", () => {
    // 60 + 25 = 85; first +10% = 93.5; +5 = 98.5 -> 99
    const p = computePremium(
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(99);
  });

  it("two runes + one moonstone: no bundle eligible", () => {
    // 25 + 25 + 25 = 75; first +10% = 82.5; +5 = 87.5 -> 88
    const p = computePremium(
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
      ],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    expect(p).toBe(88);
  });
});

describe("totalInsuranceSum", () => {
  it("sums main items and components correctly", () => {
    const sum = totalInsuranceSum([
      { type: "sword" },
      { type: "amulet" },
      { type: "rune" },
    ]);
    expect(sum).toBe(1000 + 600 + 250);
  });
});
