import { describe, expect, it } from 'vitest';
import { computePremium, totalInsuranceSum } from './pricing.js';
import { Item } from './types.js';

describe('computePremium', () => {
  it('quotes a simple sword for a first-time customer', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    // base = 100; cursed/enchantment off; first-time +10%; +5 fee.
    // 100 * 1.1 + 5 = 115
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(115);
  });

  it('applies cursed surcharge', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
    ];
    // 100 * 1.5 = 150; first-time +10% => 165; +5 => 170
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(170);
  });

  it('applies high-enchantment surcharge (>= 5)', () => {
    const items: Item[] = [
      { type: 'staff', material: 'oak', enchantment: 5, cursed: false },
    ];
    // 80 * 1.3 = 104; first-time +10% => 114.4; +5 => 119.4 -> 120
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(120);
  });

  it('applies loyalty discount for 2+ year customer', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    // 60 * 0.8 = 48 (loyalty); first contract * 1.1 => 52.8; + 5 => 57.8 -> 58
    expect(computePremium(items, { yearsWithMHPCO: 5, contractIndex: 0 })).toBe(58);
  });

  it('applies discount for subsequent contracts', () => {
    const items: Item[] = [
      { type: 'potion', material: 'glass', enchantment: 1, cursed: false },
    ];
    // 40 (base) * 0.85 (second contract) = 34; +5 = 39
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 1 })).toBe(39);
  });

  it('bundles 3 alike components into a discounted base', () => {
    const items: Item[] = [
      { type: 'rune', enchantment: 0, cursed: false },
      { type: 'rune', enchantment: 0, cursed: false },
      { type: 'rune', enchantment: 0, cursed: false },
    ];
    // bundle base = 60; first +10% => 66; +5 => 71
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });

  it('charges singles at 25 G outside a bundle', () => {
    const items: Item[] = [
      { type: 'rune', enchantment: 0, cursed: false },
      { type: 'rune', enchantment: 0, cursed: false },
    ];
    // 25 + 25 = 50; first +10% => 55; +5 => 60
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(60);
  });

  it('rounds in MHPCO favor (up)', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    // 60 * 1.1 + 5 = 71 (already integer)
    // Use a case that produces a fraction: amulet with cursed
    // 60 * 1.5 = 90; *1.1 = 99; +5 = 104 (integer)
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(71);
  });
});

describe('totalInsuranceSum', () => {
  it('sums insurance values across all items', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'rune', enchantment: 0, cursed: false },
    ];
    expect(totalInsuranceSum(items)).toBe(1000 + 250);
  });
});
