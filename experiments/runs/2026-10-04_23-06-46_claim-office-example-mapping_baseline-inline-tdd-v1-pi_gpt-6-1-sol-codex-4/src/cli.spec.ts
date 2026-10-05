import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function run(input: unknown) {
  return spawnSync('./claim-office', { input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8' });
}
const customer = { yearsWithMHPCO: 5 };
const sword = { op: 'quote', items: [{ type: 'sword' }] };
function damage(itemType: string, amount: number) {
  return { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType, amount }] } };
}

describe('claim-office executable', () => {
  it('reads stdin and prints the normative results JSON', () => {
    const result = run({ customer, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      damage('amulet', 200),
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('accepts an empty scenario', () => {
    const result = run({ customer, steps: [] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [] });
  });
  it.each([
    { customer, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] },
    { customer, steps: [sword, damage('amulet', 200)] },
    { customer, steps: [sword, damage('broomstick', 200)] },
    { customer, steps: [sword, damage('sword', -200)] },
    { customer, steps: [sword, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
    ] } }] },
    '{invalid json',
  ])('rejects invalid input atomically: %j', input => {
    const result = run(input);
    expect(result.status).not.toBe(0);
    expect(result.error).toBeUndefined();
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().length).toBeGreaterThan(0);
  });
});
