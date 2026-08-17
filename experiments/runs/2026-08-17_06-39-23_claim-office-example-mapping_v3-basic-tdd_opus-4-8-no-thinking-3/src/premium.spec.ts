import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium';

const sword = (extra: Record<string, unknown> = {}) => ({ type: 'sword', ...extra });

describe('quotePremium', () => {
  it('adds only the processing fee for an empty item list', () => {
    expect(quotePremium([], { years: 0, contractIndex: 0 })).toBe(5);
  });

  it('newcomer with a cursed sword', () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(
      quotePremium([sword({ material: 'steel', enchantment: 3, cursed: true })], {
        years: 0,
        contractIndex: 0,
      }),
    ).toBe(165);
  });

  it("long-standing customer's second contract with cursed enchanted sword", () => {
    // 100 + 50 curse + 30 high ench - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 = 160
    expect(
      quotePremium([sword({ material: 'steel', enchantment: 7, cursed: true })], {
        years: 3,
        contractIndex: 1,
      }),
    ).toBe(160);
  });

  it('applies high-enchantment surcharge at exactly level 5', () => {
    // 100 + 30 high ench + 10 first ins = 140 + 5 = 145
    expect(
      quotePremium([sword({ enchantment: 5 })], { years: 0, contractIndex: 0 }),
    ).toBe(145);
  });

  it('does not apply high-enchantment surcharge at level 4', () => {
    // 100 + 10 first ins = 110 + 5 = 115
    expect(
      quotePremium([sword({ enchantment: 4 })], { years: 0, contractIndex: 0 }),
    ).toBe(115);
  });

  it('applies loyalty discount at exactly 2 years', () => {
    // 100 - 20 loyalty + 10 first ins = 90 + 5 = 95
    expect(
      quotePremium([sword({ enchantment: 3 })], { years: 2, contractIndex: 0 }),
    ).toBe(95);
  });

  it('applies the cursed surcharge only to the affected item on a multi-item policy', () => {
    // sword 100 + amulet 60 = 160 base; curse +50 (of sword) = 210; +10% first ins of 160 (16) = 226; +5 = 231
    const items = [sword({ cursed: true }), { type: 'amulet' }];
    expect(quotePremium(items, { years: 0, contractIndex: 0 })).toBe(231);
  });

  it('rounds the premium up (in MHPCO favor)', () => {
    // Two moonstones (single) = 50 base. amulet 60. Base 110.
    // follow-up -15% of 110 = 16.5 => 93.5. + first ins 10% of 110 = 11 => 104.5. + 5 fee = 109.5 -> 110
    const items = [{ type: 'amulet' }, { type: 'moonstone' }, { type: 'moonstone' }];
    // 110 base + 11 first ins - 16.5 follow-up = 104.5 + 5 = 109.5 -> round up 110
    expect(quotePremium(items, { years: 0, contractIndex: 1 })).toBe(110);
  });
});
