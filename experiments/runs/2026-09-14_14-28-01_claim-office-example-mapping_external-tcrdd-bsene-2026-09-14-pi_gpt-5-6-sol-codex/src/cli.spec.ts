import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function runCli(input: unknown) {
  return spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'src/cli.ts'], {
    cwd: process.cwd(), input: JSON.stringify(input), encoding: 'utf8',
  });
}

it('reads a scenario from stdin and writes only its JSON result', () => {
  const input = JSON.stringify({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
  });
  const result = runCli(JSON.parse(input));
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
});

it('reports domain errors on stderr without writing results', () => {
  const result = runCli({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
  });
  expect(result.status).not.toBe(0);
  expect(result.stdout).toBe('');
  expect(result.stderr).toContain('Unknown item type: broomstick');
});
