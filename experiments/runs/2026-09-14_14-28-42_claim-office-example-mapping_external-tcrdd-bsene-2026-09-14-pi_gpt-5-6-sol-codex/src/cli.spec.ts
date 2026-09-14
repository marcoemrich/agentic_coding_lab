import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function runCli(input: unknown) {
  return spawnSync('pnpm', ['exec', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify(input), encoding: 'utf8',
  });
}

it('reads a scenario from stdin and writes its results as JSON', () => {
  const run = runCli({
    customer: { yearsWithMHPCO: 5 },
    steps: [{ op: 'quote', items: [{ type: 'amulet' }] }],
  });
  expect(run.status).toBe(0);
  expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }] });
  expect(run.stderr).toBe('');
});

it('is exposed as the claim-office executable', () => {
  const run = spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }),
    encoding: 'utf8',
  });
  expect(run.status).toBe(0);
  expect(JSON.parse(run.stdout)).toEqual({ results: [] });
});

it('reports rejected scenarios on stderr without writing results', () => {
  const run = runCli({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
  });
  expect(run.status).not.toBe(0);
  expect(run.stdout).toBe('');
  expect(run.stderr).toMatch(/unknown item type/i);
});
