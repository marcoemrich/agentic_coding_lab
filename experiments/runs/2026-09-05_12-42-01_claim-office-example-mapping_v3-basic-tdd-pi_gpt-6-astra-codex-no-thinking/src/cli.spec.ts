import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
const invoke = (input: unknown) => spawnSync('./claim-office', { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8' });
const scenario = (steps: unknown[]) => ({ customer: { yearsWithMHPCO: 5 }, steps });
const quote = { op: 'quote', items: [{ type: 'sword' }] };
const claim = (damages: unknown[], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'fire', damages } });
it('exposes the executable and JSON schema', () => {
  const result = invoke(scenario([{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] }, claim([{ itemType: 'amulet', amount: 200 }])]));
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
});
it.each([
  ['unknown quote type', scenario([{ op: 'quote', items: [{ type: 'broomstick' }] }])],
  ['prototype type', scenario([{ op: 'quote', items: [{ type: 'toString' }] }])],
  ['uninsured item', scenario([quote, claim([{ itemType: 'amulet', amount: 200 }])])],
  ['unknown damage type', scenario([quote, claim([{ itemType: 'broomstick', amount: 200 }])])],
  ['negative damage', scenario([quote, claim([{ itemType: 'sword', amount: -200 }])])],
  ['too many damages', scenario([quote, claim([{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 300 }])])],
  ['claim step reference', scenario([quote, claim([]), claim([], 1)])],
  ['future policy', scenario([claim([], 1), quote])],
  ['malformed JSON', '{'],
  ['invalid operation', scenario([{ op: 'cancel' }])],
])('rejects %s atomically', (_name, input) => {
  const result = invoke(input);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toBeTruthy();
  expect(result.stdout).toBe('');
});
it('allows two separate damages when two swords are insured', () => {
  const result = invoke(scenario([{ op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] }, claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]));
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
});
