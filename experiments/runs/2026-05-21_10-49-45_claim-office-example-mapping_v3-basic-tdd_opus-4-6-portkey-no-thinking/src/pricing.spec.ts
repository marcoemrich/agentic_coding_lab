import { describe, it, expect } from 'vitest';
import { getItemInsuranceValue, getItemBasePremium, computeComponentsPremium } from './pricing.js';

describe('Item insurance values', () => {
  it('sword has insurance value 1000', () => {
    expect(getItemInsuranceValue('sword')).toBe(1000);
  });
  it('amulet has insurance value 600', () => {
    expect(getItemInsuranceValue('amulet')).toBe(600);
  });
  it('staff has insurance value 800', () => {
    expect(getItemInsuranceValue('staff')).toBe(800);
  });
  it('potion has insurance value 400', () => {
    expect(getItemInsuranceValue('potion')).toBe(400);
  });
  it('component has insurance value 250', () => {
    expect(getItemInsuranceValue('rune')).toBe(250);
    expect(getItemInsuranceValue('moonstone')).toBe(250);
  });
});

describe('Item base premiums', () => {
  it('sword has base premium 100', () => {
    expect(getItemBasePremium('sword')).toBe(100);
  });
  it('amulet has base premium 60', () => {
    expect(getItemBasePremium('amulet')).toBe(60);
  });
  it('staff has base premium 80', () => {
    expect(getItemBasePremium('staff')).toBe(80);
  });
  it('potion has base premium 40', () => {
    expect(getItemBasePremium('potion')).toBe(40);
  });
  it('single component has base premium 25', () => {
    expect(getItemBasePremium('rune')).toBe(25);
    expect(getItemBasePremium('moonstone')).toBe(25);
  });
});

describe('Component block pricing', () => {
  it('2 runes → 50 G', () => {
    expect(computeComponentsPremium([
      { type: 'rune' }, { type: 'rune' },
    ])).toBe(50);
  });
  it('3 runes → 60 G (block applies)', () => {
    expect(computeComponentsPremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])).toBe(60);
  });
  it('4 runes → 100 G (no block)', () => {
    expect(computeComponentsPremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])).toBe(100);
  });
  it('7 runes → 175 G', () => {
    const runes = Array.from({ length: 7 }, () => ({ type: 'rune' as const }));
    expect(computeComponentsPremium(runes)).toBe(175);
  });
  it('2 runes + 1 moonstone → 75 G (no block, different types)', () => {
    expect(computeComponentsPremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
    ])).toBe(75);
  });
  it('3 runes + 3 moonstones → 120 G (two blocks)', () => {
    expect(computeComponentsPremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toBe(120);
  });
});
