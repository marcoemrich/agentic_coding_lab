import { describe, it, expect } from 'vitest';
import { policyBasePremium } from './basePremium';

const item = (type: string) => ({ type });

describe('policyBasePremium', () => {
  it('sums plain main items', () => {
    expect(policyBasePremium([item('sword'), item('amulet')])).toBe(160);
  });

  it('charges 25 G per component below a block', () => {
    expect(policyBasePremium([item('rune'), item('rune')])).toBe(50);
  });

  it('applies the block price for exactly 3 alike components', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('rune')])).toBe(60);
  });

  it('does not apply the block for 4 alike components', () => {
    const runes = [item('rune'), item('rune'), item('rune'), item('rune')];
    expect(policyBasePremium(runes)).toBe(100);
  });

  it('applies one block plus remainder for 7 alike components', () => {
    const runes = Array.from({ length: 7 }, () => item('rune'));
    expect(policyBasePremium(runes)).toBe(175);
  });

  it('does not form a block across different component types', () => {
    const items = [item('rune'), item('rune'), item('moonstone')];
    expect(policyBasePremium(items)).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    const items = [
      ...Array.from({ length: 3 }, () => item('rune')),
      ...Array.from({ length: 3 }, () => item('moonstone')),
    ];
    expect(policyBasePremium(items)).toBe(120);
  });

  it('is 0 for an empty list', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});
