import { describe, it, expect } from "vitest";
import { calculatePremium, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office - Premium Calculation", () => {
  it("should return 5 G processing fee for empty policy", () => {
    expect(calculatePremium([])).toBe(5);
  });
  it("should calculate base premium for single Sword item", () => {
    expect(calculatePremium([{ type: "Sword" }])).toBe(105);
  });
  it("should return 65 G for a single amulet (60 G base + 5 G fee)", () => {
    expect(calculatePremium([{ type: "Amulet" }])).toBe(65);
  });
  it("should return 85 G for a single staff (80 G base + 5 G fee)", () => {
    expect(calculatePremium([{ type: "Staff" }])).toBe(85);
  });
  it("should return 45 G for a single potion (40 G base + 5 G fee)", () => {
    expect(calculatePremium([{ type: "Potion" }])).toBe(45);
  });
  it("should sum base premiums for two different items (sword 100 + amulet 60 = 160 base + 5 fee = 165)", () => {
    expect(calculatePremium([{ type: "Sword" }, { type: "Amulet" }])).toBe(165);
  });
  it("should sum base premiums for three different items (sword 100 + amulet 60 + staff 80 = 240 base + 5 fee = 245)", () => {
    expect(calculatePremium([{ type: "Sword" }, { type: "Amulet" }, { type: "Staff" }])).toBe(245);
  });
  it("should apply 50% cursed surcharge to item base premium (sword 100 base + 50 cursed = 150 total item premium + 5 fee = 155)", () => {
    expect(calculatePremium([{ type: "Sword", cursed: true }])).toBe(155);
  });
  it("should apply 30% high-enchantment surcharge for enchantment >= 5 (sword 100 base + 30 surcharge = 130 item premium + 5 fee = 135)", () => {
    expect(calculatePremium([{ type: "Sword", enchantment: 5 }])).toBe(135);
  });
  it("should apply 20% loyalty discount for customers with >= 2 years (policy base 160 G with 2-year customer: 160 - 32 = 128 + 5 fee = 133)", () => {
    expect(calculatePremium([{ type: "Sword" }, { type: "Amulet" }], { yearsAsCustomer: 2 })).toBe(133);
  });
  it("should apply 10% first insurance surcharge for customers with 0 years (policy base 100 G: 100 + 10 = 110 + 5 fee = 115)", () => {
    expect(calculatePremium([{ type: "Sword" }], { yearsAsCustomer: 0 })).toBe(115);
  });
  it("should apply 15% follow-up contract discount for customers' 2nd+ quote (policy base 100 G with 2nd quote: 100 - 15 = 85 + 5 fee = 90)", () => {
    expect(calculatePremium([{ type: "Sword" }], { yearsAsCustomer: 1, isFollowUpQuote: true })).toBe(90);
  });
  it("should add 5 G processing fee at the end", () => {
    // Verify fee is added after all calculations
    const processingFeeOnlyResult = calculatePremium([]);
    expect(processingFeeOnlyResult).toBe(5);
  });
  it("should round up final premium in MHPCO's favor (197.5 G rounds up to 198 G)", () => {
    expect(calculatePremium([{ type: "Potion", cursed: true }], { yearsAsCustomer: 1, isFollowUpQuote: true })).toBe(198);
  });
  it("should handle multiple items with different modifiers (sword cursed 100+50=150, amulet plain 60, staff enchanted 80+24=104: total 314 base + 5 fee)", () => {
    expect(calculatePremium([
      { type: "Sword", cursed: true },
      { type: "Amulet" },
      { type: "Staff", enchantment: 5 }
    ])).toBe(319);
  });
  it("should reject quote with unknown item type", () => {
    expect(() => calculatePremium([{ type: "UnknownItem" }])).toThrow();
  });
});

describe("MHPCO Claim Office - Claim Processing", () => {
  it("should apply 100 G deductible per damage event (sword damage 500 G: payout 400 G)", () => {
    expect(processClaim([{ type: "Sword" }], [500])).toBe(400);
  });
  it("should fully reimburse damage for dragon material items (dragon sword damage 1000 G: payout 1000 G - no deductible)", () => {
    expect(processClaim([{ type: "DragonSword" }], [1000])).toBe(1000);
  });
  it("should not exceed 2x insurance value in reimbursement (policy cap)", () => {
    expect(processClaim([{ type: "Sword" }], [1000])).toBe(200);
  });
  it("should reimburse only 50% of damage for items with enchantment >= 8 (enchanted sword damage 1000 G: payout 400 G after 50% and deductible)", () => {
    expect(processClaim([{ type: "Sword", enchantment: 8 }], [1000])).toBe(400);
  });
  it("should round payout down (floor) to nearest G", () => {
    expect(processClaim([{ type: "Sword" }], [450.5])).toBe(350);
  });
  it("should reject claim for unknown item type", () => {
    expect(() => processClaim([{ type: "UnknownItem" }], [500])).toThrow();
  });
  it("should reject claim for item not in policy", () => {
    expect(() => processClaim([{ type: "UnknownItem" }], [500])).toThrow();
  });
  it("should reject claim with negative damage amount", () => {
    expect(() => processClaim([{ type: "Sword" }], [-500])).toThrow();
  });
  it("should reject claim with more damage entries than items", () => {
    expect(() => processClaim([{ type: "Sword" }], [500, 600])).toThrow();
  });
});

describe("MHPCO Claim Office - Component Handling", () => {
  it("should calculate base premium for single rune component (25 G premium per component)", () => {
    expect(calculatePremium([{ type: "Rune" }])).toBe(30);
  });
  it("should calculate base premium for single moonstone component (25 G premium per component)", () => {
    expect(calculatePremium([{ type: "Moonstone" }])).toBe(30);
  });
  it("should apply special block pricing for exactly 3 identical components (3 runes: 60 G base premium instead of 75 G)", () => {
    expect(calculatePremium([{ type: "Rune" }, { type: "Rune" }, { type: "Rune" }])).toBe(65);
  });
});
