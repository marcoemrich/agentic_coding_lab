import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';
import type { Item } from './types.js';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra }) as Item;

const premium = (items: Item[], years = 0, previousContracts = 0) =>
  quotePremium(items, { yearsWithMHPCO: years }, previousContracts);

describe('base premiums', () => {
  it('charges 5 G processing fee for an empty item list', () => {
    expect(premium([])).toBe(5);
  });

  it('charges base premium for a sword plus first-insurance surcharge and fee', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(premium([item('sword')])).toBe(115);
  });

  it('charges base premiums for each main item type', () => {
    expect(premium([item('amulet')])).toBe(60 + 6 + 5);
    expect(premium([item('staff')])).toBe(80 + 8 + 5);
    expect(premium([item('potion')])).toBe(40 + 4 + 5);
  });

  it('rejects unknown item types', () => {
    expect(() => premium([item('broomstick')])).toThrow();
  });
});

describe('component building blocks', () => {
  it('charges 25 G per component', () => {
    // 2 runes -> 50 base, +5 first insurance, +5 fee
    expect(premium([item('rune'), item('rune')])).toBe(60);
  });

  it('applies the block price for exactly 3 alike components', () => {
    // 60 base, +6 first insurance, +5 fee
    expect(premium([item('rune'), item('rune'), item('rune')])).toBe(71);
  });

  it('does not apply the block for 4 components', () => {
    // 100 base, +10, +5
    expect(premium([item('rune'), item('rune'), item('rune'), item('rune')])).toBe(115);
  });

  it('applies one block plus singles for 7 components', () => {
    // 7 runes -> 175 base (block requires exactly 3), +17.5, +5 = 197.5 -> 198
    const runes = Array.from({ length: 7 }, () => item('rune'));
    expect(premium(runes)).toBe(198);
  });

  it('does not form a block from different component types', () => {
    // 75 base, +7.5, +5 = 87.5 -> 88
    expect(premium([item('rune'), item('rune'), item('moonstone')])).toBe(88);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    const items = [
      item('rune'), item('rune'), item('rune'),
      item('moonstone'), item('moonstone'), item('moonstone'),
    ];
    expect(premium(items)).toBe(137);
  });
});

describe('item modifiers', () => {
  it('adds a 50 % surcharge for cursed items', () => {
    // newcomer with cursed sword: 100 + 50 + 10 + 5 = 165
    expect(premium([item('sword', { cursed: true, material: 'steel', enchantment: 3 })])).toBe(165);
  });

  it('adds a 30 % surcharge for enchantment >= 5', () => {
    // 100 + 30 + 10 first + 5 = 145
    expect(premium([item('sword', { enchantment: 5 })])).toBe(145);
  });

  it('does not add the enchantment surcharge below 5', () => {
    expect(premium([item('sword', { enchantment: 4 })])).toBe(115);
  });

  it('applies item modifiers only to the affected item', () => {
    // cursed sword + plain amulet: base 160, curse +50 => 210, first insurance +16 (10% of 160) = 226, +5
    const items = [item('sword', { cursed: true }), item('amulet')];
    expect(premium(items)).toBe(210 + 16 + 5);
  });
});

describe('policy modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    // sword: 100 base, -20 loyalty, +10 first insurance, +5 fee
    expect(premium([item('sword')], 2)).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(premium([item('sword')], 1)).toBe(115);
  });

  it('applies the follow-up discount on contracts after the first', () => {
    // 3 years, second contract, cursed sword ench 7:
    // 100 + 50 + 30 = 180 item total; -20 loyalty +10 first -15 follow-up = 155 (+5) = 160
    const items = [item('sword', { cursed: true, material: 'steel', enchantment: 7 })];
    expect(premium(items, 3, 1)).toBe(160);
  });
});

describe('rounding', () => {
  it('rounds the final premium up', () => {
    // 3 runes + 1 rune? use something producing .5: single rune, 1 year:
    // 25 base + 2.5 first insurance = 27.5 + 5 = 32.5 -> 33
    expect(premium([item('rune')])).toBe(33);
  });
});
