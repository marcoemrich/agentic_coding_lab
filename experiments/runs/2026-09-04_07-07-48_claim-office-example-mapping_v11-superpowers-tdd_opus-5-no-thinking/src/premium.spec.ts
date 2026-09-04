import { describe, expect, test } from 'vitest';

import { basePremium, itemModifierTotal, type Item } from './premium.js';

describe('base premium for main items', () => {
  test('a sword has a base premium of 100 G', () => {
    expect(basePremium([{ type: 'sword' }])).toBe(100);
  });

  test('an amulet has a base premium of 60 G', () => {
    expect(basePremium([{ type: 'amulet' }])).toBe(60);
  });

  test('a staff has a base premium of 80 G', () => {
    expect(basePremium([{ type: 'staff' }])).toBe(80);
  });

  test('a potion has a base premium of 40 G', () => {
    expect(basePremium([{ type: 'potion' }])).toBe(40);
  });

  test('a policy base premium is the sum of its item base premiums', () => {
    expect(basePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });
});

const runes = (count: number): Item[] =>
  Array.from({ length: count }, () => ({ type: 'rune' }));

describe('component base premiums and the block of 3 alike', () => {
  test('2 runes cost 25 G each', () => {
    expect(basePremium(runes(2))).toBe(50);
  });

  test('3 alike runes form a block at 60 G', () => {
    expect(basePremium(runes(3))).toBe(60);
  });

  test('4 runes form no block — a block requires exactly 3', () => {
    expect(basePremium(runes(4))).toBe(100);
  });

  test('7 runes form no block', () => {
    expect(basePremium(runes(7))).toBe(175);
  });

  test('2 runes and 1 moonstone form no block — different types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  test('3 runes and 3 moonstones form two separate blocks', () => {
    expect(
      basePremium([
        ...runes(3),
        ...Array.from({ length: 3 }, () => ({ type: 'moonstone' })),
      ]),
    ).toBe(120);
  });
});

describe('item-scoped modifiers', () => {
  test('a cursed sword adds 50 % of its own base premium', () => {
    expect(itemModifierTotal([{ type: 'sword', cursed: true }])).toBe(50);
  });

  test('the cursed surcharge ignores the base premium of other items', () => {
    expect(
      itemModifierTotal([{ type: 'sword', cursed: true }, { type: 'amulet' }]),
    ).toBe(50);
  });

  test('enchantment 5 adds a 30 % high-enchantment surcharge', () => {
    expect(itemModifierTotal([{ type: 'sword', enchantment: 5 }])).toBe(30);
  });

  test('enchantment 4 adds no high-enchantment surcharge', () => {
    expect(itemModifierTotal([{ type: 'sword', enchantment: 4 }])).toBe(0);
  });

  test('a cursed, highly enchanted sword adds both surcharges', () => {
    expect(
      itemModifierTotal([{ type: 'sword', cursed: true, enchantment: 5 }]),
    ).toBe(80);
  });

  test('a plain item adds nothing', () => {
    expect(itemModifierTotal([{ type: 'sword' }])).toBe(0);
  });
});
