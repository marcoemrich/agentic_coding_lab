import { describe, it, expect } from "vitest";
import { quote, claim } from "./mhpco.js";

describe("MHPCO Claim Office - Quote Operation", () => {
  // Empty quote - simplest case
  it.todo("should return 0 for empty quote with no items");

  // Single item - base premium only (includes processing fee)
  it("should return 110 G for a single sword", () => {
    expect(quote([{ type: "sword" }])).toBe(110);
  });
  it("should return 65 G for a single amulet", () => {
    expect(quote([{ type: "amulet" }])).toBe(65);
  });
  it("should return 85 G for a single staff", () => {
    expect(quote([{ type: "staff" }])).toBe(85);
  });
  it("should return base premium for single potion without modifiers", () => {
    expect(quote([{ type: "potion" }])).toBe(45);
  });
  it("should return base premium for single component without modifiers", () => {
    expect(quote([{ type: "component" }])).toBe(35);
  });

  // Single item with cursed modifier
  it("should apply 50% cursed surcharge to single sword", () => {
    expect(quote([{ type: "sword", cursed: true }])).toBe(155);
  });
  it("should apply 50% cursed surcharge to single component", () => {
    expect(quote([{ type: "component", cursed: true }])).toBe(53);
  });

  // Single item with enchantment modifier
  it("should apply 30% enchantment surcharge for level 5 item", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(137);
  });
  it("should apply 30% enchantment surcharge for level 8 item", () => {
    expect(quote([{ type: "sword", enchantment: 8 }])).toBe(137);
  });

  // Multiple items of same type
  it("should return 210 G for two swords", () => {
    expect(quote([{ type: "sword" }, { type: "sword" }])).toBe(210);
  });
  it("should sum premiums for two components without modifiers", () => {
    expect(quote([{ type: "component" }, { type: "component" }])).toBe(70);
  });
  it("should return 60 G for three components instead of 75 G", () => {
    expect(quote([{ type: "component" }, { type: "component" }, { type: "component" }])).toBe(60);
  });

  // Multiple items of different types
  it("should sum premiums for sword and amulet without modifiers", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }])).toBe(170);
  });
  it("should sum premiums for sword, amulet, and staff without modifiers", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }, { type: "staff" }])).toBe(260);
  });

  // Processing fee
  it("should add 5 G processing fee to empty quote", () => {
    expect(quote([])).toBe(5);
  });
  it("should add 5 G processing fee to single item quote", () => {
    expect(quote([{ type: "sword" }])).toBe(110);
  });
  it("should add 5 G processing fee to multi-item quote", () => {
    expect(quote([{ type: "amulet" }, { type: "staff" }])).toBe(155);
  });

  // Policy-wide modifiers: First insurance surcharge
  it("should apply 10% first insurance surcharge to single item", () => {
    expect(quote([{ type: "sword", firstInsurance: true }])).toBe(116);
  });
  it("should apply 10% first insurance surcharge to multiple items", () => {
    expect(quote([{ type: "sword", firstInsurance: true }, { type: "sword", firstInsurance: true }])).toBe(231);
  });

  // Policy-wide modifiers: Follow-up contract discount
  it("should apply 15% follow-up contract discount to single item", () => {
    expect(quote([{ type: "sword", followUpContract: true }])).toBe(89);
  });
  it("should apply 15% follow-up contract discount to multiple items", () => {
    expect(quote([{ type: "sword", followUpContract: true }, { type: "sword", followUpContract: true }])).toBe(179);
  });

  // Policy-wide modifiers: Long-standing customer discount
  it("should apply 20% long-standing customer discount to single item", () => {
    expect(quote([{ type: "sword", yearsWithMHPCO: 2 }])).toBe(84);
  });
  it("should apply 20% long-standing customer discount to multiple items", () => {
    expect(quote([{ type: "sword", yearsWithMHPCO: 2 }, { type: "sword", yearsWithMHPCO: 2 }])).toBe(168);
  });

  // Combined modifiers: cursed + enchantment
  it("should apply both cursed and enchantment surcharges to same item", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(206);
  });

  // Combined modifiers: item-level + policy-level
  it("should apply cursed surcharge then first insurance surcharge", () => {
    expect(quote([{ type: "sword", cursed: true, firstInsurance: true }])).toBe(181);
  });
  it("should apply enchantment surcharge then follow-up contract discount", () => {
    expect(quote([{ type: "sword", enchantment: 5, followUpContract: true }])).toBe(104);
  });

  // Rounding up in MHPCO's favor
  it("should round up fractional premium to whole number", () => {
    expect(quote([{ type: "potion", enchantment: 5 }])).toBe(55);
  });
  it("should round up after applying all modifiers", () => {
    expect(quote([{ type: "amulet", enchantment: 5, firstInsurance: true, followUpContract: true }])).toBe(70);
  });
});

describe("MHPCO Claim Office - Claim Operation", () => {
  // Simplest case: single damage event
  it.todo("should process claim with damage on single item");
  it.todo("should apply 100 G deductible to damage claim");

  // Multiple damage events on same item
  it.todo("should apply separate 100 G deductible for each damage event");

  // Multiple items with damage
  it.todo("should process claim with damage on two different items");
  it.todo("should apply deductible to each damaged item separately");

  // Claim capping
  it.todo("should cap reimbursement at 2x insurance sum");

  // Claim rejection
  it.todo("should reject claim when damage exceeds policy items");

  // Enchantment threshold: level >= 8
  it.todo("should apply 50% reimbursement for enchantment level 8");
  it.todo("should apply 50% reimbursement before deductible for enchanted item");

  // Dragon material: 100% reimbursement
  it.todo("should apply 100% reimbursement for dragon material");
});
