import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runCli(input: unknown) {
  return spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], {
    cwd: process.cwd(),
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario and writes ordered JSON results', () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', enchantment: 2 }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(execution.stderr).toBe('');
  });

  it('reports invalid scenarios on stderr without writing results', () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stdout).toBe('');
    expect(execution.stderr).toContain('Unknown item type');
  });
});
