import { describe, expect, it } from 'vitest';
import { processScenario, type Item, type ClaimStep } from './office';

const incident = (damages: { itemType: string; amount: number }[], policy = 0): ClaimStep => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const claim = (items: Item[], damages: { itemType: string; amount: number }[]) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, incident(damages)] }).results[1];

describe('claims', () => {
  it('reimburses normal items less the deductible', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('reimburses components without special clauses', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('deducts 100 per damaged item rather than per incident', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it.each([0, 50, 100])('never pays a negative amount for damage %i', amount => {
    expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount }])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it.each([['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400], ['dragon', 5, 800, 700], ['steel', 9, 1000, 400], ['steel', 7, 1000, 900], ['steel', 8, 901, 350]])('applies reimbursement precedence for %s enchantment %i', (material, enchantment, amount, payout) => {
    expect(claim([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }])).toEqual({ payout, remainingCap: 2000 - Number(payout) });
  });
  it('keeps fractions until the final total payout', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }])).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it('exhausts the cap across successive claims', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      incident([{ itemType: 'sword', amount: 1500 }]),
      incident([{ itemType: 'sword', amount: 1500 }]),
      incident([{ itemType: 'sword', amount: 1500 }]),
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it('counts duplicate insured items and applies a deductible to each', () => {
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it('keeps component values unchanged by the block discount', () => {
    expect(claim([{ type: 'sword' }, ...Array.from({ length: 3 }, () => ({ type: 'rune' }))], [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('bases cap on insurance value rather than modified premium', () => {
    expect(claim([{ type: 'sword', cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('keeps policy caps separate and indexes quotes by step, not contract', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      incident([{ itemType: 'sword', amount: 5000 }]),
      { op: 'quote', items: [{ type: 'amulet' }] },
      incident([{ itemType: 'amulet', amount: 200 }], 2),
      incident([{ itemType: 'sword', amount: 500 }]),
    ] }).results).toEqual([{ premium: 115 }, { payout: 2000, remainingCap: 0 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 0 }]);
  });
  it.each(['amulet', 'broomstick'])('rejects damage to uninsured %s', itemType => {
    expect(() => claim([{ type: 'sword' }], [{ itemType, amount: 200 }])).toThrow(/insured/);
  });
  it('rejects excessive entries of the same type', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }])).toThrow(/insured/);
  });
  it('rejects negative damages', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(/amount/);
  });
  it('leaves the cap unchanged for no damages', () => {
    expect(claim([{ type: 'sword' }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
});
