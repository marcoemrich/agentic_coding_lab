import { describe, it, expect } from "vitest";
import { computePremium } from "../quote.js";

describe("computePremium", () => {
  it("first-time customer, one plain sword: base 100 + 10% first + 5 fee = 115", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      0,
    );
    expect(p).toBe(115);
  });

  it("loyal customer, one plain amulet: 60 * 0.8 * 1.1 + 5 = 57.8 -> 58", () => {
    const p = computePremium(
      { yearsWithMHPCO: 5 },
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      0,
    );
    expect(p).toBe(58);
  });

  it("cursed sword adds 50% surcharge: 100*1.5*1.1 + 5 = 170", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      0,
    );
    expect(p).toBe(170);
  });

  it("highly enchanted staff (level 5): 80*1.3*1.1 + 5 = 119.4 -> 120", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "staff", material: "oak", enchantment: 5, cursed: false }],
      0,
    );
    expect(p).toBe(120);
  });

  it("cursed AND highly enchanted: stacks multiplicatively 100*1.5*1.3*1.1 + 5 = 219.5 -> 220", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      0,
    );
    expect(p).toBe(220);
  });

  it("second contract gets 15% discount: 100*0.85 + 5 = 90", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
      1,
    );
    expect(p).toBe(90);
  });

  it("three alike components bundled: 60*1.1 + 5 = 71", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune", enchantment: 0 },
        { type: "rune", enchantment: 0 },
        { type: "rune", enchantment: 0 },
      ],
      0,
    );
    expect(p).toBe(71);
  });

  it("four runes: 3 bundled (60) + 1 single (25) = 85*1.1 + 5 = 98.5 -> 99", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune", enchantment: 0 },
        { type: "rune", enchantment: 0 },
        { type: "rune", enchantment: 0 },
        { type: "rune", enchantment: 0 },
      ],
      0,
    );
    expect(p).toBe(99);
  });

  it("two different component types do NOT bundle: 25+25 = 50*1.1+5 = 60", () => {
    const p = computePremium(
      { yearsWithMHPCO: 0 },
      [
        { type: "rune", enchantment: 0 },
        { type: "moonstone", enchantment: 0 },
      ],
      0,
    );
    expect(p).toBe(60);
  });
});
