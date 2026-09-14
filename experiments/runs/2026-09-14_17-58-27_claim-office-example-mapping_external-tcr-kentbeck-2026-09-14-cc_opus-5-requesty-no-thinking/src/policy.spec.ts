import { describe, expect, it } from 'vitest';
import { Policy } from './policy.js';

describe('policy', () => {
  it('caps at twice the insurance sum', () => {
    expect(new Policy([{ type: 'sword' }, { type: 'amulet' }]).remainingCap).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value', () => {
    expect(new Policy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(600);
  });

  it('treats two damages of the same type separately', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ]).payout,
    ).toBe(600);
  });

  it('exhausts the cap across successive claims', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('rounds the payout down', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('rejects more damages of a type than insured items', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 100 },
        { itemType: 'sword', amount: 100 },
      ]),
    ).toThrow(/sword/);
  });

  it('rejects damage to an item that is not insured', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow(/amulet/);
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(/-200/);
  });
});
