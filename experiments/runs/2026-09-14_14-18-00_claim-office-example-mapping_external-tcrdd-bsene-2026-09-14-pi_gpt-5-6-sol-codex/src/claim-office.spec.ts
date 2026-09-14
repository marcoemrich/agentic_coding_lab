import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('uses the price list for every main item and component', () => {
    const premiums = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'].map(type =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type }] }],
      }).results[0]?.premium,
    );
    expect(premiums).toEqual([115, 71, 93, 49, 33, 33]);
  });

  it('applies a block price only to exactly three alike components', () => {
    const premiumFor = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: types.map(type => ({ type })) }],
    }).results[0]?.premium;
    expect([
      premiumFor(['rune', 'rune']),
      premiumFor(['rune', 'rune', 'rune']),
      premiumFor(['rune', 'rune', 'rune', 'rune']),
      premiumFor(Array(7).fill('rune')),
      premiumFor(['rune', 'rune', 'moonstone']),
      premiumFor([...Array(3).fill('rune'), ...Array(3).fill('moonstone')]),
    ]).toEqual([60, 71, 115, 198, 88, 137]);
  });

  it('applies curse and high-enchantment surcharges only to affected items', () => {
    const quote = (items: Array<{ type: string; cursed?: boolean; enchantment?: number }>) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }).results[0]?.premium;
    expect(quote([{ type: 'sword', cursed: true, enchantment: 3 }])).toBe(165);
    expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  it('applies loyalty and follow-up discounts to policy base premium', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    }).results[0]).toEqual({ premium: 95 });
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    }).results[1]).toEqual({ premium: 160 });
  });
});

describe('claims', () => {
  it('reimburses ordinary damage after a deductible per damaged item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('halves reimbursement at enchantment eight even for dragon material', () => {
    const payout = (material: string, enchantment: number, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material, enchantment }] },
        { op: 'claim', policy: 0, incident: { cause: 'damage', damages: [{ itemType: 'sword', amount }] } },
      ],
    }).results[1]?.payout;
    expect(payout('dragon', 8, 1000)).toBe(400);
    expect(payout('dragon', 9, 1000)).toBe(400);
    expect(payout('dragon', 5, 800)).toBe(700);
    expect(payout('steel', 9, 1000)).toBe(400);
  });

  it('matches repeated damages to separately insured items of the same type', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('deducts 100 G separately for each damaged item', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('exhausts the policy cap across successive claims', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'flood', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('bases the cap on unmodified item values, including every block component', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }, ...Array(3).fill({ type: 'rune' })] },
        { op: 'claim', policy: 0, incident: { cause: 'inspection', damages: [] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('rounds fractional payouts down in the office’s favor', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'curse', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('rejects unknown quote items and invalid or uninsured damages', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item/i);
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    })).toThrow(/amount/i);
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
          { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
        ] } },
      ],
    })).toThrow(/not insured/i);
  });
});
