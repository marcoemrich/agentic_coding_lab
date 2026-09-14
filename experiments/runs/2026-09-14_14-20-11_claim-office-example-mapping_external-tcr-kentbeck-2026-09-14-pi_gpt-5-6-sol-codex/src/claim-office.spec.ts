import { describe, expect, it } from 'vitest';
import { basePremium, createPolicy, processClaim, processScenario, quotePremium } from './claim-office.js';

describe('basePremium', () => {
  it('adds the price-list base premiums', () => {
    expect(basePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/Unknown item type/);
  });

  it('discounts exactly three alike components', () => {
    const components = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));

    expect(basePremium(components('rune', 2))).toBe(50);
    expect(basePremium(components('rune', 3))).toBe(60);
    expect(basePremium(components('rune', 4))).toBe(100);
    expect(basePremium(components('rune', 7))).toBe(175);
    expect(basePremium([...components('rune', 3), ...components('moonstone', 3)])).toBe(120);
  });
});

describe('quotePremium', () => {
  it('applies item risk and policy modifiers additively before the fee', () => {
    const cursedSword = { type: 'sword', cursed: true, enchantment: 7 };

    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 3 }], 0)).toBe(165);
    expect(quotePremium([cursedSword], 3, 1)).toBe(160);
    expect(quotePremium([cursedSword, { type: 'amulet' }], 0)).toBe(261);
  });

  it('applies thresholds, rounding, and the processing fee', () => {
    expect(quotePremium([{ type: 'rune', cursed: true }], 2, 1)).toBe(37);
    expect(quotePremium([], 0)).toBe(5);
  });

  it('scopes item surcharges to affected items only', () => {
    expect(quotePremium([
      { type: 'sword', cursed: true, enchantment: 4 },
      { type: 'amulet' },
    ], 0)).toBe(231);
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 5 }], 0)).toBe(195);
  });
});

describe('processClaim', () => {
  it('applies one deductible to every damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);

    expect(processClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('halves severe enchantment damage before the deductible and rounds down', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 9 }]);

    expect(processClaim(policy, [{ itemType: 'sword', amount: 901 }])).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  it('uses full reimbursement below the severe enchantment threshold', () => {
    const dragonPolicy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    const componentPolicy = createPolicy([{ type: 'rune' }]);

    expect(processClaim(dragonPolicy, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
    expect(processClaim(componentPolicy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('limits cumulative payouts to twice the insurance sum', () => {
    const policy = createPolicy([{ type: 'sword' }]);

    expect(processClaim(policy, [{ itemType: 'sword', amount: 1500 }]).payout).toBe(1400);
    expect(processClaim(policy, [{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('bases the cap on every insured item without premium discounts', () => {
    const policy = createPolicy([
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);

    expect(policy.remainingCap).toBe(3500);
  });

  it('rejects damage entries beyond the covered item count', () => {
    const policy = createPolicy([{ type: 'sword' }]);

    expect(() => processClaim(policy, [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 200 },
    ])).toThrow(/not covered/);
  });

  it('rejects negative damage', () => {
    const policy = createPolicy([{ type: 'sword' }]);

    expect(() => processClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow(/negative/);
  });
});

describe('processScenario', () => {
  it('processes quote history and claims in step order', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        {
          op: 'claim',
          policy: 1,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    })).toEqual({
      results: [
        { premium: 59 },
        { premium: 160 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it('rejects a claim that does not reference an earlier quote', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: 'claim',
        policy: 0,
        incident: { cause: 'fire', damages: [] },
      }],
    })).toThrow(/earlier quote/);
  });
});
