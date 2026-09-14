import { describe, expect, it } from 'vitest';
import { specFor } from './catalog.js';

describe('catalog', () => {
  it('knows the main items', () => {
    expect(specFor('sword')).toEqual({ insuranceValue: 1000, basePremium: 100, component: false });
    expect(specFor('amulet')).toEqual({ insuranceValue: 600, basePremium: 60, component: false });
    expect(specFor('staff')).toEqual({ insuranceValue: 800, basePremium: 80, component: false });
    expect(specFor('potion')).toEqual({ insuranceValue: 400, basePremium: 40, component: false });
  });

  it('knows components', () => {
    expect(specFor('rune')).toEqual({ insuranceValue: 250, basePremium: 25, component: true });
    expect(specFor('moonstone')).toEqual({ insuranceValue: 250, basePremium: 25, component: true });
  });

  it('returns undefined for unknown types', () => {
    expect(specFor('broomstick')).toBeUndefined();
  });
});
