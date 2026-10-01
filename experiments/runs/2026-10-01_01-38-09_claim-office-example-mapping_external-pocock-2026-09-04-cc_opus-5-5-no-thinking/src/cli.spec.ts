import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const claimOffice = (stdin: string) =>
  spawnSync(`${root}bin/claim-office`, { input: stdin, encoding: 'utf8', cwd: root });

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    const { status, stdout } = claimOffice(JSON.stringify(scenario));
    expect(status).toBe(0);
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; claim 200 - 100 = 100, cap 1200 - 100
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exits non-zero with an error on stderr and no results for an unknown item type', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };
    const { status, stdout, stderr } = claimOffice(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stderr).not.toMatch(/\n\s+at /); // a description, not a stack trace
    expect(stdout).toBe('');
  });

  it('exits non-zero with an error on stderr for malformed JSON', () => {
    const { status, stdout, stderr } = claimOffice('{ not json');
    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).toBe('');
  });
});
