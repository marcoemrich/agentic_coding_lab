import { describe, it, expect } from 'vitest';
import { Damage, settleClaim } from './claim.js';
import { Item } from './premium.js';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };
const dragonSword = (enchantment: number) => ({
  type: 'sword',
  material: 'dragon',
  enchantment,
});

const settle = (items: Item[], damages: Damage[], remainingCap = Infinity) =>
  settleClaim(items, { cause: 'fire', damages }, remainingCap);

describe('standard reimbursement', () => {
  it('reimburses a regular sword in full, minus the deductible', () => {
    expect(settle([sword], [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a rune in full, minus the deductible', () => {
    expect(settle([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('never pays out less than zero for a damage below the deductible', () => {
    expect(settle([sword], [{ itemType: 'sword', amount: 60 }]).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves the damage at exactly enchantment 8, then deducts', () => {
    const items = [dragonSword(8)];
    expect(settle(items, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material at enchantment 9', () => {
    const items = [dragonSword(9)];
    expect(settle(items, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    const items = [dragonSword(5)];
    expect(settle(items, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('halves damage to a highly enchanted steel sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];
    expect(settle(items, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const items = [sword, { type: 'amulet' }];
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(settle(items, damages).payout).toBe(600);
  });

  it('treats two entries of the same type as separate damages', () => {
    const items = [sword, sword];
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ];
    expect(settle(items, damages).payout).toBe(800);
  });
});

describe('cap exhaustion', () => {
  it('reduces the payout to the remaining cap and reports what is left', () => {
    const first = settle([sword], [{ itemType: 'sword', amount: 1500 }], 2000);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = settle([sword], [{ itemType: 'sword', amount: 1500 }], first.remainingCap);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding', () => {
  it('rounds the payout down, in the MHPCO favour', () => {
    // 901 halved = 450.5, minus deductible = 350.5 -> 350
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];
    expect(settle(items, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not part of the policy', () => {
    expect(() => settle([sword], [{ itemType: 'amulet', amount: 200 }])).toThrow(
      /amulet/,
    );
  });

  it('rejects a damage to an unknown item type', () => {
    expect(() => settle([sword], [{ itemType: 'broomstick', amount: 200 }])).toThrow(
      /broomstick/,
    );
  });

  it('rejects more damages of a type than the policy covers', () => {
    const damages = [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 200 },
    ];
    expect(() => settle([sword], damages)).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    expect(() => settle([sword], [{ itemType: 'sword', amount: -200 }])).toThrow(
      /negative/i,
    );
  });
});
