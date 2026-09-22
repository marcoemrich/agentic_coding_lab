import { describe, it, expect } from 'vitest';
import { quotePremium, itemBasePremium, policyBasePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium(newcomer, [], 0)).toBe(5);
  });

  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('prices a plain %s at %i G base premium', (type, expected) => {
    expect(itemBasePremium({ type })).toBe(expected);
  });

  it('prices each component at 25 G', () => {
    expect(itemBasePremium({ type: 'rune' })).toBe(25);
    expect(itemBasePremium({ type: 'moonstone' })).toBe(25);
  });

  it('sums item base premiums into the policy base premium', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });
});

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('building block of 3 alike components', () => {
  it('charges 2 runes individually', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
  });

  it('applies the block price to exactly 3 runes', () => {
    expect(policyBasePremium(runes(3))).toBe(60);
  });

  it('charges 4 runes individually - a block requires exactly 3', () => {
    expect(policyBasePremium(runes(4))).toBe(100);
  });

  it('charges 7 runes individually', () => {
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  it('does not form a block from different component types', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(policyBasePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('premium modifiers', () => {
  const cursedSword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };

  it('adds the curse surcharge only to the cursed item, not the policy total', () => {
    // 100 + 60 base, + 50 curse on the sword, + 16 first insurance (10% of 160) + 5 fee
    expect(quotePremium(newcomer, [cursedSword, { type: 'amulet' }], 0)).toBe(231);
  });

  it('prices a newcomer with a cursed sword at 165 G', () => {
    expect(quotePremium(newcomer, [cursedSword], 0)).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium({ yearsWithMHPCO: 3 }, [item], 1)).toBe(160);
  });

  it('applies the high-enchantment surcharge at exactly enchantment 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(quotePremium(newcomer, [{ type: 'sword', enchantment: 5 }], 0)).toBe(145);
  });

  it('applies no high-enchantment surcharge at enchantment 4', () => {
    expect(quotePremium(newcomer, [{ type: 'sword', enchantment: 4 }], 0)).toBe(115);
  });

  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium({ yearsWithMHPCO: 2 }, [{ type: 'sword' }], 0)).toBe(95);
  });

  it('rounds the premium up, in the MHPCO favour', () => {
    // 2 runes: 50 base + 5 first insurance - 7.5 follow-up = 47.5 + 5 fee
    // = 52.5 -> 53
    expect(quotePremium(newcomer, runes(2), 1)).toBe(53);
  });
});
