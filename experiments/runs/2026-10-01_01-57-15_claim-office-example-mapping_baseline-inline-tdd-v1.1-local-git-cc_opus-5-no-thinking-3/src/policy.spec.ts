import { describe, it, expect } from 'vitest';
import { insuranceSum } from './policy.js';
import { createPolicy } from './claim.js';

describe('insurance sum', () => {
  it.each([
    ['sword', 1000],
    ['amulet', 600],
    ['staff', 800],
    ['potion', 400],
    ['rune', 250],
    ['moonstone', 250],
  ])('insures a %s at %i G', (type, value) => {
    expect(insuranceSum([{ type }])).toBe(value);
  });

  it('sums the values of several items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('sums two items of the same type', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('is unaffected by the building-block premium discount', () => {
    expect(
      insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(1750);
  });

  it('is unaffected by premium modifiers such as a curse', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});

describe('payout cap', () => {
  it('caps at twice the insurance sum', () => {
    expect(createPolicy([{ type: 'sword' }, { type: 'amulet' }]).remainingCap).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    expect(createPolicy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
  });

  it('bases the cap on two swords', () => {
    expect(createPolicy([{ type: 'sword' }, { type: 'sword' }]).remainingCap).toBe(4000);
  });
});
