import { describe, it, expect } from 'vitest';
import { quotePremium } from './quote.js';

const newcomer = { yearsWithMHPCO: 0 };
const longStanding = { yearsWithMHPCO: 3 };

describe('processing fee', () => {
  it('charges only the 5 G processing fee for an empty item list', () => {
    expect(quotePremium({ items: [], customer: newcomer, previousContracts: 0 })).toBe(5);
  });
});

describe('first insurance surcharge', () => {
  it('adds 10 % of the policy base premium', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(
      quotePremium({ items: [{ type: 'sword' }], customer: newcomer, previousContracts: 0 }),
    ).toBe(115);
  });
});

describe('curse surcharge', () => {
  it('adds 50 % of the cursed item base premium, not of the policy total', () => {
    // base 160 + curse 50 + first 16 + fee 5
    expect(
      quotePremium({
        items: [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        customer: newcomer,
        previousContracts: 0,
      }),
    ).toBe(231);
  });
});

describe('high enchantment surcharge', () => {
  it('applies at exactly enchantment 5', () => {
    // base 100 + high 30 + first 10 + fee 5
    expect(
      quotePremium({
        items: [{ type: 'sword', enchantment: 5 }],
        customer: newcomer,
        previousContracts: 0,
      }),
    ).toBe(145);
  });

  it('does not apply at enchantment 4', () => {
    expect(
      quotePremium({
        items: [{ type: 'sword', enchantment: 4 }],
        customer: newcomer,
        previousContracts: 0,
      }),
    ).toBe(115);
  });

  it('stacks with the curse surcharge', () => {
    // base 100 + curse 50 + high 30 + first 10 + fee 5
    expect(
      quotePremium({
        items: [{ type: 'sword', enchantment: 5, cursed: true }],
        customer: newcomer,
        previousContracts: 0,
      }),
    ).toBe(195);
  });
});

describe('loyalty discount', () => {
  it('applies at exactly 2 years with MHPCO', () => {
    // base 100 - loyalty 20 + first 10 + fee 5
    expect(
      quotePremium({
        items: [{ type: 'sword' }],
        customer: { yearsWithMHPCO: 2 },
        previousContracts: 0,
      }),
    ).toBe(95);
  });

  it('does not apply at 1 year with MHPCO', () => {
    expect(
      quotePremium({
        items: [{ type: 'sword' }],
        customer: { yearsWithMHPCO: 1 },
        previousContracts: 0,
      }),
    ).toBe(115);
  });
});

describe('integration examples from the kata', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    expect(
      quotePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        customer: newcomer,
        previousContracts: 0,
      }),
    ).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    expect(
      quotePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        customer: longStanding,
        previousContracts: 1,
      }),
    ).toBe(160);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional premium up', () => {
    // moonstone base 25 - loyalty 5 + first insurance 2.5 = 22.5 + 5 fee = 27.5
    expect(
      quotePremium({
        items: [{ type: 'moonstone' }],
        customer: { yearsWithMHPCO: 2 },
        previousContracts: 0,
      }),
    ).toBe(28);
  });
});
