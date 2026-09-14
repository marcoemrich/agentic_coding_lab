import { describe, expect, it } from 'vitest';
import { isComponent, lookupItem } from './catalog.js';

describe('catalog', () => {
  it('knows main items', () => {
    expect(lookupItem('sword')).toEqual({ value: 1000, basePremium: 100 });
    expect(lookupItem('amulet')).toEqual({ value: 600, basePremium: 60 });
    expect(lookupItem('staff')).toEqual({ value: 800, basePremium: 80 });
    expect(lookupItem('potion')).toEqual({ value: 400, basePremium: 40 });
  });

  it('knows components', () => {
    expect(lookupItem('rune')).toEqual({ value: 250, basePremium: 25 });
    expect(lookupItem('moonstone')).toEqual({ value: 250, basePremium: 25 });
    expect(isComponent('rune')).toBe(true);
    expect(isComponent('sword')).toBe(false);
  });

  it('rejects unknown types', () => {
    expect(lookupItem('broomstick')).toBeUndefined();
  });
});
