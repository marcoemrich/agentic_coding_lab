import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: unknown) {
  const result = spawnSync('pnpm', ['exec', 'tsx', cliPath], {
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results as JSON to stdout', () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('exits non-zero with an error on stderr and no results on stdout for invalid input', () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  it('is available as the claim-office executable', () => {
    const binPath = fileURLToPath(new URL('../bin/claim-office', import.meta.url));
    const result = spawnSync(binPath, [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] }),
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
