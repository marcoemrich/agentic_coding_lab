import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("MHPCO premium quoting", () => {
  it("quotes a single sword for a new customer (base 100 + initial 10% + 5 fee = 115)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(115);
  });
  it("quotes a single amulet (60 base + 10% + fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(71);
  });
  it("quotes a single staff (80 base + 10% + fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "staff", material: "oak", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(93);
  });
  it("quotes a single potion (40 base + 10% + fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "potion", material: "glass", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(49);
  });
  it("quotes a single rune component (25 base + 10% + fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "rune", material: "stone", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(33);
  });
  it("quotes three alike components as a building block (60 base + 10% + fee)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]
    );
    expect(result.premium).toBe(71);
  });
  it("quotes four runes: one block of 3 + one single = 85 base + 10% + fee", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]
    );
    expect(result.premium).toBe(99);
  });
  it("adds 50% surcharge for a cursed item", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }]
    );
    expect(result.premium).toBe(170);
  });
  it("adds 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "sword", material: "steel", enchantment: 5, cursed: false }]
    );
    expect(result.premium).toBe(148);
  });
  it("stacks cursed and highly enchanted surcharges multiplicatively", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }]
    );
    expect(result.premium).toBe(220);
  });
  it("applies 20% loyalty discount for customers with >= 2 years", () => {
    const result = quote(
      { yearsWithMHPCO: 2, contractCount: 0 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(93);
  });
  it("does not apply 10% initial surcharge after the first quote", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 1 },
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(90);
  });
  it("applies 15% discount on contracts after the first", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 1 },
      [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(56);
  });
  it("rounds the final premium up (in MHPCO's favor)", () => {
    const result = quote(
      { yearsWithMHPCO: 0, contractCount: 1 },
      [{ type: "rune", material: "stone", enchantment: 0, cursed: false }]
    );
    expect(result.premium).toBe(27);
  });
});
