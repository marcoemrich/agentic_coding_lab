import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const CLI = ['--import', 'tsx', 'src/cli.ts'];

function run(input: unknown) {
  return spawnSync(process.execPath, CLI, {
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const result = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(result.stderr).toBe('');
  });

  it('reports invalid input on stderr without writing results', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/Unknown item type/);
  });

  it('rejects input that does not follow the normative schema', () => {
    const result = run({ customer: { yearsWithMHPCO: 'many' }, steps: [] });

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/Invalid customer/);
  });
});
