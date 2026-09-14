import { describe, expect, it } from 'vitest';
import { insuranceSum, Policy } from './policy.js';

describe('insuranceSum', () => {
  it('sums the insurance values of the insured items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });
  it('is unaffected by the component block discount', () => {
    const rune = { type: 'rune' };
    expect(insuranceSum([{ type: 'sword' }, rune, rune, rune])).toBe(1750);
  });
});

describe('claim', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('reimburses damage to items of enchantment 8 or more at 50 %', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('caps the payout at the remaining cap across successive claims', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] })).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] })).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('rejects a damage entry for an item that is not insured', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim({ cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow(/amulet/);
  });

  it('rejects more damage entries of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim({
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 300 },
        ],
      }),
    ).toThrow(/sword/);
  });

  it('reimburses dragon-material items in full, as the default already does', () => {
    const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] })).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });

  it('lets the high-enchantment clause win over dragon material', () => {
    const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(
      policy.claim({
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow(/negative/);
  });

  it('rounds the final payout down, in the MHPCO favour', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 8 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] })).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
});
