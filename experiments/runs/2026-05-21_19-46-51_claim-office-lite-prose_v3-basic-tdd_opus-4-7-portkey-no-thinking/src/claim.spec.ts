import { describe, it, expect } from 'vitest';
import { computePayout } from './claim.js';
import type { Item } from './quote.js';

describe('computePayout', () => {
  const policyItems: Item[] = [
    { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    { type: 'staff', material: 'dragon', enchantment: 4, cursed: false },
    { type: 'amulet', material: 'silver', enchantment: 8, cursed: false },
    { type: 'potion', material: 'glass', enchantment: 10, cursed: false },
  ];

  it('returns 0 for damage to ordinary items', () => {
    // sword: not dragon, ench 3 < 8 -> not reimbursed; deductible applies; clamp at 0
    const payout = computePayout(policyItems, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(payout).toBe(0);
  });

  it('fully reimburses dragon material minus deductible', () => {
    // staff is dragon: 500 - 100 deductible = 400
    const payout = computePayout(policyItems, {
      cause: 'fire',
      damages: [{ itemType: 'staff', amount: 500 }],
    });
    expect(payout).toBe(400);
  });

  it('reimburses 50% for high enchantment (>=8) items minus deductible', () => {
    // amulet ench 8 -> 50% of 500 = 250; - 100 = 150
    const payout = computePayout(policyItems, {
      cause: 'curse',
      damages: [{ itemType: 'amulet', amount: 500 }],
    });
    expect(payout).toBe(150);
  });

  it('applies a single deductible per incident across multiple damages', () => {
    // staff dragon 300 -> 300; amulet ench 8 200 -> 100; sum 400; - 100 deductible = 300
    const payout = computePayout(policyItems, {
      cause: 'fire',
      damages: [
        { itemType: 'staff', amount: 300 },
        { itemType: 'amulet', amount: 200 },
      ],
    });
    expect(payout).toBe(300);
  });

  it('clamps payout at 0 when reimbursable amount is below deductible', () => {
    // amulet ench 8: 50 * 0.5 = 25; - 100 = -75 -> 0
    const payout = computePayout(policyItems, {
      cause: 'curse',
      damages: [{ itemType: 'amulet', amount: 50 }],
    });
    expect(payout).toBe(0);
  });

  it('rounds in MHPCO favor (rounds down)', () => {
    // amulet ench 8: 0.5 * 333 = 166.5 -> 166 (favor MHPCO); - 100 = 66
    const payout = computePayout(policyItems, {
      cause: 'curse',
      damages: [{ itemType: 'amulet', amount: 333 }],
    });
    expect(payout).toBe(66);
  });

});
