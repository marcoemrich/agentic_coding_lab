import { describe, expect, it } from 'vitest';
import { Item, UnknownItemError, insuranceSum, policyBasePremium } from './policy.js';

const items = (...types: string[]): Item[] => types.map((type) => ({ type }));

describe('policy base premium', () => {
  it('sums main item base premiums', () => {
    expect(policyBasePremium(items('sword', 'amulet'))).toBe(160);
  });

  it('charges components individually', () => {
    expect(policyBasePremium(items('rune', 'rune'))).toBe(50);
    expect(policyBasePremium(items('rune', 'rune', 'rune', 'rune'))).toBe(100);
    expect(policyBasePremium(Array(7).fill({ type: 'rune' }))).toBe(175);
  });

  it('applies the block of exactly 3 alike components', () => {
    expect(policyBasePremium(items('rune', 'rune', 'rune'))).toBe(60);
  });

  it('treats different component types as separate blocks', () => {
    expect(policyBasePremium(items('rune', 'rune', 'moonstone'))).toBe(75);
    expect(
      policyBasePremium(items('rune', 'rune', 'rune', 'moonstone', 'moonstone', 'moonstone')),
    ).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => policyBasePremium(items('broomstick'))).toThrow(UnknownItemError);
  });
});

describe('insurance sum', () => {
  it('sums unmodified insurance values', () => {
    expect(insuranceSum(items('sword', 'sword'))).toBe(2000);
    expect(insuranceSum(items('sword', 'amulet'))).toBe(1600);
    expect(insuranceSum(items('sword', 'rune', 'rune', 'rune'))).toBe(1750);
  });
});
