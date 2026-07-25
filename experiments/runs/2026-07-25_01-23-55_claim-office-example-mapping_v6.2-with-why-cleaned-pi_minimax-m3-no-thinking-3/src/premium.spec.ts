import { describe, it, expect } from "vitest";
import { quote } from "./premium.js";

describe("quote -- premium calculation", () => {
  // ----- Simplest cases: single items, no modifiers -----

  it("empty item list -> premium 5 (only the processing fee)", () => {
    expect(
      quote({
        items: [],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(5);
  });

  it("single sword (no modifiers) -> premium 105 (100 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(105);
  });
  it("single amulet (no modifiers) -> premium 65 (60 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(65);
  });
  it("single staff (no modifiers) -> premium 85 (80 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "staff" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(85);
  });
  it("single potion (no modifiers) -> premium 45 (40 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "potion" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(45);
  });
  it("single rune (no modifiers) -> premium 30 (25 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(30);
  });
  it("single moonstone (no modifiers) -> premium 30 (25 base + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "moonstone" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(30);
  });

  // ----- Component block rule -----

  it("2 runes -> premium 55 (50 base + 5 fee, no block)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(55);
  });
  it("3 runes -> premium 65 (60 base + 5 fee, block applies)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(65);
  });
  it("4 runes -> premium 105 (100 base + 5 fee, block requires exactly 3)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(105);
  });
  it("7 runes -> premium 180 (175 base + 5 fee, no block)", () => {
    expect(
      quote({
        items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(180);
  });

  // ----- "Alike" components: block is per exact type -----

  it("2 runes + 1 moonstone -> premium 80 (75 base + 5 fee, no block)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(80);
  });
  it("3 runes + 3 moonstones -> premium 125 (120 base + 5 fee, two separate blocks)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(125);
  });

  // ----- Item-specific modifiers -----

  it("cursed sword (steel, enchantment 3) -> premium 155 (100 base + 50 curse + 5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(155);
  });
  it("sword enchantment 5 (no curse) -> premium 135 (100 base + 30 high enchantment + 5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 5, cursed: false },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(135);
  });
  it("cursed sword enchantment 5 -> premium 185 (100 base + 50 curse + 30 high enchantment + 5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 5, cursed: true },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(185);
  });
  it("sword enchantment 4 (no curse) -> premium 105 (no item modifiers)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 4, cursed: false },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(105);
  });
  it("sword enchantment 4 cursed -> premium 155 (only curse applies)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 4, cursed: true },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(155);
  });

  // ----- Multi-item policy: item modifiers apply per-item -----

  it("cursed sword + plain amulet -> premium 215 (160 base + 50 curse on sword + 5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUpContract: false,
      }).premium,
    ).toBe(215);
  });

  // ----- Policy-wide modifiers -----

  it.todo("customer with exactly 2 years -> loyalty discount applies (-20%)");
  it.todo("customer with 1 year -> no loyalty discount");
  it.todo("first contract -> first insurance surcharge (+10%)");
  it.todo("follow-up contract -> follow-up discount (-15%)");

  // ----- Rounding -----

  it.todo("premium calculation yielding 197.5 G -> final premium 198 G (round up)");

  // ----- Integration examples from the spec -----

  it.todo("newcomer with cursed sword -> premium 165 G");
  it.todo("long-standing customer's second contract with cursed enchanted sword -> premium 160 G");
});

// To make the test file compile while only it.todo entries exist,
// we provide a placeholder symbol so the import is not unused.
// The placeholder will be removed once the real implementation lives in premium.ts.
import { quote as _quotePlaceholder } from "./premium.js";
void _quotePlaceholder;
