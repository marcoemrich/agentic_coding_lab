import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Item, Policy, Incident } from './types.js';

function makePolicy(items: Item[], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: insuranceSum * 2 };
}

describe('processClaim', () => {
  it('reimburses 0 (and applies no deductible) for non-qualifying damage', () => {
    // Amulet enchant=2, silver: not dragon, not enchant>=8 -> not covered
    const policy = makePolicy(
      [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
      600,
    );
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 200 }],
    };
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(1200);
  });

  it('reimburses 50% minus 100G deductible for damage to enchant >= 8 item', () => {
    const policy = makePolicy(
      [{ type: 'staff', material: 'oak', enchantment: 9, cursed: false }],
      800,
    );
    const incident: Incident = {
      cause: 'lightning',
      damages: [{ itemType: 'staff', amount: 600 }],
    };
    // 600 * 0.5 = 300, - 100 deductible = 200
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(200);
    expect(r.remainingCap).toBe(1600 - 200);
  });

  it('fully reimburses dragon material damage minus deductible', () => {
    const policy = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 2, cursed: false }],
      1000,
    );
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    };
    // 500 - 100 = 400
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(2000 - 400);
  });

  it('sums reimbursable damage across an incident before deductible', () => {
    const policy = makePolicy(
      [
        { type: 'sword', material: 'dragon', enchantment: 2, cursed: false },
        { type: 'staff', material: 'oak', enchantment: 9, cursed: false },
      ],
      1800,
    );
    const incident: Incident = {
      cause: 'battle',
      damages: [
        { itemType: 'sword', amount: 200 }, // dragon: 200 full
        { itemType: 'staff', amount: 200 }, // enchant9: 100
      ],
    };
    // 200 + 100 = 300 - 100 = 200
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(200);
    expect(r.remainingCap).toBe(3600 - 200);
  });

  it('caps payout at 2x insurance sum across multiple claims', () => {
    const policy = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 2, cursed: false }],
      1000,
    );
    // Cap is 2000
    const incident1: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    };
    // 1500 - 100 = 1400
    const r1 = processClaim(policy, incident1);
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);

    const incident2: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    };
    // 1500 - 100 = 1400, but cap remaining is 600, so payout = 600
    const r2 = processClaim(policy, incident2);
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  it('returns 0 payout when reimbursable amount is below the deductible', () => {
    const policy = makePolicy(
      [{ type: 'staff', material: 'oak', enchantment: 9, cursed: false }],
      800,
    );
    const incident: Incident = {
      cause: 'small spark',
      damages: [{ itemType: 'staff', amount: 100 }],
    };
    // 100 * 0.5 = 50, - 100 deductible = -50 -> 0
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(1600);
  });

  it('reimburses dragon material at 100% even when not enchanted', () => {
    const policy = makePolicy(
      [{ type: 'amulet', material: 'dragon', enchantment: 0, cursed: false }],
      600,
    );
    const incident: Incident = {
      cause: 'theft attempt',
      damages: [{ itemType: 'amulet', amount: 300 }],
    };
    // 300 - 100 = 200
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(200);
    expect(r.remainingCap).toBe(1200 - 200);
  });

  it('rounds payout down (in MHPCOs favor)', () => {
    const policy = makePolicy(
      [{ type: 'staff', material: 'oak', enchantment: 9, cursed: false }],
      800,
    );
    const incident: Incident = {
      cause: 'lightning',
      damages: [{ itemType: 'staff', amount: 333 }],
    };
    // 333 * 0.5 = 166.5, - 100 = 66.5 -> 66
    const r = processClaim(policy, incident);
    expect(r.payout).toBe(66);
    expect(r.remainingCap).toBe(1600 - 66);
  });
});
