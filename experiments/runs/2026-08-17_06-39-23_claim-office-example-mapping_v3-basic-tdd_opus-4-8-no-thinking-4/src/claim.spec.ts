import { describe, it, expect } from 'vitest';
import { createPolicy, processClaim, PolicyState } from './claim';

const policyOf = (items: { type: string; material?: string; enchantment?: number }[]): PolicyState =>
  createPolicy(items);

const damage = (itemType: string, amount: number) => ({ itemType, amount });

describe('createPolicy', () => {
  it('sums insurance values and caps at twice the sum', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    expect(p.insuranceSum).toBe(1600);
    expect(p.remainingCap).toBe(3200);
  });

  it('bases the cap on unmodified insurance value even for cursed items', () => {
    const p = policyOf([{ type: 'sword', enchantment: 3 }]);
    expect(p.remainingCap).toBe(2000);
  });

  it('counts a component block at full insurance value', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);
    expect(p.insuranceSum).toBe(1750);
  });
});

describe('processClaim standard reimbursement', () => {
  it('reimburses full damage minus the deductible', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    const r = processClaim(p, [damage('sword', 500)]);
    expect(r.payout).toBe(400);
  });

  it('reimburses a damaged rune minus the deductible', () => {
    const p = policyOf([{ type: 'rune' }]);
    const r = processClaim(p, [damage('rune', 200)]);
    expect(r.payout).toBe(100);
  });
});

describe('processClaim special clauses', () => {
  it('halves reimbursement for enchantment >= 8', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(processClaim(p, [damage('sword', 1000)]).payout).toBe(400);
  });

  it('fully reimburses dragon material below the high-enchantment threshold', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(processClaim(p, [damage('sword', 800)]).payout).toBe(700);
  });

  it('lets the 50% rule win over dragon material at enchantment 9', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    expect(processClaim(p, [damage('sword', 1000)]).payout).toBe(400);
  });

  it('applies high-enchantment then deductible for dragon material at exactly 8', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(processClaim(p, [damage('sword', 1000)]).payout).toBe(400);
  });
});

describe('processClaim deductible per event', () => {
  it('applies the deductible once per damaged item', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    const r = processClaim(p, [damage('sword', 500), damage('amulet', 300)]);
    expect(r.payout).toBe(600);
  });
});

describe('processClaim cap exhaustion', () => {
  it('reduces a payout to the remaining cap across successive claims', () => {
    const p = policyOf([{ type: 'sword' }]);
    const first = processClaim(p, [damage('sword', 1500)]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = processClaim(p, [damage('sword', 1500)]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('processClaim two items of the same type', () => {
  it('treats each same-type damage entry separately', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    const r = processClaim(p, [damage('sword', 500), damage('sword', 400)]);
    // (500 - 100) + (400 - 100) = 700
    expect(r.payout).toBe(700);
  });

  it('throws when more damage entries of a type than are insured', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() => processClaim(p, [damage('sword', 500), damage('sword', 400)])).toThrow();
  });
});

describe('processClaim validation', () => {
  it('throws when a damaged item is not in the policy', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() => processClaim(p, [damage('amulet', 200)])).toThrow();
  });

  it('throws on a negative damage amount', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() => processClaim(p, [damage('sword', -200)])).toThrow();
  });

  it('rounds payouts down in the office favor', () => {
    // enchantment 9 halves 801 → 400.5, minus 100 = 300.5 → 300
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(processClaim(p, [damage('sword', 801)]).payout).toBe(300);
  });
});
