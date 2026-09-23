import { describe, it, expect } from 'vitest';
import { quote, UnknownItemTypeError } from './quote.js';

const newcomer = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  // price list: base premium + 10% first insurance + 5 G fee
  it.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('charges the price-list base premium for a %s', (type, premium) => {
    expect(quote(newcomer, [{ type }], 0).premium).toBe(premium);
  });

  it('charges only the processing fee for an empty item list', () => {
    expect(quote(newcomer, [], 0).premium).toBe(5);
  });
});

import { policyBasePremium } from './quote.js';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('components and the building block of 3 alike components', () => {
  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('charges %i runes at %i G base premium', (count, base) => {
    expect(policyBasePremium(runes(count))).toBe(base);
  });

  it('does not form a block from components of different types', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms one block per component type', () => {
    const items = [...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))];
    expect(policyBasePremium(items)).toBe(120);
  });
});

describe('premium modifiers', () => {
  it('applies the cursed surcharge to the cursed item only, not the policy total', () => {
    // 160 base + 50 curse (50% of the sword's 100 base) + 16 first insurance + 5 fee
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quote(newcomer, items, 0).premium).toBe(231);
  });

  it('applies the high-enchantment surcharge at exactly level 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(quote(newcomer, [{ type: 'sword', enchantment: 5 }], 0).premium).toBe(145);
  });

  it('applies no high-enchantment surcharge below level 5', () => {
    expect(quote(newcomer, [{ type: 'sword', enchantment: 4 }], 0).premium).toBe(115);
  });

  it('stacks the curse and high-enchantment surcharges on one item', () => {
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    expect(quote(newcomer, [{ type: 'sword', enchantment: 5, cursed: true }], 0).premium).toBe(195);
  });

  it('grants the loyalty discount at exactly 2 years with MHPCO', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: 'sword' }], 0).premium).toBe(95);
  });

  it('grants no loyalty discount below 2 years with MHPCO', () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: 'sword' }], 0).premium).toBe(115);
  });

  it('discounts each contract after the customer first one', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quote(newcomer, [{ type: 'sword' }], 1).premium).toBe(100);
  });
});

describe('integration examples', () => {
  it('quotes a newcomer cursed sword at 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(165);
  });

  it('quotes a long-standing customer second contract at 160 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, items, 1).premium).toBe(160);
  });
});

import { insuranceSum } from './quote.js';

describe('insurance sum and cap', () => {
  it('sums the items insurance values', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('counts each of two swords separately', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('ignores the block discount, which affects the premium only', () => {
    expect(insuranceSum([{ type: 'sword' }, ...runes(3)])).toBe(1750);
  });

  it('ignores premium modifiers, which do not raise the insurance sum', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});

describe('rounding in the MHPCO favor', () => {
  it('rounds a premium up to the next whole G', () => {
    // 2 runes = 50 base; 50 - 10 loyalty + 5 first insurance - 7.5 follow-up
    // = 37.5 + 5 fee = 42.5, rounded up in the MHPCO's favor
    expect(quote({ yearsWithMHPCO: 2 }, runes(2), 1).premium).toBe(43);
  });
});

describe('unknown item types', () => {
  it('rejects a quote containing an unknown item type', () => {
    expect(() => quote(newcomer, [{ type: 'broomstick' }], 0)).toThrow(UnknownItemTypeError);
  });
});
