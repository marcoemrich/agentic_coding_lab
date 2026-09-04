import { describe, expect, test } from 'vitest';

import { damagePayout, settleClaim } from './claim.js';
import { createPolicy } from './policy.js';

describe('payout for a single damage', () => {
  test('a plain item is fully reimbursed, minus the 100 G deductible', () => {
    expect(
      damagePayout({ type: 'sword', material: 'steel', enchantment: 3 }, 500),
    ).toBe(400);
  });

  test('a component has no enchantment or material, so no clause applies', () => {
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  test('enchantment 8 halves the damage before the deductible', () => {
    expect(damagePayout({ type: 'sword', enchantment: 8 }, 1000)).toBe(400);
  });

  test('enchantment 7 does not trigger the high-enchantment clause', () => {
    expect(damagePayout({ type: 'sword', enchantment: 7 }, 1000)).toBe(900);
  });

  test('dragon material is fully reimbursed, then the deductible applies', () => {
    expect(
      damagePayout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800),
    ).toBe(700);
  });

  test('the 50 % rule wins when both clauses apply', () => {
    expect(
      damagePayout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000),
    ).toBe(400);
  });

  test('a dragon sword at exactly enchantment 8 is halved, then reduced', () => {
    expect(
      damagePayout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000),
    ).toBe(400);
  });

  test('a payout never goes below zero', () => {
    expect(damagePayout({ type: 'rune' }, 50)).toBe(0);
  });
});

describe('claims against a policy', () => {
  const swordPolicy = () => createPolicy([{ type: 'sword' }]);

  test('the cap is twice the insurance sum', () => {
    expect(swordPolicy().remainingCap).toBe(2000);
  });

  test('each damaged item carries its own deductible', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const result = settleClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  test('two damages to two swords are settled separately', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const result = settleClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });

  test('a claim is capped at the remaining cap', () => {
    const policy = swordPolicy();
    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  test('a fractional payout is rounded down, in the MHPCO favour', () => {
    // enchantment 8 halves 801 to 400.5, minus 100 deductible = 300.5
    const policy = createPolicy([{ type: 'sword', enchantment: 8 }]);
    const result = settleClaim(policy, [{ itemType: 'sword', amount: 801 }]);
    expect(result.payout).toBe(300);
  });

  test('premium modifiers do not raise the cap', () => {
    expect(createPolicy([{ type: 'sword', cursed: true }]).remainingCap).toBe(
      2000,
    );
  });
});
