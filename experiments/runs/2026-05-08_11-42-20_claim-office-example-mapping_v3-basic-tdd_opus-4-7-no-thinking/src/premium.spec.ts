import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';

describe('quotePremium - empty', () => {
  it('empty item list returns just the processing fee', () => {
    expect(quotePremium({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
});

describe('quotePremium - single items, no modifiers', () => {
  it('plain sword for newcomer with 0 years, first quote', () => {
    // 100 base + 10 first insurance = 110 + 5 fee = 115
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        0
      )
    ).toBe(115);
  });

  it('plain amulet 0 years', () => {
    // 60 + 6 first = 66 + 5 = 71
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }],
        0
      )
    ).toBe(71);
  });
});

describe('quotePremium - cursed', () => {
  it('newcomer with cursed sword (integration example)', () => {
    // 100 + 50 curse + 10 first = 160 + 5 = 165
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        0
      )
    ).toBe(165);
  });
});

describe('quotePremium - long-standing customer second contract', () => {
  it('cursed sword enchantment 7, 3 years, contractIndex=1', () => {
    // 100 base + 50 curse + 30 high + 10 first = 190 (item-affecting + first insurance per item)
    // Wait: per the example breakdown: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
    expect(
      quotePremium(
        { yearsWithMHPCO: 3 },
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        1
      )
    ).toBe(160);
  });
});

describe('quotePremium - components & blocks', () => {
  it('2 runes -> 50 G base; +5 fee; 0 years first quote: 50 + 5 first + 5 fee = 60', () => {
    // 2 runes: 50 base
    // First insurance per item: each rune gets 10% surcharge? "each item in a quote is treated as a first insurance"
    // 2*25 = 50 base, first insurance 10% of 50 = 5, total 55, +5 fee = 60
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' },
          { type: 'rune' },
        ],
        0
      )
    ).toBe(60);
  });

  it('3 runes -> 60 G block', () => {
    // 60 + 6 first = 66 + 5 = 71
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        0
      )
    ).toBe(71);
  });

  it('4 runes -> 100 G base (no block)', () => {
    // 100 + 10 first = 110 + 5 = 115
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        0
      )
    ).toBe(115);
  });

  it('7 runes -> 175 G base (one block of 3 + 4 singles = 60 + 100 = 160? or 1 block + 4 singles)', () => {
    // The text says 7 runes -> 175 G base premium.
    // Hmm: 7 = 3+4. Block applies to one group of exactly 3? Then 60 + 4*25 = 60+100 = 160. But expected 175.
    // Or 2 blocks of 3 + 1 single: 2*60+25 = 145. No.
    // Or no block applies because not exactly 3? Then 7*25 = 175. Yes!
    // The text: "no block — block requires exactly 3"
    // So for 7 runes, 7*25 = 175.
    // That means the block applies only when there are exactly 3 alike, no greedy grouping.
    // Wait but then "3 runes + 3 moonstones → 120 G base premium (two separate blocks)" - each group has exactly 3.
    // So if you have 4 runes, no block at all (175 doesn't match 4 runes either).
    // Actually 7 runes literally: no block applies because count is not 3.
    // 7*25 = 175. Confirmed.
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        Array(7).fill({ type: 'rune' }),
        0
      )
    ).toBe(Math.ceil((175 + 17.5) + 5));
    // 175 + 17.5 first = 192.5 ceil = 193, + 5 = 198
  });

  it('2 runes + 1 moonstone -> 75 G base', () => {
    // 75 + 7.5 first = 82.5 ceil = 83 + 5 = 88
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'moonstone' },
        ],
        0
      )
    ).toBe(88);
  });

  it('3 runes + 3 moonstones -> 120 G base (two blocks)', () => {
    // 120 + 12 first = 132 + 5 = 137
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
        ],
        0
      )
    ).toBe(137);
  });
});

describe('quotePremium - multi-item modifier scope', () => {
  it('cursed sword + plain amulet, 0 years', () => {
    // 100 + 60 = 160 base
    // cursed: +50 (50% of 100) -> 210
    // first insurance: 10% of policy base 160 = 16 -> 226
    // +5 fee = 231
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
        ],
        0
      )
    ).toBe(231);
  });
});

describe('quotePremium - thresholds', () => {
  it('exactly 2 years gets loyalty discount', () => {
    // sword 100 + 10 first - 20 loyalty = 90 + 5 = 95
    expect(
      quotePremium(
        { yearsWithMHPCO: 2 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        0
      )
    ).toBe(95);
  });

  it('enchantment exactly 5 gets high enchantment surcharge', () => {
    // 100 + 30 high + 10 first = 140 + 5 = 145
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        0
      )
    ).toBe(145);
  });

  it('enchantment 4 no high surcharge', () => {
    // 100 + 10 first = 110 + 5 = 115
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }],
        0
      )
    ).toBe(115);
  });
});

describe('quotePremium - rounding', () => {
  it('rounds final premium up (in MHPCO favor)', () => {
    // We need a calculation that yields fractional. Easy case: 197.5 -> 198
    // Find inputs that hit 197.5. Eg potion (40 base) with enchantment 5 (30%): 40 + 12 = 52
    // Hmm. Actually let me use: 1 rune for 0-year customer, 3 years -> ?
    // 25 rune + 10% first = 27.5; 0 years; +5 fee = 32.5 -> 33
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune' }],
        0
      )
    ).toBe(33);
  });
});

describe('quotePremium - follow-up contract', () => {
  it('15% discount on contractIndex >= 1', () => {
    // sword, 0 years, contract index 1
    // 100 base + 10 first - 15 follow-up = 95 + 5 = 100
    expect(
      quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        1
      )
    ).toBe(100);
  });
});
