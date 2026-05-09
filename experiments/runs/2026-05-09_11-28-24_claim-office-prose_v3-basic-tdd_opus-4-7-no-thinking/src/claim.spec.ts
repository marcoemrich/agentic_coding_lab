import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Item, Incident, Policy } from './types.js';

function makePolicy(items: Item[], insuranceSum: number): Policy {
  return {
    items,
    insuranceSum,
    remainingCap: 2 * insuranceSum,
  };
}

describe('processClaim', () => {
  it('returns zero payout for damage that is neither dragon nor highly enchanted', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const policy = makePolicy(items, 600);
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 200 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(1200);
  });

  it('reimburses 50% for items with enchantment >= 8, less deductible', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 8, cursed: false },
    ];
    const policy = makePolicy(items, 1000);
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 600 }],
    };
    // 50% of 600 = 300, -100 deductible = 200
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(2000 - 200);
  });

  it('does not apply 50% rule below enchantment 8', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 7, cursed: false },
    ];
    const policy = makePolicy(items, 1000);
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 600 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it('fully reimburses dragon-material items, less deductible', () => {
    const items: Item[] = [
      { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
    ];
    const policy = makePolicy(items, 1000);
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    };
    // 100% of 500 = 500, -100 = 400
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2000 - 400);
  });

  it('applies a single deductible per incident, not per damage', () => {
    const items: Item[] = [
      { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
      { type: 'amulet', material: 'dragon', enchantment: 0, cursed: false },
    ];
    const policy = makePolicy(items, 1600);
    const incident: Incident = {
      cause: 'fire',
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 300 },
      ],
    };
    // 200 + 300 = 500 reimbursed, -100 = 400
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(3200 - 400);
  });

  it('payout cannot be negative when deductible exceeds reimbursable', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'dragon', enchantment: 0, cursed: false },
    ];
    const policy = makePolicy(items, 600);
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 50 }],
    };
    // 100% of 50 = 50, -100 = -50 -> 0
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(1200);
  });

  it('caps payout at twice the insurance sum across multiple claims', () => {
    const items: Item[] = [
      { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
    ];
    const policy = makePolicy(items, 1000);
    // First incident pays 1500 - 100 = 1400 (cap remaining 600)
    const incident1: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    };
    const r1 = processClaim(policy, incident1);
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);

    // Second incident: would pay 1000-100=900, but capped at 600
    const incident2: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    };
    const r2 = processClaim(policy, incident2);
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  it('mixes covered and uncovered damages in one incident', () => {
    const items: Item[] = [
      { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
      { type: 'potion', material: 'glass', enchantment: 1, cursed: false },
    ];
    const policy = makePolicy(items, 1400);
    const incident: Incident = {
      cause: 'fire',
      damages: [
        { itemType: 'sword', amount: 300 },
        { itemType: 'potion', amount: 100 },
      ],
    };
    // sword: 300 dragon = 300; potion: not covered = 0
    // total = 300, -100 = 200
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(2800 - 200);
  });
});
