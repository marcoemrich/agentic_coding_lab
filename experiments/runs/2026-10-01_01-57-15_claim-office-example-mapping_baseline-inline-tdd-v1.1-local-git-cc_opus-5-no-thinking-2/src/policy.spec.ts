import { describe, it, expect } from 'vitest';
import { insuranceSum, cap } from './policy.js';

const item = (type: string) => ({ type });
const many = (type: string, n: number) => Array.from({ length: n }, () => item(type));

describe('insurance sum', () => {
  it('sums the insurance values of all items', () => {
    expect(insuranceSum([item('sword'), item('amulet')])).toBe(1600);
  });

  it('counts two swords twice', () => {
    expect(insuranceSum(many('sword', 2))).toBe(2000);
  });

  it('is unaffected by the component block discount', () => {
    expect(insuranceSum([item('sword'), ...many('rune', 3)])).toBe(1750);
  });

  it('is 0 for an empty policy', () => {
    expect(insuranceSum([])).toBe(0);
  });
});

describe('payout cap', () => {
  it('is twice the insurance sum', () => {
    expect(cap([item('sword'), item('amulet')])).toBe(3200);
  });

  it('is based on the unmodified insurance value, ignoring premium modifiers', () => {
    expect(cap([{ type: 'sword', cursed: true }])).toBe(2000);
  });

  it('is 4000 G for two swords', () => {
    expect(cap(many('sword', 2))).toBe(4000);
  });
});
