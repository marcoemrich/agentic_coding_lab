import { spawnSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const runCli = (input: unknown) => spawnSync(
  process.execPath,
  ['node_modules/tsx/dist/cli.mjs', 'src/cli.ts'],
  { input: JSON.stringify(input), encoding: 'utf8' },
);

describe('claim-office CLI', () => {
  it('is published as the claim-office executable', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(packageJson.bin).toEqual({ 'claim-office': 'src/cli.ts' });
    expect(statSync('src/cli.ts').mode & 0o111).not.toBe(0);
  });

  it('reports invalid scenarios on stderr without writing results', () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/unknown item/i);
    expect(run.stdout).toBe('');
  });

  it('reads a scenario from stdin and writes results as JSON', () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
