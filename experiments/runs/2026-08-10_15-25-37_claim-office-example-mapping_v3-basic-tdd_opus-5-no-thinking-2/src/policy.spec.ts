import { describe, it, expect } from 'vitest';
import { Policy } from './policy.js';
import type { Item } from './types.js';

const sword = (extra: Partial<Item> = {}): Item => ({ type: 'sword', ...extra });
const steelSword = sword({ material: 'steel', enchantment: 3 });
const dragonSword = (enchantment: number) => sword({ material: 'dragon', enchantment });

const claim = (policy: Policy, damages: { itemType: string; amount: number }[]) =>
  policy.claim({ cause: 'dragon attack', damages });

describe('insurance sum and cap', () => {
  it('sums the insurance values of the covered items', () => {
    expect(new Policy([sword(), { type: 'amulet' }]).insuranceSum).toBe(1600);
  });

  it('caps the total payout at twice the insurance sum', () => {
    expect(new Policy([sword(), { type: 'amulet' }]).remainingCap).toBe(3200);
  });

  it('counts each of several alike items towards the insurance sum', () => {
    expect(new Policy([sword(), sword()]).insuranceSum).toBe(2000);
  });

  it('bases the cap on unmodified insurance values, ignoring premium modifiers', () => {
    expect(new Policy([sword({ cursed: true })]).remainingCap).toBe(2000);
  });

  it('ignores the block discount when summing insurance values', () => {
    const items = [sword(), ...Array<Item>(3).fill({ type: 'rune' })];
    expect(new Policy(items).insuranceSum).toBe(1750);
  });
});

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    expect(claim(new Policy([steelSword]), [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies no special clause to a component without enchantment or material', () => {
    expect(claim(new Policy([{ type: 'rune' }]), [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('never pays out a negative amount when damage is below the deductible', () => {
    expect(claim(new Policy([steelSword]), [{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves damage for enchantment level 8 before the deductible', () => {
    const result = claim(new Policy([dragonSword(8)]), [{ itemType: 'sword', amount: 1000 }]);
    expect(result.payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material at enchantment 9', () => {
    const result = claim(new Policy([dragonSword(9)]), [{ itemType: 'sword', amount: 1000 }]);
    expect(result.payout).toBe(400);
  });

  it('reimburses dragon material in full below enchantment 8', () => {
    const result = claim(new Policy([dragonSword(5)]), [{ itemType: 'sword', amount: 800 }]);
    expect(result.payout).toBe(700);
  });

  it('halves damage for a highly enchanted steel item', () => {
    const highSteel = sword({ material: 'steel', enchantment: 9 });
    const result = claim(new Policy([highSteel]), [{ itemType: 'sword', amount: 1000 }]);
    expect(result.payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([steelSword, { type: 'amulet' }]);
    const result = claim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('treats two damages to alike items as separate events', () => {
    const policy = new Policy([steelSword, steelSword]);
    const result = claim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });
});

describe('cap exhaustion across successive claims', () => {
  it('reduces the desired payout to the remaining cap', () => {
    const policy = new Policy([steelSword]);

    const first = claim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = claim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout down', () => {
    // enchantment 8 halves 901 to 450.5, then the deductible -> 350.5 -> 350
    const policy = new Policy([sword({ material: 'steel', enchantment: 8 })]);
    expect(claim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not part of the policy', () => {
    const policy = new Policy([steelSword]);
    expect(() => claim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow(/amulet/);
  });

  it('rejects a damage to an unknown item type', () => {
    const policy = new Policy([steelSword]);
    expect(() => claim(policy, [{ itemType: 'broomstick', amount: 200 }])).toThrow(/broomstick/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([steelSword]);
    const damages = [
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ];
    expect(() => claim(policy, damages)).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([steelSword]);
    expect(() => claim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
