import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliOutcome {
  code: number;
  stdout: string;
  stderr: string;
}

async function runCli(input: unknown): Promise<CliOutcome> {
  const child = execFileAsync('npx', ['tsx', CLI], { encoding: 'utf8' });
  child.child.stdin!.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { code: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout: string; stderr: string };
    return { code: failure.code ?? 1, stdout: failure.stdout, stderr: failure.stderr };
  }
}

describe('claim-office CLI', () => {
  it('writes the results of a scenario to stdout', async () => {
    const { code, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero with an error on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).not.toContain('results');
  });

  it('exits non-zero for a negative damage amount', async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
