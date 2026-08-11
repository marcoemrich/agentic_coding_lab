import { describe, it, expect } from 'vitest';
import { componentsBasePremium, quotePremium } from './premium.js';
import type { Item } from './types.js';

const sword = (o: Partial<Item> = {}): Item => ({ type: 'sword', ...o });
const rune = (o: Partial<Item> = {}): Item => ({ type: 'rune', ...o });
const moonstone = (o: Partial<Item> = {}): Item => ({ type: 'moonstone', ...o });

// A neutral customer: no loyalty, and we look at the first contract.
const NEW_CUSTOMER = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  it('charges the price-list base premium plus first insurance and fee', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([sword()], NEW_CUSTOMER, 0)).toBe(115);
  });

  it('prices amulet, staff and potion from the price list', () => {
    expect(quotePremium([{ type: 'amulet' }], NEW_CUSTOMER, 0)).toBe(60 + 6 + 5);
    expect(quotePremium([{ type: 'staff' }], NEW_CUSTOMER, 0)).toBe(80 + 8 + 5);
    expect(quotePremium([{ type: 'potion' }], NEW_CUSTOMER, 0)).toBe(40 + 4 + 5);
  });

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], NEW_CUSTOMER, 0)).toBe(5);
  });

  it('rejects unknown item types', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], NEW_CUSTOMER, 0)).toThrow();
  });
});

describe('component building blocks', () => {
  // The examples give base premiums in isolation, before any policy-wide
  // modifier or the fee.
  const basePremium = componentsBasePremium;

  it('charges 25 G per component when no block applies', () => {
    expect(basePremium([rune(), rune()])).toBe(50);
  });

  it('charges 60 G for a block of exactly 3 alike components', () => {
    expect(basePremium([rune(), rune(), rune()])).toBe(60);
  });

  it('does not apply the block to 4 components', () => {
    expect(basePremium([rune(), rune(), rune(), rune()])).toBe(100);
  });

  it('applies one block and charges the rest individually for 7 components', () => {
    expect(basePremium([rune(), rune(), rune(), rune(), rune(), rune(), rune()])).toBe(175);
  });

  it('treats different component types as not alike', () => {
    expect(basePremium([rune(), rune(), moonstone()])).toBe(75);
  });

  it('forms separate blocks per component type', () => {
    const items = [rune(), rune(), rune(), moonstone(), moonstone(), moonstone()];
    expect(basePremium(items)).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('applies the curse surcharge only to the cursed item', () => {
    // policy base 100 + 60 = 160; curse adds 50 (50% of the sword only);
    // first insurance is 10% of the policy base = 16; fee 5.
    const items: Item[] = [sword({ cursed: true }), { type: 'amulet' }];
    expect(quotePremium(items, NEW_CUSTOMER, 0)).toBe(160 + 50 + 16 + 5);
  });

  it('applies the high-enchantment surcharge from level 5', () => {
    expect(quotePremium([sword({ enchantment: 5 })], NEW_CUSTOMER, 0)).toBe(100 + 30 + 10 + 5);
  });

  it('does not apply the high-enchantment surcharge below level 5', () => {
    expect(quotePremium([sword({ enchantment: 4 })], NEW_CUSTOMER, 0)).toBe(100 + 10 + 5);
  });

  it('stacks curse and high enchantment on the same item', () => {
    const items = [sword({ enchantment: 5, cursed: true })];
    expect(quotePremium(items, NEW_CUSTOMER, 0)).toBe(100 + 50 + 30 + 10 + 5);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount from exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([sword()], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(quotePremium([sword()], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('discounts every contract after the first by 15 %', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium([sword()], NEW_CUSTOMER, 1)).toBe(100);
  });

  it('bases policy-wide modifiers on the sum of all item base premiums', () => {
    // base 160; loyalty -32; first insurance +16; fee 5
    const items: Item[] = [sword(), { type: 'amulet' }];
    expect(quotePremium(items, { yearsWithMHPCO: 5 }, 0)).toBe(160 - 32 + 16 + 5);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final premium up', () => {
    // rune 25 base + 2.5 first insurance - 3.75 follow-up = 23.75,
    // + 5 fee = 28.75 -> 29
    expect(quotePremium([rune()], NEW_CUSTOMER, 1)).toBe(29);
  });

  it('keeps intermediate amounts as fractions', () => {
    // Two runes rounded individually would give 15 + 15 = 30; rounding only
    // at the end yields 2 x 23.75 = 47.5 + 5 = 52.5 -> 53.
    expect(quotePremium([rune(), rune()], NEW_CUSTOMER, 1)).toBe(53);
  });
});

describe('integration examples', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    const items = [sword({ material: 'steel', enchantment: 3, cursed: true })];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    const items = [sword({ material: 'steel', enchantment: 7, cursed: true })];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});
