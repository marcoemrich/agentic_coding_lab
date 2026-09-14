import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const executable = resolve(here, '..', 'bin', 'claim-office.js');

function runCli(scenario: unknown) {
  const result = spawnSync(process.execPath, [executable], {
    input: JSON.stringify(scenario),
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('claim-office CLI', () => {
  it('writes results to stdout and exits zero', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero and writes to stderr for an unknown item type', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).not.toContain('results');
    expect(result.stderr).toMatch(/broomstick/);
  });

  it('exits non-zero for a negative damage amount', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200/);
  });

  it('exits non-zero for damage to an uninsured item', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
  });

  it('exits non-zero for more damages of a type than insured items', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/sword/);
  });
});
