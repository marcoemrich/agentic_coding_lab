import { describe, it, expect } from 'vitest';
import { runScenario } from './claimOffice';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const quotePremium = (items: Item[], yearsWithMHPCO = 0): number => {
  const out = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] });
  return (out.results[0] as { premium: number }).premium;
};

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([])).toBe(5);
  });

  it('newcomer with a cursed steel sword pays 165 G', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });

  it.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('prices a plain %s for a newcomer at %i G (base + 10%% first insurance + fee)', (type, premium) => {
    expect(quotePremium([{ type }])).toBe(premium);
  });

  describe('components and building blocks', () => {
    const runes = (n: number): Item[] => Array.from({ length: n }, () => ({ type: 'rune' }));

    it.each([
      [2, 60], // base 50
      [3, 71], // base 60 (block)
      [4, 115], // base 100 (no block)
      [7, 198], // base 175 -> 197.5 rounded up
    ])('%i runes cost %i G for a newcomer', (n, premium) => {
      expect(quotePremium(runes(n))).toBe(premium);
    });

    it('does not form a block from different component types (2 runes + 1 moonstone, base 75)', () => {
      expect(quotePremium([...runes(2), { type: 'moonstone' }])).toBe(88);
    });

    it('forms separate blocks per component type (3 runes + 3 moonstones, base 120)', () => {
      const moonstones: Item[] = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
      expect(quotePremium([...runes(3), ...moonstones])).toBe(137);
    });
  });

  it('applies the curse surcharge only to the cursed item, policy modifiers to the policy base', () => {
    // 100 + 60 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  describe('high enchantment threshold', () => {
    it('adds 30% for a sword with exactly enchantment 5', () => {
      // 100 + 30 + 10 + 5
      expect(quotePremium([{ type: 'sword', enchantment: 5 }])).toBe(145);
    });

    it('applies both surcharges to a cursed sword with enchantment 5', () => {
      // 100 + 50 + 30 + 10 + 5
      expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
    });

    it('adds no high-enchantment surcharge at enchantment 4', () => {
      expect(quotePremium([{ type: 'sword', enchantment: 4 }])).toBe(115);
      expect(quotePremium([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
    });
  });

  it('gives a 20% loyalty discount to a customer with exactly 2 years', () => {
    // 100 - 20 loyalty + 10 first insurance + 5
    expect(quotePremium([{ type: 'sword' }], 2)).toBe(95);
  });

  it('gives no loyalty discount below 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], 1)).toBe(115);
  });

  it("gives a 15% follow-up discount on the customer's second contract", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});

type Damage = { itemType: string; amount: number };

const claimAgainst = (items: Item[], ...claims: Damage[][]) => {
  const out = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      ...claims.map((damages) => ({ op: 'claim' as const, policy: 0, incident: { cause: 'dragon attack', damages } })),
    ],
  });
  return out.results.slice(1);
};

describe('claim', () => {
  it('reimburses a regular sword in full minus the 100 G deductible', () => {
    const [result] = claimAgainst(
      [{ type: 'sword', material: 'steel', enchantment: 3 }],
      [{ itemType: 'sword', amount: 500 }],
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  describe('special clauses', () => {
    const payoutFor = (item: Item, amount: number) =>
      (claimAgainst([item], [{ itemType: item.type, amount }])[0] as { payout: number }).payout;

    it('reimburses 50% for a steel sword with enchantment 9, then the deductible', () => {
      expect(payoutFor({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
    });

    it('lets the 50% rule win over dragon material (enchantment 9)', () => {
      expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
    });

    it('applies the 50% rule at exactly enchantment 8 for dragon material', () => {
      expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
    });

    it('fully reimburses dragon material below enchantment 8', () => {
      expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
    });

    it('reimburses a rune in full minus the deductible', () => {
      expect(payoutFor({ type: 'rune' }, 200)).toBe(100);
    });
  });

  it('applies the deductible once per damaged item', () => {
    const [result] = claimAgainst(
      [{ type: 'sword' }, { type: 'amulet' }],
      [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('treats each damage to two insured swords separately (cap 4000)', () => {
    const [result] = claimAgainst(
      [{ type: 'sword' }, { type: 'sword' }],
      [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }],
    );
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });

  describe('cap', () => {
    it('bases the cap on unmodified insurance values of a cursed sword (2000)', () => {
      const [result] = claimAgainst([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 1900 });
    });

    it('counts block components at full insurance value (sword + 3 runes: cap 3500)', () => {
      const runes: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
      const [result] = claimAgainst([{ type: 'sword' }, ...runes], [{ itemType: 'rune', amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 3400 });
    });

    it('limits successive claims to the remaining cap', () => {
      const results = claimAgainst(
        [{ type: 'sword' }],
        [{ itemType: 'sword', amount: 1500 }],
        [{ itemType: 'sword', amount: 1500 }],
      );
      expect(results).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  it('rounds a fractional payout down', () => {
    // 50% of 901 = 450.5, minus 100 deductible = 350.5 -> 350
    const [result] = claimAgainst([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('invalid scenarios', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });

  it('rejects a claim for an item not on the policy', () => {
    expect(() => claimAgainst([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }])).toThrow(/amulet/);
  });

  it('rejects a claim with more damages of a type than the policy covers', () => {
    expect(() =>
      claimAgainst([{ type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }]),
    ).toThrow();
  });

  it('rejects a claim for an unknown item type', () => {
    expect(() => claimAgainst([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects a claim with a negative damage amount', () => {
    expect(() => claimAgainst([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(/-200/);
  });

  it('rejects a claim referencing a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(/policy/i);
  });
});
