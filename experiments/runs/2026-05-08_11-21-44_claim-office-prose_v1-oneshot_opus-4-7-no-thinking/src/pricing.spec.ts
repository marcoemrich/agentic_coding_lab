import { describe, it, expect } from 'vitest';
import { computeInsuranceSum, computePremium, roundInFavor } from './pricing.js';
import { Item } from './types.js';

describe('roundInFavor', () => {
  it('rounds up non-integer amounts', () => {
    expect(roundInFavor(57.8)).toBe(58);
    expect(roundInFavor(100.01)).toBe(101);
  });

  it('keeps exact integers as-is', () => {
    expect(roundInFavor(100)).toBe(100);
    expect(roundInFavor(58.0)).toBe(58);
  });
});

describe('computeInsuranceSum', () => {
  it('sums main item insurance values', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'amulet' },
    ];
    expect(computeInsuranceSum(items)).toBe(1600);
  });

  it('values components at 250G each', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
    ];
    expect(computeInsuranceSum(items)).toBe(750);
  });
});

describe('computePremium', () => {
  it('computes premium for example 1: sword, no modifiers, first insurance, 0 years', () => {
    // base 100, no risk, ×1.1 (first) = 110, +5 = 115
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(115);
  });

  it('computes premium for example 2: amulet, 5 years, first contract', () => {
    // base 60, no risk, ×0.8 (loyalty) = 48, ×1.1 (first) = 52.8, +5 = 57.8 → 58
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 5, contractIndex: 0 });
    expect(premium).toBe(58);
  });

  it('applies cursed surcharge of 50%', () => {
    // sword: base 100 ×1.5 = 150, ×1.1 (first) = 165, +5 = 170
    const items: Item[] = [
      { type: 'sword', cursed: true, enchantment: 0 },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(170);
  });

  it('applies high-enchantment surcharge of 30%', () => {
    // staff: base 80 ×1.3 = 104, ×1.1 = 114.4, +5 = 119.4 → 120
    const items: Item[] = [
      { type: 'staff', enchantment: 5 },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(120);
  });

  it('applies cursed and high-enchantment surcharges together', () => {
    // sword: 100 ×1.5 ×1.3 = 195, ×1.1 = 214.5, +5 = 219.5 → 220
    const items: Item[] = [
      { type: 'sword', cursed: true, enchantment: 7 },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(220);
  });

  it('applies block-of-3 component discount', () => {
    // 3 runes: block base 60 (instead of 75), no risk
    // ×1.1 (first) = 66, +5 = 71
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(71);
  });

  it('does not apply block discount to mixed component types', () => {
    // 2 runes, 1 moonstone: 25+25+25 = 75, ×1.1 = 82.5, +5 = 87.5 → 88
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(88);
  });

  it('handles 4 alike components: one block of 3 + one single', () => {
    // 3 runes blocked at 60, 1 rune at 25 → base 85
    // ×1.1 = 93.5, +5 = 98.5 → 99
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(premium).toBe(99);
  });

  it('applies loyalty discount for years >= 2', () => {
    // sword: base 100, ×0.8 = 80, ×1.1 = 88, +5 = 93
    const items: Item[] = [{ type: 'sword' }];
    const premium = computePremium(items, { yearsWithMHPCO: 2, contractIndex: 0 });
    expect(premium).toBe(93);
  });

  it('applies subsequent-contract discount of 15%', () => {
    // sword: base 100, ×0.85 = 85, +5 = 90
    const items: Item[] = [{ type: 'sword' }];
    const premium = computePremium(items, { yearsWithMHPCO: 0, contractIndex: 1 });
    expect(premium).toBe(90);
  });
});
