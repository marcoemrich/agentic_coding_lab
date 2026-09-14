import { describe, expect, it } from 'vitest';
import { createPolicy, processClaim, processScenario, quotePremium } from './claim-office';

describe('quotePremium', () => {
  it('prices component blocks by exact type and count', () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quotePremium(customer, [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
    expect(quotePremium(customer, [
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
    ])).toBe(88);
    expect(quotePremium(customer, Array.from({ length: 7 }, () => ({ type: 'rune' })))).toBe(198);
  });

  it('stacks item and policy modifiers before rounding and fee', () => {
    const items = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(quotePremium({ yearsWithMHPCO: 0 }, [{ type: 'sword', cursed: true }])).toBe(165);
    expect(quotePremium({ yearsWithMHPCO: 3 }, items, 1)).toBe(160);
    expect(quotePremium({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  it('rejects unknown item types', () => {
    expect(() => quotePremium({ yearsWithMHPCO: 0 }, [{ type: 'broomstick' }])).toThrow('Unknown item type');
  });
});

describe('processScenario', () => {
  it('processes sequential quotes and claims', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    })).toEqual({
      results: [
        { premium: 175 },
        { premium: 160 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it('rejects a reference that does not identify an earlier quote', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: 'claim', policy: 0,
        incident: { cause: 'fire', damages: [] },
      }],
    })).toThrow('Invalid policy reference');
  });
});

describe('processClaim', () => {
  it('applies reimbursement rules and a deductible to each damage', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'dragon', enchantment: 9 },
      { type: 'amulet', enchantment: 2 },
    ]);
    expect(processClaim(policy, [
      { itemType: 'sword', amount: 1000 },
      { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('rounds down once and exhausts the policy cap across claims', () => {
    const fractional = createPolicy([{ type: 'sword', enchantment: 8 }]);
    expect(processClaim(fractional, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);

    const capped = createPolicy([{ type: 'sword' }]);
    expect(processClaim(capped, [{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(processClaim(capped, [{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('rejects uncovered, duplicate, and negative damages', () => {
    expect(() => processClaim(createPolicy([{ type: 'sword' }]), [
      { itemType: 'amulet', amount: 100 },
    ])).toThrow('not covered');
    expect(() => processClaim(createPolicy([{ type: 'sword' }]), [
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ])).toThrow('not covered');
    expect(() => processClaim(createPolicy([{ type: 'sword' }]), [
      { itemType: 'sword', amount: -200 },
    ])).toThrow('Invalid damage');
  });
});
