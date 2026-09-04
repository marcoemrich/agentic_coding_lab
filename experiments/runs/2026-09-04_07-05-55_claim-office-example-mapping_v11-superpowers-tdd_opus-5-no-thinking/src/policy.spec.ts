import { describe, test, expect } from 'vitest';
import { createPolicy } from './policy.js';

describe('policy', () => {
  test('insurance sum is the sum of the items insurance values', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  test('the block discount does not reduce the insurance sum', () => {
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    expect(createPolicy([{ type: 'sword' }, ...runes]).insuranceSum).toBe(1750);
  });

  test('premium modifiers do not raise the cap', () => {
    const policy = createPolicy([{ type: 'sword', cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  test('two swords are insured twice over', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });
});
