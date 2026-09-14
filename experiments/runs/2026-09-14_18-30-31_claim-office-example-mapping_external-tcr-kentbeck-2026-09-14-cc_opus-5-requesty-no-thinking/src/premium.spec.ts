import { describe, expect, it } from 'vitest';
import { policyBasePremium, quotePremium, UnknownItemError } from './premium.js';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('policy base premium', () => {
  it('sums main item base premiums', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });

  it('prices component blocks of exactly three alike components', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
    expect(policyBasePremium(runes(3))).toBe(60);
    expect(policyBasePremium(runes(4))).toBe(100);
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  it('treats alike as same type', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
    expect(
      policyBasePremium([...runes(3), { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }]),
    ).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => policyBasePremium([{ type: 'broomstick' }])).toThrow(UnknownItemError);
  });

  it('prices an empty policy at zero', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});

describe('quote premium', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  it('charges only the processing fee for an empty policy', () => {
    expect(quotePremium([], newcomer, false)).toBe(5);
  });

  it('prices a newcomer with a cursed sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, newcomer, false)).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, true)).toBe(160);
  });

  it('applies item modifiers only to the affected item', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    // base 160 + 50 curse + 16 first insurance = 226
    expect(quotePremium(items, newcomer, false)).toBe(231);
  });

  it('applies loyalty at exactly two years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, false)).toBe(95);
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, false)).toBe(115);
  });

  it('applies the high enchantment surcharge at exactly five', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, false)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, false)).toBe(115);
  });

  it('rounds the final premium up', () => {
    // amulet base 60, cursed 30, first insurance 6 => 96 + 5 = 101
    expect(quotePremium([{ type: 'amulet', cursed: true }], newcomer, false)).toBe(101);
    // potion 40 + high ench 12 + 4 = 56 + 5 = 61
    expect(quotePremium([{ type: 'potion', enchantment: 9 }], newcomer, false)).toBe(61);
    // staff 80, loyalty -16, first +8, follow-up -12 => 60 + 5 = 65
    expect(quotePremium([{ type: 'staff' }], { yearsWithMHPCO: 5 }, true)).toBe(65);
  });
});
