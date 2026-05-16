import { describe, it, expect } from "vitest";
import { computePremium, roundInFavor } from "./quote.js";

describe("roundInFavor", () => {
  it("rounds up to next whole G", () => {
    expect(roundInFavor(100)).toBe(100);
    expect(roundInFavor(100.1)).toBe(101);
    expect(roundInFavor(99.9)).toBe(100);
  });

  it("handles floating-point near-integers", () => {
    expect(roundInFavor(100.0000000001)).toBe(100);
  });
});

describe("computePremium - main items", () => {
  it("sword, no enchantment, first contract, no loyalty", () => {
    // base 100, +10% first => 110, + 5 = 115
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(115);
  });

  it("amulet, loyal customer, first contract", () => {
    // base 60, factor = 1 - 0.2 + 0.1 = 0.9; 60*0.9 = 54; +5 = 59
    const premium = computePremium(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      { customer: { yearsWithMHPCO: 5 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(59);
  });

  it("cursed sword adds 50%", () => {
    // base 100 * 1.5 = 150; first contract +10% => 165; +5 = 170
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(170);
  });

  it("high-enchantment staff adds 30%", () => {
    // base 80 * 1.3 = 104; first contract +10% => 114.4; +5 = 119.4 -> 120
    const premium = computePremium(
      [{ type: "staff", material: "oak", enchantment: 7, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(120);
  });

  it("cursed and high-enchantment stack additively (1 + 0.5 + 0.3 = 1.8)", () => {
    // sword base 100 * 1.8 = 180; first contract +10% => 198; +5 = 203
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(203);
  });

  it("subsequent contract gets 15% discount instead of 10% surcharge", () => {
    // potion base 40; factor = 1 - 0.15 = 0.85; 40*0.85=34; +5=39
    const premium = computePremium(
      [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 1 },
    );
    expect(premium).toBe(39);
  });
});

describe("computePremium - components", () => {
  it("single rune", () => {
    // base 25; first contract: 25*1.1 = 27.5; +5 = 32.5 -> 33
    const premium = computePremium(
      [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(33);
  });

  it("3 alike runes form a block at 60G", () => {
    // block base 60; first contract * 1.1 = 66; +5 = 71
    const premium = computePremium(
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ],
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(71);
  });

  it("4 alike runes: 1 block + 1 single = 60+25 = 85", () => {
    // 85 * 1.1 = 93.5; +5 = 98.5 -> 99
    const premium = computePremium(
      Array.from({ length: 4 }, () => ({
        type: "rune",
        material: "stone",
        enchantment: 0,
        cursed: false,
      })),
      { customer: { yearsWithMHPCO: 0 }, contractsSoFar: 0 },
    );
    expect(premium).toBe(99);
  });

  it("3 runes + 3 moonstones = 2 blocks = 120", () => {
    // 120 * 1.1 = 132; +5 = 137
    const items = [
      ...Array.from({ length: 3 }, () => ({
        type: "rune",
        material: "stone",
        enchantment: 0,
        cursed: false,
      })),
      ...Array.from({ length: 3 }, () => ({
        type: "moonstone",
        material: "stone",
        enchantment: 0,
        cursed: false,
      })),
    ];
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      contractsSoFar: 0,
    });
    expect(premium).toBe(137);
  });

  it("2 runes do not form a block (no discount)", () => {
    // 2 * 25 = 50; * 1.1 = 55; +5 = 60
    const items = Array.from({ length: 2 }, () => ({
      type: "rune",
      material: "stone",
      enchantment: 0,
      cursed: false,
    }));
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      contractsSoFar: 0,
    });
    expect(premium).toBe(60);
  });
});
