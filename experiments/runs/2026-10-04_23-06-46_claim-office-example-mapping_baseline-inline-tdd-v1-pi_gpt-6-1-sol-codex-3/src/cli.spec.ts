import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function run(input: unknown, executable = './claim-office') {
  return spawnSync(executable, executable === process.execPath ? ['--import', 'tsx', 'src/cli.ts'] : [], {
    input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8',
  });
}
const customer = { yearsWithMHPCO: 5 };
const quote = { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] };
const claim = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } };

describe('CLI', () => {
  it.each(['./claim-office', process.execPath])('reads stdin and writes only JSON via %s', executable => {
    const result = run({ customer, steps: [quote, claim] }, executable);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
  it.each([
    { customer, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] },
    { customer, steps: [{ op: 'quote', items: [{ type: 'toString' }] }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: -200 }] } }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }, { itemType: 'amulet', amount: 200 }] } }] },
    { customer, steps: [claim, quote] },
    { customer, steps: [quote, claim, { ...claim, policy: 1 }] },
    '{bad json',
    null,
    {},
    { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
    { customer, steps: [{ op: 'renew', items: [] }] },
    { customer, steps: [{ op: 'quote', items: [{ type: 'sword', cursed: 'yes' }] }] },
    { customer, steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 1.5 }] }] },
    { customer, steps: [{ op: 'quote', items: [{ type: 'sword', material: 123 }] }] },
    { customer, steps: [quote, { ...claim, policy: 0.5 }] },
    { customer, steps: [quote, { ...claim, incident: { damages: [] } }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200.5 }] } }] },
    { customer, steps: [quote, { ...claim, incident: { cause: 'fire', damages: [{ itemType: 'amulet' }] } }] },
  ])('rejects invalid scenarios atomically: %j', input => {
    const result = run(input);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim()).not.toBe('');
  });
});
