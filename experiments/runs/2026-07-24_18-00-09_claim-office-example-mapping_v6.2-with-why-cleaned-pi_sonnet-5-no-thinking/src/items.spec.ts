import { describe, it, expect } from "vitest";
import { policyBasePremium, insuranceSum } from "./items.js";

describe("Item catalog: base premiums and insurance values", () => {
  // Building block of 3 alike components
  it("policyBasePremium returns 50 G for 2 runes (no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("policyBasePremium returns 60 G for 3 runes (block applies)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("policyBasePremium returns 100 G for 4 runes (no block -- requires exactly 3)", () => {
    expect(
      policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(100);
  });
  it("policyBasePremium returns 175 G for 7 runes (no block -- requires exactly 3)", () => {
    expect(
      policyBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))
    ).toBe(175);
  });

  // "Alike" components
  it("policyBasePremium returns 75 G for 2 runes + 1 moonstone (no block: different types)", () => {
    expect(
      policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])
    ).toBe(75);
  });
  it("policyBasePremium returns 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ])
    ).toBe(120);
  });

  // Cap exhaustion (insurance sum feeds the claim cap)
  it("insuranceSum returns 1600 G for a sword + amulet policy", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("insuranceSum returns 1750 G for a sword + 3 runes policy (block discount does not affect insurance sum)", () => {
    expect(
      insuranceSum([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(1750);
  });
  it("insuranceSum returns 2000 G for a policy covering two swords", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
});
