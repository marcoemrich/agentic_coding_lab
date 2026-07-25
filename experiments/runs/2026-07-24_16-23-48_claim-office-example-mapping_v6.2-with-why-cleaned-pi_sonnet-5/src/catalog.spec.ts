import { describe, it, expect } from "vitest";
import { computeItemsBasePremium, computeInsuranceSum } from "./catalog.js";

describe("Catalog - item base premiums", () => {
  it("empty item list has a base premium of 0 G", () => {
    expect(computeItemsBasePremium([])).toBe(0);
  });
  it("a single sword has a base premium of 100 G", () => {
    expect(computeItemsBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("a single amulet has a base premium of 60 G", () => {
    expect(computeItemsBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("a single staff has a base premium of 80 G", () => {
    expect(computeItemsBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("a single potion has a base premium of 40 G", () => {
    expect(computeItemsBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("a single rune has a base premium of 25 G", () => {
    expect(computeItemsBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("2 runes have a base premium of 50 G -- no block", () => {
    expect(computeItemsBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes have a base premium of 60 G -- block applies", () => {
    expect(computeItemsBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes have a base premium of 100 G -- no block, requires exactly 3", () => {
    expect(
      computeItemsBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(100);
  });
  it("7 runes have a base premium of 175 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(computeItemsBasePremium(runes)).toBe(175);
  });
  it("2 runes + 1 moonstone have a base premium of 75 G -- different types, no block", () => {
    expect(
      computeItemsBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])
    ).toBe(75);
  });
  it("3 runes + 3 moonstones have a base premium of 120 G -- two separate blocks", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(computeItemsBasePremium(items)).toBe(120);
  });
  it("throws for an item with an unknown type -- e.g. broomstick", () => {
    expect(() => computeItemsBasePremium([{ type: "broomstick" }])).toThrow();
  });
});

describe("Catalog - insurance sums", () => {
  it("a sword + an amulet have an insurance sum of 1600 G", () => {
    expect(computeInsuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("two swords have an insurance sum of 2000 G", () => {
    expect(computeInsuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("a sword + 3 runes have an insurance sum of 1750 G -- block discount doesn't reduce insurance sum", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(computeInsuranceSum(items)).toBe(1750);
  });
});
