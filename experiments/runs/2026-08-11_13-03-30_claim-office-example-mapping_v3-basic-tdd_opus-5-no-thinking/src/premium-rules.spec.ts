import { describe, expect, it } from 'vitest';
import { policyBasePremium, quotePremium } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('building block of 3 alike components', () => {
  it.each([
    [2, 50],
    [3, 60], // block applies
    [4, 100], // no block — a block is exactly 3
    [7, 175],
  ])('prices %i runes at %i G base', (count, expected) => {
    expect(policyBasePremium(runes(count))).toBe(expected);
  });

  it('does not form a block across different component types', () => {
    expect(
      policyBasePremium([...runes(2), { type: 'moonstone' }]),
    ).toBe(75);
  });

  it('forms one block per component type', () => {
    const items = [...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))];
    expect(policyBasePremium(items)).toBe(120);
  });
});

describe('modifier scope on multi-item policies', () => {
  it('applies the curse surcharge only to the cursed item', () => {
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    // base 160 + 50 curse = 210, then 10 % first insurance on 160 = 16, + 5 fee
    expect(policyBasePremium(items)).toBe(160);
    expect(quotePremium(newcomer, 0, items)).toBe(231);
  });
});

describe('modifier thresholds', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    const twoYears = { yearsWithMHPCO: 2 };
    // 100 base + 10 first insurance − 20 loyalty + 5 fee
    expect(quotePremium(twoYears, 0, [{ type: 'sword' }])).toBe(95);
  });

  it('charges the high-enchantment surcharge at exactly enchantment 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(quotePremium(newcomer, 0, [{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('stacks curse and high enchantment', () => {
    // 100 + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    expect(
      quotePremium(newcomer, 0, [{ type: 'sword', enchantment: 5, cursed: true }]),
    ).toBe(195);
  });

  it('charges no high-enchantment surcharge at enchantment 4', () => {
    expect(quotePremium(newcomer, 0, [{ type: 'sword', enchantment: 4 }])).toBe(115);
  });
});

describe('integration examples', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(newcomer, 0, items)).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(loyal, 1, items)).toBe(160);
  });
});
