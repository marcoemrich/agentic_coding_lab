import { describe, it, expect } from 'vitest';
import { computePremium, totalInsuranceSum } from './pricing.js';
import { Item } from './types.js';

describe('computePremium', () => {
  it('prices a single plain sword for a brand-new customer', () => {
    // Base: 100. First contract surcharge: +10% => 110. + 5 fee = 115.
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });

  it('applies cursed surcharge', () => {
    // 100 * 1.5 = 150. First contract +10% => 165. +5 = 170.
    const items: Item[] = [{ type: 'sword', cursed: true }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(170);
  });

  it('applies high-enchantment surcharge (>=5)', () => {
    // 80 * 1.3 = 104. First contract +10% => 114.4. +5 = 119.4 => ceil 120.
    const items: Item[] = [{ type: 'staff', enchantment: 5 }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(120);
  });

  it('stacks cursed + high enchantment additively (1.5 + 0.3 = 1.8x)', () => {
    // 100 * 1.8 = 180. First contract +10% => 198. +5 = 203.
    const items: Item[] = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(203);
  });

  it('gives loyalty discount and first-contract surcharge together', () => {
    // 60 * (1 - 0.2 + 0.1) = 60 * 0.9 = 54. +5 = 59.
    const items: Item[] = [{ type: 'amulet' }];
    expect(computePremium(items, { yearsWithMHPCO: 5, contractIndex: 0 })).toBe(59);
  });

  it('applies subsequent-contract discount instead of first-contract surcharge', () => {
    // 100 * (1 - 0.15) = 85. +5 = 90.
    const items: Item[] = [{ type: 'sword' }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 1 })).toBe(90);
  });

  it('rounds up in MHPCO favor', () => {
    // potion: 40. First contract +10% => 44. +5 = 49 (integer here).
    const items: Item[] = [{ type: 'potion' }];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(49);
  });

  it('prices a bundle of 3 alike components at 60 G instead of 75', () => {
    // 60 base. First contract +10% => 66. +5 = 71.
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });

  it('does not bundle 3 components of different types', () => {
    // 25 + 25 + 25 = 75. First +10% => 82.5. +5 = 87.5 => ceil 88.
    const items: Item[] = [
      { type: 'rune' },
      { type: 'moonstone' },
      { type: 'pearl' },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(88);
  });

  it('bundles 6 alike components into two bundles of 3', () => {
    // 60 + 60 = 120. First +10% => 132. +5 = 137.
    const items: Item[] = Array.from({ length: 6 }, () => ({ type: 'rune' } as Item));
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(137);
  });

  it('handles a mix of items', () => {
    // sword 100 + amulet 60 + rune bundle of 3 (60) = 220.
    // First contract +10% => 242. +5 = 247.
    const items: Item[] = [
      { type: 'sword' },
      { type: 'amulet' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(247);
  });
});

describe('totalInsuranceSum', () => {
  it('sums insurance values across mixed items', () => {
    const items: Item[] = [
      { type: 'sword' },        // 1000
      { type: 'amulet' },       // 600
      { type: 'staff' },        // 800
      { type: 'potion' },       // 400
      { type: 'rune' },         // 250
      { type: 'moonstone' },    // 250
    ];
    expect(totalInsuranceSum(items)).toBe(3300);
  });
});
