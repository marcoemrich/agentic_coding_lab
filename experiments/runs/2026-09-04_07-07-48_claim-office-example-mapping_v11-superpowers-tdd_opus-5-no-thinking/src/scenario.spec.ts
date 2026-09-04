import { describe, expect, test } from 'vitest';

import { runScenario } from './scenario.js';

const customer = { yearsWithMHPCO: 5 };

describe('running a scenario', () => {
  test('a quote step yields a premium', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });

  test('a claim step refers to the policy created by an earlier quote', () => {
    const results = runScenario({
      customer,
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('the follow-up discount applies from the second quote onwards', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  test('an unknown item type is rejected', () => {
    expect(() =>
      runScenario({
        customer,
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  test('a damage to an item outside the policy is rejected', () => {
    expect(() =>
      runScenario({
        customer,
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'amulet', amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  test('more damages of a type than the policy covers are rejected', () => {
    expect(() =>
      runScenario({
        customer,
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon',
              damages: [
                { itemType: 'sword', amount: 200 },
                { itemType: 'sword', amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  test('a negative damage amount is rejected', () => {
    expect(() =>
      runScenario({
        customer,
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'sword', amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/-200|negative/);
  });
});
