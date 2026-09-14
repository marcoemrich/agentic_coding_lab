import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(
  input: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile(
      'node',
      ['--import', 'tsx', CLI],
      (error, stdout, stderr) => {
        resolve({
          code: error && typeof error.code === 'number' ? error.code : 0,
          stdout,
          stderr,
        });
      },
    );
    child.stdin?.end(input);
  });
}

describe('claim-office CLI', () => {
  it('writes the results of a scenario to stdout', async () => {
    const { code, stdout } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
            ],
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'amulet', amount: 200 }],
            },
          },
        ],
      }),
    );

    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('fails with an error on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toContain('broomstick');
  });

  it('fails for a damage to an item outside the policy', async () => {
    const { code, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'amulet', amount: 200 }],
            },
          },
        ],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('fails for a negative damage amount', async () => {
    const { code, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'sword', amount: -200 }],
            },
          },
        ],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('fails for more damages of a type than the policy covers', async () => {
    const { code, stderr } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 500 },
              ],
            },
          },
        ],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('fails on malformed JSON input', async () => {
    const { code, stderr } = await runCli('not json');
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
