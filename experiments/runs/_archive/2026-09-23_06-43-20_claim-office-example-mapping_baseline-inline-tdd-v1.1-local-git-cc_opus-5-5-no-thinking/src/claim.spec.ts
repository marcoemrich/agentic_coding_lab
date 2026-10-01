import { describe, it, expect } from 'vitest';
import { Policy } from './claim';

describe('policy cap', () => {
  it.each([
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
  ])('cap of %j is %i', (items, cap) => {
    expect(new Policy(items).remainingCap).toBe(cap);
  });
});

describe('claim payout', () => {
  it('reimburses a regular sword minus deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses a rune minus deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies deductible per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(600);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i -> %i', (material, enchantment, amount, payout) => {
    const policy = new Policy([{ type: 'sword', material, enchantment }]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(payout);
  });

  it('treats each damage to same-type items separately', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword', enchantment: 9 }]);
    // first sword: 500 - 100; second sword (enchantment 9): 500 - 100
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 1000 },
      ]).payout,
    ).toBe(800);
  });

  it('never pays negative amounts for damages below the deductible', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 50 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(200);
  });

  it('rounds fractional payouts down', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 8 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('limits successive claims to the remaining cap', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects more damages of a type than insured', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 100 },
        { itemType: 'sword', amount: 100 },
      ]),
    ).toThrow();
  });

  it('rejects damage to an uninsured item', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => policy.claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects negative damage amounts', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('does not consume cap when a claim is rejected', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 100 },
      ]),
    ).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});
