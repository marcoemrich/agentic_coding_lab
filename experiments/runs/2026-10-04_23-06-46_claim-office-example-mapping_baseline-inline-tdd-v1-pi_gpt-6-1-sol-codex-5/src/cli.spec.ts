import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (input: unknown, executable = './claim-office') => spawnSync(executable, [], {
  input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8',
});
const scenario = (steps: unknown[]) => ({ customer: { yearsWithMHPCO: 5 }, steps });
const sword = { op: 'quote', items: [{ type: 'sword' }] };
const damage = (itemType: string, amount: number, policy = 0) => ({ op: 'claim', policy, incident: { cause: 'fire', damages: [{ itemType, amount }] } });

describe('claim-office CLI', () => {
  it.each([
    ['unknown quote item', scenario([{ op: 'quote', items: [{ type: 'broomstick' }] }])],
    ['prototype name item', scenario([{ op: 'quote', items: [{ type: 'toString' }] }])],
    ['uninsured damage', scenario([sword, damage('amulet', 200)])],
    ['unknown damage', scenario([sword, damage('broomstick', 200)])],
    ['negative damage', scenario([sword, damage('sword', -200)])],
    ['excess duplicate damage', scenario([sword, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 300 }] } }])],
    ['future policy reference', scenario([damage('sword', 200, 1), sword])],
    ['claim policy reference', scenario([sword, damage('sword', 200), damage('sword', 200, 1)])],
    ['invalid JSON', '{'],
    ['missing customer', { steps: [] }],
    ['fractional customer tenure', { customer: { yearsWithMHPCO: 1.5 }, steps: [] }],
    ['invalid operation', scenario([{ op: 'renew' }])],
    ['missing item type', scenario([{ op: 'quote', items: [{}] }])],
    ['invalid curse field', scenario([{ op: 'quote', items: [{ type: 'sword', cursed: 'yes' }] }])],
    ['fractional enchantment', scenario([{ op: 'quote', items: [{ type: 'sword', enchantment: 4.5 }] }])],
    ['missing incident cause', scenario([sword, { op: 'claim', policy: 0, incident: { damages: [] } }])],
    ['fractional damage', scenario([sword, damage('sword', 200.5)])],
  ])('rejects %s with stderr and no partial stdout', (_name, input) => {
    const output = run(input);
    expect(output.status).not.toBe(0);
    expect(output.stderr.length).toBeGreaterThan(0);
    expect(output.stdout).toBe('');
  });
  it('reads stdin and emits exactly the normative JSON results', () => {
    const output = run(scenario([
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      damage('amulet', 200),
    ]));
    expect(output.status).toBe(0);
    expect(output.stderr).toBe('');
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
