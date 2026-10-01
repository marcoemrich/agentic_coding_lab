import { describe, it, expect } from 'vitest';
import { runScenario, type Item } from './claimOffice';

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });

  it('charges base premium plus first insurance surcharge plus fee for a plain sword', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3 }])).toEqual({ premium: 115 });
  });

  describe('components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

    it('charges 25 G base premium per rune below a block (2 runes: 50 base + 5 first + 5 fee)', () => {
      expect(quote(runes(2))).toEqual({ premium: 60 });
    });

    it('charges 60 G base premium for a block of exactly 3 runes (60 base + 6 first + 5 fee)', () => {
      expect(quote(runes(3))).toEqual({ premium: 71 });
    });

    it('applies no block to 4 runes (100 base + 10 first + 5 fee)', () => {
      expect(quote(runes(4))).toEqual({ premium: 115 });
    });

    it('applies no block to 7 runes and rounds 197.5 up (175 base + 17.5 first + 5 fee)', () => {
      expect(quote(runes(7))).toEqual({ premium: 198 });
    });

    it('does not form a block from different component types (2 runes + 1 moonstone: 75 base)', () => {
      expect(quote([...runes(2), { type: 'moonstone' }])).toEqual({ premium: 88 });
    });

    it('forms separate blocks per component type (3 runes + 3 moonstones: 120 base)', () => {
      const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
      expect(quote([...runes(3), ...moonstones])).toEqual({ premium: 137 });
    });
  });

  describe('modifiers', () => {
    it('newcomer with a cursed sword pays 165 G (100 base + 50 curse + 10 first + 5 fee)', () => {
      expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
    });

    it('applies the high-enchantment surcharge at exactly enchantment 5 (100 + 30 + 10 first + 5 fee)', () => {
      expect(quote([{ type: 'sword', enchantment: 5 }])).toEqual({ premium: 145 });
    });

    it('applies both surcharges to a cursed sword with enchantment 5 (100 + 50 + 30 + 10 first + 5 fee)', () => {
      expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    });

    it('applies no high-enchantment surcharge at enchantment 4', () => {
      expect(quote([{ type: 'sword', enchantment: 4 }])).toEqual({ premium: 115 });
    });

    it('applies only the curse surcharge to a cursed sword with enchantment 4', () => {
      expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
    });

    it('applies the curse surcharge to the cursed item only (160 base + 50 curse + 16 first + 5 fee)', () => {
      expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
    });

    it('grants the loyalty discount at exactly 2 years with MHPCO (100 - 20 loyalty + 10 first + 5 fee)', () => {
      expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 });
    });

    it("long-standing customer's second contract pays 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: 'quote', items: [{ type: 'amulet' }] },
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  it('rejects an item with an unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/unknown item type: broomstick/i);
  });

  it('rejects an item type that merely matches an inherited object key', () => {
    expect(() => quote([{ type: 'constructor' }])).toThrow(/unknown item type: constructor/i);
  });
});

const claim = (items: Item[], ...damageSets: { itemType: string; amount: number }[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      ...damageSets.map((damages) => ({
        op: 'claim' as const,
        policy: 0,
        incident: { cause: 'dragon attack', damages },
      })),
    ],
  }).results.slice(1) as { payout: number; remainingCap: number }[];

describe('claim', () => {
  it('reimburses a regular sword fully minus the 100 G deductible', () => {
    const [result] = claim(
      [{ type: 'sword', material: 'steel', enchantment: 3 }],
      [{ itemType: 'sword', amount: 500 }],
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses 50 % for enchantment >= 8 before the deductible (steel, ench 9, 1000 -> 400)', () => {
    const [result] = claim(
      [{ type: 'sword', material: 'steel', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('applies the 50 % clause to dragon material at exactly enchantment 8 (1000 -> 400)', () => {
    const [result] = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 8 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });

  it('lets the 50 % clause win over dragon material (ench 9, 1000 -> 400)', () => {
    const [result] = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });

  it('reimburses dragon material fully below enchantment 8 (ench 5, 800 -> 700)', () => {
    const [result] = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 5 }],
      [{ itemType: 'sword', amount: 800 }],
    );
    expect(result.payout).toBe(700);
  });

  it('reimburses a rune fully minus the deductible (200 -> 100)', () => {
    const [result] = claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('applies the deductible once per damaged item (sword 500 + amulet 300 -> 600)', () => {
    const [result] = claim(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('reduces a later claim to the remaining cap (2 x 1500 on a sword -> 1400, then 600)', () => {
    const results = claim(
      [{ type: 'sword' }],
      [{ itemType: 'sword', amount: 1500 }],
      [{ itemType: 'sword', amount: 1500 }],
    );
    expect(results).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('bases the cap on the unmodified insurance value of a cursed sword (cap 2000)', () => {
    const [result] = claim([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 100 }]);
    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('counts each block component at full insurance value (sword + 3 runes: cap 3500)', () => {
    const [result] = claim(
      [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
      [{ itemType: 'rune', amount: 200 }],
    );
    expect(result).toEqual({ payout: 100, remainingCap: 3400 });
  });

  it('treats each damage to two insured swords separately (cap 4000)', () => {
    const [result] = claim(
      [{ type: 'sword' }, { type: 'sword' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it('rounds a fractional payout down (ench 9, 901 -> 350.5 -> 350)', () => {
    const [result] = claim([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }]);
    expect(result.payout).toBe(350);
  });

  it('matches damage entries to distinct insured items of the same type in order', () => {
    const [result] = claim(
      [
        { type: 'sword', enchantment: 9 },
        { type: 'sword', enchantment: 3 },
      ],
      [
        { itemType: 'sword', amount: 1000 },
        { itemType: 'sword', amount: 1000 },
      ],
    );
    expect(result.payout).toBe(1300);
  });

  it('rejects a claim with more damages of a type than the policy covers', () => {
    expect(() =>
      claim(
        [{ type: 'sword' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ],
      ),
    ).toThrow(/not covered by policy/i);
  });

  it('rejects damage to an item that is not part of the policy', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }])).toThrow(
      /not covered by policy/i,
    );
  });

  it('rejects damage to an item with an unknown type', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 200 }])).toThrow(
      /not covered by policy/i,
    );
  });

  it('rejects a negative damage amount', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(
      /invalid damage amount: -200/i,
    );
  });

  it('rejects a claim that references a step which is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } },
        ],
      }),
    ).toThrow(/unknown policy: 3/i);
  });
});
