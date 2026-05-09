import { describe, it, expect } from 'vitest';
import { computePremium, totalInsuranceSum, roundUp, roundDown } from './pricing.js';
import { Item } from './types.js';

describe('rounding', () => {
  it('rounds up for premiums (MHPCO favor)', () => {
    expect(roundUp(57.8)).toBe(58);
    expect(roundUp(100)).toBe(100);
    expect(roundUp(100.0001)).toBe(101);
  });
  it('rounds down for payouts (MHPCO favor)', () => {
    expect(roundDown(57.8)).toBe(57);
    expect(roundDown(100)).toBe(100);
  });
});

describe('totalInsuranceSum', () => {
  it('sums main items by their insurance values', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'amulet' },
      { type: 'staff' },
      { type: 'potion' },
    ];
    expect(totalInsuranceSum(items)).toBe(1000 + 600 + 800 + 400);
  });

  it('values components at 250 G each', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
    ];
    expect(totalInsuranceSum(items)).toBe(750);
  });
});

describe('computePremium', () => {
  it('plain sword, 0 years, first contract', () => {
    // 100 * 1.10 + 5 = 115
    const items: Item[] = [{ type: 'sword' }];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(115);
  });

  it('amulet, 5 years (loyalty), first contract', () => {
    // 60 * 0.8 * 1.10 + 5 = 52.8 + 5 = 57.8 -> 58
    const items: Item[] = [{ type: 'amulet' }];
    expect(
      computePremium(items, { yearsWithMHPCO: 5, isFirstContract: true }),
    ).toBe(58);
  });

  it('cursed sword, 0 years, first contract', () => {
    // 100 * 1.5 = 150; 150 * 1.10 + 5 = 165 + 5 = 170
    const items: Item[] = [{ type: 'sword', cursed: true }];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(170);
  });

  it('high enchantment staff, 0 years, first contract', () => {
    // 80 * 1.3 = 104; 104 * 1.10 + 5 = 114.4 + 5 = 119.4 -> 120
    const items: Item[] = [{ type: 'staff', enchantment: 5 }];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(120);
  });

  it('cursed and high-enchant sword: surcharges add', () => {
    // 100 * (1 + 0.5 + 0.3) = 180; 180 * 1.10 + 5 = 198 + 5 = 203
    const items: Item[] = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(203);
  });

  it('repeat contract gets 15% discount instead of first surcharge', () => {
    // Sword: 100 * 0.85 + 5 = 85 + 5 = 90
    const items: Item[] = [{ type: 'sword' }];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: false }),
    ).toBe(90);
  });

  it('three runes: special block premium 60 G applies', () => {
    // base = 60; 0 years, first: 60*1.10 + 5 = 71
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(71);
  });

  it('two runes: no block, 25 G each = 50 G base', () => {
    // 50 * 1.10 + 5 = 55 + 5 = 60
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(60);
  });

  it('four runes: one block of 3 + 1 leftover = 60 + 25 = 85', () => {
    // 85 * 1.10 + 5 = 93.5 + 5 = 98.5 -> 99
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(99);
  });

  it('three different components: no block (must be alike)', () => {
    // 25*3 = 75; 75*1.10 + 5 = 82.5 + 5 = 87.5 -> 88
    const items: Item[] = [
      { type: 'rune' },
      { type: 'moonstone' },
      { type: 'pearl' },
    ];
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true }),
    ).toBe(88);
  });
});
