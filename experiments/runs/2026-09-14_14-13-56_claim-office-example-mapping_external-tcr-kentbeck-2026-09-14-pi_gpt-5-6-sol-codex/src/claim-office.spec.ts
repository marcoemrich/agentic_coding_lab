import { describe, expect, it } from 'vitest';
import { insuranceCap, processScenario, quote, settleClaim } from './claim-office';

describe('quote', () => {
  it('charges only the processing fee for an empty policy', () => {
    expect(quote([], 0, false).premium).toBe(5);
  });

  it.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
    ['rune', 33],
    ['moonstone', 33],
  ])('uses the price list for a %s', (type, premium) => {
    expect(quote([{ type }], 0, false).premium).toBe(premium);
  });

  it('rejects unknown item types', () => {
    expect(() => quote([{ type: 'broomstick' }], 0, false)).toThrow('Unknown item type');
  });

  it.each([
    [2, 60],
    [3, 71],
    [4, 115],
    [7, 198],
  ])('prices %i alike components', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })), 0, false).premium).toBe(premium);
  });

  it('applies component blocks separately by exact type', () => {
    const items = ['rune', 'rune', 'rune', 'moonstone', 'moonstone', 'moonstone'].map(type => ({ type }));
    expect(quote(items, 0, false).premium).toEqual(137);
  });

  it('stacks item modifiers and keeps their scope to the affected item', () => {
    const items = [
      { type: 'sword', cursed: true, enchantment: 5 },
      { type: 'amulet', cursed: false, enchantment: 2 },
    ];
    expect(quote(items, 0, false).premium).toBe(261);
  });

  it('applies modifiers at their exact customer and contract thresholds', () => {
    const sword = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(quote(sword, 3, true).premium).toBe(160);
    expect(quote([{ type: 'sword', enchantment: 4 }], 2, false).premium).toBe(95);
  });
});

describe('claims', () => {
  it('applies one deductible to each damage entry', () => {
    const items = [{ type: 'sword' }, { type: 'amulet' }];
    expect(settleClaim(items, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ], insuranceCap(items))).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('halves highly enchanted damage before the deductible', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 8 }];
    expect(settleClaim(items, [{ itemType: 'sword', amount: 1000 }], insuranceCap(items)))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('fully reimburses ordinary and dragon-material items', () => {
    expect(settleClaim([{ type: 'sword', enchantment: 3 }], [
      { itemType: 'sword', amount: 500 },
    ], 2000).payout).toBe(400);
    expect(settleClaim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [
      { itemType: 'sword', amount: 800 },
    ], 2000).payout).toBe(700);
  });

  it('matches repeated damages to distinct insured items', () => {
    const swords = [{ type: 'sword' }, { type: 'sword', enchantment: 9 }];
    expect(settleClaim(swords, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 1000 },
    ], insuranceCap(swords)).payout).toBe(800);
    expect(() => settleClaim([{ type: 'sword' }], [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ], 2000)).toThrow('not covered');
  });

  it('rejects invalid damage and limits payout to remaining policy cap', () => {
    expect(() => settleClaim([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }], 2000))
      .toThrow('not covered');
    expect(() => settleClaim([{ type: 'sword' }], [{ itemType: 'sword', amount: -1 }], 2000))
      .toThrow('negative');
    expect(settleClaim([{ type: 'sword' }], [{ itemType: 'sword', amount: 1500 }], 600))
      .toEqual({ payout: 600, remainingCap: 0 });
  });

  it('bases the cap on unmodified insurance values', () => {
    expect(insuranceCap([{ type: 'sword', cursed: true }, ...Array(3).fill({ type: 'rune' })])).toBe(3500);
  });

  it('rounds the final payout down while retaining fractional intermediates', () => {
    expect(settleClaim([{ type: 'sword', enchantment: 8 }], [
      { itemType: 'sword', amount: 901 },
    ], 2000).payout).toBe(350);
  });

  it('handles components as ordinary damageable insured items', () => {
    expect(settleClaim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }], 500))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe('scenario processing', () => {
  it('tracks follow-up contracts and cap exhaustion across steps', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        { op: 'claim', policy: 1, incident: {
          cause: 'duel', damages: [{ itemType: 'sword', amount: 1500 }],
        } },
        { op: 'claim', policy: 1, incident: {
          cause: 'duel again', damages: [{ itemType: 'sword', amount: 1500 }],
        } },
      ],
    })).toEqual({ results: [
      { premium: 59 },
      { premium: 160 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });

  it('rejects claims that do not refer to an earlier quote', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
    })).toThrow('policy');
  });
});
