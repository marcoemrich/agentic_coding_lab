import { describe, it, expect } from 'vitest';
import { quote } from './quote';
import { openPolicy, settleClaim } from './claim';

const customer = { yearsWithMHPCO: 0 };
const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });
const policyFor = (items: { type: string }[]) => openPolicy(quote(customer, items, 0));

describe('standard reimbursement', () => {
  it('reimburses fully minus the deductible', () => {
    const p = policyFor([item('sword', { material: 'steel', enchantment: 3 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a rune, which has no enchantment or material', () => {
    const p = policyFor([item('rune')]);
    expect(settleClaim(p, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('never pays out below zero', () => {
    const p = policyFor([item('sword')]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves damage for enchantment >= 8 before the deductible', () => {
    const p = policyFor([item('sword', { material: 'steel', enchantment: 9 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('applies the 50 % rule at exactly enchantment 8', () => {
    const p = policyFor([item('sword', { material: 'dragon', enchantment: 8 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const p = policyFor([item('sword', { material: 'dragon', enchantment: 9 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material fully below the enchantment threshold', () => {
    const p = policyFor([item('sword', { material: 'dragon', enchantment: 5 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const p = policyFor([item('sword'), item('amulet')]);
    const r = settleClaim(p, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(r.payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const p = policyFor([item('sword'), item('sword')]);
    const r = settleClaim(p, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(r.payout).toBe(800);
  });
});

describe('cap', () => {
  it('caps at twice the insurance sum across successive claims', () => {
    const p = policyFor([item('sword')]);
    expect(p.remainingCap).toBe(2000);

    const first = settleClaim(p, [{ itemType: 'sword', amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(p, [{ itemType: 'sword', amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it('bases the cap on the unmodified insurance value', () => {
    const p = policyFor([item('sword', { cursed: true })]);
    expect(p.remainingCap).toBe(2000);
  });
});

describe('rejections', () => {
  it('rejects damage to an item that is not insured', () => {
    const p = policyFor([item('sword')]);
    expect(() => settleClaim(p, [{ itemType: 'amulet', amount: 200 }])).toThrow();
  });

  it('rejects an unknown item type', () => {
    const p = policyFor([item('sword')]);
    expect(() => settleClaim(p, [{ itemType: 'broomstick', amount: 200 }])).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const p = policyFor([item('sword')]);
    expect(() =>
      settleClaim(p, [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow(/more sword damages/);
  });

  it('rejects a negative damage amount', () => {
    const p = policyFor([item('sword')]);
    expect(() => settleClaim(p, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const p = policyFor([item('sword')]);
    expect(() => settleClaim(p, [{ itemType: 'amulet', amount: 200 }])).toThrow();
    expect(p.remainingCap).toBe(2000);
  });
});

describe('rounding', () => {
  it('rounds the payout down', () => {
    // enchantment 9 -> 50 % of 901 = 450.5, minus deductible = 350.5 -> 350
    const p = policyFor([item('sword', { enchantment: 9 })]);
    expect(settleClaim(p, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
