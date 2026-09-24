import { describe, expect, it } from 'vitest';
import { runScenario } from './office.js';

const customer = { yearsWithMHPCO: 0 };
const quote = (items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>) => ({ op: 'quote' as const, items });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const claim = (policy: number, damages: ReturnType<typeof damage>[]) => ({ op: 'claim' as const, policy, incident: { cause: 'dragon attack', damages } });

describe('claims', () => {
  it('reimburses ordinary items and components with a deductible for each damage', () => {
    expect(runScenario({ customer, steps: [quote([{ type: 'sword', material: 'steel', enchantment: 3 }, { type: 'amulet' }, { type: 'rune' }]), claim(0, [damage('sword', 500), damage('amulet', 300), damage('rune', 200)])] }).results[1]).toEqual({ payout: 700, remainingCap: 3000 });
  });

  it('prioritizes high enchantment over dragon material and rounds the final payout down', () => {
    expect(runScenario({ customer, steps: [quote([{ type: 'sword', material: 'dragon', enchantment: 8 }, { type: 'amulet', material: 'dragon', enchantment: 5 }]), claim(0, [damage('sword', 1000), damage('amulet', 801)])] }).results[1]).toEqual({ payout: 1101, remainingCap: 2099 });
    expect(runScenario({ customer, steps: [quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim(0, [damage('sword', 901)])] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('tracks policy-specific cap across successive claims including component values and duplicates', () => {
    expect(runScenario({ customer, steps: [quote([{ type: 'sword' }]), claim(0, [damage('sword', 1500)]), claim(0, [damage('sword', 1500)])] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
    expect(runScenario({ customer, steps: [quote([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]), claim(0, [])] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
    expect(runScenario({ customer, steps: [quote([{ type: 'sword' }, { type: 'sword' }]), claim(0, [damage('sword', 500), damage('sword', 500)])] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('rejects unmatched, excess and negative damages or invalid policies', () => {
    for (const damages of [[damage('amulet', 200)], [damage('broomstick', 200)], [damage('sword', 200), damage('sword', 200)], [damage('sword', -200)]]) {
      expect(() => runScenario({ customer, steps: [quote([{ type: 'sword' }]), claim(0, damages)] })).toThrow();
    }
    expect(() => runScenario({ customer, steps: [claim(0, [damage('sword', 100)])] })).toThrow();
    expect(() => runScenario({ customer, steps: [quote([{ type: 'broomstick' }])] })).toThrow();
  });
});
