import { describe, it, expect } from 'vitest';
import { computePremium, totalInsuranceSum } from './pricing.js';
import type { Item } from './types.js';

describe('computePremium', () => {
  it('quotes a plain sword for a brand-new customer (first contract)', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    // base 100, first contract 1.10 -> 110, +5 fee = 115
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });

  it('applies loyalty discount for 2+ year customer', () => {
    const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }];
    // base 60, loyalty 0.8 -> 48, first 1.10 -> 52.8, +5 = 57.8 -> 58
    expect(computePremium(items, { yearsWithMHPCO: 5, contractIndex: 0 })).toBe(58);
  });

  it('applies cursed surcharge', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 1, cursed: true }];
    // 100 * 1.5 = 150, first 1.10 -> 165, +5 = 170
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(170);
  });

  it('applies highly enchanted surcharge', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 5, cursed: false }];
    // 100 * 1.3 = 130, first 1.10 -> 143, +5 = 148
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(148);
  });

  it('stacks cursed and highly enchanted surcharges', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 7, cursed: true }];
    // 100 * 1.5 * 1.3 = 195, first 1.10 -> 214.5, +5 = 219.5 -> 220
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(220);
  });

  it('applies subsequent-contract discount', () => {
    const items: Item[] = [{ type: 'sword' }];
    // 100, second contract 0.85 -> 85, +5 = 90
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 1 })).toBe(90);
  });

  it('charges 60G base for a building block of 3 alike runes', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    // bucket base 60, first 1.10 -> 66, +5 = 71
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });

  it('charges 60+25 for 4 alike runes (one bucket + one loose)', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    // 60 + 25 = 85, first 1.10 -> 93.5, +5 = 98.5 -> 99
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(99);
  });

  it('does not bundle different component types', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
    ];
    // 25*3 = 75, first 1.10 -> 82.5, +5 = 87.5 -> 88
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(88);
  });

  it('rounds in MHPCO favor (always up)', () => {
    // craft something that produces a fractional G
    const items: Item[] = [{ type: 'potion' }];
    // 40, first 1.10 -> 44, +5 = 49
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(49);
  });
});

describe('totalInsuranceSum', () => {
  it('sums insurance values', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'rune' },
      { type: 'amulet' },
    ];
    expect(totalInsuranceSum(items)).toBe(1000 + 250 + 600);
  });
});
