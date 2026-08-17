import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium';

const base = { yearsWithMHPCO: 0, isFollowUp: false };

describe('quotePremium', () => {
  it('adds only the processing fee for an empty policy', () => {
    expect(quotePremium([], base)).toBe(5);
  });

  it('computes a plain single-item premium with fee', () => {
    // amulet base 60 + 6 first insurance + 5 fee = 71
    expect(quotePremium([{ type: 'amulet' }], base)).toBe(71);
  });

  it('adds a 50% curse surcharge on the affected item base premium', () => {
    const items = [{ type: 'sword', cursed: true }];
    // 100 base + 50 curse + 5 fee (0 years, first quote → no loyalty/follow-up,
    // but first insurance +10) = 100 + 50 + 10 + 5 = 165
    expect(quotePremium(items, base)).toBe(165);
  });

  it('applies the curse surcharge only to the cursed item on a multi-item policy', () => {
    // cursed sword (100) + plain amulet (60): base 160, +50 curse,
    // +16 first insurance (10% of 160), +5 fee = 231
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quotePremium(items, base)).toBe(231);
  });

  it('applies high-enchantment surcharge at exactly level 5', () => {
    // sword ench 5: 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], base)).toBe(145);
  });

  it('does not apply high-enchantment surcharge at level 4', () => {
    // sword ench 4: 100 + 10 first + 5 fee = 115
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], base)).toBe(115);
  });

  it('stacks curse and high-enchantment on the same item', () => {
    // sword ench 5 cursed: 100 + 50 + 30 + 10 first + 5 = 195
    const items = [{ type: 'sword', enchantment: 5, cursed: true }];
    expect(quotePremium(items, base)).toBe(195);
  });

  it('applies loyalty discount at exactly 2 years', () => {
    // sword: 100 - 20 loyalty + 10 first + 5 fee = 95
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, isFollowUp: false })).toBe(95);
  });

  it('applies the follow-up discount on later contracts', () => {
    // sword: 100 - 15 follow-up + 10 first + 5 fee = 100
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 0, isFollowUp: true })).toBe(100);
  });

  it('computes the long-standing second-contract integration example', () => {
    // cursed sword ench 7, 3 years, follow-up:
    // 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
    const items = [{ type: 'sword', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3, isFollowUp: true })).toBe(160);
  });

  it('sums curse, high-ench and first insurance on an amulet', () => {
    // amulet base 60 + 30 curse + 18 high + 6 first + 5 fee = 119
    const items = [{ type: 'amulet', enchantment: 5, cursed: true }];
    expect(quotePremium(items, base)).toBe(119);
  });

  it('rounds a fractional premium up in the office favor', () => {
    // single rune base 25 + 2.5 first insurance + 5 fee = 32.5 → 33
    expect(quotePremium([{ type: 'rune' }], base)).toBe(33);
  });
});
