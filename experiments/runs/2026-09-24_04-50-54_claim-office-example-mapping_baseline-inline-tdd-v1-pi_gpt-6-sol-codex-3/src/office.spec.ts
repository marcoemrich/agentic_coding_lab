import { describe, expect, it } from 'vitest';
import { runScenario } from './office.js';

describe('quotes', () => {
  it('prices main items and charges a processing fee even for an empty policy', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }, { type: 'staff' }, { type: 'potion' }] },
      { op: 'quote', items: [] },
    ] })).toEqual({ results: [{ premium: 313 }, { premium: 5 }] });
  });

  it('discounts exactly three components of the same type, without reducing insured value', () => {
    const items = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: items('rune', 2) },
      { op: 'quote', items: items('rune', 3) },
      { op: 'quote', items: items('rune', 4) },
      { op: 'quote', items: [...items('rune', 2), ...items('moonstone', 1)] },
      { op: 'quote', items: [...items('rune', 3), ...items('moonstone', 3)] },
    ] })).toEqual({ results: [
      { premium: 60 }, { premium: 62 }, { premium: 100 }, { premium: 77 }, { premium: 119 },
    ] });
  });

  it('does not form blocks from seven components and rounds fractional premiums up', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: 'quote', items: Array.from({ length: 7 }, () => ({ type: 'rune' })) },
      { op: 'quote', items: [{ type: 'rune' }] },
    ] })).toEqual({ results: [{ premium: 163 }, { premium: 24 }] });
  });

  it('stacks item surcharges with policy-wide discounts and first insurance', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }, { type: 'amulet' }] },
    ] })).toEqual({ results: [{ premium: 175 }, { premium: 160 }, { premium: 205 }] });
  });
});
