import { describe, it, expect } from 'vitest';
import { policyBasePremium, quotePremium } from './premium.js';

describe('component blocks', () => {
  it('charges 25 G per rune below a block', () => {
    expect(policyBasePremium([{ type: 'rune' }, { type: 'rune' }])).toBe(50);
  });

  it('charges 60 G for exactly 3 alike components', () => {
    expect(
      policyBasePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(60);
  });

  it('does not apply the block for 4 runes', () => {
    expect(policyBasePremium(Array(4).fill({ type: 'rune' }))).toBe(100);
  });

  it('does not apply the block for 7 runes', () => {
    expect(policyBasePremium(Array(7).fill({ type: 'rune' }))).toBe(175);
  });

  it('treats different component types as not alike', () => {
    expect(
      policyBasePremium([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
      ]),
    ).toBe(75);
  });

  it('applies two separate blocks for 3 runes and 3 moonstones', () => {
    expect(
      policyBasePremium([
        ...Array(3).fill({ type: 'rune' }),
        ...Array(3).fill({ type: 'moonstone' }),
      ]),
    ).toBe(120);
  });
});

describe('main item base premiums', () => {
  it('sums the price list entries', () => {
    expect(
      policyBasePremium([
        { type: 'sword' },
        { type: 'amulet' },
        { type: 'staff' },
        { type: 'potion' },
      ]),
    ).toBe(280);
  });
});

describe('premium modifiers', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('adds the first insurance surcharge and the fee', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], newcomer, 0)).toBe(115);
  });

  it('applies the cursed surcharge to the affected item only', () => {
    // base 160; curse 50% of the sword's 100 = 50; first insurance 16; fee 5
    expect(
      quotePremium(
        [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        newcomer,
        0,
      ),
    ).toBe(231);
  });

  it('applies the high enchantment surcharge from level 5', () => {
    // 100 base + 30 high ench + 10 first insurance + 5 fee
    expect(
      quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0),
    ).toBe(145);
  });

  it('applies no high enchantment surcharge at level 4', () => {
    expect(
      quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0),
    ).toBe(115);
  });

  it('stacks curse and high enchantment on the same item', () => {
    // 100 + 50 curse + 30 high ench + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', enchantment: 5, cursed: true }],
        newcomer,
        0,
      ),
    ).toBe(195);
  });

  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(
      quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0),
    ).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(
      quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0),
    ).toBe(115);
  });

  it('discounts each contract after the first', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(
      quotePremium([{ type: 'sword' }], newcomer, 1),
    ).toBe(100);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    // 5 runes: base 125; one cursed adds 12.5; first insurance 12.5;
    // follow-up discount -18.75  ->  131.25 + 5 fee = 136.25 -> 137
    expect(
      quotePremium(
        [{ type: 'rune', cursed: true }, ...Array(4).fill({ type: 'rune' })],
        newcomer,
        1,
      ),
    ).toBe(137);
  });

  it('keeps intermediate amounts as fractions', () => {
    // block of 3 runes: policy base 60, each item base 20; one cursed adds 10
    // 60 + 10 + 6 first insurance + 5 fee = 81
    expect(
      quotePremium(
        [{ type: 'rune', cursed: true }, ...Array(2).fill({ type: 'rune' })],
        newcomer,
        0,
      ),
    ).toBe(81);
  });
});

describe('integration examples', () => {
  it('quotes 165 G for a newcomer with a cursed sword', () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });

  it("quotes 160 G for a long-standing customer's second contract", () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });
});
