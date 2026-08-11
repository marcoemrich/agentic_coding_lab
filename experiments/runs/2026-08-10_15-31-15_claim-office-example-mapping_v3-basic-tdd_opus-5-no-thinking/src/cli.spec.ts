import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));
const TSX = fileURLToPath(new URL('../node_modules/.bin/tsx', import.meta.url));

interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = execFile(TSX, [CLI], (_error, stdout, stderr) => {
      resolve({ code: child.exitCode ?? 0, stdout, stderr });
    });
    child.stdin?.end(input);
  });
}

describe('claim-office CLI', () => {
  it('writes results for a valid scenario to stdout', async () => {
    const { code, stdout } = await runCli(
      JSON.stringify({
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
      }),
    );

    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero with a message on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });

  it('exits non-zero for a negative damage amount', async () => {
    const { code, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('exits non-zero for malformed JSON', async () => {
    const { code, stderr } = await runCli('not json');
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('exits non-zero for a scenario without a customer', async () => {
    const { code, stderr } = await runCli(JSON.stringify({ steps: [] }));
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
