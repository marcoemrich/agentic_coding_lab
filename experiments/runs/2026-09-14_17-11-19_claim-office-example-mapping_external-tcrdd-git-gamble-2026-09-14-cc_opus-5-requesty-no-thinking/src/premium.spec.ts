import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';

describe('quotePremium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });

  it('charges a plain sword at base 100 plus first insurance and fee', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });

  it('knows the base premiums of all main item types', () => {
    const plain = (type: string) => quotePremium([{ type }], { yearsWithMHPCO: 0 }, 0);
    expect(plain('amulet')).toBe(71);
    expect(plain('staff')).toBe(93);
    expect(plain('potion')).toBe(49);
  });

  it('rejects an unknown item type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], { yearsWithMHPCO: 0 }, 0)).toThrow(
      /broomstick/,
    );
  });

  it('adds a 50% curse surcharge to the cursed item', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([item], { yearsWithMHPCO: 0 }, 0)).toBe(165);
  });

  it('adds a 30% surcharge from enchantment level 5 upwards', () => {
    const sword = (enchantment: number) =>
      quotePremium([{ type: 'sword', enchantment }], { yearsWithMHPCO: 0 }, 0);
    expect(sword(4)).toBe(115);
    expect(sword(5)).toBe(145);
  });

  it('grants a 20% loyalty discount from 2 years of business', () => {
    const sword = (years: number) =>
      quotePremium([{ type: 'sword' }], { yearsWithMHPCO: years }, 0);
    expect(sword(1)).toBe(115);
    expect(sword(2)).toBe(95);
  });

  it('discounts every contract after the first by 15%', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium([cursedSword], { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('insures components at a base premium of 25 G each', () => {
    const runes = (count: number) =>
      quotePremium(
        Array.from({ length: count }, () => ({ type: 'rune' })),
        { yearsWithMHPCO: 0 },
        0,
      );
    expect(runes(2)).toBe(60);
    expect(runes(4)).toBe(115);
  });

  it('offers a block price for exactly 3 alike components', () => {
    const runes = (count: number) =>
      quotePremium(
        Array.from({ length: count }, () => ({ type: 'rune' })),
        { yearsWithMHPCO: 0 },
        0,
      );
    expect(runes(3)).toBe(71);
    expect(runes(4)).toBe(115);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    const runes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quotePremium(runes, { yearsWithMHPCO: 0 }, 0)).toBe(198);
  });
});
