import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const invoke = (input: unknown) => spawnSync('./claim-office', {
  input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8',
});
const scenario = (steps: object[]) => ({ customer: { yearsWithMHPCO: 5 }, steps });
const quote = { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] };
const claim = (itemType: string, amount: number, policy = 0) => ({ op: 'claim', policy, incident: { cause: 'fire', damages: [{ itemType, amount }] } });

describe('claim-office executable', () => {
  it('reads the schema example and emits only JSON', () => {
    const result = invoke(scenario([quote, claim('amulet', 200)]));
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('supports an empty scenario', () => {
    const result = invoke(scenario([]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [] });
  });
  it.each([
    scenario([{ op: 'quote', items: [{ type: 'broomstick' }] }]),
    scenario([quote, claim('sword', 200)]),
    scenario([quote, claim('broomstick', 200)]),
    scenario([quote, claim('amulet', -200)]),
    scenario([quote, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }, { itemType: 'amulet', amount: 300 }] } }]),
    scenario([quote, claim('amulet', 200, 1)]),
    scenario([{ op: 'unknown' }]),
    '{broken json',
  ])('rejects invalid input atomically %#', input => {
    const result = invoke(input);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().length).toBeGreaterThan(0);
  });
});
