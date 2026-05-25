import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(here, 'cli.ts');

function runCli(input: string) {
  return spawnSync('npx', ['tsx', cliPath], {
    input,
    encoding: 'utf-8',
  });
}

describe('CLI', () => {
  it('reads scenario JSON from stdin and writes results to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it('exits non-zero on unknown item type', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
