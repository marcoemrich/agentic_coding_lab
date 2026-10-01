import { describe, it, expect } from 'vitest';
import { quote, policyBasePremium, insuranceSum, payoutCap } from './quote.js';

const newCustomer = { yearsWithMHPCO: 0 };

describe('processing fee', () => {
  it('charges 5 G processing fee for an empty item list', () => {
    expect(quote(newCustomer, [], 0)).toBe(5);
  });
});

describe('base premiums per item type', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges %s a base premium of %i G', (type, expected) => {
    expect(policyBasePremium([{ type }])).toBe(expected);
  });

  it('sums base premiums of several items', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });
});

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('component base premiums and the block of 3 alike', () => {
  it('charges 25 G per component', () => {
    expect(policyBasePremium(runes(1))).toBe(25);
  });

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('charges %i runes a base premium of %i G', (count, expected) => {
    expect(policyBasePremium(runes(count))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(policyBasePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('item-specific surcharges', () => {
  it('adds a 50 % curse surcharge on the cursed item only', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(100 + 60 + 50 + 16 + 5);
  });

  it('adds a 30 % surcharge at exactly enchantment 5', () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: 'sword', enchantment: 5 }], 0)).toBe(
      100 + 30 + 10 + 5,
    );
  });

  it('adds no high-enchantment surcharge at enchantment 4', () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: 'sword', enchantment: 4 }], 0)).toBe(100 + 10 + 5);
  });

  it('stacks curse and high-enchantment surcharges', () => {
    const items = [{ type: 'sword', enchantment: 5, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(100 + 50 + 30 + 10 + 5);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: 'sword' }], 0)).toBe(100 - 20 + 10 + 5);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: 'sword' }], 0)).toBe(100 + 10 + 5);
  });

  it('discounts 15 % on each contract after the first', () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: 'sword' }], 1)).toBe(100 + 10 - 15 + 5);
  });
});

describe('integration examples', () => {
  it('quotes a newcomer with a cursed sword at 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(165);
  });

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, items, 1)).toBe(160);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a premium up to the next whole G', () => {
    // base 60, enchantment +18, first insurance +6, follow-up -9 => 75 + 5 = 80
    const items = [{ type: 'amulet', enchantment: 5 }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 1)).toBe(80);
  });

  it('rounds a fractional premium of 197.5 G up to 198 G', () => {
    // base 200 (sword 100 + 4 runes 100, no block) + 12.5 curse on one rune
    // + 20 first insurance - 40 loyalty = 192.5, plus the 5 G fee = 197.5
    const items = [{ type: 'sword' }, { type: 'rune', cursed: true }, ...runes(3)];
    expect(quote({ yearsWithMHPCO: 2 }, items, 0)).toBe(198);
  });
});

describe('insurance sum and payout cap', () => {
  it('sums the insurance values of the covered items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('counts two swords twice', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('insures components at 250 G each, unaffected by the block discount', () => {
    expect(insuranceSum([{ type: 'sword' }, ...runes(3)])).toBe(1750);
  });

  it('caps the payout at twice the insurance sum', () => {
    expect(payoutCap([{ type: 'sword' }])).toBe(2000);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    expect(payoutCap([{ type: 'sword', cursed: true }])).toBe(2000);
  });
});

describe('unknown item types', () => {
  it('rejects a quote containing an unknown item type', () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: 'broomstick' }], 0)).toThrow(
      /unknown item type: broomstick/i,
    );
  });
});
