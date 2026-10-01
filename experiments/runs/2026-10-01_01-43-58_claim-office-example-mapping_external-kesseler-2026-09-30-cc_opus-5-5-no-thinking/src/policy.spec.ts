import { describe, expect, it } from 'vitest';
import { Policy } from './policy';

describe('Policy claim', () => {
  it('reimburses a regular sword in full minus the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);

    const result = policy.claim([{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses a rune in full minus the deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);

    const result = policy.claim([{ itemType: 'rune', amount: 200 }]);

    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('reimburses half the damage to a highly enchanted steel sword before the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 9 }]);

    const result = policy.claim([{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it.each([
    [8, 1000, 400],
    [9, 1000, 400],
    [5, 800, 700],
  ])('pays a dragon-material sword with enchantment %i and damage %i G: %i G', (enchantment, amount, payout) => {
    const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment }]);

    const result = policy.claim([{ itemType: 'sword', amount }]);

    expect(result.payout).toBe(payout);
  });

  it('pays nothing for a damage below the deductible', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const result = policy.claim([{ itemType: 'sword', amount: 50 }]);

    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);

    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it.each([
    ['staff', 1600],
    ['potion', 800],
    ['moonstone', 500],
  ])('caps a %s policy at twice its insurance value', (type, cap) => {
    const policy = new Policy([{ type }]);

    const result = policy.claim([]);

    expect(result).toEqual({ payout: 0, remainingCap: cap });
  });

  it.each([
    ['a sword and an amulet', [{ type: 'sword' }, { type: 'amulet' }], 3200],
    ['a cursed sword', [{ type: 'sword', cursed: true }], 2000],
    ['a sword and a block of 3 runes', [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
  ])('caps %s at twice the unmodified insurance sum', (_description, items, cap) => {
    const policy = new Policy(items);

    const result = policy.claim([]);

    expect(result.remainingCap).toBe(cap);
  });

  it('reduces a claim to the cap remaining after earlier claims', () => {
    const policy = new Policy([{ type: 'sword' }]);
    const first = policy.claim([{ itemType: 'sword', amount: 1500 }]);

    const second = policy.claim([{ itemType: 'sword', amount: 1500 }]);

    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds a fractional payout down in the MHPCO\'s favor', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 8 }]);

    const result = policy.claim([{ itemType: 'sword', amount: 901 }]);

    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('treats each damage to two insured swords separately, in policy order', () => {
    const policy = new Policy([
      { type: 'sword', enchantment: 3 },
      { type: 'sword', enchantment: 9 },
    ]);

    const result = policy.claim([
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]);

    expect(result).toEqual({ payout: 1300, remainingCap: 2700 });
  });

  it('rejects a damage to an item that is not part of the policy', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claim = () => policy.claim([{ itemType: 'amulet', amount: 300 }]);

    expect(claim).toThrow('Damaged item is not covered by the policy: amulet');
  });

  it('rejects a claim with more damages of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claim = () =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]);

    expect(claim).toThrow('Damaged item is not covered by the policy: sword');
  });

  it('rejects a damage to an item of unknown type', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claim = () => policy.claim([{ itemType: 'broomstick', amount: 500 }]);

    expect(claim).toThrow('Damaged item is not covered by the policy: broomstick');
  });

  it('leaves the cap untouched after a rejected claim', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 500 },
      ]),
    ).toThrow();

    const result = policy.claim([]);

    expect(result.remainingCap).toBe(2000);
  });

  it('rejects a damage with a negative amount', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claim = () => policy.claim([{ itemType: 'sword', amount: -200 }]);

    expect(claim).toThrow('Damage amount must not be negative: -200');
  });
});
