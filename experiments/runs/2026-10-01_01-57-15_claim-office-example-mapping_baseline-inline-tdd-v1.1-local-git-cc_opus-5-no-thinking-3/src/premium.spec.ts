import { describe, it, expect } from 'vitest';
import {
  quotePremium,
  policyBasePremium,
  premiumBeforeFee,
  roundPremium,
} from './premium.js';

const newCustomer = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium(newCustomer, [], 0)).toBe(5);
  });

  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges the %s base premium', (type, base) => {
    // base + 10% first insurance + 5 G fee
    expect(quotePremium(newCustomer, [{ type }], 0)).toBe(base + base * 0.1 + 5);
  });
});

describe('component building blocks', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('charges %i runes at %i G base premium', (count, expected) => {
    expect(policyBasePremium(runes(count))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(
      policyBasePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }]),
    ).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    expect(
      policyBasePremium([
        ...runes(3),
        { type: 'moonstone' },
        { type: 'moonstone' },
        { type: 'moonstone' },
      ]),
    ).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('applies the cursed surcharge only to the cursed item, not the policy total', () => {
    // 160 G policy base + 50 G (50% of the cursed sword's 100 G base)
    expect(
      premiumBeforeFee(newCustomer, [{ type: 'sword', cursed: true }, { type: 'amulet' }], 0, {
        firstInsurance: false,
      }),
    ).toBe(210);
  });

  it('applies the high-enchantment surcharge at exactly enchantment 5', () => {
    expect(
      premiumBeforeFee(newCustomer, [{ type: 'sword', enchantment: 5 }], 0, {
        firstInsurance: false,
      }),
    ).toBe(130);
  });

  it('applies no high-enchantment surcharge at enchantment 4', () => {
    expect(
      premiumBeforeFee(newCustomer, [{ type: 'sword', enchantment: 4 }], 0, {
        firstInsurance: false,
      }),
    ).toBe(100);
  });

  it('stacks curse and high enchantment on the same item', () => {
    expect(
      premiumBeforeFee(newCustomer, [{ type: 'sword', enchantment: 5, cursed: true }], 0, {
        firstInsurance: false,
      }),
    ).toBe(180);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years with MHPCO', () => {
    // 100 base + 10 first insurance - 20 loyalty + 5 fee
    expect(quotePremium({ yearsWithMHPCO: 2 }, [{ type: 'sword' }], 0)).toBe(95);
  });

  it('grants no loyalty discount at 1 year with MHPCO', () => {
    expect(quotePremium({ yearsWithMHPCO: 1 }, [{ type: 'sword' }], 0)).toBe(115);
  });

  it('discounts each contract after the first by 15 %', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium(newCustomer, [{ type: 'sword' }], 1)).toBe(100);
  });
});

describe('integration examples', () => {
  it('quotes 165 G for a newcomer with a cursed sword', () => {
    expect(
      quotePremium({ yearsWithMHPCO: 0 }, [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
      ], 0),
    ).toBe(165);
  });

  it("quotes 160 G for a long-standing customer's second contract", () => {
    expect(
      quotePremium({ yearsWithMHPCO: 3 }, [
        { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
      ], 1),
    ).toBe(160);
  });
});

describe('rounding and validation', () => {
  it('rounds a fractional premium up, in the MHPCO favour', () => {
    expect(roundPremium(197.5)).toBe(198);
    expect(roundPremium(197.1)).toBe(198);
    expect(roundPremium(197)).toBe(197);
  });

  it('rejects an unknown item type', () => {
    expect(() => quotePremium(newCustomer, [{ type: 'broomstick' }], 0)).toThrow(
      /unknown item type: broomstick/i,
    );
  });
});
