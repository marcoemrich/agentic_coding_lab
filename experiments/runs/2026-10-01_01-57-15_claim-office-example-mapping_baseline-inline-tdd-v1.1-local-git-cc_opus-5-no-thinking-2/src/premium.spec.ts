import { describe, it, expect } from 'vitest';
import { policyBasePremium } from './premium.js';

const item = (type: string) => ({ type });
const many = (type: string, n: number) => Array.from({ length: n }, () => item(type));

describe('policy base premium', () => {
  it('is 0 for an empty item list', () => {
    expect(policyBasePremium([])).toBe(0);
  });

  it('sums the base premiums of main items', () => {
    expect(policyBasePremium([item('sword'), item('amulet')])).toBe(160);
  });

  describe('building block of 3 alike components', () => {
    it('charges 2 runes individually', () => {
      expect(policyBasePremium(many('rune', 2))).toBe(50);
    });

    it('charges a block of exactly 3 runes at 60 G', () => {
      expect(policyBasePremium(many('rune', 3))).toBe(60);
    });

    it('charges 4 runes individually — a block requires exactly 3', () => {
      expect(policyBasePremium(many('rune', 4))).toBe(100);
    });

    it('charges 7 runes individually', () => {
      expect(policyBasePremium(many('rune', 7))).toBe(175);
    });
  });

  describe('"alike" means the same component type', () => {
    it('forms no block from 2 runes and 1 moonstone', () => {
      expect(policyBasePremium([...many('rune', 2), item('moonstone')])).toBe(75);
    });

    it('forms two separate blocks from 3 runes and 3 moonstones', () => {
      expect(policyBasePremium([...many('rune', 3), ...many('moonstone', 3)])).toBe(120);
    });
  });

  it('combines main items with a component block', () => {
    expect(policyBasePremium([item('sword'), ...many('rune', 3)])).toBe(160);
  });
});
