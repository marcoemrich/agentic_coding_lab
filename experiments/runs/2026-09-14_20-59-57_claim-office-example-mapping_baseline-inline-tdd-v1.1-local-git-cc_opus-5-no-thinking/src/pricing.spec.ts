import { describe, it, expect } from 'vitest';
import { policyBasePremium } from './pricing.js';

describe('item base premiums', () => {
  it('prices each main item type', () => {
    expect(policyBasePremium([{ type: 'sword' }])).toBe(100);
    expect(policyBasePremium([{ type: 'amulet' }])).toBe(60);
    expect(policyBasePremium([{ type: 'staff' }])).toBe(80);
    expect(policyBasePremium([{ type: 'potion' }])).toBe(40);
  });

  it('prices components at 25 G each', () => {
    expect(policyBasePremium([{ type: 'rune' }])).toBe(25);
    expect(policyBasePremium([{ type: 'moonstone' }])).toBe(25);
  });
});

describe('building block of 3 alike components', () => {
  it('applies the block only for exactly 3 of the same type', () => {
    expect(policyBasePremium([{ type: 'rune' }, { type: 'rune' }])).toBe(50);
    expect(
      policyBasePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(60);
    expect(
      policyBasePremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(100);
  });

  it('prices 7 runes without a block', () => {
    expect(policyBasePremium(Array(7).fill({ type: 'rune' }))).toBe(175);
  });

  it('treats different component types as not alike', () => {
    expect(
      policyBasePremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
      ]),
    ).toBe(75);
  });

  it('forms one block per component type', () => {
    expect(
      policyBasePremium([
        ...Array(3).fill({ type: 'rune' }),
        ...Array(3).fill({ type: 'moonstone' }),
      ]),
    ).toBe(120);
  });
});
