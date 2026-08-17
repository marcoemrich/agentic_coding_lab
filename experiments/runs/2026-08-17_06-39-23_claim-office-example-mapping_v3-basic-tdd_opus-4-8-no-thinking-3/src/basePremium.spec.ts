import { describe, it, expect } from 'vitest';
import { basePremium } from './basePremium';

const item = (type: string) => ({ type });

describe('basePremium', () => {
  it('sums main item base premiums', () => {
    expect(basePremium([item('sword'), item('amulet')])).toBe(160);
  });

  it('charges components at 25 G each when no block', () => {
    expect(basePremium([item('rune'), item('rune')])).toBe(50);
  });

  it('applies block price of 60 G for exactly 3 alike components', () => {
    expect(basePremium([item('rune'), item('rune'), item('rune')])).toBe(60);
  });

  it('does not apply block for 4 alike (block requires exactly 3)', () => {
    expect(basePremium([item('rune'), item('rune'), item('rune'), item('rune')])).toBe(100);
  });

  it('applies one block plus remainder for 7 runes', () => {
    expect(
      basePremium(Array.from({ length: 7 }, () => item('rune'))),
    ).toBe(175);
  });

  it('does not block across different component types', () => {
    expect(basePremium([item('rune'), item('rune'), item('moonstone')])).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    expect(
      basePremium([
        item('rune'), item('rune'), item('rune'),
        item('moonstone'), item('moonstone'), item('moonstone'),
      ]),
    ).toBe(120);
  });
});
