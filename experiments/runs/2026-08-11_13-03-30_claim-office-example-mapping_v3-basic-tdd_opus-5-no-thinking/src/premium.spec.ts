import { describe, expect, it } from 'vitest';
import { quotePremium } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };

describe('base premiums per item', () => {
  // newcomer, no previous contract: base + 10 % first insurance + 5 G fee.
  it.each([
    ['sword', 115], // 100 + 10 + 5
    ['amulet', 71], // 60 + 6 + 5
    ['staff', 93], // 80 + 8 + 5
    ['potion', 49], // 40 + 4 + 5
  ])('prices a plain %s at %i G', (type, expected) => {
    expect(quotePremium(newcomer, 0, [{ type }])).toBe(expected);
  });

  it('charges 25 G per single component', () => {
    // 25 + 2.5 + 5 = 32.5 → rounded up
    expect(quotePremium(newcomer, 0, [{ type: 'rune' }])).toBe(33);
  });

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium(newcomer, 0, [])).toBe(5);
  });

  it('rejects an unknown item type', () => {
    expect(() => quotePremium(newcomer, 0, [{ type: 'broomstick' }])).toThrow();
  });
});
