import { describe, it, expect } from 'vitest';
import { processClaim } from './claims.js';
import { Policy } from './types.js';

function makePolicy(opts: Partial<Policy> & { insuranceSum: number }): Policy {
  return {
    items: opts.items ?? [],
    insuranceSum: opts.insuranceSum,
    remainingCap: opts.remainingCap ?? 2 * opts.insuranceSum,
  };
}

describe('processClaim', () => {
  it('subtracts the 100G deductible per incident', () => {
    const policy = makePolicy({
      items: [{ type: 'amulet', enchantment: 2 }],
      insuranceSum: 600,
    });
    const out = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(out.payout).toBe(100); // 200 - 100 deductible
    expect(out.remainingCap).toBe(1100); // 1200 - 100
  });

  it('returns zero payout when damage is below the deductible', () => {
    const policy = makePolicy({
      items: [{ type: 'amulet' }],
      insuranceSum: 600,
    });
    const out = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 50 }],
    });
    expect(out.payout).toBe(0);
    expect(out.remainingCap).toBe(1200);
  });

  it('reimburses high-enchantment items at 50%', () => {
    const policy = makePolicy({
      items: [{ type: 'staff', enchantment: 8 }],
      insuranceSum: 800,
    });
    const out = processClaim(policy, {
      damages: [{ itemType: 'staff', amount: 400 }],
    });
    // 400 × 0.5 = 200, − 100 deductible = 100
    expect(out.payout).toBe(100);
  });

  it('fully reimburses dragon-material items', () => {
    const policy = makePolicy({
      items: [{ type: 'sword', material: 'dragon', enchantment: 3 }],
      insuranceSum: 1000,
    });
    const out = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    // 500 − 100 deductible = 400
    expect(out.payout).toBe(400);
  });

  it('dragon material overrides high-enchantment 50% rule', () => {
    const policy = makePolicy({
      items: [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      insuranceSum: 1000,
    });
    const out = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(out.payout).toBe(400);
  });

  it('caps total payout at twice the insurance sum across multiple claims', () => {
    const policy = makePolicy({
      items: [{ type: 'amulet' }],
      insuranceSum: 600,
    });
    // Cap = 1200
    const c1 = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    expect(c1.payout).toBe(900); // 1000 - 100
    expect(c1.remainingCap).toBe(300);

    const c2 = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    expect(c2.payout).toBe(300); // capped by remaining
    expect(c2.remainingCap).toBe(0);

    const c3 = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 100 }],
    });
    expect(c3.payout).toBe(0);
    expect(c3.remainingCap).toBe(0);
  });

  it('aggregates multiple damages in one incident under one deductible', () => {
    const policy = makePolicy({
      items: [{ type: 'sword' }, { type: 'amulet' }],
      insuranceSum: 1600,
    });
    const out = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 150 },
      ],
    });
    // gross = 350, − 100 = 250
    expect(out.payout).toBe(250);
  });
});
