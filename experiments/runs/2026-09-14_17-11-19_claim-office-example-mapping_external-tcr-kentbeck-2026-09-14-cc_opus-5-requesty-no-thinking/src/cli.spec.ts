import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface Run {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): Promise<Run> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', cli]);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('close', (code) => resolve({ status: code ?? 1, stdout, stderr }));
    child.stdin.end(JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('writes results for the scenario read from stdin', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
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
  }, 30000);

  it('fails with a message on stderr for an unknown item type', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('broomstick');
  }, 30000);

  it('rejects the whole claim when a damage amount is negative', async () => {
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
    expect(run.stdout).toBe('');
    expect(run.stderr).not.toBe('');
  }, 30000);

  it('rejects a claim with more damages of a type than the policy covers', async () => {
    const run = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 300 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).not.toBe('');
  }, 30000);
});
