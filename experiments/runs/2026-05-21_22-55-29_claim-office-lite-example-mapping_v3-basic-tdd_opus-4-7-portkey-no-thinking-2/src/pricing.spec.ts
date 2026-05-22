import { describe, it, expect } from 'vitest';
import { itemBasePremium, itemInsuranceValue, policyBasePremium, isComponent, isMainItem } from './pricing.js';

describe('item base premium', () => {
  it('sword: 100 G', () => {
    expect(itemBasePremium({ type: 'sword' })).toBe(100);
  });
  it('amulet: 60 G', () => {
    expect(itemBasePremium({ type: 'amulet' })).toBe(60);
  });
  it('staff: 80 G', () => {
    expect(itemBasePremium({ type: 'staff' })).toBe(80);
  });
  it('potion: 40 G', () => {
    expect(itemBasePremium({ type: 'potion' })).toBe(40);
  });
  it('rune (component): 25 G', () => {
    expect(itemBasePremium({ type: 'rune' })).toBe(25);
  });
  it('moonstone (component): 25 G', () => {
    expect(itemBasePremium({ type: 'moonstone' })).toBe(25);
  });
});

describe('item insurance value', () => {
  it('sword: 1000 G', () => {
    expect(itemInsuranceValue({ type: 'sword' })).toBe(1000);
  });
  it('amulet: 600 G', () => {
    expect(itemInsuranceValue({ type: 'amulet' })).toBe(600);
  });
  it('staff: 800 G', () => {
    expect(itemInsuranceValue({ type: 'staff' })).toBe(800);
  });
  it('potion: 400 G', () => {
    expect(itemInsuranceValue({ type: 'potion' })).toBe(400);
  });
  it('component: 250 G', () => {
    expect(itemInsuranceValue({ type: 'rune' })).toBe(250);
    expect(itemInsuranceValue({ type: 'moonstone' })).toBe(250);
  });
});

describe('isComponent / isMainItem', () => {
  it('classifies components', () => {
    expect(isComponent('rune')).toBe(true);
    expect(isComponent('moonstone')).toBe(true);
    expect(isComponent('sword')).toBe(false);
  });
  it('classifies main items', () => {
    expect(isMainItem('sword')).toBe(true);
    expect(isMainItem('rune')).toBe(false);
  });
});

describe('policy base premium with component blocks', () => {
  it('2 runes -> 50 G', () => {
    expect(policyBasePremium([
      { type: 'rune' }, { type: 'rune' },
    ])).toBe(50);
  });
  it('3 runes -> 60 G (block)', () => {
    expect(policyBasePremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])).toBe(60);
  });
  it('4 runes -> 100 G (no block, block requires exactly 3)', () => {
    expect(policyBasePremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])).toBe(100);
  });
  it('7 runes -> 175 G', () => {
    expect(policyBasePremium(Array(7).fill({ type: 'rune' }))).toBe(175);
  });
  it('2 runes + 1 moonstone -> 75 G (no block, different types)', () => {
    expect(policyBasePremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
    ])).toBe(75);
  });
  it('3 runes + 3 moonstones -> 120 G (two separate blocks)', () => {
    expect(policyBasePremium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toBe(120);
  });
  it('cursed sword + plain amulet -> 160 G base', () => {
    expect(policyBasePremium([
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ])).toBe(160);
  });
  it('empty -> 0', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});
