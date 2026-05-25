import { describe, it, expect } from 'vitest';
import { quotePremium, rawPremium } from './pricing.js';

describe('quotePremium', () => {
  it('example 1: single sword, new customer, first contract', () => {
    const p = quotePremium(
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    // 100 (base) * 1.10 (first) + 5 = 115
    expect(p).toBe(115);
  });

  it('example 2: amulet, loyal customer, first contract', () => {
    const p = quotePremium(
      [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
      { yearsWithMHPCO: 5, contractIndex: 0 },
    );
    // 60 * 0.8 * 1.10 + 5 = 52.8 + 5 = 57.8 -> ceil 58
    expect(p).toBe(58);
  });

  it('cursed item carries 50% surcharge', () => {
    const p = quotePremium(
      [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }],
      { yearsWithMHPCO: 0, contractIndex: 1 },
    );
    // 100 * 1.5 = 150; subsequent: 150 * 0.85 = 127.5; +5 = 132.5 -> 133
    expect(p).toBe(133);
  });

  it('highly enchanted (>=5) carries 30% surcharge', () => {
    const p = quotePremium(
      [{ type: 'staff', enchantment: 5 }],
      { yearsWithMHPCO: 0, contractIndex: 1 },
    );
    // 80 * 1.3 = 104; subsequent *0.85 = 88.4; +5 = 93.4 -> 94
    expect(p).toBe(94);
  });

  it('cursed and highly enchanted stack multiplicatively', () => {
    const p = quotePremium(
      [{ type: 'amulet', enchantment: 7, cursed: true }],
      { yearsWithMHPCO: 0, contractIndex: 0 },
    );
    // 60 * 1.5 * 1.3 = 117; first contract * 1.10 = 128.7; +5 = 133.7 -> 134
    expect(p).toBe(134);
  });

  it('block of 3 alike components uses special base premium of 60', () => {
    const items = [
      { type: 'rune' as const },
      { type: 'rune' as const },
      { type: 'rune' as const },
    ];
    expect(rawPremium(items)).toBe(60);
  });

  it('non-block remainder priced at 25 each', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }];
    expect(rawPremium(items)).toBe(50);
  });

  it('4 alike components = 60 (block) + 25 (remainder) = 85', () => {
    const items = [
      { type: 'moonstone' }, { type: 'moonstone' },
      { type: 'moonstone' }, { type: 'moonstone' },
    ];
    expect(rawPremium(items)).toBe(85);
  });

  it('different component types are not pooled', () => {
    const items = [
      { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' },
    ];
    expect(rawPremium(items)).toBe(100);
  });
});
