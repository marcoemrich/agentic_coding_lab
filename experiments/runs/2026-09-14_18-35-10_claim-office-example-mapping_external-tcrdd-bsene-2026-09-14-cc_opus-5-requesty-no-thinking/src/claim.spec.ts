import { describe, expect, it } from 'vitest';

import { createPolicy } from './policy';
import { claim } from './claim';

describe('claim', () => {
  it('reimburses the damage minus the deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('reimburses only half the damage for items enchanted 8 or higher', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] })).toEqual(
      { payout: 400, remainingCap: 1600 },
    );
  });

  it('caps the payout at the remaining cap of the policy', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 1500 }];
    expect(claim(policy, { cause: 'fire', damages })).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(claim(policy, { cause: 'fire', damages })).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('rounds the payout down in the MHPCO favour', () => {
    const policy = createPolicy([{ type: 'sword', enchantment: 9 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] })).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  it('rejects damages to items that are not part of the policy', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      claim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow(/amulet/);
  });

  it('matches each damage entry to a distinct insured item', () => {
    const twoSwords = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    expect(
      claim(twoSwords, {
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 3400 });

    const oneSword = createPolicy([{ type: 'sword' }]);
    expect(() =>
      claim(oneSword, {
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 300 },
        ],
      }),
    ).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow(/negative/);
  });
});
