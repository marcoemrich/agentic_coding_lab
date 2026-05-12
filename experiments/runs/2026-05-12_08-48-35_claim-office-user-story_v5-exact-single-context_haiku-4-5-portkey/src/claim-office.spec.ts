import { describe, it, expect } from "vitest";
import { calculatePremium } from "./claim-office.js";

describe("MHPCO Claim Office - Premium Quoting", () => {
  it("should calculate base premium for a single sword", () => {
    const result = calculatePremium({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(115); // 100 base + 10% initial surcharge + 5 G fee
  });
  it("should calculate base premium for a single amulet", () => {
    const result = calculatePremium({
      items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(71); // 60 base + 10% initial surcharge + 5 G fee = 71
  });
  it("should calculate base premium for a single staff", () => {
    const result = calculatePremium({
      items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(93); // 80 base + 10% initial surcharge + 5 G fee = 93
  });
  it("should calculate base premium for a single potion", () => {
    const result = calculatePremium({
      items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(49); // 40 base + 10% initial surcharge + 5 G fee = 49
  });
  it("should calculate base premium for a single component", () => {
    const result = calculatePremium({
      items: [{ type: "component", material: "rune", enchantment: 0, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(33); // 25 base + 10% initial surcharge + 5 G fee = 32.5, rounds up to 33
  });
  it("should apply special building block premium for 3 alike components", () => {
    const result = calculatePremium({
      items: [
        { type: "component", material: "rune", enchantment: 0, cursed: false },
        { type: "component", material: "rune", enchantment: 0, cursed: false },
        { type: "component", material: "rune", enchantment: 0, cursed: false }
      ],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(71); // 60 building block premium + 10% initial surcharge + 5 G fee = 71
  });
  it("should apply 50% surcharge for cursed items", () => {
    const result = calculatePremium({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(165); // 100 base + 50% cursed surcharge (50) + 10% initial surcharge (10) + 5 G fee = 165
  });
  it("should apply 30% surcharge for highly enchanted items (level >= 5)", () => {
    const result = calculatePremium({
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(148); // 100 base + 30% enchanted surcharge (30) + 10% initial surcharge (13) + 5 G fee = 148
  });
  it("should calculate premium for multiple different items", () => {
    const result = calculatePremium({
      items: [
        { type: "component", material: "rune", enchantment: 0, cursed: false },
        { type: "component", material: "moonstone", enchantment: 0, cursed: false }
      ],
      yearsWithMHPCO: 0
    });
    expect(result).toBe(60); // 2 components: 25 each = 50 base + 10% initial surcharge (5) + 5 G fee = 60
  });
  it.todo("should add 5G processing fee to total premium");
  it.todo("should apply 10% initial assessment surcharge for first contract");
  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");
  it.todo("should apply 15% discount for repeat customers (after first contract)");
  it.todo("should round amounts to whole G in MHPCO's favor (round up)");
});
