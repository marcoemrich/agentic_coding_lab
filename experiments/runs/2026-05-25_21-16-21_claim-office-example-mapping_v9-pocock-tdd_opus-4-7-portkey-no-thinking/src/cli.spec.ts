import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(here, 'cli.ts');

type RunResult = { stdout: string; stderr: string; status: number };

function runCli(input: unknown): RunResult {
  try {
    const stdout = execFileSync('npx', ['tsx', cliPath], {
      input: JSON.stringify(input),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout, stderr: '', status: 0 };
  } catch (err) {
    const e = err as { stdout?: Buffer | string; stderr?: Buffer | string; status?: number };
    return {
      stdout: e.stdout?.toString() ?? '',
      stderr: e.stderr?.toString() ?? '',
      status: e.status ?? 1,
    };
  }
}

describe('claim-office CLI (subprocess)', () => {
  it('reads JSON from stdin and writes results JSON to stdout', () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it('exits non-zero and writes error to stderr on unknown item type, no results on stdout', () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr.length).toBeGreaterThan(0);
  });
});
