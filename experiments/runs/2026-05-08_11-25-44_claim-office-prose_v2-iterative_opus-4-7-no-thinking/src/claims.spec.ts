import { describe, it, expect } from 'vitest';
import { processClaim } from './claims.js';
import type { Policy } from './types.js';

function policy(items: Policy['items'], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: insuranceSum * 2 };
}

describe('processClaim', () => {
  it('applies a 100G deductible', () => {
    const p = policy([{ type: 'amulet', enchantment: 2 }], 600);
    const result = processClaim(p, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1200 - 100);
  });

  it('reimburses 50% for items with enchantment >= 8', () => {
    const p = policy([{ type: 'staff', enchantment: 9 }], 800);
    // 50% of 500 = 250, minus 100 deductible = 150
    const result = processClaim(p, {
      damages: [{ itemType: 'staff', amount: 500 }],
    });
    expect(result.payout).toBe(150);
  });

  it('reimburses fully for dragon-material items', () => {
    const p = policy([{ type: 'sword', material: 'dragon', enchantment: 9 }], 1000);
    // dragon overrides the 50% rule -> full 800, minus 100 = 700
    const result = processClaim(p, {
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  it('caps total payout at 2x insurance sum across multiple claims', () => {
    const p = policy([{ type: 'amulet' }], 600); // cap = 1200
    const r1 = processClaim(p, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    expect(r1.payout).toBe(900);
    expect(r1.remainingCap).toBe(300);
    const r2 = processClaim(p, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    // 1000 - 100 = 900, but only 300 remaining
    expect(r2.payout).toBe(300);
    expect(r2.remainingCap).toBe(0);
  });

  it('returns 0 payout when damage less than deductible', () => {
    const p = policy([{ type: 'sword' }], 1000);
    const r = processClaim(p, { damages: [{ itemType: 'sword', amount: 50 }] });
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(2000);
  });

  it('applies a single deductible per incident across multiple damages', () => {
    const p = policy([{ type: 'sword' }, { type: 'amulet' }], 1600);
    const r = processClaim(p, {
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 200 },
      ],
    });
    // gross 400, minus 100 deductible = 300
    expect(r.payout).toBe(300);
  });
});
