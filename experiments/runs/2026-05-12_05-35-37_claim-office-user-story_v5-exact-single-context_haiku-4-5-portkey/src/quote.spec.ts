import { describe, it, expect } from "vitest";
import { calculateQuote } from "./quote.js";

describe("Premium Quote", () => {
  it("should calculate premium for a single sword (new customer)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(115);
  });
  it("should calculate premium for a single amulet (different base)", () => {
    const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(71);
  });
  it("should calculate premium for a single component", () => {
    const items = [{ type: "component", material: "rune", enchantment: 0, cursed: false }];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(33);
  });
  it("should apply special bundle premium for three alike components", () => {
    const items = [
      { type: "component", material: "rune", enchantment: 0, cursed: false },
      { type: "component", material: "rune", enchantment: 0, cursed: false },
      { type: "component", material: "rune", enchantment: 0, cursed: false },
    ];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(71);
  });
  it("should combine premiums for multiple different main items", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(181);
  });
  it("should apply 50% surcharge for cursed items", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(170);
  });
  it("should apply 30% surcharge for enchanted items (level >= 5)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(148);
  });
  it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const customer = { yearsWithMHPCO: 2 };
    const premium = calculateQuote(items, customer);
    expect(premium).toBe(92);
  });
});
