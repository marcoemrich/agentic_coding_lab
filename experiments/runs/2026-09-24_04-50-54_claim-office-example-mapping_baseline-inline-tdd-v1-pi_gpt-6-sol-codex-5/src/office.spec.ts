import { describe, expect, it } from 'vitest';
import { runScenario } from './office.js';

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Array<{ type: string; cursed?: boolean; enchantment?: number; material?: string }>) => ({ op: 'quote' as const, items });
const item = (type: string) => ({ type });

describe('quotes', () => {
  it('prices the four main items and an empty policy including the fee and first-insurance assessment', () => {
    expect(runScenario({ customer: customer(), steps: [quote([])] })).toEqual({ results: [{ premium: 5 }] });
    for (const [type, premium] of [['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49]] as const) {
      expect(runScenario({ customer: customer(), steps: [quote([item(type)])] })).toEqual({ results: [{ premium }] });
    }
  });

  it('uses exact-type blocks of exactly three components, without changing insurance values', () => {
    for (const [items, base] of [
      [[item('rune'), item('rune')], 50],
      [[item('rune'), item('rune'), item('rune')], 60],
      [[item('rune'), item('rune'), item('rune'), item('rune')], 100],
      [Array.from({ length: 7 }, () => item('rune')), 175],
      [[item('rune'), item('rune'), item('moonstone')], 75],
      [[...Array.from({ length: 3 }, () => item('rune')), ...Array.from({ length: 3 }, () => item('moonstone'))], 120],
    ] as const) {
      expect(runScenario({ customer: customer(), steps: [quote([...items])] })).toEqual({ results: [{ premium: Math.ceil(base * 110 / 100 + 5) }] });
    }
  });

  it('stacks item risk against item base and policy adjustments against policy base', () => {
    expect(runScenario({ customer: customer(), steps: [quote([{ type: 'sword', cursed: true }, item('amulet')])] })).toEqual({ results: [{ premium: 231 }] });
    expect(runScenario({ customer: customer(), steps: [quote([{ type: 'sword', cursed: true, enchantment: 5 }])] })).toEqual({ results: [{ premium: 195 }] });
    expect(runScenario({ customer: customer(), steps: [quote([{ type: 'sword', cursed: true, enchantment: 4 }])] })).toEqual({ results: [{ premium: 165 }] });
    expect(runScenario({ customer: customer(2), steps: [quote([item('sword')])] })).toEqual({ results: [{ premium: 95 }] });
  });

  it('keeps first-insurance assessment per quote item even on subsequent contracts', () => {
    expect(runScenario({ customer: customer(3), steps: [quote([item('potion')]), quote([{ type: 'sword', cursed: true, enchantment: 7 }])] })).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
});
