import { describe, it, expect } from 'vitest';
import { quotePremium, basePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0, isFollowUp: false };

describe('component building blocks', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes -> %i G base premium', (n, expected) => {
    expect(basePremium(runes(n))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms separate blocks per component type', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('main item base premiums', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('%s -> %i G', (type, expected) => {
    expect(basePremium([{ type }])).toBe(expected);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote premium', () => {
  it('empty item list costs only the processing fee', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('newcomer with a cursed sword pays 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, newcomer)).toBe(165);
  });

  it("long-standing customer's second contract with a cursed enchanted sword pays 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3, isFollowUp: true })).toBe(160);
  });

  it('applies the curse surcharge only to the cursed item', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium(items, newcomer)).toBe(231);
  });

  it('applies loyalty discount at exactly 2 years', () => {
    // 100 - 20 loyalty + 10 first + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, isFollowUp: false })).toBe(95);
  });

  it('does not apply loyalty discount below 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1, isFollowUp: false })).toBe(115);
  });

  it('applies high-enchantment surcharge at exactly enchantment 5, stacking with curse', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer)).toBe(195);
  });

  it('does not apply high-enchantment surcharge at enchantment 4', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer)).toBe(115);
    expect(quotePremium([{ type: 'sword', enchantment: 4, cursed: true }], newcomer)).toBe(165);
  });

  it('rounds fractional premiums up in the MHPCO favor', () => {
    // potion 40 + 10% = 44; 2 runes 50 cursed +25 ... use a single cursed rune: 25 + 12.5 + 2.5 + 5 = 45
    expect(quotePremium([{ type: 'rune', cursed: true }], newcomer)).toBe(45);
    // amulet 60, follow-up: 60 + 6 - 9 + 5 = 62; rune follow-up: 25 + 2.5 - 3.75 + 5 = 28.75 -> 29
    expect(quotePremium([{ type: 'rune' }], { yearsWithMHPCO: 0, isFollowUp: true })).toBe(29);
  });
});
