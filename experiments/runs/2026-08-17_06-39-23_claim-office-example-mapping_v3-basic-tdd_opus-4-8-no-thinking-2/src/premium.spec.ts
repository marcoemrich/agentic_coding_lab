import { describe, it, expect } from 'vitest';
import { quotePremium, policyBasePremium } from './premium.js';
import type { Item, Customer } from './types.js';

function item(type: string, extra: Partial<Item> = {}): Item {
  return { type, ...extra } as Item;
}

const newcomer: Customer = { yearsWithMHPCO: 0 };

describe('base premiums for main items', () => {
  it('prices a single sword base premium', () => {
    // 100 base + 10 first insurance + 5 fee = 115
    expect(quotePremium([item('sword')], newcomer, 0)).toBe(115);
  });

  it('prices an amulet', () => {
    // 60 + 6 + 5 = 71
    expect(quotePremium([item('amulet')], newcomer, 0)).toBe(71);
  });

  it('prices a staff', () => {
    // 80 + 8 + 5 = 93
    expect(quotePremium([item('staff')], newcomer, 0)).toBe(93);
  });

  it('prices a potion', () => {
    // 40 + 4 + 5 = 49
    expect(quotePremium([item('potion')], newcomer, 0)).toBe(49);
  });

  it('empty item list is just the processing fee', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });
});

describe('component block base premiums', () => {
  it('2 runes -> 50', () => {
    expect(policyBasePremium([item('rune'), item('rune')])).toBe(50);
  });

  it('3 runes -> 60 (block applies)', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('rune')])).toBe(60);
  });

  it('4 runes -> 100 (no block, needs exactly 3)', () => {
    expect(policyBasePremium(Array(4).fill(item('rune')))).toBe(100);
  });

  it('7 runes -> 175', () => {
    expect(policyBasePremium(Array(7).fill(item('rune')))).toBe(175);
  });

  it('2 runes + 1 moonstone -> 75 (different types, no block)', () => {
    expect(
      policyBasePremium([item('rune'), item('rune'), item('moonstone')]),
    ).toBe(75);
  });

  it('3 runes + 3 moonstones -> 120 (two separate blocks)', () => {
    expect(
      policyBasePremium([
        item('rune'),
        item('rune'),
        item('rune'),
        item('moonstone'),
        item('moonstone'),
        item('moonstone'),
      ]),
    ).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('cursed surcharge applies to affected item only', () => {
    // cursed sword base 100 + amulet 60 = 160; curse 50% of 100 = 50
    // policy base 160, first insurance 10% of 160 = 16, fee 5
    // 160 + 50 + 16 + 5 = 231
    const items = [item('sword', { cursed: true }), item('amulet')];
    expect(quotePremium(items, newcomer, 0)).toBe(231);
  });

  it('high enchantment surcharge at exactly level 5', () => {
    // sword base 100, high ench 30, first ins 10, fee 5 = 145
    expect(quotePremium([item('sword', { enchantment: 5 })], newcomer, 0)).toBe(145);
  });

  it('no high enchantment at level 4', () => {
    // sword base 100, first ins 10, fee 5 = 115
    expect(quotePremium([item('sword', { enchantment: 4 })], newcomer, 0)).toBe(115);
  });

  it('cursed and high enchantment stack', () => {
    // sword 100 + curse 50 + highench 30 + first ins 10 + fee 5 = 195
    expect(
      quotePremium([item('sword', { enchantment: 5, cursed: true })], newcomer, 0),
    ).toBe(195);
  });
});

describe('policy-wide modifiers', () => {
  const loyal: Customer = { yearsWithMHPCO: 2 };

  it('loyalty discount at exactly 2 years', () => {
    // sword 100, loyalty -20, first ins 10, fee 5 = 95
    expect(quotePremium([item('sword')], loyal, 0)).toBe(95);
  });

  it('no loyalty discount at 1 year', () => {
    expect(quotePremium([item('sword')], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('follow-up contract discount for second contract', () => {
    // sword 100, first ins 10, follow-up -15, fee 5 = 100
    expect(quotePremium([item('sword')], newcomer, 1)).toBe(100);
  });
});

describe('integration examples', () => {
  it('newcomer with a cursed sword -> 165', () => {
    const items = [item('sword', { material: 'steel', enchantment: 3, cursed: true })];
    expect(quotePremium(items, newcomer, 0)).toBe(165);
  });

  it("long-standing customer's second contract -> 160", () => {
    const items = [item('sword', { material: 'steel', enchantment: 7, cursed: true })];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});

describe('rounding in favour of MHPCO', () => {
  it('premium 197.5 rounds up to 198', () => {
    // Construct: staff base 80, cursed 40 -> ... choose values to hit .5
    // Simpler: use a single sword with follow-up to force a fraction.
    // sword 100, first ins 10, follow-up -15 = 95 -> no fraction.
    // Use loyalty on a base that yields .5: base 175 (7 runes) with
    // first insurance 17.5. 175 + 17.5 + 5 = 197.5 -> 198.
    expect(quotePremium(Array(7).fill(item('rune')), newcomer, 0)).toBe(198);
  });
});
