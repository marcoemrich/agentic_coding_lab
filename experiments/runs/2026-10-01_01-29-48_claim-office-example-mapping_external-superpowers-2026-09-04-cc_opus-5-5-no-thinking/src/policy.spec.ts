import { describe, it, expect } from 'vitest';
import { Policy } from './policy';

const steelSword = { type: 'sword', material: 'steel', enchantment: 3 };

describe('claim payout', () => {
  it('reimburses the full damage minus the 100 G deductible', () => {
    const policy = new Policy([steelSword]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies the deductible once per damaged item and reduces the cap (2× insurance sum)', () => {
    // insurance sum 1000 + 600 = 1600 → cap 3200
    const policy = new Policy([steelSword, { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('limits payouts to the remaining cap across successive claims', () => {
    const policy = new Policy([steelSword]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it.each([
    // [material, enchantment, damage, payout]
    ['steel', 9, 1000, 400], // 50 % clause, then deductible
    ['dragon', 9, 1000, 400], // 50 % clause wins over dragon material
    ['dragon', 8, 1000, 400], // threshold: exactly 8 triggers the 50 % clause
    ['dragon', 5, 800, 700], // dragon material only: full reimbursement
    ['steel', 7, 1000, 900], // below threshold: full reimbursement
  ])('%s sword with enchantment %i, damage %i → payout %i', (material, enchantment, amount, want) => {
    const policy = new Policy([{ type: 'sword', material, enchantment }]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(want);
  });

  it.each(['amulet', 'broomstick'])('rejects damage to an uninsured %s', (itemType) => {
    const policy = new Policy([steelSword]);
    expect(() => policy.claim([{ itemType, amount: 200 }])).toThrow(itemType);
  });

  it('treats each damage to two insured swords separately (cap 4000 G)', () => {
    const policy = new Policy([steelSword, steelSword]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 2500 },
        { itemType: 'sword', amount: 1500 },
      ]),
    ).toEqual({ payout: 3800, remainingCap: 200 });
  });

  it('rejects a claim with more damages of a type than items insured', () => {
    const policy = new Policy([steelSword]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([steelSword]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(/-200/);
  });

  it('rounds a fractional payout down in the MHPCO\'s favor', () => {
    // 901 × 50 % = 450.5 − 100 = 350.5 → 350
    const policy = new Policy([{ type: 'sword', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('pays nothing for a damage below the deductible without offsetting other damages', () => {
    const policy = new Policy([steelSword, { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 50 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(200);
  });

  it('pays for a damaged rune like any other item', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });

  it.each([
    ['a sword and a 3-rune block', [steelSword, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    ['a cursed, highly enchanted sword', [{ type: 'sword', cursed: true, enchantment: 9 }], 2000],
  ])('caps %s at twice the unmodified insurance sum (%i G)', (_name, items, cap) => {
    const policy = new Policy(items);
    expect(policy.claim([]).remainingCap).toBe(cap);
  });
});
