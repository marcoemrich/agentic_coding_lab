import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { processInput } from './process.js';

const SCENARIO = {
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

function runCli(input: string): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync('npx', ['tsx', 'src/cli.ts'], { input, encoding: 'utf8' });
    return { stdout, stderr: '', status: 0 };
  } catch (error) {
    const err = error as { stdout: string; stderr: string; status: number };
    return { stdout: err.stdout, stderr: err.stderr, status: err.status };
  }
}

describe('processInput', () => {
  it('produces a results document', () => {
    expect(JSON.parse(processInput(JSON.stringify(SCENARIO)))).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});

describe('cli', () => {
  it('reads stdin and writes results to stdout', () => {
    const { stdout, status } = runCli(JSON.stringify(SCENARIO));
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero with an error on stderr for unknown item types', () => {
    const { stdout, stderr, status } = runCli(
      JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
    );
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });

  it('exits non-zero for a negative damage amount', () => {
    const { status, stderr } = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      }),
    );
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
