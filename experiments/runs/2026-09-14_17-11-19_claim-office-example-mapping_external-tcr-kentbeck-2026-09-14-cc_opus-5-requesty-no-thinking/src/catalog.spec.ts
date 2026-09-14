import { describe, expect, it } from 'vitest';
import { isComponent, lookup } from './catalog.js';

describe('catalog', () => {
  it('knows main items', () => {
    expect(lookup('sword')).toEqual({ insuranceValue: 1000, basePremium: 100 });
    expect(lookup('amulet')).toEqual({ insuranceValue: 600, basePremium: 60 });
    expect(lookup('staff')).toEqual({ insuranceValue: 800, basePremium: 80 });
    expect(lookup('potion')).toEqual({ insuranceValue: 400, basePremium: 40 });
  });

  it('knows components', () => {
    expect(lookup('rune')).toEqual({ insuranceValue: 250, basePremium: 25 });
    expect(lookup('moonstone')).toEqual({ insuranceValue: 250, basePremium: 25 });
    expect(isComponent('rune')).toBe(true);
    expect(isComponent('sword')).toBe(false);
  });

  it('returns undefined for unknown types', () => {
    expect(lookup('broomstick')).toBeUndefined();
  });
});
