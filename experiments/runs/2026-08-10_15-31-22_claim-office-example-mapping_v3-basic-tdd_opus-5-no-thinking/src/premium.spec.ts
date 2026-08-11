import { describe, it, expect } from 'vitest';
import { policyBasePremium, quotePremium } from './premium.js';
import type { Item } from './types.js';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra }) as Item;

describe('policy base premium', () => {
  it('sums main item base premiums', () => {
    expect(policyBasePremium([item('sword')])).toBe(100);
    expect(policyBasePremium([item('amulet')])).toBe(60);
    expect(policyBasePremium([item('staff')])).toBe(80);
    expect(policyBasePremium([item('potion')])).toBe(40);
    expect(policyBasePremium([item('sword'), item('amulet')])).toBe(160);
  });

  it('charges 25 G per component', () => {
    expect(policyBasePremium([item('rune'), item('rune')])).toBe(50);
  });

  it('applies the block price for exactly 3 alike components', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('rune')])).toBe(60);
  });

  it('does not apply the block for 4 alike components', () => {
    expect(policyBasePremium(Array(4).fill(item('rune')))).toBe(100);
  });

  it('charges 175 G for 7 runes', () => {
    expect(policyBasePremium(Array(7).fill(item('rune')))).toBe(175);
  });

  it('requires alike components to be the same type', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('moonstone')])).toBe(75);
  });

  it('applies two separate blocks for 3 runes and 3 moonstones', () => {
    expect(
      policyBasePremium([
        ...Array(3).fill(item('rune')),
        ...Array(3).fill(item('moonstone')),
      ]),
    ).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => policyBasePremium([item('broomstick')])).toThrow();
  });
});

describe('quote premium', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('applies the curse surcharge to the affected item only', () => {
    // 160 base + 50 curse (50 % of the sword only) = 210
    // + 10 % first insurance of the 160 policy base = 16 -> 226 + 5 fee = 231
    const items = [item('sword', { cursed: true }), item('amulet')];
    expect(quotePremium(items, newcomer, 0)).toBe(231);
  });

  it('computes the newcomer cursed sword integration example', () => {
    const items = [item('sword', { material: 'steel', enchantment: 3, cursed: true })];
    expect(quotePremium(items, newcomer, 0)).toBe(165);
  });

  it('computes the long-standing customer second contract example', () => {
    const items = [item('sword', { material: 'steel', enchantment: 7, cursed: true })];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('applies the loyalty discount at exactly 2 years', () => {
    // 100 base + 10 first insurance - 20 loyalty = 90 + 5
    expect(quotePremium([item('sword')], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('applies the high enchantment surcharge at exactly 5', () => {
    // 100 + 30 + 10 = 140 + 5
    expect(quotePremium([item('sword', { enchantment: 5 })], newcomer, 0)).toBe(145);
  });

  it('applies both surcharges for a cursed item at enchantment 5', () => {
    // 100 + 50 + 30 + 10 = 190 + 5
    expect(quotePremium([item('sword', { enchantment: 5, cursed: true })], newcomer, 0)).toBe(195);
  });

  it('does not apply the high enchantment surcharge at 4', () => {
    // 100 + 10 = 110 + 5
    expect(quotePremium([item('sword', { enchantment: 4 })], newcomer, 0)).toBe(115);
  });

  it('rounds the final premium up, keeping intermediates as fractions', () => {
    // 7 runes: 175 base + 17.5 first insurance - 26.25 follow-up = 166.25
    // + 5 fee = 171.25 -> 172
    expect(quotePremium(Array(7).fill(item('rune')), newcomer, 1)).toBe(172);
  });
});
