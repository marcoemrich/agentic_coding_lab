import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const CLI = new URL('./cli.ts', import.meta.url).pathname;

async function runCli(input: unknown) {
  const child = run('npx', ['tsx', CLI], { encoding: 'utf8' });
  child.child.stdin?.end(JSON.stringify(input));
  return child;
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results to stdout', async () => {
    const { stdout } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('reports a rejected scenario as a single error line on stderr', async () => {
    const failure = (await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    }).catch((error: unknown) => error)) as { code: number; stdout: string; stderr: string };

    expect(failure.code).toBe(1);
    expect(failure.stdout).toBe('');
    expect(failure.stderr).toBe('claim-office: unknown item type: broomstick\n');
  });

  it('is installed as the claim-office executable', async () => {
    const child = run('npx', ['claim-office'], { encoding: 'utf8' });
    child.child.stdin?.end(
      JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] }),
    );
    const { stdout } = await child;
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
