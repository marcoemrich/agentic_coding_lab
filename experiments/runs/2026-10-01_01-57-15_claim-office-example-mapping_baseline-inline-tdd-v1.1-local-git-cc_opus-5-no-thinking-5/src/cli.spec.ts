import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(stdin: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile(
      'node',
      ['--import', 'tsx', CLI],
      (error, stdout, stderr) => {
        resolve({ code: error ? (error as { code?: number }).code ?? 1 : 0, stdout, stderr });
      },
    );
    child.stdin!.end(stdin);
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', async () => {
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

  it('exits non-zero and writes to stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  it('exits non-zero for a damage to an item outside the policy', async () => {
    const { code, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
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
    expect(stderr).toMatch(/amount/);
  });

  it('exits non-zero for malformed JSON input', async () => {
    const { code, stderr } = await runCli('not json');
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
