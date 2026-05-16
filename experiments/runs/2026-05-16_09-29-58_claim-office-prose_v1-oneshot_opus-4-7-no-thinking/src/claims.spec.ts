import { describe, it, expect } from 'vitest';
import { processClaim } from './claims.js';
import { Policy } from './types.js';

function makePolicy(items: Policy['items'], insuranceSum: number): Policy {
  return { items, insuranceSum, cap: 2 * insuranceSum, remainingCap: 2 * insuranceSum };
}

describe('processClaim', () => {
  it('applies the 100 G deductible and pays the rest in full for an ordinary item', () => {
    const policy = makePolicy([{ type: 'amulet' }], 600);
    const out = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(out.payout).toBe(100);
    expect(out.remainingCap).toBe(1100);
  });

  it('zeros out when damage is below the deductible', () => {
    const policy = makePolicy([{ type: 'potion' }], 400);
    const out = processClaim(policy, {
      cause: 'slip',
      damages: [{ itemType: 'potion', amount: 50 }],
    });
    expect(out.payout).toBe(0);
    expect(out.remainingCap).toBe(800);
  });

  it('reimburses high-enchantment items at 50%', () => {
    const policy = makePolicy([{ type: 'staff', enchantment: 8 }], 800);
    // 1000 covered at 50% = 500. -100 deductible = 400.
    const out = processClaim(policy, {
      cause: 'blast',
      damages: [{ itemType: 'staff', amount: 1000 }],
    });
    expect(out.payout).toBe(400);
    expect(out.remainingCap).toBe(1200);
  });

  it('reimburses dragon-material items at 100%', () => {
    const policy = makePolicy([{ type: 'sword', material: 'dragon' }], 1000);
    // 500 covered at 100% = 500. -100 = 400.
    const out = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(out.payout).toBe(400);
    expect(out.remainingCap).toBe(1600);
  });

  it('caps total payouts across multiple claims at 2x insurance sum', () => {
    const policy = makePolicy([{ type: 'amulet' }], 600);
    // cap = 1200.
    const first = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    expect(first.payout).toBe(900); // 1000 - 100
    expect(first.remainingCap).toBe(300);

    const second = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    // 1000 - 100 = 900, but capped at 300.
    expect(second.payout).toBe(300);
    expect(second.remainingCap).toBe(0);

    const third = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(third.payout).toBe(0);
    expect(third.remainingCap).toBe(0);
  });

  it('charges the deductible once per damage event, even with multiple damaged items', () => {
    const policy = makePolicy([{ type: 'sword' }, { type: 'amulet' }], 1600);
    // 300 + 250 = 550 covered. -100 = 450.
    const out = processClaim(policy, {
      cause: 'fire',
      damages: [
        { itemType: 'sword', amount: 300 },
        { itemType: 'amulet', amount: 250 },
      ],
    });
    expect(out.payout).toBe(450);
    expect(out.remainingCap).toBe(2750);
  });
});
