import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface Run {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): Promise<Run> {
  return new Promise((resolve) => {
    const child = execFile('node_modules/.bin/tsx', [cliPath], (error, stdout, stderr) => {
      resolve({ status: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('writes the results of a scenario to stdout', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero and writes to stderr for an unknown item type', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toMatch(/broomstick/);
  });

  it('exits non-zero for a damage to an item outside the policy', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toMatch(/not covered/i);
  });

  it('exits non-zero for a negative damage amount', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/negative/i);
  });

  it('exits non-zero for malformed JSON input', async () => {
    const run = await new Promise<Run>((resolve) => {
      const child = execFile('node_modules/.bin/tsx', [cliPath], (error, stdout, stderr) => {
        resolve({ status: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
      });
      child.stdin!.end('not json');
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe('');
  });
});
