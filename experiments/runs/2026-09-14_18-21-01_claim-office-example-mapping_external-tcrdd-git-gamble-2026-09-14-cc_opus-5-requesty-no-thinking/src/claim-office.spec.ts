import { describe, it, expect } from 'vitest';
import {
  runScenario,
  type Item,
  type Scenario,
  type StepResult,
} from './scenario.js';

const premiumOfFirstStep = (scenario: Scenario): number => {
  const result = runScenario(scenario).results[0] as StepResult & {
    premium: number;
  };
  return result.premium;
};

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it('charges the base premium of a sword plus the fee', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });

    expect(result.results[0]).toEqual({ premium: 115 });
  });

  it('knows the base premium of every main item type', () => {
    const premiumOf = (type: string) =>
      premiumOfFirstStep({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type }] }],
      });

    expect(premiumOf('amulet')).toBe(71);
    expect(premiumOf('staff')).toBe(93);
    expect(premiumOf('potion')).toBe(49);
  });

  it('charges 25 G per component', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] }],
    });

    expect(result.results[0]).toEqual({ premium: 60 });
  });

  it('offers a block price for exactly 3 alike components', () => {
    const runes = (count: number) =>
      premiumOfFirstStep({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: Array.from({ length: count }, () => ({ type: 'rune' })) },
        ],
      });

    expect(runes(3)).toBe(71);
    expect(runes(4)).toBe(115);
    expect(runes(7)).toBe(198);
  });

  it('adds a 50 % curse surcharge on the cursed item only', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 231 });
  });

  it('adds a 30 % surcharge from enchantment level 5 upwards', () => {
    const premiumForSword = (item: Item) =>
      premiumOfFirstStep({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [item] }],
      });

    expect(premiumForSword({ type: 'sword', enchantment: 4 })).toBe(115);
    expect(premiumForSword({ type: 'sword', enchantment: 5 })).toBe(145);
    expect(premiumForSword({ type: 'sword', enchantment: 5, cursed: true })).toBe(195);
  });

  it('grants a 20 % loyalty discount from 2 years of business', () => {
    const premiumForYears = (yearsWithMHPCO: number) =>
      premiumOfFirstStep({
        customer: { yearsWithMHPCO },
        steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
      });

    expect(premiumForYears(1)).toBe(115);
    expect(premiumForYears(2)).toBe(95);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: Array.from({ length: 7 }, () => ({ type: 'rune' })) },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 198 });
  });

  it('adds a 10 % initial assessment surcharge to every quote', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }],
    });

    expect(result.results[0]).toEqual({ premium: 165 });
  });

  it('discounts every contract after the first by 15 %', () => {
    const cursedSword: Item = { type: 'sword', cursed: true, enchantment: 7 };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe('claim', () => {
  it('reimburses the damage minus a 100 G deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3 }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses damage to highly enchanted items at 50 %', () => {
    const payoutForSword = (item: Item, amount: number) =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [item] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount }] },
          },
        ],
      }).results[1];

    expect(
      payoutForSword({ type: 'sword', material: 'steel', enchantment: 9 }, 1000),
    ).toEqual({ payout: 400, remainingCap: 1600 });
    expect(
      payoutForSword({ type: 'sword', material: 'steel', enchantment: 7 }, 1000),
    ).toEqual({ payout: 900, remainingCap: 1100 });
  });
});

describe('rejected scenarios', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  it('rejects a claim for an item the policy does not cover', () => {
    const claimAgainstOneSword = (damages: { itemType: string; amount: number }[]) =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages } },
        ],
      });

    expect(() => claimAgainstOneSword([{ itemType: 'amulet', amount: 200 }])).toThrow(
      /amulet/,
    );
    expect(() =>
      claimAgainstOneSword([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow(/sword/);
  });

  it('rejects a claim with a negative damage amount', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/negative/);
  });
});
