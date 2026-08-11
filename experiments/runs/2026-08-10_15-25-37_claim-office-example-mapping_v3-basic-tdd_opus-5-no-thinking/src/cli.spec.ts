import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout: string, stderr: string) => {
      resolve({ status: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(input);
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };

    const { status, stdout } = await runCli(JSON.stringify(scenario));

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it('exits non-zero and writes to stderr for an unknown item type', async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };

    const { status, stdout, stderr } = await runCli(JSON.stringify(scenario));

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).toBe('');
  }, 30000);

  it('exits non-zero for a negative damage amount', async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    };

    const { status, stderr } = await runCli(JSON.stringify(scenario));

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30000);

  it('exits non-zero for malformed JSON', async () => {
    const { status, stderr } = await runCli('{not json');

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30000);
});
