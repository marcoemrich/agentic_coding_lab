import { describe, expect, it } from 'vitest';
import { runScenario } from './office';

const item = (type: string, extra = {}) => ({ type, ...extra });
const quote = (items: object[]) => ({ op: 'quote', items });
const run = (steps: object[], yearsWithMHPCO = 0) => runScenario({ customer: { yearsWithMHPCO }, steps });

const claim = (damages: { itemType: string; amount: number }[], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });

describe('invalid operations', () => {
  it.each(['broomstick', 'toString', '__proto__'])('rejects unknown quote type %s', type => {
    expect(() => run([quote([item(type)])])).toThrow(/unknown item/i);
  });
  it.each(['amulet', 'broomstick'])('rejects uninsured damage %s', type => {
    expect(() => run([quote([item('sword')]), claim([damage(type, 200)])])).toThrow(/not insured/i);
  });
  it('rejects negative damage', () => {
    expect(() => run([quote([item('sword')]), claim([damage('sword', -200)])])).toThrow(/amount/i);
  });
  it('rejects excess occurrences of an insured type', () => {
    expect(() => run([quote([item('sword'), item('amulet')]), claim([damage('sword', 500), damage('sword', 300)])])).toThrow(/not insured/i);
  });
  it.each([-1, 1, 99])('rejects invalid policy index %i', policy => {
    expect(() => run([quote([item('sword')]), claim([], policy)])).toThrow(/policy/i);
  });
  it('does not let exhausted caps bypass damage validation', () => {
    expect(() => run([quote([item('sword')]), claim([damage('sword', 10000)]), claim([damage('amulet', 200)])])).toThrow(/not insured/i);
  });
});

describe('policy caps', () => {
  it('exhausts the cap across successive claims', () => {
    expect(run([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)]), claim([damage('sword', 500)])])).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ] });
  });
  it.each([
    [[item('sword'), item('amulet')], 3200],
    [[item('sword', { cursed: true })], 2000],
    [[item('sword'), item('rune'), item('rune'), item('rune')], 3500],
    [[item('staff'), item('potion'), item('moonstone')], 2900],
  ])('uses unmodified insurance values %j', (items, cap) => {
    expect(run([quote(items), claim([damage(items[0].type, 10000)])]).results[1]).toEqual({ payout: cap, remainingCap: 0 });
  });
  it('indexes policies by step and keeps their caps independent', () => {
    expect(run([quote([item('sword')]), claim([damage('sword', 1500)]), quote([item('amulet')]), claim([damage('amulet', 200)], 2), claim([damage('sword', 1500)])]).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 600, remainingCap: 0 },
    ]);
  });
});

describe('claims', () => {
  it.each([
    ['sword', 'steel', 3, 500, 400, 1600],
    ['rune', undefined, undefined, 200, 100, 400],
    ['sword', 'dragon', 8, 1000, 400, 1600],
    ['sword', 'dragon', 9, 1000, 400, 1600],
    ['sword', 'dragon', 5, 800, 700, 1300],
    ['sword', 'steel', 9, 1000, 400, 1600],
    ['sword', 'steel', 8, 901, 350, 1650],
    ['sword', 'steel', 0, 50, 0, 2000],
    ['sword', 'steel', 0, 0, 0, 2000],
  ])('%s %s enchantment %s damage %i', (type, material, enchantment, amount, payout, remainingCap) => {
    expect(run([quote([item(type as string, { material, enchantment })]), claim([damage(type as string, amount as number)])]).results[1]).toEqual({ payout, remainingCap });
  });
  it('deducts once per damaged item, not per incident', () => {
    expect(run([quote([item('sword'), item('amulet')]), claim([damage('sword', 500), damage('amulet', 300)])]).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('covers two swords and applies separate deductibles', () => {
    expect(run([quote([item('sword'), item('sword')]), claim([damage('sword', 500), damage('sword', 300)])]).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it('matches repeated types in policy order and rounds only the total payout', () => {
    expect(run([quote([item('sword', { enchantment: 8 }), item('sword', { enchantment: 9 })]), claim([damage('sword', 901), damage('sword', 901)])]).results[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('allows an empty claim', () => {
    expect(run([quote([item('sword')]), claim([])]).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe('additive modifiers', () => {
  it.each([[4, false, 115], [4, true, 165], [5, false, 145], [5, true, 195]])('enchantment %i cursed %s', (enchantment, cursed, premium) => {
    expect(run([quote([item('sword', { enchantment, cursed })])])).toEqual({ results: [{ premium }] });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('loyalty at %i years', (years, premium) => {
    expect(run([quote([item('sword')])], years)).toEqual({ results: [{ premium }] });
  });
  it('applies risk only to affected items and loyalty to the base', () => {
    expect(run([quote([item('sword', { cursed: true }), item('amulet')])], 2)).toEqual({ results: [{ premium: 199 }] });
  });
  it('keeps first insurance on follow-up contracts, without compounding', () => {
    const q = quote([item('sword', { cursed: true, enchantment: 7 })]);
    expect(run([q, q, q], 3)).toEqual({ results: [{ premium: 175 }, { premium: 160 }, { premium: 160 }] });
  });
  it('rounds only the final premium up', () => {
    expect(run([quote([item('rune'), item('moonstone')])])).toEqual({ results: [{ premium: 60 }] });
  });
});

describe('component blocks', () => {
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('%i runes', (count, premium) => {
    expect(run([quote(Array.from({ length: count }, () => item('rune')))])).toEqual({ results: [{ premium }] });
  });
  it('requires the same type', () => {
    expect(run([quote([item('rune'), item('rune'), item('moonstone')])])).toEqual({ results: [{ premium: 88 }] });
  });
  it('offers separate blocks for separate types', () => {
    expect(run([quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => item(type))))])).toEqual({ results: [{ premium: 137 }] });
  });
});

describe('price list and processing fee', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('%s first insurance', (type, premium) => {
    expect(run([quote([item(type)])])).toEqual({ results: [{ premium }] });
  });
  it('charges only the fee for an empty policy', () => {
    expect(run([quote([])])).toEqual({ results: [{ premium: 5 }] });
  });
});
