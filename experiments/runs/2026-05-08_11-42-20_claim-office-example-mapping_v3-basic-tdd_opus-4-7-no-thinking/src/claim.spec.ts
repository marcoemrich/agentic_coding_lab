import { describe, it, expect } from 'vitest';
import { processClaim, makePolicy, Policy } from './claim.js';

function policyFor(items: Parameters<typeof makePolicy>[0]): Policy {
  return makePolicy(items);
}

describe('processClaim - basic', () => {
  it('regular sword damage 500 -> 400', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 500 }] });
    expect(r.payout).toBe(400);
    // cap 2000, used 400, remaining 1600
    expect(r.remainingCap).toBe(1600);
  });

  it('rune damage 200 -> 100 (no enchantment/material on components)', () => {
    const policy = policyFor([{ type: 'rune' }]);
    const r = processClaim(policy, { damages: [{ itemType: 'rune', amount: 200 }] });
    expect(r.payout).toBe(100);
    expect(r.remainingCap).toBe(500 - 100);
  });
});

describe('processClaim - high enchantment', () => {
  it('steel sword enchantment 9, damage 1000 -> 400', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(r.payout).toBe(400);
  });

  it('exactly enchantment 8 dragon sword damage 1000 -> 400 (50%, then deductible)', () => {
    const policy = policyFor([{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(r.payout).toBe(400);
  });

  it('dragon sword enchantment 5 damage 800 -> 700 (full reimbursement, only dragon clause)', () => {
    const policy = policyFor([{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 800 }] });
    expect(r.payout).toBe(700);
  });
});

describe('processClaim - multiple damages', () => {
  it('dragon attack: sword 500 + amulet 300 -> total 600 (deductible per item)', () => {
    const policy = policyFor([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ]);
    const r = processClaim(policy, { damages: [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ] });
    // 500-100=400, 300-100=200, total 600
    expect(r.payout).toBe(600);
  });
});

describe('processClaim - cap tracking', () => {
  it('two successive 1500 claims on a sword (cap 2000)', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const r1 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  it('cursed sword cap is 2000 (modifiers do not raise cap)', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('sword + 3 runes block: insurance sum 1750', () => {
    const policy = policyFor([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.remainingCap).toBe(3500);
  });
});

describe('processClaim - rounding (down for payout)', () => {
  it('payout calculation that yields 350.5 rounds down to 350', () => {
    // High enchantment 50%: damage 901 -> 450.5, then -100 = 350.5 -> 350
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 901 }] });
    expect(r.payout).toBe(350);
  });
});

describe('processClaim - multiple same-type items', () => {
  it('two swords, dragon attack damages both', () => {
    const policy = policyFor([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
    const r = processClaim(policy, { damages: [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ] });
    expect(r.payout).toBe(800); // 400 + 400
  });

  it('more sword damages than swords insured -> error', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    expect(() => processClaim(policy, { damages: [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ] })).toThrow();
  });
});

describe('processClaim - errors', () => {
  it('damage to item not in policy throws', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    expect(() => processClaim(policy, { damages: [{ itemType: 'amulet', amount: 100 }] })).toThrow();
  });

  it('negative damage throws', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    expect(() => processClaim(policy, { damages: [{ itemType: 'sword', amount: -200 }] })).toThrow();
  });
});

describe('processClaim - damage smaller than deductible', () => {
  it('damage 50, deductible 100 -> payout 0', () => {
    const policy = policyFor([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 50 }] });
    expect(r.payout).toBe(0);
  });
});
