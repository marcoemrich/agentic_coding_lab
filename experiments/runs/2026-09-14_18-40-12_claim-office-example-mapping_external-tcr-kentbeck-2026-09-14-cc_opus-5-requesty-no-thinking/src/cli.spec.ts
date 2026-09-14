import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface Run {
  code: number;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<Run> {
  return new Promise((resolve, reject) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      if (error && typeof error.code !== 'number') {
        reject(error);
        return;
      }
      resolve({ code: typeof error?.code === 'number' ? error.code : 0, stdout, stderr });
    });
    child.stdin?.end(input);
  });
}

describe('claim-office CLI', () => {
  it('writes results for the schema example', async () => {
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
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    const run = await runCli(input);
    expect(run.code).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it('fails with a message on stderr for an unknown item type', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const run = await runCli(input);
    expect(run.code).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toMatch(/broomstick/);
  }, 30000);

  it('fails on a negative damage amount', async () => {
    const input = JSON.stringify({
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
    const run = await runCli(input);
    expect(run.code).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).not.toBe('');
  }, 30000);
});
