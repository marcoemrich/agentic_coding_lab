import { describe, expect, it } from "vitest";
import { basePremium } from "./base-premium.js";

const components = (type: string, count: number) =>
  Array.from({ length: count }, () => ({ type }));
const runes = (count: number) => components("rune", count);

describe("base premium of a policy", () => {
  it("a sword has a base premium of 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });

  it("an amulet has a base premium of 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });

  it("a staff has a base premium of 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });

  it("a potion has a base premium of 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  it("2 runes -> 50 G", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });

  it("3 runes -> 60 G (building block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("4 runes -> 100 G (no block: block requires exactly 3)", () => {
    expect(basePremium(runes(4))).toBe(100);
  });

  it("7 runes -> 175 G", () => {
    expect(basePremium(runes(7))).toBe(175);
  });

  it("1 moonstone -> 25 G (moonstone is a component)", () => {
    expect(basePremium(components("moonstone", 1))).toBe(25);
  });

  it("2 runes + 1 moonstone -> 75 G (no block: different types)", () => {
    expect(basePremium([...runes(2), ...components("moonstone", 1)])).toBe(75);
  });

  it("3 runes + 3 moonstones -> 120 G (two separate blocks)", () => {
    expect(basePremium([...runes(3), ...components("moonstone", 3)])).toBe(120);
  });

  it("a sword and 3 runes -> 160 G (block combines with main items)", () => {
    expect(basePremium([{ type: "sword" }, ...runes(3)])).toBe(160);
  });

});
