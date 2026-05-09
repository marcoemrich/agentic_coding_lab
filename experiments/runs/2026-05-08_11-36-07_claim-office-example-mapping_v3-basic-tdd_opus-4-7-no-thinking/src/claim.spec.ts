import { describe, it, expect } from 'vitest';
import { processClaim, createPolicy } from './claim.js';
import type { Item } from './types.js';

function policyOf(items: Item[]) {
  return createPolicy(items);
}

describe('processClaim - basics', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(res.payout).toBe(400);
    expect(res.remainingCap).toBe(2000 - 400);
  });

  it('rune damage 200 → payout 100 (no special clauses)', () => {
    const policy = policyOf([{ type: 'rune' }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(res.payout).toBe(100);
    expect(res.remainingCap).toBe(500 - 100);
  });

  it('dragon material sword ench 8 damage 1000 → payout 400', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(res.payout).toBe(400);
  });

  it('dragon sword ench 9 damage 1000 → payout 400 (50% rule wins)', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(res.payout).toBe(400);
  });

  it('dragon sword ench 5 damage 800 → payout 700', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(res.payout).toBe(700);
  });

  it('steel sword ench 9 damage 1000 → payout 400', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const res = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(res.payout).toBe(400);
  });

  it('deductible per damage event: dragon attack damages sword 500 + amulet 300 → payout 600', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ]);
    const res = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(res.payout).toBe(600);
  });
});

describe('processClaim - cap exhaustion', () => {
  it('two successive 1500 claims: first 1400, second 600', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const r1 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  it('cap is twice insurance value (sword=1000 → cap=2000)', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    expect(policy.cap).toBe(2000);
  });

  it('cap based on unmodified insurance value for cursed sword', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]);
    expect(policy.cap).toBe(2000);
  });

  it('insurance sum sword + 3 runes = 1750 (block discount affects premium not insurance sum)', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.cap).toBe(3500);
  });
});

describe('processClaim - rounding favor MHPCO', () => {
  it('payout 350.5 → 350 (round down)', () => {
    // Need a fractional payout. dragon-material sword + high-ench: 50% applies; 50% of x then -100.
    // x=901, 50% = 450.5, -100 = 350.5 → 350
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 901 }] });
    expect(r.payout).toBe(350);
  });
});

describe('processClaim - validation errors', () => {
  it('throws when damage references item not in policy', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, { damages: [{ itemType: 'amulet', amount: 100 }] })).toThrow();
  });

  it('throws when damages contain more entries of a type than insured', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() =>
      processClaim(policy, {
        damages: [
          { itemType: 'sword', amount: 100 },
          { itemType: 'sword', amount: 100 },
        ],
      }),
    ).toThrow();
  });

  it('throws on negative damage amount', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, { damages: [{ itemType: 'sword', amount: -200 }] })).toThrow();
  });
});

describe('processClaim - multiple of same type', () => {
  it('two swords insured: insurance sum 2000, cap 4000', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
    ]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });

  it('two swords damaged separately each get own deductible', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
    ]);
    const r = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ],
    });
    // (500-100) + (300-100) = 600
    expect(r.payout).toBe(600);
  });
});
