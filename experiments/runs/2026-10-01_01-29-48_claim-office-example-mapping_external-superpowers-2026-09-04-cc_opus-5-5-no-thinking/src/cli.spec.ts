import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const executable = fileURLToPath(new URL('../bin/claim-office', import.meta.url));

function runCli(input: unknown) {
  return spawnSync(executable, { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results as JSON to stdout', () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    // amulet: 60 + 6 first insurance − 12 loyalty = 54 + 5 fee; claim 200 − 100; cap 1200 − 100
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  const swordQuote = { op: 'quote', items: [{ type: 'sword' }] };
  const claimOf = (damages: unknown[]) => ({ op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } });

  it.each([
    ['an unknown item type in a quote', [{ op: 'quote', items: [{ type: 'broomstick' }] }], /broomstick/],
    ['damage to an uninsured item', [swordQuote, claimOf([{ itemType: 'amulet', amount: 200 }])], /amulet/],
    [
      'more damages of a type than insured',
      [swordQuote, claimOf([{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }])],
      /sword/,
    ],
    ['a negative damage amount', [swordQuote, claimOf([{ itemType: 'sword', amount: -200 }])], /-200/],
  ])('rejects %s with a non-zero exit and a one-line error on stderr', (_name, steps, message) => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toMatch(message);
    expect(run.stderr.trim().split('\n')).toHaveLength(1);
  });
});
