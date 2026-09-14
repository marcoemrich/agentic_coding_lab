import { describe, it, expect } from 'vitest';
import { computePremium, policyBasePremium, insuranceSum } from './premium.js';
import { UnknownItemTypeError } from './domain.js';

const plain = (type: string) => ({ type });
const repeat = (type: string, n: number) => Array.from({ length: n }, () => plain(type));
const newcomer = { yearsWithMHPCO: 0 };

describe('base premiums per item', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges the price-list base premium for a %s', (type, expected) => {
    expect(policyBasePremium([plain(type)])).toBe(expected);
  });
});

describe('building block of 3 alike components', () => {
  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('charges %i runes at %i G base premium', (count, expected) => {
    expect(policyBasePremium(repeat('rune', count))).toBe(expected);
  });

  it('does not form a block from components of different types', () => {
    expect(policyBasePremium([...repeat('rune', 2), plain('moonstone')])).toBe(75);
  });

  it('applies two separate blocks to 3 runes and 3 moonstones', () => {
    expect(policyBasePremium([...repeat('rune', 3), ...repeat('moonstone', 3)])).toBe(120);
  });
});

describe('modifier scope on multi-item policies', () => {
  it('applies the curse surcharge to the cursed item only', () => {
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    // 160 base + 50 curse + 16 first insurance = 226 + 5 fee
    expect(computePremium(items, newcomer, false)).toBe(231);
  });
});

describe('modifier thresholds', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(computePremium([plain('sword')], { yearsWithMHPCO: 2 }, false)).toBe(95);
  });

  it('applies the high-enchantment surcharge at exactly enchantment 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(computePremium([{ type: 'sword', enchantment: 5 }], newcomer, false)).toBe(145);
  });

  it('applies both surcharges to a cursed, highly enchanted item', () => {
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    expect(
      computePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer, false),
    ).toBe(195);
  });

  it('applies no high-enchantment surcharge at enchantment 4', () => {
    expect(computePremium([{ type: 'sword', enchantment: 4 }], newcomer, false)).toBe(115);
  });
});

describe('integration examples', () => {
  it('quotes a newcomer with a cursed sword at 165 G', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(computePremium([item], newcomer, false)).toBe(165);
  });

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(computePremium([item], { yearsWithMHPCO: 3 }, true)).toBe(160);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional premium up', () => {
    // 3 potions: 120 base + 12 first insurance = 132; a moonstone pair adds
    // 50 base + 5 => 187.5 after the 15% follow-up discount on the base.
    const items = [...repeat('potion', 3), ...repeat('moonstone', 2)];
    const exact = 170 * 1.1 - 170 * 0.15 + 5;
    expect(exact % 1).not.toBe(0);
    expect(computePremium(items, newcomer, true)).toBe(Math.ceil(exact));
  });
});

describe('edge cases', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(computePremium([], newcomer, false)).toBe(5);
  });

  it('rejects an unknown item type', () => {
    expect(() => computePremium([plain('broomstick')], newcomer, false)).toThrow(
      UnknownItemTypeError,
    );
  });
});

describe('insurance sum', () => {
  it('sums the unmodified insurance values of two swords', () => {
    expect(insuranceSum(repeat('sword', 2))).toBe(2000);
  });

  it('sums a sword and an amulet', () => {
    expect(insuranceSum([plain('sword'), plain('amulet')])).toBe(1600);
  });

  it('is unaffected by the block discount', () => {
    expect(insuranceSum([plain('sword'), ...repeat('rune', 3)])).toBe(1750);
  });

  it('is unaffected by premium modifiers', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});
