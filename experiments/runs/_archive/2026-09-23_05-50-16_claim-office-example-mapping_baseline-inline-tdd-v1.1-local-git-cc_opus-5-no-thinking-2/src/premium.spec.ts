import { describe, it, expect } from 'vitest';
import { quotePremium, itemBasePremiums, type Item, type Customer } from './premium';

const NEWCOMER: Customer = { yearsWithMHPCO: 0 };

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra });
const items = (type: string, count: number): Item[] =>
  Array.from({ length: count }, () => item(type));

const totalBase = (list: Item[]): number =>
  itemBasePremiums(list).reduce((sum, entry) => sum + entry.basePremium, 0);

describe('base premiums', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], NEWCOMER, 0)).toBe(5);
  });

  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges the %s base premium plus first insurance and fee', (type, base) => {
    expect(quotePremium([item(type)], NEWCOMER, 0)).toBe(base + base * 0.1 + 5);
  });
});

describe('component base premiums', () => {
  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('charges %i runes as %i G base premium', (count, expected) => {
    expect(totalBase(items('rune', count))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(totalBase([...items('rune', 2), item('moonstone')])).toBe(75);
  });

  it('forms one block per component type', () => {
    expect(totalBase([...items('rune', 3), ...items('moonstone', 3)])).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('adds the curse surcharge only to the cursed item, not the policy total', () => {
    const policy = [item('sword', { cursed: true }), item('amulet')];
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium(policy, NEWCOMER, 0)).toBe(160 + 50 + 16 + 5);
  });

  it('adds the high-enchantment surcharge from enchantment 5 upwards', () => {
    expect(quotePremium([item('sword', { enchantment: 5 })], NEWCOMER, 0)).toBe(
      100 + 30 + 10 + 5,
    );
  });

  it('adds no high-enchantment surcharge below enchantment 5', () => {
    expect(quotePremium([item('sword', { enchantment: 4 })], NEWCOMER, 0)).toBe(100 + 10 + 5);
  });

  it('stacks curse and high-enchantment surcharges', () => {
    const cursedEnchanted = item('sword', { enchantment: 5, cursed: true });
    expect(quotePremium([cursedEnchanted], NEWCOMER, 0)).toBe(100 + 50 + 30 + 10 + 5);
  });
});

describe('policy-wide modifiers', () => {
  const LOYAL: Customer = { yearsWithMHPCO: 2 };

  it('grants the loyalty discount from 2 years of business', () => {
    expect(quotePremium([item('sword')], LOYAL, 0)).toBe(100 - 20 + 10 + 5);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(quotePremium([item('sword')], { yearsWithMHPCO: 1 }, 0)).toBe(100 + 10 + 5);
  });

  it('grants the follow-up discount on each contract after the first', () => {
    expect(quotePremium([item('sword')], NEWCOMER, 1)).toBe(100 - 15 + 10 + 5);
  });

  it('applies policy-wide modifiers to the policy base premium', () => {
    const policy = [item('sword'), item('amulet')];
    expect(quotePremium(policy, LOYAL, 1)).toBe(160 - 32 - 24 + 16 + 5);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final premium up', () => {
    // 3 potions: base 120, loyalty -24, first insurance +12 => 108 + 5 = 113
    // use a fraction: 1 potion + 1 rune with loyalty => base 65, -13, +6.5 => 58.5 + 5
    expect(quotePremium([item('potion'), item('rune')], { yearsWithMHPCO: 2 }, 0)).toBe(64);
  });
});

describe('integration examples', () => {
  it('quotes a newcomer with a cursed sword at 165 G', () => {
    const cursedSword = item('sword', { material: 'steel', enchantment: 3, cursed: true });
    expect(quotePremium([cursedSword], NEWCOMER, 0)).toBe(165);
  });

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const cursedSword = item('sword', { material: 'steel', enchantment: 7, cursed: true });
    expect(quotePremium([cursedSword], { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});
