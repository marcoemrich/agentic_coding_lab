import { describe, it, expect } from 'vitest';
import { policyBasePremium } from './premium.js';
import type { Item } from './types.js';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra }) as Item;

describe('base premiums per item type', () => {
  it('prices a sword at 100 G', () => {
    expect(policyBasePremium([item('sword')])).toBe(100);
  });

  it('prices an amulet at 60 G', () => {
    expect(policyBasePremium([item('amulet')])).toBe(60);
  });

  it('prices a staff at 80 G', () => {
    expect(policyBasePremium([item('staff')])).toBe(80);
  });

  it('prices a potion at 40 G', () => {
    expect(policyBasePremium([item('potion')])).toBe(40);
  });

  it('sums the base premiums of several items', () => {
    expect(policyBasePremium([item('sword'), item('amulet')])).toBe(160);
  });

  it('prices an empty item list at 0 G', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});

describe('component building blocks', () => {
  it('prices 2 runes at 50 G', () => {
    expect(policyBasePremium([item('rune'), item('rune')])).toBe(50);
  });

  it('prices 3 runes at 60 G because the block applies', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('rune')])).toBe(60);
  });

  it('prices 4 runes at 100 G because a block requires exactly 3', () => {
    expect(policyBasePremium(Array(4).fill(item('rune')))).toBe(100);
  });

  it('prices 7 runes at 175 G', () => {
    expect(policyBasePremium(Array(7).fill(item('rune')))).toBe(175);
  });

  it('does not form a block from different component types', () => {
    expect(policyBasePremium([item('rune'), item('rune'), item('moonstone')])).toBe(75);
  });

  it('forms two separate blocks from 3 runes and 3 moonstones', () => {
    expect(
      policyBasePremium([...Array(3).fill(item('rune')), ...Array(3).fill(item('moonstone'))]),
    ).toBe(120);
  });
});
