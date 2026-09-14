import { describe, expect, it } from 'vitest';
import { processScenarioJson } from './app.js';

describe('processScenarioJson', () => {
  it('returns a results document', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(JSON.parse(processScenarioJson(input))).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('rejects an unknown item type', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(() => processScenarioJson(input)).toThrow(/broomstick/);
  });

  it('rejects a document without a customer', () => {
    expect(() => processScenarioJson(JSON.stringify({ steps: [] }))).toThrow(/customer/);
  });

  it('rejects a document without steps', () => {
    expect(() =>
      processScenarioJson(JSON.stringify({ customer: { yearsWithMHPCO: 1 } })),
    ).toThrow(/steps/);
  });
});
