import { describe, expect, it } from 'vitest';
import { runScenario, type Item, type Damage } from './office';

const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
const items = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));

const claim = (insured: Item[], damages: Damage[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
  { op: 'quote', items: insured }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
] }).results[1];

describe('invalid operations', () => {
  it.each(['broomstick', 'toString', '__proto__'])('rejects unknown type %s', type => expect(() => quote([{ type }])).toThrow(/type/i));
  it.each(['amulet', 'broomstick'])('rejects uninsured %s', itemType => expect(() => claim(items('sword', 1), [{ itemType, amount: 200 }])).toThrow(/insured/i));
  it('rejects excess duplicate damages', () => expect(() => claim(items('sword', 1), [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }])).toThrow(/insured/i));
  it('rejects negative damage', () => expect(() => claim(items('sword', 1), [{ itemType: 'sword', amount: -200 }])).toThrow(/amount/i));
  it.each([-1, 0, 1])('rejects unavailable policy %i', policy => expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'claim', policy, incident: { cause: 'fire', damages: [] } }] })).toThrow(/policy/i));
});

describe('policy caps', () => {
  it('exhausts the cap across successive claims', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: items('sword', 1) },
      ...Array.from({ length: 3 }, () => ({ op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } })),
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it('does not raise cap for cursed premiums', () => expect(claim([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 9999 }])).toEqual({ payout: 2000, remainingCap: 0 }));
  it('does not reduce insurance value for blocks', () => expect(claim([...items('sword', 1), ...items('rune', 3)], [])).toEqual({ payout: 0, remainingCap: 3500 }));
  it.each([['amulet', 1200], ['staff', 1600], ['potion', 800], ['moonstone', 500]])('uses %s insurance value', (type, remainingCap) => expect(claim([{ type }], [])).toEqual({ payout: 0, remainingCap }));
  it('uses quote step indices, keeping policy caps independent', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: items('sword', 1) },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 2100 }] } },
      { op: 'quote', items: items('amulet', 1) },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] }).results).toEqual([{ premium: 115 }, { payout: 2000, remainingCap: 0 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }]);
  });
});

describe('claim reimbursement', () => {
  it.each([
    ['steel', 3, 500, 400], ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700], ['steel', 9, 1000, 400], ['steel', 8, 901, 350],
    ['steel', 7, 500, 400], ['steel', 0, 50, 0], ['steel', 9, 100, 0], ['steel', 0, 0, 0],
  ])('%s enchantment %i damage %i', (material, enchantment, amount, payout) => {
    expect(claim([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }])).toEqual({ payout, remainingCap: 2000 - payout });
  });
  it('reimburses components normally', () => expect(claim(items('rune', 1), [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }));
  it('deducts once per damaged item', () => expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }));
  it('handles duplicate swords independently', () => expect(claim(items('sword', 2), [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])).toEqual({ payout: 600, remainingCap: 3400 }));
  it('matches duplicate damages to insured items in order', () => expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])).toEqual({ payout: 350, remainingCap: 3650 }));
  it('keeps fractions until the final payout', () => expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }])).toEqual({ payout: 701, remainingCap: 2499 }));
  it('allows an empty damage report', () => expect(claim(items('sword', 1), [])).toEqual({ payout: 0, remainingCap: 2000 }));
});

describe('modifiers', () => {
  it.each([[false, 4, 115], [true, 4, 165], [false, 5, 145], [true, 5, 195]])('curse %s enchantment %i', (cursed, enchantment, premium) => {
    expect(quote([{ type: 'sword', cursed, enchantment }])).toEqual({ premium });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('loyalty at %i years', (years, premium) => expect(quote(items('sword', 1), years)).toEqual({ premium }));
  it('scopes risk to the affected item', () => expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 }));
  it('adds policy discounts on base, retaining first insurance on subsequent quotes', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([{ premium: 5 }, { premium: 160 }, { premium: 80 }]);
  });
  it('rounds only the final premium', () => expect(quote([{ type: 'rune', cursed: true }, { type: 'moonstone', cursed: true }])).toEqual({ premium: 85 }));
  it('applies risk to discounted component bases', () => expect(quote(items('rune', 3).map(item => ({ ...item, cursed: true })))).toEqual({ premium: 101 }));
});

describe('component blocks', () => {
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices %i runes', (count, premium) => {
    expect(quote(items('rune', count))).toEqual({ premium });
  });
  it('does not mix types', () => expect(quote([...items('rune', 2), ...items('moonstone', 1)])).toEqual({ premium: 88 }));
  it('discounts separate exact blocks', () => expect(quote([...items('rune', 3), ...items('moonstone', 3)])).toEqual({ premium: 137 }));
});

describe('base premiums and first insurance', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('prices %s', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it('charges only the fee for an empty policy', () => expect(quote([])).toEqual({ premium: 5 }));
});
