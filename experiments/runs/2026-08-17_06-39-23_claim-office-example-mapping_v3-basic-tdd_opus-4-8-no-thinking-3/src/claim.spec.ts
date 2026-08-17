import { describe, it, expect } from 'vitest';
import { createPolicy, processClaim } from './claim';
import { QuoteItem } from './basePremium';

const policyOf = (items: QuoteItem[]) => createPolicy(items);

describe('createPolicy', () => {
  it('sets insurance sum and cap for a sword', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.remainingCap).toBe(2000);
  });

  it('sums insurance values across items (sword + amulet)', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    expect(p.insuranceSum).toBe(1600);
    expect(p.remainingCap).toBe(3200);
  });

  it('bases the cap on unmodified insurance value for a cursed sword', () => {
    const p = policyOf([{ type: 'sword', cursed: true, enchantment: 5 }]);
    expect(p.remainingCap).toBe(2000);
  });

  it('does not let the block discount affect the insurance sum', () => {
    const p = policyOf([
      { type: 'sword' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(p.insuranceSum).toBe(1750);
  });
});

describe('processClaim', () => {
  const damage = (itemType: string, amount: number) => ({ itemType, amount });

  it('reimburses fully minus deductible for a regular sword', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    const r = processClaim(p, { cause: 'fire', damages: [damage('sword', 500)] });
    expect(r.payout).toBe(400);
  });

  it('reimburses a rune fully minus deductible', () => {
    const p = policyOf([{ type: 'rune' }]);
    const r = processClaim(p, { cause: 'fire', damages: [damage('rune', 200)] });
    expect(r.payout).toBe(100);
  });

  it('applies a deductible per damaged item', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    const r = processClaim(p, {
      cause: 'dragon',
      damages: [damage('sword', 500), damage('amulet', 300)],
    });
    expect(r.payout).toBe(600);
  });

  it('halves reimbursement for enchantment >= 8, then deductible', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    const r = processClaim(p, { cause: 'x', damages: [damage('sword', 1000)] });
    expect(r.payout).toBe(400);
  });

  it('50% rule wins when both dragon material and enchantment >= 8 apply', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    const r = processClaim(p, { cause: 'x', damages: [damage('sword', 1000)] });
    expect(r.payout).toBe(400);
  });

  it('dragon material at enchantment 5 reimburses fully then deductible', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    const r = processClaim(p, { cause: 'x', damages: [damage('sword', 800)] });
    expect(r.payout).toBe(700);
  });

  it('applies the high-enchantment clause at exactly level 8', () => {
    const p = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    const r = processClaim(p, { cause: 'x', damages: [damage('sword', 1000)] });
    expect(r.payout).toBe(400);
  });

  it('caps payout at twice the insurance sum across successive claims', () => {
    const p = policyOf([{ type: 'sword' }]);
    const first = processClaim(p, { cause: 'x', damages: [damage('sword', 1500)] });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = processClaim(p, { cause: 'x', damages: [damage('sword', 1500)] });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it('treats two same-type entries as separate damages', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    const r = processClaim(p, {
      cause: 'dragon',
      damages: [damage('sword', 500), damage('sword', 500)],
    });
    expect(r.payout).toBe(800);
  });

  it('rounds payout down (in MHPCO favor)', () => {
    // enchantment 9 halves: 701 / 2 = 350.5 -> 350, minus deductible 100 = 250
    const p = policyOf([{ type: 'sword', enchantment: 9 }]);
    const r = processClaim(p, { cause: 'x', damages: [damage('sword', 701)] });
    expect(r.payout).toBe(250);
  });

  it('rejects damage to an item not in the policy', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(p, { cause: 'x', damages: [damage('amulet', 200)] }),
    ).toThrow();
  });

  it('rejects more damage entries of a type than are insured', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(p, {
        cause: 'x',
        damages: [damage('sword', 100), damage('sword', 100)],
      }),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(p, { cause: 'x', damages: [damage('sword', -200)] }),
    ).toThrow();
  });
});
