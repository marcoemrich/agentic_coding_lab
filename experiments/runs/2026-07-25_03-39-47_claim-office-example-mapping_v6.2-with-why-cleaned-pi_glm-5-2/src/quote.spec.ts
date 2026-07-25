import { describe, it, expect } from "vitest";
import { policyBasePremium, insuranceSum, quotePremium } from "./quote.js";

describe("Quote - base premium and insurance sum", () => {
  it("empty item list -> policy base premium 0", () => {
    expect(policyBasePremium([])).toBe(0);
  });
  it("single main item base premiums: sword 100, amulet 60, staff 80, potion 40", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("single component base premium: rune 25, moonstone 25", () => {
    expect(policyBasePremium([{ type: "rune" }])).toBe(25);
    expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("component block & alike: 2 runes 50, 3 runes 60 (block), 4 runes 100, 7 runes 175, 2 runes+1 moonstone 75, 3 runes+3 moonstones 120 (two blocks)", () => {
    const rune = (n: number) => Array(n).fill({ type: "rune" });
    expect(policyBasePremium(rune(2))).toBe(50);
    expect(policyBasePremium(rune(3))).toBe(60);
    expect(policyBasePremium(rune(4))).toBe(100);
    expect(policyBasePremium(rune(7))).toBe(175);
    expect(policyBasePremium([...rune(2), { type: "moonstone" }])).toBe(75);
    expect(policyBasePremium([...rune(3), ...Array(3).fill({ type: "moonstone" })])).toBe(120);
  });
  it("insurance sum: sword+amulet 1600, two swords 2000, sword+3 runes(block) 1750", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
    expect(
      insuranceSum([{ type: "sword" }, ...Array(3).fill({ type: "rune" })])
    ).toBe(1750);
  });
});

describe("Quote - full premium", () => {
  it("empty items (0 years, first contract) -> premium 5 (only processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, false)).toBe(5);
  });
  it("newcomer cursed sword (steel, ench 3, 0 years, first contract) -> 165", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(165);
  });
  it("long-standing second contract cursed sword (steel, ench 7, 3 years, follow-up) -> 160", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        true
      )
    ).toBe(160);
  });
  it("cursed sword + plain amulet (0 years, first contract) -> 231 (item-specific curse on item base; 210 base+curse + 16 first insurance + 5 fee)", () => {
    expect(
      quotePremium(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(231);
  });
  it("loyalty at exactly 2 years: plain sword (2 years, first contract) -> 95", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, false)).toBe(
      95
    );
  });
  it("high enchantment at exactly 5: sword ench 5 (0 years, first) -> 145; cursed -> 195 (both surcharges)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5, cursed: false }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(145);
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(195);
  });
  it("enchantment 4: sword ench 4 (0 years, first) not cursed -> 115; cursed -> 165 (no high-ench)", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4, cursed: false }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(115);
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4, cursed: true }],
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(165);
  });
  it("premium rounds up (MHPCO favor): 7 runes (0 years, first) -> 198 (197.5 -> 198)", () => {
    expect(
      quotePremium(
        Array(7).fill({ type: "rune" }),
        { yearsWithMHPCO: 0 },
        false
      )
    ).toBe(198);
  });
});
