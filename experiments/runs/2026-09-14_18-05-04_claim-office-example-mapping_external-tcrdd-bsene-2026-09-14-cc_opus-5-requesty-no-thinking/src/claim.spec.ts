import { describe, it, expect } from 'vitest';
import { Policy } from './policy';

describe('claim', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reports the cap remaining after the payout', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).remainingCap).toBe(1600);
  });

  it('caps the payout at the remaining cap', () => {
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

  it('reimburses damage to highly enchanted items at 50%', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('rejects damage to an item the policy does not cover', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow(/amulet/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(/-200/);
  });

  it('rounds the payout down, in the MHPCO favour', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 8 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
