import { describe, it, expect } from 'vitest';
import { catalogEntry, isComponent, isMainItem, COMPONENT_VALUE, COMPONENT_PREMIUM } from './catalog';

describe('catalog', () => {
  it('gives insurance value and base premium for main items', () => {
    expect(catalogEntry('sword')).toEqual({ value: 1000, premium: 100 });
    expect(catalogEntry('amulet')).toEqual({ value: 600, premium: 60 });
    expect(catalogEntry('staff')).toEqual({ value: 800, premium: 80 });
    expect(catalogEntry('potion')).toEqual({ value: 400, premium: 40 });
  });

  it('gives value and premium for components', () => {
    expect(catalogEntry('rune')).toEqual({ value: COMPONENT_VALUE, premium: COMPONENT_PREMIUM });
    expect(catalogEntry('moonstone')).toEqual({ value: 250, premium: 25 });
  });

  it('classifies main items and components', () => {
    expect(isMainItem('sword')).toBe(true);
    expect(isComponent('rune')).toBe(true);
    expect(isComponent('sword')).toBe(false);
  });

  it('throws for unknown types', () => {
    expect(() => catalogEntry('broomstick')).toThrow();
  });
});
