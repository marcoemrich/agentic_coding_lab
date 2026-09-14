import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function run(input: unknown) {
  return spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify(input), encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('is exposed through the claim-office command', () => {
    const execution = spawnSync('pnpm', ['--silent', 'claim-office'], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }),
      encoding: 'utf8',
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [] });
  });

  it('reads a scenario from stdin and writes its results to stdout', () => {
    const execution = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 49 }] });
    expect(execution.stderr).toBe('');
  });
});
