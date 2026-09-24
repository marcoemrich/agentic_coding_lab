import { spawnSync } from 'node:child_process';
import { expect } from 'vitest';

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
const item = (type: string, props: Omit<Item, 'type'> = {}): Item => ({ type, ...props });
const copies = (type: string, count: number): Item[] => Array.from({ length: count }, () => item(type));
const quote = (items: Item[]): Step => ({ op: 'quote', items });
const claim = (damages: { itemType: string; amount: number }[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const sword = item('sword');
const cursed = item('sword', { cursed: true, enchantment: 3, material: 'steel' });
const dragon = (enchantment: number) => item('sword', { material: 'dragon', enchantment });
type Example = { years?: number; steps: Step[]; results?: object[]; invalid?: boolean };
const q = (items: Item[], premium: number, years = 0): Example => ({ years, steps: [quote(items)], results: [{ premium }] });
const c = (items: Item[], damages: ReturnType<typeof damage>[], payout: number, remainingCap: number): Example => ({ steps: [quote(items), claim(damages)], results: [{ premium: 0 }, { payout, remainingCap }] });
const bad = (steps: Step[]): Example => ({ steps, invalid: true });
export const examples: Record<number, Example> = {
  1: q([], 5), 2: q([sword], 115), 3: q([item('amulet')], 71),
  4: q([item('staff')], 93), 5: q([item('potion')], 49),
  6: q([item('rune')], 33), 7: q([item('moonstone')], 33),
  8: q(copies('rune', 2), 60), 9: q(copies('rune', 3), 71),
  10: q(copies('rune', 4), 115), 11: q(copies('rune', 7), 198),
  12: q([...copies('rune', 2), item('moonstone')], 88),
  13: q([...copies('rune', 3), ...copies('moonstone', 3)], 137),
  14: q([cursed], 165),
  15: { steps: [quote([item('sword', { enchantment: 5 })]), quote([item('sword', { enchantment: 4 })])], results: [{ premium: 145 }, { premium: 100 }] },
  16: q([item('sword', { enchantment: 5, cursed: true })], 195),
  17: q([item('sword', { enchantment: 4, cursed: true })], 165),
  18: q([sword], 95, 2),
  19: q([cursed, item('amulet')], 231),
  20: { years: 3, steps: [quote([]), quote([item('sword', { cursed: true, enchantment: 7, material: 'steel' })])], results: [{ premium: 5 }, { premium: 160 }] },
  21: q(copies('rune', 7), 198),
  22: bad([quote([item('broomstick')])]),
  23: c([item('sword', { material: 'steel', enchantment: 3 })], [damage('sword', 500)], 400, 1600),
  24: c([item('rune')], [damage('rune', 200)], 100, 400),
  25: c([dragon(5)], [damage('sword', 800)], 700, 1300),
  26: c([item('sword', { material: 'steel', enchantment: 9 })], [damage('sword', 1000)], 400, 1600),
  27: c([dragon(8)], [damage('sword', 1000)], 400, 1600),
  28: c([dragon(9)], [damage('sword', 1000)], 400, 1600),
  29: c([sword, item('amulet')], [damage('sword', 500), damage('amulet', 300)], 600, 2600),
  30: c([sword, sword], [damage('sword', 500), damage('sword', 300)], 600, 3400),
  31: c([sword, item('amulet')], [], 0, 3200),
  32: { steps: [quote([cursed]), claim([])], results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] },
  33: c([sword, ...copies('rune', 3)], [], 0, 3500),
  34: c([sword], [damage('sword', 1500)], 1400, 600),
  35: { steps: [quote([sword]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])], results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] },
  36: c([item('sword', { enchantment: 8 })], [damage('sword', 901)], 350, 1650),
  37: bad([quote([sword]), claim([damage('amulet', 200)])]),
  38: bad([quote([sword]), claim([damage('broomstick', 200)])]),
  39: bad([quote([sword]), claim([damage('sword', 200), damage('sword', 200)])]),
  40: bad([quote([sword]), claim([damage('sword', -200)])]),
  41: { years: 5, steps: [quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]), claim([damage('amulet', 200)])], results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] },
};

export function verify(number: number): void {
  const example = examples[number];
  const result = spawnSync('node', ['--import', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify({ customer: { yearsWithMHPCO: example.years ?? 0 }, steps: example.steps }),
    encoding: 'utf8',
  });
  if (example.invalid) {
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain('results');
    return;
  }
  expect(result.status, result.stderr).toBe(0);
  const actual = JSON.parse(result.stdout) as { results: Record<string, number>[] };
  expect(actual.results).toHaveLength(example.steps.length);
  example.results?.forEach((expected, index) => {
    for (const [key, value] of Object.entries(expected)) {
      if (index === 0 && key === 'premium' && value === 0) continue;
      expect(actual.results[index][key]).toBe(value);
    }
  });
}
