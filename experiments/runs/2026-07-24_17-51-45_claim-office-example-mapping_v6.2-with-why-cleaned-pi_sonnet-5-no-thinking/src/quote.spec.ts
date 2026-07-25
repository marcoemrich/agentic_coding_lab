import { describe, it, expect } from "vitest";
import { calculatePremium } from "./quote.js";

describe("Quote premium calculation", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const premium = calculatePremium({ customer: { yearsWithMHPCO: 0 }, items: [] });
    expect(premium).toBe(5);
  });

  it("each main item type priced from the MHPCO price list for a newcomer's first contract -> sword 115 G, amulet 71 G, staff 93 G, potion 49 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(calculatePremium({ customer, items: [{ type: "sword" }] })).toBe(115);
    expect(calculatePremium({ customer, items: [{ type: "amulet" }] })).toBe(71);
    expect(calculatePremium({ customer, items: [{ type: "staff" }] })).toBe(93);
    expect(calculatePremium({ customer, items: [{ type: "potion" }] })).toBe(49);
  });

  it("components without a block: block requires exactly 3 alike components -> 2 runes 60 G, 4 runes 115 G, 7 runes 198 G (rounded up)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: "rune" }));
    expect(calculatePremium({ customer, items: runes(2) })).toBe(60);
    expect(calculatePremium({ customer, items: runes(4) })).toBe(115);
    expect(calculatePremium({ customer, items: runes(7) })).toBe(198);
  });

  it("alike components are grouped by type only -> 2 runes + 1 moonstone 88 G (no block); 3 runes + 3 moonstones 137 G (two separate blocks)", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      calculatePremium({
        customer,
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      })
    ).toBe(88);
    expect(
      calculatePremium({
        customer,
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      })
    ).toBe(137);
  });

  it("Newcomer with a cursed sword integration example -> premium 165 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculatePremium({
      customer,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
    });
    expect(premium).toBe(165);
  });

  it("high-enchantment surcharge applies at enchantment >= 5 -> enchant 4: 115 G (no surcharge), enchant 5: 145 G, enchant 5 + cursed: 195 G (both surcharges)", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(
      calculatePremium({ customer, items: [{ type: "sword", enchantment: 4 }] })
    ).toBe(115);
    expect(
      calculatePremium({ customer, items: [{ type: "sword", enchantment: 5 }] })
    ).toBe(145);
    expect(
      calculatePremium({
        customer,
        items: [{ type: "sword", enchantment: 5, cursed: true }],
      })
    ).toBe(195);
  });

  it("loyalty discount applies for customers with exactly 2 years with MHPCO -> premium 95 G for a single sword", () => {
    const customer = { yearsWithMHPCO: 2 };
    const premium = calculatePremium({ customer, items: [{ type: "sword" }] });
    expect(premium).toBe(95);
  });

  it("Long-standing customer's second contract integration example -> premium 160 G (first-insurance surcharge always applies per item; follow-up discount also applies)", () => {
    const customer = { yearsWithMHPCO: 3 };
    const premium = calculatePremium(
      {
        customer,
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      },
      { isFollowUpContract: true }
    );
    expect(premium).toBe(160);
  });

  it("modifier scope on multi-item policy: item-specific surcharges scope to the item's base premium, policy-wide modifiers scope to the policy base premium -> cursed sword + amulet, newcomer/first contract = 231 G", () => {
    const customer = { yearsWithMHPCO: 0 };
    const premium = calculatePremium({
      customer,
      items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ],
    });
    expect(premium).toBe(231);
  });
});
