import { describe, it, expect } from 'vitest';
import { getItemSpec, ITEM_SPECS } from './items';

describe('Item specifications', () => {
  it('should have spec for sword', () => {
    const spec = getItemSpec('sword');
    expect(spec.insuranceValue).toBe(1000);
    expect(spec.basePremium).toBe(100);
  });

  it('should have spec for amulet', () => {
    const spec = getItemSpec('amulet');
    expect(spec.insuranceValue).toBe(600);
    expect(spec.basePremium).toBe(60);
  });

  it('should have spec for staff', () => {
    const spec = getItemSpec('staff');
    expect(spec.insuranceValue).toBe(800);
    expect(spec.basePremium).toBe(80);
  });

  it('should have spec for potion', () => {
    const spec = getItemSpec('potion');
    expect(spec.insuranceValue).toBe(400);
    expect(spec.basePremium).toBe(40);
  });

  it('should have spec for rune (component)', () => {
    const spec = getItemSpec('rune');
    expect(spec.insuranceValue).toBe(250);
    expect(spec.basePremium).toBe(25);
  });

  it('should have spec for moonstone (component)', () => {
    const spec = getItemSpec('moonstone');
    expect(spec.insuranceValue).toBe(250);
    expect(spec.basePremium).toBe(25);
  });

  it('should throw on unknown item type', () => {
    expect(() => getItemSpec('broomstick')).toThrow();
  });
});
