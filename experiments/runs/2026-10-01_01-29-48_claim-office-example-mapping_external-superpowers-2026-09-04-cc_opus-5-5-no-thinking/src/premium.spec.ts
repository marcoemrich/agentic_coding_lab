import { describe, it, expect } from 'vitest';
import { policyBasePremium, quotePremium } from './premium';

const moonstones = (n: number) => Array.from({ length: n }, () => ({ type: 'moonstone' }));
const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('policy base premium', () => {
  it('charges 25 G per component below a block', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
  });

  it.each([
    [3, 60],
    [4, 100],
    [7, 175],
  ])('applies the 60 G block only to exactly 3 alike components (%i runes → %i G)', (n, want) => {
    expect(policyBasePremium(runes(n))).toBe(want);
  });

  it('does not form a block from components of different types', () => {
    expect(policyBasePremium([...runes(2), ...moonstones(1)])).toBe(75);
  });

  it('forms a separate block per component type', () => {
    expect(policyBasePremium([...runes(3), ...moonstones(3)])).toBe(120);
  });

  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges the price-list base premium for a %s (%i G)', (type, want) => {
    expect(policyBasePremium([{ type }])).toBe(want);
  });

  it('sums main items and components', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }, ...runes(3)])).toBe(220);
  });
});

const newcomer = { yearsWithMHPCO: 0, isFollowUpContract: false };

describe('quote premium', () => {
  it('charges only the 5 G processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('adds a 10 % first-insurance surcharge on the policy base premium', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3 }], newcomer)).toBe(115);
  });

  it('adds a 50 % curse surcharge for a newcomer with a cursed sword (integration: 165 G)', () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer),
    ).toBe(165);
  });

  it('applies the curse surcharge to the cursed item only, not the policy total', () => {
    // 160 base + 50 curse (of sword) + 16 first insurance (of 160) + 5 fee
    expect(
      quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet', cursed: false }], newcomer),
    ).toBe(231);
  });

  it.each([
    // [enchantment, cursed, premium] — 100 base + 10 first insurance + 5 fee = 115
    [5, false, 145], // +30 high enchantment
    [5, true, 195], // +30 high enchantment +50 curse
    [4, false, 115],
    [4, true, 165], // +50 curse only
  ])('sword with enchantment %i (cursed: %s) → %i G', (enchantment, cursed, want) => {
    expect(quotePremium([{ type: 'sword', enchantment, cursed }], newcomer)).toBe(want);
  });

  it.each([
    // 100 base + 10 first insurance − 20 loyalty (if applicable) + 5 fee
    [1, 115],
    [2, 95],
    [3, 95],
  ])('customer with %i years → %i G (20 %% loyalty discount from 2 years)', (yearsWithMHPCO, want) => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO, isFollowUpContract: false })).toBe(want);
  });

  it('stacks all modifiers for a long-standing customer\'s follow-up contract (integration: 160 G)', () => {
    // 100 + 50 curse + 30 enchantment − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        isFollowUpContract: true,
      }),
    ).toBe(160);
  });

  it('rounds a fractional premium up in the MHPCO\'s favor', () => {
    // 175 base + 17.5 first insurance − 35 loyalty − 26.25 follow-up = 131.25 → 132 + 5 fee
    expect(quotePremium(runes(7), { yearsWithMHPCO: 2, isFollowUpContract: true })).toBe(137);
  });

  it('applies the curse surcharge to a cursed component\'s base premium', () => {
    // 25 base + 12.5 curse + 2.5 first insurance = 40 + 5 fee
    expect(quotePremium([{ type: 'rune', cursed: true }], newcomer)).toBe(45);
  });

  it('rejects an item of unknown type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], newcomer)).toThrow(/broomstick/);
  });
});
