import { describe, expect, it } from 'vitest';
import { quotePremium, insuranceSum } from './quote.js';

describe('quote premium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });

  it('prices a newcomer with a cursed sword', () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });

  it('grants the loyalty discount at exactly 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('applies item surcharges per item, not to the policy total', () => {
    expect(
      quotePremium(
        [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(231);
  });

  it('applies the high-enchantment surcharge to a component-free policy', () => {
    expect(quotePremium([{ type: 'potion', enchantment: 5 }], { yearsWithMHPCO: 0 }, 0)).toBe(61);
  });

  it('rounds up in the MHPCO favour', () => {
    // block of 3 runes: base 60, curse on one rune 12.5 → 72.5 + 6 first insurance + 5 fee = 83.5
    expect(
      quotePremium(
        [{ type: 'rune', cursed: true }, { type: 'rune' }, { type: 'rune' }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(84);
  });
});

describe('insurance sum', () => {
  it('sums the insurance values of the items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('counts each of several same-type items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('is unaffected by the component block discount', () => {
    expect(
      insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(1750);
  });

  it('is unaffected by premium modifiers', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});
