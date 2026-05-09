import { describe, expect, it } from 'vitest';
import { processClaim } from './claims.js';
import type { Policy } from './types.js';

function makePolicy(items: Policy['items'], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: 2 * insuranceSum };
}

describe('processClaim', () => {
  it('subtracts a 100G deductible from the claim', () => {
    const p = makePolicy([{ type: 'sword' }], 1000);
    const out = processClaim(p, {
      damages: [{ itemType: 'sword', amount: 300 }],
    });
    expect(out.payout).toBe(200);
    expect(out.remainingCap).toBe(2000 - 200);
  });

  it('caps payout at twice the insurance sum across multiple claims', () => {
    const p = makePolicy([{ type: 'amulet' }], 600);
    // First claim: 1000 - 100 deductible = 900; cap is 1200
    const out1 = processClaim(p, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    expect(out1.payout).toBe(900);
    expect(out1.remainingCap).toBe(300);
    // Second claim: would pay 500-100=400, but cap leaves only 300
    const out2 = processClaim(p, {
      damages: [{ itemType: 'amulet', amount: 500 }],
    });
    expect(out2.payout).toBe(300);
    expect(out2.remainingCap).toBe(0);
  });

  it('reimburses 50% on items with enchantment >= 8', () => {
    const p = makePolicy([{ type: 'staff', enchantment: 8 }], 800);
    const out = processClaim(p, {
      damages: [{ itemType: 'staff', amount: 400 }],
    });
    // 50% of 400 = 200; - 100 deductible = 100
    expect(out.payout).toBe(100);
  });

  it('fully reimburses dragon-material items (overrides enchantment penalty)', () => {
    const p = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      1000,
    );
    const out = processClaim(p, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(out.payout).toBe(400); // 500 - 100
  });

  it('clamps negative net (deductible exceeds reimbursement) to 0', () => {
    const p = makePolicy([{ type: 'potion' }], 400);
    const out = processClaim(p, {
      damages: [{ itemType: 'potion', amount: 50 }],
    });
    expect(out.payout).toBe(0);
    expect(out.remainingCap).toBe(800);
  });

  it('one deductible per damage event regardless of damages count', () => {
    const p = makePolicy([{ type: 'sword' }, { type: 'amulet' }], 1600);
    const out = processClaim(p, {
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 200 },
      ],
    });
    expect(out.payout).toBe(300); // 400 - 100 deductible (single event)
  });
});
