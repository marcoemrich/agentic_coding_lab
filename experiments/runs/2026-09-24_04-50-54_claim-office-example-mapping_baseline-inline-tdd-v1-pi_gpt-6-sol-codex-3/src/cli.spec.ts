import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function cli(input: unknown) {
  return spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], {
    input: JSON.stringify(input), encoding: 'utf8', cwd: process.cwd(),
  });
}

describe('claim-office CLI', () => {
  it('reads one scenario from stdin and writes only JSON results to stdout', () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exposes the executable and rejects unknown items without partial stdout', () => {
    const result = spawnSync('./claim-office', [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'broomstick' }] },
      ] }), encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe('');
  });

  it('rejects invalid input without writing partial results to stdout', () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage/i);
    expect(result.stdout).toBe('');
  });
});
