import { describe, it, expect } from 'vitest';
import {
  isComponent,
  isMainItem,
  isKnownItemType,
  itemInsuranceValue,
  itemBasePremium,
} from './catalog';

describe('catalog', () => {
  it('classifies main items', () => {
    expect(isMainItem('sword')).toBe(true);
    expect(isMainItem('amulet')).toBe(true);
    expect(isMainItem('staff')).toBe(true);
    expect(isMainItem('potion')).toBe(true);
    expect(isMainItem('rune')).toBe(false);
  });

  it('classifies components', () => {
    expect(isComponent('rune')).toBe(true);
    expect(isComponent('moonstone')).toBe(true);
    expect(isComponent('sword')).toBe(false);
  });

  it('recognises known and unknown types', () => {
    expect(isKnownItemType('sword')).toBe(true);
    expect(isKnownItemType('rune')).toBe(true);
    expect(isKnownItemType('broomstick')).toBe(false);
  });

  it('provides insurance values for main items', () => {
    expect(itemInsuranceValue('sword')).toBe(1000);
    expect(itemInsuranceValue('amulet')).toBe(600);
    expect(itemInsuranceValue('staff')).toBe(800);
    expect(itemInsuranceValue('potion')).toBe(400);
  });

  it('provides insurance value for components', () => {
    expect(itemInsuranceValue('rune')).toBe(250);
    expect(itemInsuranceValue('moonstone')).toBe(250);
  });

  it('provides base premiums for main items', () => {
    expect(itemBasePremium('sword')).toBe(100);
    expect(itemBasePremium('amulet')).toBe(60);
    expect(itemBasePremium('staff')).toBe(80);
    expect(itemBasePremium('potion')).toBe(40);
  });

  it('provides base premium for components', () => {
    expect(itemBasePremium('rune')).toBe(25);
    expect(itemBasePremium('moonstone')).toBe(25);
  });
});
