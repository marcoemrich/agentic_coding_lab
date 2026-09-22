import { describe, it, expect } from 'vitest';
import { createPolicy, settleClaim } from './claim';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };

describe('insurance sum and cap', () => {
  it('sums the insurance values of the covered items', () => {
    const policy = createPolicy([sword, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('counts two swords as 2000 G insurance sum', () => {
    expect(createPolicy([sword, sword]).insuranceSum).toBe(2000);
  });

  it('bases the cap on the unmodified insurance value of a cursed sword', () => {
    expect(createPolicy([{ ...sword, cursed: true }]).remainingCap).toBe(2000);
  });

  it('ignores the block discount for the insurance sum', () => {
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    expect(createPolicy([sword, ...runes]).insuranceSum).toBe(1750);
  });
});

describe('payouts', () => {
  it('reimburses a regular sword in full, minus the deductible', () => {
    const policy = createPolicy([sword]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a rune in full, minus the deductible', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    expect(settleClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([sword, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(600);
  });

  it('halves damage to an item with exactly enchantment 8', () => {
    const policy = createPolicy([{ ...sword, material: 'dragon', enchantment: 8 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = createPolicy([{ ...sword, material: 'dragon', enchantment: 9 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material below the enchantment threshold in full', () => {
    const policy = createPolicy([{ ...sword, material: 'dragon', enchantment: 5 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('halves damage to a highly enchanted steel sword', () => {
    const policy = createPolicy([{ ...sword, enchantment: 9 }]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('cap exhaustion', () => {
  it('reduces a later claim to the remaining cap', () => {
    const policy = createPolicy([sword]);
    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const second = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item outside the policy', () => {
    const policy = createPolicy([sword]);
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow();
  });

  it('rejects an unknown item type', () => {
    const policy = createPolicy([sword]);
    expect(() => settleClaim(policy, [{ itemType: 'broomstick', amount: 200 }])).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = createPolicy([sword]);
    const damages = [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 200 },
    ];
    expect(() => settleClaim(policy, damages)).toThrow();
  });

  it('treats two swords as separate damages with their own deductible', () => {
    const policy = createPolicy([sword, sword]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(600);
  });

  it('rejects a negative damage amount', () => {
    const policy = createPolicy([sword]);
    expect(() => settleClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = createPolicy([sword]);
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });

  it('rounds a payout down, in the MHPCO favour', () => {
    const policy = createPolicy([{ ...sword, enchantment: 9 }]);
    // 901 / 2 = 450.5, minus the deductible = 350.5 -> 350
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
