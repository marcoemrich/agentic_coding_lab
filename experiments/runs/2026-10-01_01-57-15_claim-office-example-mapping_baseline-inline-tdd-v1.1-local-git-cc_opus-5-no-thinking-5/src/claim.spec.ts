import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Item } from './premium.js';

const sword: Item = { type: 'sword', material: 'steel', enchantment: 3 };
const dragonSword = (enchantment: number): Item => ({
  type: 'sword',
  material: 'dragon',
  enchantment,
});

function claim(items: Item[], damages: { itemType: string; amount: number }[], cap?: number) {
  return processClaim({
    items,
    damages,
    remainingCap: cap ?? Number.POSITIVE_INFINITY,
  });
}

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the 100 G deductible', () => {
    expect(claim([sword], [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies no special clause to a component', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('never pays out less than zero for damage below the deductible', () => {
    expect(claim([sword], [{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });
});

describe('high enchantment clause', () => {
  it('reimburses 50 % for a steel sword at enchantment 9', () => {
    expect(
      claim(
        [{ type: 'sword', material: 'steel', enchantment: 9 }],
        [{ itemType: 'sword', amount: 1000 }],
      ).payout,
    ).toBe(400);
  });

  it('applies at exactly enchantment 8', () => {
    expect(claim([dragonSword(8)], [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('dragon material clause', () => {
  it('reimburses in full below the enchantment threshold', () => {
    expect(claim([dragonSword(5)], [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('loses against the 50 % rule when both clauses apply', () => {
    expect(claim([dragonSword(9)], [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    expect(
      claim(
        [sword, { type: 'amulet' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ],
      ).payout,
    ).toBe(600);
  });

  it('treats two damages to two insured swords as separate events', () => {
    expect(
      claim(
        [sword, sword],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ],
      ).payout,
    ).toBe(800);
  });
});

describe('cap exhaustion', () => {
  it('reduces the payout to the remaining cap and reports the rest', () => {
    const first = claim([sword], [{ itemType: 'sword', amount: 1500 }], 2000);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = claim([sword], [{ itemType: 'sword', amount: 1500 }], first.remainingCap);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout down', () => {
    // 50 % of 901 = 450.5, minus deductible 100 => 350.5 -> 350
    expect(
      claim(
        [{ type: 'sword', material: 'steel', enchantment: 9 }],
        [{ itemType: 'sword', amount: 901 }],
      ).payout,
    ).toBe(350);
  });
});

describe('invalid claims', () => {
  it('rejects damage to an item that is not part of the policy', () => {
    expect(() => claim([sword], [{ itemType: 'amulet', amount: 200 }])).toThrow(/amulet/);
  });

  it('rejects damage to an unknown item type', () => {
    expect(() => claim([sword], [{ itemType: 'broomstick', amount: 200 }])).toThrow(/broomstick/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    expect(() =>
      claim(
        [sword],
        [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      ),
    ).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    expect(() => claim([sword], [{ itemType: 'sword', amount: -200 }])).toThrow(/amount/);
  });
});
