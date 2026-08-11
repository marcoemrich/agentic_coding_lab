import { describe, it, expect } from 'vitest';
import { quotePremium } from './quote.js';
import type { Item } from './types.js';

const newcomer = { yearsWithMHPCO: 0 };
const sword = (extra: Partial<Item> = {}): Item => ({ type: 'sword', ...extra });

/** A quote that is the customer's first contract, so no follow-up discount. */
const firstContract = { customer: newcomer, previousContracts: 0 };

describe('item-specific surcharges', () => {
  it('adds 50 % of the item base premium for a cursed item', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(quotePremium([sword({ cursed: true })], firstContract)).toBe(165);
  });

  it('adds 30 % for enchantment level 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(quotePremium([sword({ enchantment: 5 })], firstContract)).toBe(145);
  });

  it('does not add the enchantment surcharge below level 5', () => {
    expect(quotePremium([sword({ enchantment: 4 })], firstContract)).toBe(115);
  });

  it('stacks curse and enchantment surcharges', () => {
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    expect(quotePremium([sword({ enchantment: 5, cursed: true })], firstContract)).toBe(195);
  });

  it('applies an item surcharge only to the affected item, not the policy total', () => {
    // 160 policy base + 50 curse (of the sword only) + 16 first insurance + 5 fee
    const items = [sword({ cursed: true }), { type: 'amulet' }];
    expect(quotePremium(items, firstContract)).toBe(231);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([sword()], { customer: { yearsWithMHPCO: 2 }, previousContracts: 0 })).toBe(95);
  });

  it('withholds the loyalty discount below 2 years', () => {
    expect(quotePremium([sword()], { customer: { yearsWithMHPCO: 1 }, previousContracts: 0 })).toBe(115);
  });

  it('discounts 15 % on each contract after the first', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium([sword()], { customer: newcomer, previousContracts: 1 })).toBe(100);
  });

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], firstContract)).toBe(5);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional premium up', () => {
    // 2 runes: 50 base + 12.5 curse (50 % of one rune) + 5 first insurance
    // + 5 fee = 72.5 -> 73
    const items: Item[] = [{ type: 'rune', cursed: true }, { type: 'rune' }];
    expect(quotePremium(items, firstContract)).toBe(73);
  });
});

describe('integration examples', () => {
  it('quotes a newcomer with a cursed sword at 165 G', () => {
    const items = [sword({ material: 'steel', enchantment: 3, cursed: true })];
    expect(quotePremium(items, firstContract)).toBe(165);
  });

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const items = [sword({ material: 'steel', enchantment: 7, cursed: true })];
    expect(quotePremium(items, { customer: { yearsWithMHPCO: 3 }, previousContracts: 1 })).toBe(160);
  });
});

describe('unknown items', () => {
  it('rejects a quote containing an unknown item type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], firstContract)).toThrow(/broomstick/);
  });
});
