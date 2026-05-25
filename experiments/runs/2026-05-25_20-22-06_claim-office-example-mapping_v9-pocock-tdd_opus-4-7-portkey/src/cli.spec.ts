import { describe, expect, test } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const CLI = resolve(__dirname, 'cli.ts');

function runCli(input: string) {
  return spawnSync('npx', ['tsx', CLI], {
    input,
    encoding: 'utf8',
  });
}

describe('CLI', () => {
  test('reads scenario from stdin and writes results to stdout', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });
    const result = runCli(input);
    expect(result.status).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty('premium');
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  test('quote with unknown item type → exit non-zero, error on stderr', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
  });
});
