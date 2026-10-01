import { type Item, policyBasePremium, runScenario } from './claimOffice';

const newcomer = { yearsWithMHPCO: 0 };

function quotePremium(items: Item[], customer = newcomer): number {
  const { results } = runScenario({ customer, steps: [{ op: 'quote', items }] });
  return (results[0] as { premium: number }).premium;
}

describe('quote', () => {
  test('empty item list costs only the 5 G processing fee', () => {
    expect(quotePremium([])).toBe(5);
  });

  test.each([
    ['sword', 115], // 100 + 10 first insurance + 5 fee
    ['amulet', 71], // 60 + 6 + 5
    ['staff', 93], // 80 + 8 + 5
    ['potion', 49], // 40 + 4 + 5
  ])('a plain %s for a newcomer costs %i G', (type, premium) => {
    expect(quotePremium([{ type }])).toBe(premium);
  });

  test('newcomer with a cursed steel sword (enchantment 3) pays 165 G', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([cursedSword])).toBe(165);
  });

  test('curse surcharge applies to the cursed item only, not the whole policy', () => {
    // 160 base + 50 curse (of sword's 100) + 16 first insurance (of 160) + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  test.each([
    [4, false, 115], // 100 + 10 + 5
    [4, true, 165], // 100 + 50 curse + 10 + 5
    [5, false, 145], // 100 + 30 high enchantment + 10 + 5
    [5, true, 195], // 100 + 50 + 30 + 10 + 5
  ])('sword with enchantment %i (cursed: %s) costs %i G', (enchantment, cursed, premium) => {
    expect(quotePremium([{ type: 'sword', enchantment, cursed }])).toBe(premium);
  });

  test.each([
    [1, 115], // 100 + 10 + 5
    [2, 95], // 100 - 20 loyalty + 10 + 5
  ])('customer with %i years pays %i G for a plain sword', (yearsWithMHPCO, premium) => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO })).toBe(premium);
  });

  test('a premium of 197.5 G is rounded up to 198 G', () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
    expect(quotePremium(runes(7))).toBe(198);
  });

  test("long-standing customer's second contract for a cursed sword (enchantment 7) costs 160 G", () => {
    // 100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
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

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));
const moonstones = (n: number) => Array.from({ length: n }, () => ({ type: 'moonstone' }));

describe('component base premium', () => {
  test.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes have a base premium of %i G', (count, premium) => {
    expect(policyBasePremium(runes(count))).toBe(premium);
  });

  test('2 runes and 1 moonstone form no block (different types)', () => {
    expect(policyBasePremium([...runes(2), ...moonstones(1)])).toBe(75);
  });

  test('3 runes and 3 moonstones form two separate blocks', () => {
    expect(policyBasePremium([...runes(3), ...moonstones(3)])).toBe(120);
  });
});

type Damage = { itemType: string; amount: number };

function claimAgainst(items: Item[], ...claims: Damage[][]) {
  const { results } = runScenario({
    customer: newcomer,
    steps: [
      { op: 'quote', items },
      ...claims.map((damages) => ({
        op: 'claim' as const,
        policy: 0,
        incident: { cause: 'dragon attack', damages },
      })),
    ],
  });
  return results.slice(1);
}

describe('claim', () => {
  test('regular steel sword (enchantment 3) with 500 G damage pays 400 G', () => {
    const [result] = claimAgainst([{ type: 'sword', material: 'steel', enchantment: 3 }], [
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('rune with 200 G damage pays 100 G (no special clause for components)', () => {
    const [result] = claimAgainst([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  test('the 100 G deductible applies once per damaged item', () => {
    // sword + amulet: cap 2 × 1600 = 3200; (500 - 100) + (300 - 100) = 600
    const [result] = claimAgainst([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  test.each([
    ['dragon', 8, 1000, 400], // 50 % clause, then deductible
    ['dragon', 9, 1000, 400], // 50 % rule wins over dragon material
    ['dragon', 5, 800, 700], // only dragon clause: full reimbursement
    ['steel', 9, 1000, 400], // only 50 % clause
  ])('%s sword with enchantment %i and %i G damage pays %i G', (material, enchantment, amount, payout) => {
    const [result] = claimAgainst([{ type: 'sword', material, enchantment }], [
      { itemType: 'sword', amount },
    ]);
    expect(result).toMatchObject({ payout });
  });

  test('a payout of 350.5 G is rounded down to 350 G', () => {
    // enchantment 9: 901 / 2 = 450.5, minus 100 deductible = 350.5
    const [result] = claimAgainst([{ type: 'sword', enchantment: 9 }], [
      { itemType: 'sword', amount: 901 },
    ]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  test('successive claims exhaust the cap of twice the insurance sum', () => {
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

  test.each([
    ['a cursed sword', 2000, [{ type: 'sword', cursed: true }]],
    ['a sword and 3 runes (block)', 3500, [{ type: 'sword' }, ...runes(3)]],
    ['two swords', 4000, [{ type: 'sword' }, { type: 'sword' }]],
  ])('cap for %s is %i G', (_label, cap, items) => {
    const [result] = claimAgainst(items, [{ itemType: 'sword', amount: 100 }]);
    expect(result).toEqual({ payout: 0, remainingCap: cap });
  });

  test('two sword damages are treated as separate damages to the two insured swords', () => {
    // (1000 / 2 - 100) + (1000 - 100) = 1300
    const [result] = claimAgainst([{ type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 1 }], [
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]);
    expect(result).toEqual({ payout: 1300, remainingCap: 2700 });
  });
});

describe('invalid scenarios', () => {
  test('quote with an unknown item type is rejected', () => {
    expect(() => quotePremium([{ type: 'broomstick' }])).toThrow(/unknown item type.*broomstick/i);
  });

  test('item type named like an object property is still unknown', () => {
    expect(() => quotePremium([{ type: 'constructor' }])).toThrow(/unknown item type/i);
  });

  test.each([
    ['an amulet when only a sword is insured', [{ itemType: 'amulet', amount: 200 }]],
    ['an unknown item type', [{ itemType: 'broomstick', amount: 200 }]],
    [
      'two sword damages when only one sword is insured',
      [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ],
    ],
  ])('claim for %s is rejected', (_label, damages) => {
    expect(() => claimAgainst([{ type: 'sword' }], damages)).toThrow(/not covered/i);
  });

  test('claim with a negative damage amount is rejected', () => {
    expect(() => claimAgainst([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(
      /negative/i,
    );
  });

  test('claim referencing a step that is not a quote is rejected', () => {
    expect(() =>
      runScenario({
        customer: newcomer,
        steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(/unknown policy/i);
  });
});
