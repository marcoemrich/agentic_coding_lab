import { describe, it, expect } from 'vitest';
import { openPolicy, settleClaim } from './claim.js';
import type { Item } from './types.js';

describe('insurance sum and cap', () => {
  it('sums the insurance values of all items', () => {
    const policy = openPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('counts multiple items of the same type separately', () => {
    const policy = openPolicy([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });

  it('ignores premium modifiers when computing the cap', () => {
    const policy = openPolicy([{ type: 'sword', cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('ignores the block discount when computing the insurance sum', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(openPolicy(items).insuranceSum).toBe(1750);
  });
});

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = openPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies no special clause to components', () => {
    const policy = openPolicy([{ type: 'rune' }]);
    expect(settleClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('never pays out a negative amount when damage is below the deductible', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 40 }]).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves damage for enchantment level 8 before the deductible', () => {
    const policy = openPolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = openPolicy([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    const policy = openPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('halves damage for a highly enchanted non-dragon item', () => {
    const policy = openPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = openPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const policy = openPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(800);
  });
});

describe('cap exhaustion', () => {
  it('reduces the payout to the remaining cap and tracks it across claims', () => {
    const policy = openPolicy([{ type: 'sword' }]);

    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rejected claims', () => {
  it('rejects damage to an item that is not insured', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 100 }])).toThrow();
  });

  it('rejects an unknown item type', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    expect(() => settleClaim(policy, [{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ];
    expect(() => settleClaim(policy, damages)).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    expect(() => settleClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = openPolicy([{ type: 'sword' }]);
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final payout down', () => {
    // 50% of 901 = 450.5, minus the deductible -> 350.5 -> 350
    const policy = openPolicy([{ type: 'sword', enchantment: 8 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
