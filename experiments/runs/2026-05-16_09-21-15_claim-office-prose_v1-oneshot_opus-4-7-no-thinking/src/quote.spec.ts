import { describe, it, expect } from "vitest";
import { computePremium } from "./quote.js";

describe("computePremium", () => {
  it("computes premium for a single sword, new customer", () => {
    // Sword base: 100. First insurance +10% => 110. +5 fee => 115.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(115);
  });

  it("applies cursed surcharge 50%", () => {
    // Sword cursed base: 100 * 1.5 = 150. First +10% => 165. +5 => 170.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(170);
  });

  it("applies high enchantment surcharge 30%", () => {
    // Sword enchanted 5 base: 100 * 1.3 = 130. First +10% => 143. +5 => 148.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(148);
  });

  it("stacks cursed and high enchantment", () => {
    // 100 * (1+0.5+0.3) = 100 * 1.8 = 180. First +10% => 198. +5 => 203.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(203);
  });

  it("applies loyalty discount", () => {
    // amulet base: 60. Loyalty -20% => 48. First +10% => 52.8. +5 => 57.8 => 58.
    const premium = computePremium(
      { yearsWithMHPCO: 5 },
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(58);
  });

  it("applies subsequent contract discount", () => {
    // sword 100. Subsequent -15% => 85. +5 => 90.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { priorContracts: 1 },
    );
    expect(premium).toBe(90);
  });

  it("bundles 3 alike components at 60G", () => {
    // 3 runes => 60. First +10% => 66. +5 => 71.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune", enchantment: 0, cursed: false },
        { type: "rune", enchantment: 0, cursed: false },
        { type: "rune", enchantment: 0, cursed: false },
      ],
      { priorContracts: 0 },
    );
    expect(premium).toBe(71);
  });

  it("bundles 3 + 1 leftover", () => {
    // 3 runes (60) + 1 rune (25) = 85. First +10% => 93.5 => 94. +5 => 99.
    const premium = computePremium(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune", enchantment: 0, cursed: false },
        { type: "rune", enchantment: 0, cursed: false },
        { type: "rune", enchantment: 0, cursed: false },
        { type: "rune", enchantment: 0, cursed: false },
      ],
      { priorContracts: 0 },
    );
    // 85 * 1.1 = 93.5, +5 = 98.5, ceil => 99.
    expect(premium).toBe(99);
  });

  it("rounds in MHPCO's favor (ceiling)", () => {
    // potion base 40. loyal -20% => 32. First +10% => 35.2. +5 => 40.2 => 41.
    const premium = computePremium(
      { yearsWithMHPCO: 3 },
      [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      { priorContracts: 0 },
    );
    expect(premium).toBe(41);
  });
});
