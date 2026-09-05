import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
const execute = (input: unknown) => spawnSync('./claim-office', [], { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8' });
const scenario = (steps: unknown[]) => ({ customer: { yearsWithMHPCO: 5 }, steps });
it('runs the named executable with the normative JSON format', () => {
  const result = execute(scenario([
    { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
  ]));
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
});
it.each([
  [{ op: 'quote', items: [{ type: 'broomstick' }] }],
  [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }],
  [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }],
  [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }],
  [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }] } }],
])('rejects the whole scenario on invalid input %j', (...steps) => {
  const result = execute(scenario(steps));
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
});
it('reports malformed JSON without stdout', () => {
  const result = execute('{');
  expect(result.status).not.toBe(0);
  expect(result.stderr).not.toBe('');
  expect(result.stdout).toBe('');
});
