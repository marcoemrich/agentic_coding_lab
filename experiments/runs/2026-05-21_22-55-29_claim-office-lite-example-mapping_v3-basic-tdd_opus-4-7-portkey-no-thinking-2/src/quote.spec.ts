import { describe, it, expect } from 'vitest';
import { computeQuote } from './quote.js';

describe('computeQuote', () => {
  it('empty item list -> 5 G (only processing fee)', () => {
    expect(computeQuote({
      items: [],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(5);
  });

  it('newcomer with cursed sword -> 165 G', () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(computeQuote({
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(165);
  });

  it('long-standing 2nd contract: cursed enchant-7 sword -> 160 G', () => {
    // 100 base + 50 curse + 30 enchant - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 fee = 160
    expect(computeQuote({
      items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
      yearsWithMHPCO: 3,
      isFirstContract: false,
    })).toBe(160);
  });

  it('high enchantment threshold: exactly 5 triggers surcharge', () => {
    // 100 + 30 (enchant) + 10 (first) = 140 + 5 = 145
    expect(computeQuote({
      items: [{ type: 'sword', enchantment: 5 }],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(145);
  });

  it('enchantment 4 -> no high-enchantment surcharge', () => {
    // 100 + 10 first = 110 + 5 = 115
    expect(computeQuote({
      items: [{ type: 'sword', enchantment: 4 }],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(115);
  });

  it('loyalty threshold: exactly 2 years triggers discount', () => {
    // 100 base - 20 loyalty + 10 first = 90 + 5 = 95
    expect(computeQuote({
      items: [{ type: 'sword' }],
      yearsWithMHPCO: 2,
      isFirstContract: true,
    })).toBe(95);
  });

  it('cursed sword + plain amulet -> policy of 160 G base + 50 curse + 16 first = 226 + 5 = 231', () => {
    // base 160, curse 50 (on sword only), first ins 16 (10% of 160), fee 5
    // total: 160 + 50 + 16 + 5 = 231
    expect(computeQuote({
      items: [
        { type: 'sword', cursed: true },
        { type: 'amulet' },
      ],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(231);
  });

  it('rounds premium up in MHPCO favor', () => {
    // Custom case: a policy that produces 0.5 fractional G must round up.
    // sword 100 base, loyalty 2 years => -20 (no frac), first => +10
    // need to construct a fractional case... use 3 runes (block 60)
    // 60 base - 12 loyalty (20% of 60) + 6 first (10%) - 9 follow-up (15%) = 45 + 5 = 50 (no frac)
    // try: 1 staff (80) -> loyalty -16, first +8, follow-up -12 -> 60 + 5 = 65
    // hmm need a fractional - use amulet 60, +10% +1.5? no, 6
    // try potion 40 + amulet 60 = 100 base. cursed potion +20 = 120. enchantment hp doesn't help.
    // try 25 G component cursed: 25 base + 12.5 curse + 2.5 first = 40.0 (no frac if both)
    // single cursed rune: 25 base + 12.5 curse + 2.5 first = 40 (no frac)
    // single highly enchanted rune: 25 + 7.5 enchant + 2.5 first = 35
    // single cursed + enchant rune: 25 + 12.5 + 7.5 + 2.5 = 47.5 -> round UP to 48 + 5 = 53
    expect(computeQuote({
      items: [{ type: 'rune', cursed: true, enchantment: 5 }],
      yearsWithMHPCO: 0,
      isFirstContract: true,
    })).toBe(53);
  });
});
