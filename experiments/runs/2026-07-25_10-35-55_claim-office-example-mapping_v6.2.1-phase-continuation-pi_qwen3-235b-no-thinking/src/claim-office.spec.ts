import { describe, it, expect } from "vitest";
import { calculatePremium, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should compute premium for an empty item list as 5 G (only processing fee)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [];
    const result = calculatePremium(customer, items);
    expect(result).toBe(5);
  });
  
  it("should compute base premium for a sword as 100 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(100);
  });
  it("should compute base premium for an amulet as 60 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "amulet" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(60);
  });
  it("should compute base premium for a staff as 80 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "staff" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(80);
  });
  it("should compute base premium for a potion as 40 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "potion" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(40);
  });
  
  it("should compute base premium for components: 25 G each", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "rune" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(25);
  });
  it("should apply special base premium of 60 G for a building block of 3 alike components", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    const result = calculatePremium(customer, items);
    expect(result).toBe(60);
  });
  it("should not apply block discount for 4 runes -> 100 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(100);
  });
  it("should handle 7 runes -> 175 G base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = Array(7).fill({ type: "rune" });
    const result = calculatePremium(customer, items);
    expect(result).toBe(175);
  });
  it("should not apply block for different component types (2 runes + 1 moonstone -> 75 G)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(75);
  });
  it("should apply two separate blocks for 3 runes + 3 moonstones -> 120 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(120);
  });
  
  it("should add 50% risk surcharge for cursed items (applied to item's base premium)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "sword", cursed: true }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(150);
  });
  it("should add 30% risk surcharge for highly enchanted items (enchantment level ≥ 5)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "sword", enchantment: 5 }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(130);
  });
  it("should apply 20% loyalty discount for long-standing customers (≥ 2 years)", () => {
    const customer = { yearsWithMHPCO: 2 };
    const items = [
      { type: "sword" }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(80);
  });
  it("should add 10% initial assessment surcharge for first insurance", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "sword" }
    ];
    const result = calculatePremium(customer, items);
    expect(result).toBe(110);
  });
  it.todo("should apply 15% discount on each contract after first");
  it.todo("should add 5 G processing fee to every premium");
  
  it.todo("should round final premium to whole G in MHPCO's favor (up)");
  it.todo("should compute premium for a cursed sword with 0 years: 165 G");
  it.todo("should compute premium for a cursed highly-enchanted sword for long-standing customer on second contract: 160 G");
  
  it.todo("should apply item-specific modifiers only to affected items (cursed sword + plain amulet -> surcharge only on sword)");
  it.todo("should apply policy-wide modifiers to sum of all item base premiums");
  
  it.todo("should validate known item types and exit with error for unknown type (e.g., broomstick)");
  
  it.todo("should initialize cap at twice insurance sum (sword: 1000 G -> cap 2000 G)");
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should reimburse damage to items with enchantment ≥ 8 at 50% of damage amount");
  it.todo("should fully reimburse damage to items made of dragon material");
  it.todo("should fully reimburse regular sword with damage 500 G -> payout 400 G");
  it.todo("should pay 100 G for damage to rune with damage 200 G");
  it.todo("should handle dragon-material sword with enchantment 9, damage 1000 G -> payout 400 G");
  it.todo("should handle dragon-material sword with enchantment 5, damage 800 G -> payout 700 G");
  it.todo("should handle steel sword with enchantment 9, damage 1000 G -> payout 400 G");
  it.todo("should reject claim if damage list contains more items of a type than policy covers");
  it.todo("should reduce payout if remaining cap is less than calculated payout");
  it.todo("should write results in correct JSON format with premium, payout, and remainingCap");
});
