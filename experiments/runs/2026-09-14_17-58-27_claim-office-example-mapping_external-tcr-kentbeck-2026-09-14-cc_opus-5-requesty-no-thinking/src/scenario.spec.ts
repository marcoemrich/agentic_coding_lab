import { describe, expect, it } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario', () => {
  it('runs a quote followed by a claim', () => {
    expect(
      runScenario({
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
      }),
    ).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('treats a second quote as a follow-up contract', () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: 'quote', items: [{ type: 'potion' }] },
          {
            op: 'quote',
            items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
          },
        ],
      }),
    ).toEqual([{ premium: 41 }, { premium: 160 }]);
  });

  it('rejects a claim against a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 3,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
          },
        ],
      }),
    ).toThrow(/policy/);
  });
});

describe('multi-item policies', () => {
  it('insures two swords and pays a deductible per damaged sword', () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toEqual([{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
  });

  it('charges the curse surcharge only on the cursed item', () => {
    // base 160 + 50 curse + 16 first insurance + 5 fee = 231
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] },
        ],
      }),
    ).toEqual([{ premium: 231 }]);
  });

  it('insures a sword and a block of runes at the full insurance sum', () => {
    // premium: base 100 + 60 = 160, + 16 first insurance + 5 fee = 181; cap 2 * 1750
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
          },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
          },
        ],
      }),
    ).toEqual([{ premium: 181 }, { payout: 100, remainingCap: 3400 }]);
  });
});
