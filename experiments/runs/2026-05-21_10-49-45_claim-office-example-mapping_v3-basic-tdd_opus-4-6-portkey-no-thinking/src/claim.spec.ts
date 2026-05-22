import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Item } from './quote.js';

function makePolicy(items: Item[], previousPayouts = 0) {
  let insuranceSum = 0;
  for (const item of items) {
    const val = item.type === 'rune' || item.type === 'moonstone' ? 250 :
      item.type === 'sword' ? 1000 :
      item.type === 'amulet' ? 600 :
      item.type === 'staff' ? 800 :
      item.type === 'potion' ? 400 : 0;
    insuranceSum += val;
  }
  return {
    items,
    insuranceSum,
    cap: insuranceSum * 2,
    totalPaidOut: previousPayouts,
  };
}

describe('Claim - deductible', () => {
  it('regular sword, 500 G damage → 400 G payout', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(400);
  });

  it('rune, 200 G damage → 100 G payout', () => {
    const policy = makePolicy([{ type: 'rune' }]);
    const result = processClaim(policy, [
      { itemType: 'rune', amount: 200 },
    ]);
    expect(result.payout).toBe(100);
  });

  it('deductible per damaged item, not per event', () => {
    // sword 500 G damage + amulet 300 G damage
    // sword: 500 - 100 = 400
    // amulet: 300 - 100 = 200
    // total: 600
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });
});

describe('Claim - high enchantment (≥8) reimbursed at 50%', () => {
  it('enchantment 9 sword, 1000 G damage → 400 G', () => {
    // 50% of 1000 = 500, minus 100 deductible = 400
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result.payout).toBe(400);
  });

  it('enchantment 8 sword, 1000 G damage → 400 G', () => {
    // exactly 8 triggers 50%
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result.payout).toBe(400);
  });

  it('enchantment 7 sword, 1000 G damage → 900 G (no reduction)', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 7, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result.payout).toBe(900);
  });
});

describe('Claim - dragon material', () => {
  it('dragon-material sword, enchantment 5, 800 G damage → 700 G', () => {
    // full reimbursement (dragon material), then deductible: 800 - 100 = 700
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 800 },
    ]);
    expect(result.payout).toBe(700);
  });

  it('dragon-material sword, enchantment 9, 1000 G damage → 400 G (50% wins)', () => {
    // both clauses apply: 50% rule wins → 500 - 100 = 400
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result.payout).toBe(400);
  });

  it('dragon-material sword, enchantment 8, 1000 G damage → 400 G', () => {
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result.payout).toBe(400);
  });
});

describe('Claim - cap exhaustion', () => {
  it('payout capped at remaining cap', () => {
    // sword insured: sum 1000, cap 2000
    // first claim 1500 → payout 1400 (1500-100), remaining 600
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    const result1 = processClaim(policy, [
      { itemType: 'sword', amount: 1500 },
    ]);
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    // second claim 1500 → desired 1400, but only 600 remaining
    const policy2 = { ...policy, totalPaidOut: 1400 };
    const result2 = processClaim(policy2, [
      { itemType: 'sword', amount: 1500 },
    ]);
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });

  it('two swords → insurance sum 2000, cap 4000', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
    ]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });

  it('sword and 3 runes → insurance sum 1750', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });
});

describe('Claim - payout rounding (MHPCO favor = down)', () => {
  it('payout of 350.5 → 350 G', () => {
    // enchantment 8 sword, 801 G damage → 50% of 801 = 400.5, - 100 = 300.5 → 300
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }]);
    const result = processClaim(policy, [
      { itemType: 'sword', amount: 801 },
    ]);
    expect(result.payout).toBe(300);
  });
});

describe('Claim - error cases', () => {
  it('throws when damage item not in policy', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, [
      { itemType: 'amulet', amount: 200 },
    ])).toThrow();
  });

  it('throws when more damages of a type than insured', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 300 },
    ])).toThrow();
  });

  it('throws on negative damage amount', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, [
      { itemType: 'sword', amount: -200 },
    ])).toThrow();
  });

  it('throws on unknown damage item type', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() => processClaim(policy, [
      { itemType: 'broomstick', amount: 200 },
    ])).toThrow();
  });
});
