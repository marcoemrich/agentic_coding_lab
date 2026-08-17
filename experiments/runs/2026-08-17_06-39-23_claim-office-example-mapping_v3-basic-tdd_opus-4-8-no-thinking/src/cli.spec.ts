import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const cliPath = join(dirname(fileURLToPath(import.meta.url)), 'cli.ts');

function runCli(input: string): { status: number; stdout: string; stderr: string } {
  const result = spawnSync('npx', ['tsx', cliPath], {
    input,
    encoding: 'utf8',
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe('claim-office CLI', () => {
  it('processes the schema example and writes results to stdout', () => {
    const input = JSON.stringify({
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
    });
    const { status, stdout } = runCli(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    expect(output).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });

  it('exits non-zero and writes to stderr for an unknown item type', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const { status, stdout, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe('');
  });

  it('exits non-zero for a negative damage amount', () => {
    const input = JSON.stringify({
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
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('exits non-zero when a damage item is not part of the policy', () => {
    const input = JSON.stringify({
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
    });
    const { status } = runCli(input);
    expect(status).not.toBe(0);
  });

  it('exits non-zero when more sword damages than insured', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 200 },
              { itemType: 'sword', amount: 200 },
            ],
          },
        },
      ],
    });
    const { status } = runCli(input);
    expect(status).not.toBe(0);
  });
});
