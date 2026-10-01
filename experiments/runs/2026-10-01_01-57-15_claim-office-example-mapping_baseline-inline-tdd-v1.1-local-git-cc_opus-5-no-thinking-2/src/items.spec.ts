import { describe, it, expect } from 'vitest';
import { itemSpec } from './items.js';

describe('item price list', () => {
  it('knows the sword', () => {
    expect(itemSpec('sword')).toEqual({ insuranceValue: 1000, basePremium: 100, kind: 'main' });
  });

  it('knows the amulet', () => {
    expect(itemSpec('amulet')).toEqual({ insuranceValue: 600, basePremium: 60, kind: 'main' });
  });

  it('knows the staff', () => {
    expect(itemSpec('staff')).toEqual({ insuranceValue: 800, basePremium: 80, kind: 'main' });
  });

  it('knows the potion', () => {
    expect(itemSpec('potion')).toEqual({ insuranceValue: 400, basePremium: 40, kind: 'main' });
  });

  it('insures a rune as a component at 250 G / 25 G', () => {
    expect(itemSpec('rune')).toEqual({ insuranceValue: 250, basePremium: 25, kind: 'component' });
  });

  it('insures a moonstone as a component at 250 G / 25 G', () => {
    expect(itemSpec('moonstone')).toEqual({ insuranceValue: 250, basePremium: 25, kind: 'component' });
  });

  it('does not know a broomstick', () => {
    expect(itemSpec('broomstick')).toBeUndefined();
  });
});
