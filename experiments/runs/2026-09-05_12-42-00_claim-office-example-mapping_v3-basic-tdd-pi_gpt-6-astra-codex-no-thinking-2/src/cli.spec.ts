import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';

const invoke = (input: unknown) => spawnSync('./claim-office', { input: JSON.stringify(input), encoding: 'utf8' });
const customer = { yearsWithMHPCO: 5 };
it('exposes claim-office with JSON stdin/stdout', () => {
  const result = invoke({ customer, steps: [
    { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
  ] });
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
].map(steps => [steps]))('rejects invalid scenarios without partial output %#', steps => {
  const result = invoke({ customer, steps });
  expect(result.status).not.toBe(0);
  expect(result.stdout).toBe('');
  expect(result.stderr.trim().length).toBeGreaterThan(0);
});
it('reports malformed JSON', () => {
  const result = spawnSync('./claim-office', { input: '{', encoding: 'utf8' });
  expect(result.status).not.toBe(0);
  expect(result.stdout).toBe('');
  expect(result.stderr).toMatch(/error/i);
});
