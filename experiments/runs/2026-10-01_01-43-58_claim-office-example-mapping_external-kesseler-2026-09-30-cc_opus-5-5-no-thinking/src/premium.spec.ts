import { describe, expect, it } from 'vitest';
import { basePremium, Customer, Item, quotePremium } from './premium';

describe('basePremium', () => {
  it('is zero for an empty item list', () => {
    const items: Item[] = [];

    const result = basePremium(items);

    expect(result).toBe(0);
  });

  it('is 100 for a sword', () => {
    const items: Item[] = [{ type: 'sword' }];

    const result = basePremium(items);

    expect(result).toBe(100);
  });

  it.each([
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('is the price-list base premium for a %s', (type, expected) => {
    const items: Item[] = [{ type }];

    const result = basePremium(items);

    expect(result).toBe(expected);
  });

  it.each([
    [1, 25],
    [2, 50],
  ])('charges 25 per component for %i runes', (count, expected) => {
    const items: Item[] = runes(count);

    const result = basePremium(items);

    expect(result).toBe(expected);
  });

  it('charges the 60 G block premium for exactly 3 runes', () => {
    const items: Item[] = runes(3);

    const result = basePremium(items);

    expect(result).toBe(60);
  });

  it.each([
    [4, 100],
    [7, 175],
  ])('applies no block for %i runes because a block requires exactly 3', (count, expected) => {
    const items: Item[] = runes(count);

    const result = basePremium(items);

    expect(result).toBe(expected);
  });

  it('applies no block to 2 runes and 1 moonstone because they are different types', () => {
    const items: Item[] = [...runes(2), ...moonstones(1)];

    const result = basePremium(items);

    expect(result).toBe(75);
  });

  it('applies two separate blocks to 3 runes and 3 moonstones', () => {
    const items: Item[] = [...runes(3), ...moonstones(3)];

    const result = basePremium(items);

    expect(result).toBe(120);
  });

  it('applies no block to 3 swords because blocks are for components only', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'sword' }, { type: 'sword' }];

    const result = basePremium(items);

    expect(result).toBe(300);
  });

  it('rejects an item of unknown type', () => {
    const items: Item[] = [{ type: 'broomstick' }];

    const calculate = () => basePremium(items);

    expect(calculate).toThrow('Unknown item type: broomstick');
  });
});

describe('quotePremium', () => {
  const newcomer: Customer = { yearsWithMHPCO: 0 };

  it('is only the processing fee for an empty item list', () => {
    const items: Item[] = [];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(5);
  });

  it('adds the first insurance surcharge and processing fee to a plain sword', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(115);
  });

  it('adds the curse surcharge for a newcomer with a cursed sword', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(165);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    const items: Item[] = [
      { type: 'sword', cursed: true },
      { type: 'amulet', cursed: false },
    ];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(231);
  });

  it('adds the high-enchantment surcharge for a sword with exactly enchantment 5', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 5, cursed: false }];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(145);
  });

  it('adds only the curse surcharge for a cursed sword with enchantment 4', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 4, cursed: true }];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(165);
  });

  it('adds both surcharges for a cursed sword with exactly enchantment 5', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 5, cursed: true }];

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(195);
  });

  it('grants the loyalty discount to a customer with exactly 2 years', () => {
    const items: Item[] = [{ type: 'sword' }];

    const premium = quotePremium(items, { yearsWithMHPCO: 2 }, false);

    expect(premium).toBe(95);
  });

  it('grants no loyalty discount to a customer with 1 year', () => {
    const items: Item[] = [{ type: 'sword' }];

    const premium = quotePremium(items, { yearsWithMHPCO: 1 }, false);

    expect(premium).toBe(115);
  });

  it('grants the follow-up discount on a long-standing customer\'s second contract', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];

    const premium = quotePremium(items, { yearsWithMHPCO: 3 }, true);

    expect(premium).toBe(160);
  });

  it('rounds a fractional premium up in the MHPCO\'s favor', () => {
    const items: Item[] = runes(1);

    const premium = quotePremium(items, newcomer, false);

    expect(premium).toBe(33);
  });
});

function runes(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: 'rune' }));
}

function moonstones(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: 'moonstone' }));
}
