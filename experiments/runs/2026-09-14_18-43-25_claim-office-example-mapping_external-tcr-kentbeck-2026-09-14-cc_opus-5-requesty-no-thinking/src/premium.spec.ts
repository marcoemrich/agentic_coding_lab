import { describe, expect, it } from 'vitest';
import { insuranceSum, policyBasePremium, type Item } from './premium';

const items = (...types: string[]): Item[] => types.map((type) => ({ type }));
const repeat = (type: string, n: number): Item[] => Array.from({ length: n }, () => ({ type }));

describe('policy base premium', () => {
  it('sums main item base premiums', () => {
    expect(policyBasePremium(items('sword', 'amulet'))).toBe(160);
  });

  it('prices components individually below a block', () => {
    expect(policyBasePremium(repeat('rune', 2))).toBe(50);
  });

  it('prices exactly 3 alike components as a block', () => {
    expect(policyBasePremium(repeat('rune', 3))).toBe(60);
  });

  it('does not apply the block for other counts', () => {
    expect(policyBasePremium(repeat('rune', 4))).toBe(100);
    expect(policyBasePremium(repeat('rune', 7))).toBe(175);
  });

  it('treats alike as the same component type', () => {
    expect(policyBasePremium([...repeat('rune', 2), { type: 'moonstone' }])).toBe(75);
    expect(policyBasePremium([...repeat('rune', 3), ...repeat('moonstone', 3)])).toBe(120);
  });

  it('is zero for no items', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});

describe('insurance sum', () => {
  it('sums unmodified insurance values', () => {
    expect(insuranceSum(items('sword', 'sword'))).toBe(2000);
    expect(insuranceSum(items('sword', 'amulet'))).toBe(1600);
    expect(insuranceSum([{ type: 'sword' }, ...repeat('rune', 3)])).toBe(1750);
  });
});
