import { describe, expect, it } from 'vitest';
import {
  computeInsuranceSum,
  computeItemsPremium,
  computePremium,
  roundUp,
} from './pricing.js';

describe('roundUp', () => {
  it('rounds non-integers up', () => {
    expect(roundUp(100.1)).toBe(101);
    expect(roundUp(99.5)).toBe(100);
  });
  it('keeps integers as-is', () => {
    expect(roundUp(100)).toBe(100);
    expect(roundUp(0)).toBe(0);
  });
});

describe('computeInsuranceSum', () => {
  it('sums main item insurance values', () => {
    expect(
      computeInsuranceSum([
        { type: 'sword' },
        { type: 'amulet' },
        { type: 'staff' },
        { type: 'potion' },
      ]),
    ).toBe(1000 + 600 + 800 + 400);
  });
  it('sums components at 250 each', () => {
    expect(
      computeInsuranceSum([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
      ]),
    ).toBe(750);
  });
});

describe('computeItemsPremium', () => {
  it('applies a sword base of 100', () => {
    expect(computeItemsPremium([{ type: 'sword' }])).toBe(100);
  });
  it('applies cursed surcharge (+50%)', () => {
    expect(computeItemsPremium([{ type: 'sword', cursed: true }])).toBe(150);
  });
  it('applies high-enchantment surcharge (+30%)', () => {
    expect(
      computeItemsPremium([{ type: 'sword', enchantment: 5 }]),
    ).toBe(130);
  });
  it('stacks cursed and high-enchantment', () => {
    expect(
      computeItemsPremium([{ type: 'sword', cursed: true, enchantment: 5 }]),
    ).toBeCloseTo(195); // 100 * 1.5 * 1.3
  });
  it('does not apply enchantment surcharge below 5', () => {
    expect(
      computeItemsPremium([{ type: 'sword', enchantment: 4 }]),
    ).toBe(100);
  });
  it('bundles 3 alike components for 60G', () => {
    expect(
      computeItemsPremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(60);
  });
  it('bundles where possible, with single remainder at 25G', () => {
    expect(
      computeItemsPremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(85);
  });
  it('only bundles alike components', () => {
    expect(
      computeItemsPremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
      ]),
    ).toBe(75);
  });
});

describe('computePremium', () => {
  it('schema example 1: 0 years, first contract, sword e=3 not cursed', () => {
    // 100 base * 1.1 (first) + 5 = 115
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        { yearsWithMHPCO: 0, contractsAlreadyIssued: 0 },
      ),
    ).toBe(115);
  });

  it('schema example 2 quote: 5 years loyal, first contract, amulet e=2 not cursed', () => {
    // 60 base * 0.8 (loyalty) * 1.1 (first) + 5 = 52.8 + 5 = 57.8 -> ceil 58
    expect(
      computePremium(
        [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        { yearsWithMHPCO: 5, contractsAlreadyIssued: 0 },
      ),
    ).toBe(58);
  });

  it('applies per-contract discount (15%) after first', () => {
    // sword 100 * 0.85 + 5 = 90
    expect(
      computePremium([{ type: 'sword' }], {
        yearsWithMHPCO: 0,
        contractsAlreadyIssued: 1,
      }),
    ).toBe(90);
  });

  it('rounds up in MHPCO favor', () => {
    // amulet 60 * 1.1 = 66, + 5 = 71 (already integer)
    expect(
      computePremium([{ type: 'amulet' }], {
        yearsWithMHPCO: 0,
        contractsAlreadyIssued: 0,
      }),
    ).toBe(71);
  });
});
