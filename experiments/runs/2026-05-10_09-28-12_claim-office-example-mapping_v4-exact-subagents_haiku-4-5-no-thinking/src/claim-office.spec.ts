import { describe, it, expect } from "vitest";
import { quotePolicy, processClaim, quoteComponent } from "./claim-office.js";

describe("MHPCO Claim Office - Quote Operation", () => {
  it("should return 0 for empty item list", () => {
    expect(quotePolicy([])).toBe(0);
  });
  it("should return base premium for single Sword", () => {
    expect(quotePolicy([{ type: "Sword" }])).toBe(50);
  });
  it("should return sum of base premiums for multiple items", () => {
    expect(quotePolicy([{ type: "Sword" }, { type: "Sword" }])).toBe(100);
  });
  it("should return base premium for Amulet", () => {
    expect(quotePolicy([{ type: "Amulet" }])).toBe(100);
  });
  it("should return base premium for Staff", () => {
    expect(quotePolicy([{ type: "Staff" }])).toBe(75);
  });
  it("should return base premium for Potion", () => {
    expect(quotePolicy([{ type: "Potion" }])).toBe(60);
  });
  it("should return total with first insurance modifier (+10%)", () => {
    expect(quotePolicy([{ type: "Sword", insuranceModifier: "first" }])).toBe(55);
  });
  it("should return total with loyalty discount (-20%) for 2+ years", () => {
    expect(quotePolicy([{ type: "Sword", yearsInsured: 2 }])).toBe(40);
  });
  it("should return total with cursed item surcharge (50%)", () => {
    expect(quotePolicy([{ type: "Sword", cursed: true }])).toBe(75);
  });
  it("should return total with high enchantment surcharge (30%) for ≥5", () => {
    expect(quotePolicy([{ type: "Sword", enchantmentLevel: 5 }])).toBe(65);
  });
  it("should round premium up (away from zero) in MHPCO's favor", () => {
    // Test that rounding goes UP (ceiling) not down (floor): 82.1 should become 83 not 82
    // Sword 50: 50 * 1.1 (first) * 1.5 (cursed) = 82.5 -> must round to 83 to favor MHPCO
    expect(quotePolicy([{ type: "Sword", insuranceModifier: "first", cursed: true }])).toBe(83);
  });
  it.todo("should apply processing fee (+5 G) to final premium");
  it("should reject unknown item type", () => {
    expect(() => quotePolicy([{ type: "UnknownItem" }])).toThrow();
  });
});

describe("MHPCO Claim Office - Claim Operation", () => {
  it("should return 0 for zero damage amount", () => {
    expect(processClaim(0)).toBe(0);
  });
  it("should subtract 100 G deductible from single damage claim", () => {
    expect(processClaim(100)).toBe(0);
  });
  it.todo("should reimburse full amount for damage under cap (2x insurance sum)");
  it("should apply 100 G deductible to multiple damage events", () => {
    expect(processClaim(100, 200, undefined, false, undefined, [100, 100])).toBe(100);
  });
  it("should cap payout at 2x the insurance sum", () => {
    expect(processClaim(400, 100)).toBe(200);
  });
  it("should apply 50% reimbursement for enchantment ≥8 damage", () => {
    expect(processClaim(400, 100, 8)).toBe(100);
  });
  it("should apply 100% reimbursement for dragon material damage", () => {
    expect(processClaim(400, 100, undefined, true)).toBe(300);
  });
  it("should reject claim for item not in policy", () => {
    expect(() => processClaim(100, 50, undefined, false, "UnknownItem")).toThrow();
  });
  it("should reject negative damage amount", () => {
    expect(() => processClaim(-50)).toThrow();
  });
  it("should reject claim with more damages of type than insured quantity", () => {
    // Insuring 1 Sword but claiming damage for 2 Sword items should be rejected
    expect(() => processClaim(200, 100, undefined, false, "Sword", undefined, 2, 1)).toThrow();
  });
});

describe("MHPCO Claim Office - Component Bundle Pricing", () => {
  it("should charge 25 G per individual component", () => {
    expect(quoteComponent([{ type: "Sword" }])).toBe(25);
  });
  it("should charge 60 G for block of 3 identical components", () => {
    expect(quoteComponent([{ type: "Sword" }, { type: "Sword" }, { type: "Sword" }])).toBe(60);
  });
  it("should apply premium modifiers to component pricing", () => {
    expect(quoteComponent([{ type: "Sword", cursed: true }])).toBe(37.5);
  });
});
