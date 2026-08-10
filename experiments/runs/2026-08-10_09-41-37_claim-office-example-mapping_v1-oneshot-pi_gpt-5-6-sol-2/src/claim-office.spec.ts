import { describe, expect, it } from 'vitest';
import { runScenario } from './claim-office';

const scenario = (steps: unknown[], yearsWithMHPCO = 0) => ({
  customer: { yearsWithMHPCO }, steps,
});

const quote = (items: unknown[]) => ({ op: 'quote', items });
const claim = (policy: number, damages: unknown[]) => ({
  op: 'claim', policy, incident: { cause: 'test', damages },
});

describe('quotes', () => {
  it('prices component blocks and empty policies', () => {
    expect(runScenario(scenario([quote([])])).results[0]).toEqual({ premium: 5 });
    expect(runScenario(scenario([quote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])])).results[0]).toEqual({ premium: 71 });
  });

  it('stacks item and customer modifiers', () => {
    const result = runScenario(scenario([
      quote([{ type: 'amulet' }]),
      quote([{ type: 'sword', cursed: true, enchantment: 7 }]),
    ], 3));
    expect(result.results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
});

describe('claims', () => {
  it('applies deductibles, high enchantment, and the policy cap', () => {
    const result = runScenario(scenario([
      quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]),
      claim(0, [{ itemType: 'sword', amount: 1000 }]),
      claim(0, [{ itemType: 'sword', amount: 4000 }]),
    ]));
    expect(result.results.slice(1)).toEqual([
      { payout: 400, remainingCap: 1600 },
      { payout: 1600, remainingCap: 0 },
    ]);
  });

  it('rejects excess duplicate damage and negative damage', () => {
    expect(() => runScenario(scenario([
      quote([{ type: 'sword' }]),
      claim(0, [{ itemType: 'sword', amount: 1 }, { itemType: 'sword', amount: 1 }]),
    ]))).toThrow(/uninsured/);
    expect(() => runScenario(scenario([
      quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: -1 }]),
    ]))).toThrow(/damage amount/);
  });
});
