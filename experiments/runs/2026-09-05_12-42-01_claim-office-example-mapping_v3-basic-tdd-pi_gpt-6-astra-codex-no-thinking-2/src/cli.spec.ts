import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';

function cli(input: unknown) {
  return spawnSync('./claim-office', { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8' });
}
const scenario = (steps: unknown[]) => ({ customer: { yearsWithMHPCO: 5 }, steps });
const sword = { op: 'quote', items: [{ type: 'sword' }] };
const claim = (damages: unknown[]) => ({ op: 'claim', policy: 0, incident: { cause: 'fire', damages } });

it('runs the schema example through the executable', () => {
  const result = cli(scenario([
    { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
    claim([{ itemType: 'amulet', amount: 200 }]),
  ]));
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
});

it.each([
  scenario([{ op: 'quote', items: [{ type: 'broomstick' }] }]),
  scenario([sword, claim([{ itemType: 'amulet', amount: 200 }])]),
  scenario([sword, claim([{ itemType: 'unknown', amount: 200 }])]),
  scenario([sword, claim([{ itemType: 'sword', amount: -200 }])]),
  scenario([sword, claim([{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }])]),
  '{invalid json',
])('rejects invalid input without partial stdout: %j', input => {
  const result = cli(input);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(/\S/);
  expect(result.stdout).toBe('');
});

it('supports an empty scenario', () => {
  const result = cli(scenario([]));
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [] });
});
