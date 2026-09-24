import { describe, expect, it } from 'vitest';
import { runScenario, type Item } from './office.js';

const quote = (items: Item[]) => ({ op: 'quote' as const, items });
const claim = (policy: number, damages: { itemType: string; amount: number }[]) => ({ op: 'claim' as const, policy, incident: { cause: 'dragon attack', damages } });
const scenario = (...steps: (ReturnType<typeof quote> | ReturnType<typeof claim>)[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps });

describe('claims', () => {
  it('deducts once per damaged item, and keeps the cap per policy across claims', () => {
    expect(scenario(quote([{ type: 'sword' }, { type: 'amulet' }]),
      claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }]),
      claim(0, [{ itemType: 'sword', amount: 3000 }]),
      claim(0, [{ itemType: 'amulet', amount: 1000 }]),
    ).results.slice(1)).toEqual([
      { payout: 600, remainingCap: 2600 },
      { payout: 2600, remainingCap: 0 },
      { payout: 0, remainingCap: 0 },
    ]);
  });

  it('applies enchantment before deductible even on dragon material, and rounds only at the end', () => {
    expect(scenario(quote([{ type: 'sword', material: 'dragon', enchantment: 8 }, { type: 'rune' }]),
      claim(0, [{ itemType: 'sword', amount: 1001 }, { itemType: 'rune', amount: 200 }]),
    ).results[1]).toEqual({ payout: 500, remainingCap: 2000 });
  });

  it('assigns same-type damages to different insured items and preserves component insurance sums', () => {
    expect(scenario(quote([{ type: 'sword', enchantment: 9 }, { type: 'sword', material: 'dragon' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
      claim(0, [{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 800 }]),
    ).results[1]).toEqual({ payout: 1100, remainingCap: 4400 });
  });

  it('reimburses standard and dragon material below enchantment eight, and floors fractional payout totals', () => {
    expect(scenario(quote([{ type: 'sword', enchantment: 5, material: 'dragon' },
      { type: 'amulet', enchantment: 9 }, { type: 'potion' }]),
      claim(0, [{ itemType: 'sword', amount: 800 }, { itemType: 'amulet', amount: 901 },
        { itemType: 'potion', amount: 50 }]),
    ).results[1]).toEqual({ payout: 1050, remainingCap: 2950 });
  });

  it('rejects unknown items, excess damage entries, and negative damage', () => {
    expect(() => scenario(quote([{ type: 'broomstick' }]))).toThrow();
    expect(() => scenario(quote([{ type: 'sword' }]), claim(0, [{ itemType: 'amulet', amount: 200 }]))).toThrow();
    expect(() => scenario(quote([{ type: 'sword' }]), claim(0, [
      { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
    ]))).toThrow();
    expect(() => scenario(quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: -200 }]))).toThrow();
    expect(() => scenario(claim(0, []))).toThrow();
  });
});
