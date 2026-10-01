import { describe, it, expect } from 'vitest';
import { Policy } from './policy';

describe('Policy claim', () => {
  it('reimburses regular damage in full minus the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it.each([
    // 50% of damage first, then deductible
    [{ type: 'sword', material: 'steel', enchantment: 9 }, 1000, 400],
    [{ type: 'sword', material: 'dragon', enchantment: 9 }, 1000, 400],
    [{ type: 'sword', material: 'dragon', enchantment: 8 }, 1000, 400],
    // dragon material only: full reimbursement, then deductible
    [{ type: 'sword', material: 'dragon', enchantment: 5 }, 800, 700],
  ])('applies the enchantment and dragon clauses for %o with damage %i', (item, amount, payout) => {
    const policy = new Policy([item]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(payout);
  });

  it('limits successive payouts to twice the insurance sum', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it.each([
    ['sword and amulet', [{ type: 'sword' }, { type: 'amulet' }], 3200],
    ['sword and a block of 3 runes', [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    ['two swords', [{ type: 'sword' }, { type: 'sword' }], 4000],
    ['cursed sword', [{ type: 'sword', cursed: true }], 2000],
  ])('caps a policy covering %s at twice the unmodified insurance values', (_name, items, cap) => {
    const policy = new Policy(items);
    // 200 damage on a sword pays 100 and leaves cap - 100
    expect(policy.claim([{ itemType: 'sword', amount: 200 }]).remainingCap).toBe(cap - 100);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(policy.claim(damages).payout).toBe(600);
  });

  it('reimburses component damage in full minus the deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('rounds the final payout down in the MHPCO\'s favor', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 9 }]);
    // 50% of 901 = 450.5, minus 100 deductible = 350.5
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('does not let damage below the deductible reduce other reimbursements', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 40 },
    ];
    expect(policy.claim(damages)).toEqual({ payout: 400, remainingCap: 2800 });
  });

  it.each([
    ['an item not covered by the policy', [{ itemType: 'amulet', amount: 200 }]],
    ['an unknown item type', [{ itemType: 'broomstick', amount: 200 }]],
    ['a negative amount', [{ itemType: 'sword', amount: -200 }]],
    [
      'more damages of a type than insured items',
      [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ],
    ],
  ])('rejects a claim with %s', (_name, damages) => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim(damages)).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 200 },
      ]),
    ).toThrow();
    expect(policy.claim([{ itemType: 'sword', amount: 200 }]).remainingCap).toBe(1900);
  });

  it('treats each damage to two insured swords separately, each with its own deductible', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ];
    expect(policy.claim(damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
});
