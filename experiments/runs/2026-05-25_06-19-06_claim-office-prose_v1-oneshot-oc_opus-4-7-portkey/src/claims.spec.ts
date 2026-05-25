import { describe, it, expect } from 'vitest';
import { createPolicyState, processClaim } from './claims.js';

describe('processClaim', () => {
  it('does not pay for non-special items even if damaged', () => {
    const state = createPolicyState([
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ]);
    const r = processClaim(state, {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(r.payout).toBe(0);
    // cap unchanged: insurance sum 600, cap 1200
    expect(r.remainingCap).toBe(1200);
  });

  it('reimburses 50% of damage for enchantment >= 8 minus 100 deductible', () => {
    const state = createPolicyState([
      { type: 'sword', enchantment: 9 },
    ]);
    const r = processClaim(state, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    // 500 * 0.5 = 250; - 100 = 150
    expect(r.payout).toBe(150);
    expect(r.remainingCap).toBe(2000 - 150);
  });

  it('reimburses 100% of damage for dragon material minus deductible', () => {
    const state = createPolicyState([
      { type: 'sword', material: 'dragon', enchantment: 2 },
    ]);
    const r = processClaim(state, {
      cause: 'breath',
      damages: [{ itemType: 'sword', amount: 700 }],
    });
    expect(r.payout).toBe(600);
    expect(r.remainingCap).toBe(2000 - 600);
  });

  it('caps payout at twice insurance sum across multiple claims', () => {
    const state = createPolicyState([
      { type: 'sword', material: 'dragon' },
    ]);
    // insurance sum 1000, cap 2000
    const r1 = processClaim(state, {
      cause: 'breath',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);

    const r2 = processClaim(state, {
      cause: 'breath',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    // would be 900, but capped at 600
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  it('applies deductible per event, not per damage line', () => {
    const state = createPolicyState([
      { type: 'sword', material: 'dragon' },
      { type: 'staff', material: 'dragon' },
    ]);
    const r = processClaim(state, {
      cause: 'storm',
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'staff', amount: 300 },
      ],
    });
    // 200 + 300 = 500; - 100 = 400
    expect(r.payout).toBe(400);
  });

  it('payout never goes negative if damage less than deductible', () => {
    const state = createPolicyState([{ type: 'sword', material: 'dragon' }]);
    const r = processClaim(state, {
      cause: 'scratch',
      damages: [{ itemType: 'sword', amount: 50 }],
    });
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(2000);
  });
});
