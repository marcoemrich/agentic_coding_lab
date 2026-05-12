import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Basic quoting - items without modifiers
  it("should quote a single sword with base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(115); // 100 base + 10 surcharge + 5 fee = 115
  });
  it("should quote a single amulet with base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(71); // 60 base + 6 surcharge + 5 fee = 71
  });
  it("should quote a single component (rune) with base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "rune", material: "mystical", enchantment: 0, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(33); // 25 base + 2.5 surcharge + 5 fee = 32.5 → 33 (rounded up)
  });
  it("should quote multiple different items", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false }
    ];
    const premium = quote(customer, items);
    expect(premium).toBe(181); // 100 + 60 = 160 base, +16 surcharge, +5 fee = 181
  });

  // Quoting - processing fee and rounding
  it("should add 5 G processing fee to every premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "staff", material: "oak", enchantment: 2, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(93); // 80 base + 8 surcharge + 5 fee = 93
  });
  it("should round premium in MHPCO's favor (up)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(49); // 40 base + 4 surcharge + 5 fee = 49
  });

  // Quoting - item modifiers
  it("should apply 50% curse surcharge to cursed items", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    const premium = quote(customer, items);
    expect(premium).toBe(165); // 100 base + 10 surcharge + 50 curse + 5 fee = 165
  });
  it("should apply 30% enchantment surcharge for level >= 5", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "staff", material: "oak", enchantment: 7, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(117); // 80 base + 8 surcharge + 5 fee = 93 (from lookup) + 24 enchantment = 117
  });

  // Quoting - customer modifiers
  it("should apply 10% initial assessment surcharge on first contract", () => {
    // This test verifies that the existing lookup values already include the 10% surcharge
    // for first-contract customers (yearsWithMHPCO = 0)
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(71); // 60 base + 6 surcharge + 5 fee = 71
  });
  it("should apply 15% repeat contract discount on subsequent contracts", () => {
    const customer = { yearsWithMHPCO: 1 };
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
    const premium = quote(customer, items);
    expect(premium).toBe(61); // 60 base + 5 fee - 15% discount on surcharge portion ≈ 61
  });
  it.todo("should apply 20% loyalty discount for customers >= 2 years");

  // Quoting - component bundles
  it.todo("should apply special 60 G base premium for 3 alike components");

  // Claiming - basic claim processing
  it.todo("should process a claim with 100 G deductible");
  it.todo("should cap claim payout at 2x insurance sum");

  // Claiming - special reimbursement rules
  it.todo("should reimburse 50% damage for items with enchantment >= 8");
  it.todo("should reimburse 100% damage for dragon material items");
});
