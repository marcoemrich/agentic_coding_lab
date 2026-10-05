import { describe, expect, it } from 'vitest';
import { processScenario } from './office';

const scenario = (steps: unknown[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps });
const quote = (items: unknown[]) => ({ op: 'quote', items });
const claim = (damages: unknown[], policy = 0) => ({
  op: 'claim', policy, incident: { cause: 'dragon attack', damages },
});

describe('quotes', () => {
  it.each([
    ['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49],
    ['rune', 33], ['moonstone', 33],
  ])('prices a first insurance of %s with final upward rounding', (type, premium) => {
    expect(scenario([quote([{ type }])])).toEqual({ results: [{ premium }] });
  });
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])(
    'discounts exactly three alike components, not %i arbitrarily grouped components', (count, premium) => {
      expect(scenario([quote(Array.from({ length: count }, () => ({ type: 'rune' })))])).toEqual({ results: [{ premium }] });
    },
  );
  it.each([
    [['rune', 'rune', 'moonstone'], 88],
    [['rune', 'rune', 'rune', 'moonstone', 'moonstone', 'moonstone'], 137],
    [['sword', 'sword', 'sword'], 335],
  ])('groups components by exact type only: %j', (types, premium) => {
    expect(scenario([quote((types as string[]).map(type => ({ type })))]))
      .toEqual({ results: [{ premium }] });
  });
  it.each([
    [{ cursed: true, enchantment: 3 }, 165],
    [{ cursed: true, enchantment: 4 }, 165],
    [{ enchantment: 4 }, 115],
    [{ enchantment: 5 }, 145],
    [{ cursed: true, enchantment: 5 }, 195],
  ])('adds item risks independently at their thresholds: %j', (modifiers, premium) => {
    expect(scenario([quote([{ type: 'sword', ...modifiers }])])).toEqual({ results: [{ premium }] });
  });
  it('applies item risks only to the affected item base', () => {
    expect(scenario([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])]))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('applies loyalty from exactly two years (%i)', (years, premium) => {
    expect(scenario([quote([{ type: 'sword' }])], years)).toEqual({ results: [{ premium }] });
  });
  it('stacks loyalty, item risks, first insurance, and follow-up discounts additively', () => {
    const sword = { type: 'sword', material: 'steel', cursed: true, enchantment: 7 };
    expect(scenario([quote([sword]), quote([sword]), quote([sword])], 3)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }, { premium: 160 }],
    });
  });
  it('does not round individual components before summing premiums', () => {
    expect(scenario([quote([{ type: 'rune' }, { type: 'moonstone' }])]))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it('charges only the processing fee for an empty policy', () => {
    expect(scenario([quote([])])).toEqual({ results: [{ premium: 5 }] });
  });
});

describe('claims', () => {
  it('exhausts a persistent cap and pays zero on later claims', () => {
    const damage = claim([{ itemType: 'sword', amount: 1500 }]);
    expect(scenario([quote([{ type: 'sword', cursed: true }]), damage, damage, damage]))
      .toEqual({ results: [
        { premium: 165 }, { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
      ] });
  });
  it('uses unmodified values for component blocks and duplicate main items', () => {
    expect(scenario([
      quote([{ type: 'sword' }, ...Array.from({ length: 3 }, () => ({ type: 'rune' }))]),
      claim([{ itemType: 'sword', amount: 5000 }]),
      quote([{ type: 'sword' }, { type: 'sword' }]),
      claim([{ itemType: 'sword', amount: 2500 }, { itemType: 'sword', amount: 2500 }], 2),
    ]).results).toEqual([
      { premium: 181 }, { payout: 3500, remainingCap: 0 },
      { premium: 195 }, { payout: 4000, remainingCap: 0 },
    ]);
  });
  it('keeps policy caps independent and counts only quotes for follow-up discounts', () => {
    expect(scenario([
      quote([{ type: 'sword' }]), claim([{ itemType: 'sword', amount: 500 }]),
      quote([{ type: 'amulet' }]), claim([{ itemType: 'amulet', amount: 200 }], 2),
      claim([{ itemType: 'sword', amount: 500 }]), claim([], 2),
    ]).results).toEqual([
      { premium: 115 }, { payout: 400, remainingCap: 1600 },
      { premium: 62 }, { payout: 100, remainingCap: 1100 },
      { payout: 400, remainingCap: 1200 }, { payout: 0, remainingCap: 1100 },
    ]);
  });
  it('matches duplicate types in policy order and resets availability for each claim', () => {
    const damages = claim([{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 500 }]);
    expect(scenario([
      quote([{ type: 'sword', enchantment: 8 }, { type: 'sword' }]), damages, damages,
    ]).results.slice(1)).toEqual([
      { payout: 800, remainingCap: 3200 }, { payout: 800, remainingCap: 2400 },
    ]);
  });
  it.each([
    ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700], ['steel', 9, 1000, 400],
    ['steel', 7, 1000, 900], ['steel', 8, 901, 350],
  ])('settles %s enchantment %i damage %i with enchantment priority', (material, enchantment, amount, payout) => {
    expect(scenario([
      quote([{ type: 'sword', material, enchantment }]),
      claim([{ itemType: 'sword', amount }]),
    ]).results[1]).toEqual({ payout, remainingCap: 2000 - payout });
  });
  it('keeps fractional reimbursements until the final policy payout', () => {
    expect(scenario([
      quote([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }]),
      claim([{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }]),
    ]).results[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it.each([
    ['sword', 500, 400, 1600], ['amulet', 200, 100, 1100],
    ['staff', 500, 400, 1200], ['potion', 400, 300, 500],
    ['rune', 200, 100, 400], ['moonstone', 200, 100, 400],
    ['sword', 50, 0, 2000], ['sword', 0, 0, 2000],
  ])('reimburses ordinary %s damage %i minus its deductible', (type, amount, payout, remainingCap) => {
    expect(scenario([quote([{ type }]), claim([{ itemType: type, amount }])]).results[1])
      .toEqual({ payout, remainingCap });
  });
  it('deducts once per damaged item, not once per incident', () => {
    expect(scenario([
      quote([{ type: 'sword', material: 'dragon' }, { type: 'amulet', material: 'dragon' }]),
      claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }]),
    ]).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});
