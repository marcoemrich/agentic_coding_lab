import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
function quote(items: Item[]) { return { op: 'quote', items }; }
function claim(policy: number, damages: Damage[]) { return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } }; }
function items(type: string, count: number): Item[] { return Array.from({ length: count }, () => ({ type })); }
function cli(steps: unknown[], yearsWithMHPCO = 0) {
  const result = spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
  return { status: result.status, stderr: result.stderr, stdout: result.stdout,
    output: result.status === 0 ? JSON.parse(result.stdout) as { results: Record<string, number>[] } : undefined };
}
function expectResults(steps: unknown[], results: Record<string, number>[], years = 0) {
  const actual = cli(steps, years);
  expect(actual.status, actual.stderr).toBe(0);
  expect(actual.output).toEqual({ results });
}
function expectQuote(itemsToInsure: Item[], premium: number, years = 0) {
  expectResults([quote(itemsToInsure)], [{ premium }], years);
}
function expectRejection(steps: unknown[]) {
  const result = cli(steps);
  expect(result.status).not.toBe(0);
  expect(result.stderr.length).toBeGreaterThan(0);
  expect(result.stdout).not.toContain('results');
}

describe('MHPCO claim-office CLI', () => {
  it('empty quote returns 5 G fee and one result', () => expectQuote([], 5));
  it('plain sword: 100 + 10 + 5 = 115 G', () => expectQuote(items('sword', 1), 115));
  it('plain amulet: 60 + 6 + 5 = 71 G', () => expectQuote(items('amulet', 1), 71));
  it('plain staff: 80 + 8 + 5 = 93 G', () => expectQuote(items('staff', 1), 93));
  it('plain potion: 40 + 4 + 5 = 49 G', () => expectQuote(items('potion', 1), 49));
  it('rune: 25 + 2.5 + 5 rounds to 33 G; insurance value 250 G', () => {
    expectResults([quote(items('rune', 1)), claim(0, [{ itemType: 'rune', amount: 1000 }])],
      [{ premium: 33 }, { payout: 500, remainingCap: 0 }]);
  });
  it('moonstone: 25 + 2.5 + 5 rounds to 33 G; insurance value 250 G', () => {
    expectResults([quote(items('moonstone', 1)), claim(0, [{ itemType: 'moonstone', amount: 1000 }])],
      [{ premium: 33 }, { payout: 500, remainingCap: 0 }]);
  });
  it('2 runes: 50 G base, 60 G quote', () => expectQuote(items('rune', 2), 60));
  it('3 runes: 60 G block base, 71 G quote', () => expectQuote(items('rune', 3), 71));
  it('4 runes: 100 G base without block, 115 G quote', () => expectQuote(items('rune', 4), 115));
  it('7 runes: 175 G base, fractional 197.5 rounds to 198 G', () => expectQuote(items('rune', 7), 198));
  it('2 runes and 1 moonstone: 75 G base, no mixed block, quote 88 G', () => expectQuote([...items('rune', 2), ...items('moonstone', 1)], 88));
  it('3 runes and 3 moonstones: two blocks, 120 G base, quote 137 G', () => expectQuote([...items('rune', 3), ...items('moonstone', 3)], 137));
  it('cursed sword and plain amulet: 160 base + 50 curse + 16 first + 5 = 231 G', () => expectQuote([{ type: 'sword', cursed: true }, { type: 'amulet' }], 231));
  it('enchantment 4 plain sword: no enchantment surcharge, 115 G', () => expectQuote([{ type: 'sword', enchantment: 4 }], 115));
  it('enchantment 4 cursed sword: curse only, 165 G', () => expectQuote([{ type: 'sword', enchantment: 4, cursed: true }], 165));
  it('enchantment 5 sword: 30 G surcharge, 145 G', () => expectQuote([{ type: 'sword', enchantment: 5 }], 145));
  it('enchantment 5 cursed sword: both surcharges, 195 G', () => expectQuote([{ type: 'sword', enchantment: 5, cursed: true }], 195));
  it('exactly 2 years loyalty: sword premium 95 G', () => expectQuote(items('sword', 1), 95, 2));
  it('under 2 years: sword premium 115 G', () => expectQuote(items('sword', 1), 115, 1));
  it('newcomer cursed steel sword enchantment 3: premium 165 G', () => expectQuote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], 165));
  it('3-year customer second contract new cursed sword enchantment 7: 160 G', () => {
    expectResults([quote([]), quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }])], [{ premium: 5 }, { premium: 160 }], 3);
  });
  it('fractional premium 197.5 rounds up to 198 G only at end', () => expectQuote(items('rune', 7), 198));
  it('schema example: amulet quote and fire claim emit integer premium 59, payout 100 and remaining cap 1100', () => {
    expectResults([quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]),
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }],
    [{ premium: 59 }, { payout: 100, remainingCap: 1100 }], 5);
  });
  it('regular steel sword enchantment 3 damage 500 G pays 400 G', () => {
    expectResults([quote([{ type: 'sword', material: 'steel', enchantment: 3 }]), claim(0, [{ itemType: 'sword', amount: 500 }])], [{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('rune damage 200 G pays 100 G without special clause', () => {
    expectResults([quote(items('rune', 1)), claim(0, [{ itemType: 'rune', amount: 200 }])], [{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it('dragon sword enchantment 5 damage 800 G pays 700 G', () => {
    expectResults([quote([{ type: 'sword', material: 'dragon', enchantment: 5 }]), claim(0, [{ itemType: 'sword', amount: 800 }])], [{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it('steel sword enchantment 9 damage 1000 G pays 400 G', () => {
    expectResults([quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])], [{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('dragon sword exactly enchantment 8 damage 1000 G pays 400 G', () => {
    expectResults([quote([{ type: 'sword', material: 'dragon', enchantment: 8 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])], [{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('dragon sword enchantment 9 damage 1000 G pays 400 G: 50% wins', () => {
    expectResults([quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])], [{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('dragon attack sword 500 G and amulet 300 G pays 600 G, deductible twice', () => {
    expectResults([quote([{ type: 'sword', material: 'dragon' }, { type: 'amulet', material: 'dragon' }]), claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])], [{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
  it('amulet insurance value 600 G gives cap 1200 G', () => {
    expectResults([quote(items('amulet', 1)), claim(0, [{ itemType: 'amulet', amount: 5000 }])], [{ premium: 71 }, { payout: 1200, remainingCap: 0 }]);
  });
  it('staff insurance value 800 G gives cap 1600 G', () => {
    expectResults([quote(items('staff', 1)), claim(0, [{ itemType: 'staff', amount: 5000 }])], [{ premium: 93 }, { payout: 1600, remainingCap: 0 }]);
  });
  it('potion insurance value 400 G gives cap 800 G', () => {
    expectResults([quote(items('potion', 1)), claim(0, [{ itemType: 'potion', amount: 5000 }])], [{ premium: 49 }, { payout: 800, remainingCap: 0 }]);
  });
  it('two swords insurance sum 2000 G has cap 4000 G', () => {
    expectResults([quote(items('sword', 2)), claim(0, [{ itemType: 'sword', amount: 5000 }])], [{ premium: 225 }, { payout: 4000, remainingCap: 0 }]);
  });
  it('two insured swords damaged in two entries each receive deductible', () => {
    expectResults([quote(items('sword', 2)), claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])], [{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
  });
  it('sword and amulet insurance sum 1600 G gives cap 3200 G', () => {
    expectResults([quote([{ type: 'sword' }, { type: 'amulet' }]), claim(0, [{ itemType: 'sword', amount: 5000 }])], [{ premium: 181 }, { payout: 3200, remainingCap: 0 }]);
  });
  it('cursed sword premium 165 G still has cap 2000 G', () => {
    expectResults([quote([{ type: 'sword', cursed: true }]), claim(0, [{ itemType: 'sword', amount: 5000 }])], [{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
  });
  it('sword and 3 runes: 1750 G insurance sum gives cap 3500 G', () => {
    expectResults([quote([...items('sword', 1), ...items('rune', 3)]), claim(0, [{ itemType: 'sword', amount: 5000 }])], [{ premium: 181 }, { payout: 3500, remainingCap: 0 }]);
  });
  it('successive sword claims 1500 G pay 1400 then 600 G, remaining 600 then 0 G', () => {
    expectResults([quote(items('sword', 1)), claim(0, [{ itemType: 'sword', amount: 1500 }]), claim(0, [{ itemType: 'sword', amount: 1500 }])], [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('fractional payout 350.5 G rounds down to 350 G only at end', () => {
    expectResults([quote([{ type: 'sword', enchantment: 9 }]), claim(0, [{ itemType: 'sword', amount: 901 }])], [{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });
  it('unknown quote broomstick exits nonzero with stderr and no results stdout', () => expectRejection([quote(items('broomstick', 1))]));
  it('uninsured amulet claim exits nonzero with stderr', () => expectRejection([quote(items('sword', 1)), claim(0, [{ itemType: 'amulet', amount: 200 }])]));
  it('unknown damage type exits nonzero with stderr', () => expectRejection([quote(items('sword', 1)), claim(0, [{ itemType: 'broomstick', amount: 200 }])]));
  it('two sword damages with only one sword insured reject entire claim', () => expectRejection([quote(items('sword', 1)), claim(0, [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }])]));
  it('negative damage -200 exits nonzero with stderr', () => expectRejection([quote(items('sword', 1)), claim(0, [{ itemType: 'sword', amount: -200 }])]));
});
