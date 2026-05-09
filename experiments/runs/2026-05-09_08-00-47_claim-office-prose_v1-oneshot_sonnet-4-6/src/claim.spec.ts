import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Policy, Damage } from './types.js';

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
    insuranceSum: 600,
    remainingCap: 1200,
    ...overrides,
  };
}

function damage(itemType: string, amount: number): Damage {
  return { itemType, amount };
}

describe('processClaim — basic deductible', () => {
  it('subtracts 100 G deductible from reimbursable damage', () => {
    const policy = makePolicy();
    const { payout } = processClaim(policy, [damage('amulet', 200)]);
    expect(payout).toBe(100); // 200 - 100 = 100
  });

  it('returns 0 when damage does not exceed deductible', () => {
    const policy = makePolicy();
    const { payout } = processClaim(policy, [damage('amulet', 80)]);
    expect(payout).toBe(0);
  });

  it('returns 0 exactly when damage equals deductible', () => {
    const policy = makePolicy();
    const { payout } = processClaim(policy, [damage('amulet', 100)]);
    expect(payout).toBe(0);
  });
});

describe('processClaim — remaining cap', () => {
  it('reduces remainingCap by payout', () => {
    const policy = makePolicy();
    const { payout, remainingCap } = processClaim(policy, [damage('amulet', 200)]);
    expect(payout).toBe(100);
    expect(remainingCap).toBe(1100);
  });

  it('caps payout at remainingCap', () => {
    const policy = makePolicy({ remainingCap: 50 });
    const { payout, remainingCap } = processClaim(policy, [damage('amulet', 300)]);
    expect(payout).toBe(50);
    expect(remainingCap).toBe(0);
  });

  it('returns 0 payout when cap is already exhausted', () => {
    const policy = makePolicy({ remainingCap: 0 });
    const { payout, remainingCap } = processClaim(policy, [damage('amulet', 500)]);
    expect(payout).toBe(0);
    expect(remainingCap).toBe(0);
  });
});

describe('processClaim — enchantment >= 8 (50% reimbursement)', () => {
  it('reimburses at 50% for highly enchanted items', () => {
    const policy = makePolicy({
      items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
    });
    // 400 * 0.5 = 200; 200 - 100 = 100
    const { payout } = processClaim(policy, [damage('sword', 400)]);
    expect(payout).toBe(100);
  });

  it('floors fractional payout (MHPCO favour)', () => {
    const policy = makePolicy({
      items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
    });
    // 301 * 0.5 = 150.5; 150.5 - 100 = 50.5 → floor = 50
    const { payout } = processClaim(policy, [damage('sword', 301)]);
    expect(payout).toBe(50);
  });

  it('does not apply 50% for enchantment 7 (below threshold)', () => {
    const policy = makePolicy({
      items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: false }],
    });
    const { payout } = processClaim(policy, [damage('sword', 300)]);
    expect(payout).toBe(200); // 300 - 100 = 200
  });
});

describe('processClaim — dragon material (full reimbursement)', () => {
  it('reimburses dragon-material items fully', () => {
    const policy = makePolicy({
      items: [{ type: 'amulet', material: 'dragon', enchantment: 2, cursed: false }],
    });
    const { payout } = processClaim(policy, [damage('amulet', 300)]);
    expect(payout).toBe(200); // 300 - 100 = 200
  });

  it('dragon material overrides the high-enchantment 50% rule', () => {
    const policy = makePolicy({
      items: [{ type: 'amulet', material: 'dragon', enchantment: 9, cursed: false }],
    });
    // Dragon → 100%; 300 - 100 = 200
    const { payout } = processClaim(policy, [damage('amulet', 300)]);
    expect(payout).toBe(200);
  });
});

describe('processClaim — multiple damages in one incident', () => {
  it('sums damage amounts before subtracting the single deductible', () => {
    const policy = makePolicy({
      items: [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ],
      insuranceSum: 1600,
      remainingCap: 3200,
    });
    // 150 + 200 = 350; 350 - 100 = 250
    const { payout } = processClaim(policy, [damage('amulet', 150), damage('sword', 200)]);
    expect(payout).toBe(250);
  });
});

describe('processClaim — sequential claims mutate cap', () => {
  it('second claim sees the reduced cap from the first', () => {
    const policy = makePolicy({ remainingCap: 250 });

    const first = processClaim(policy, [damage('amulet', 200)]);
    expect(first.payout).toBe(100);
    // Mutate as CLI does
    policy.remainingCap = first.remainingCap;

    const second = processClaim(policy, [damage('amulet', 300)]);
    // Remaining cap was 150; 300 - 100 = 200 but capped at 150
    expect(second.payout).toBe(150);
    expect(second.remainingCap).toBe(0);
  });
});
