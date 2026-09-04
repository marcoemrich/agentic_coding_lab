import { describe, expect, test } from 'vitest';

import { quotePremium } from './quote.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

describe('quote premium', () => {
  test('an empty item list costs only the 5 G processing fee', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  test('a newcomer with a cursed sword pays 165 G', () => {
    // 100 base + 50 curse + 10 first insurance = 160, + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        newcomer,
        0,
      ),
    ).toBe(165);
  });

  test("a long-standing customer's second contract with a cursed sword pays 160 G", () => {
    // 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first - 15 follow-up
    // = 155, + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        loyal,
        1,
      ),
    ).toBe(160);
  });

  test('exactly 2 years with MHPCO earns the loyalty discount', () => {
    // 100 base - 20 loyalty + 10 first insurance = 90, + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  test('1 year with MHPCO earns no loyalty discount', () => {
    // 100 base + 10 first insurance = 110, + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  test('the cursed surcharge applies to the cursed item, not the policy total', () => {
    // base 160 (sword 100 + amulet 60) + 50 curse + 16 first insurance = 226,
    // + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        newcomer,
        0,
      ),
    ).toBe(231);
  });

  test('a fractional premium is rounded up, in the MHPCO favour', () => {
    // base 50 (2 runes), follow-up -7.5, first insurance +5 => 47.5,
    // + 5 fee = 52.5, rounded up to 53
    expect(
      quotePremium([{ type: 'rune' }, { type: 'rune' }], newcomer, 1),
    ).toBe(53);
  });

  test('intermediate fractions are not rounded before the final premium', () => {
    // base 50, follow-up -7.5, first +5 => 47.5; rounding the -7.5 early
    // would give a different answer than rounding only at the end
    expect(
      quotePremium([{ type: 'rune' }, { type: 'rune' }], newcomer, 1),
    ).not.toBe(52);
  });
});
