import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const run = promisify(execFile);
const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

async function runCli(input: unknown) {
  const child = run('npx', ['tsx', cli], { encoding: 'utf8' });
  child.child.stdin!.end(JSON.stringify(input));
  return child;
}

describe('cli', () => {
  it('writes the scenario results as JSON to stdout', async () => {
    const { stdout } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });

  it('reports errors as a plain message rather than a stack trace', async () => {
    const failure = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    }).catch((error) => error);
    expect(failure.code).not.toBe(0);
    expect(failure.stdout).toBe('');
    expect(failure.stderr.trim()).toBe('unknown item type: broomstick');
  });

  it('is exposed as the claim-office executable', async () => {
    const pkg = JSON.parse(
      await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'),
    );
    expect(pkg.bin['claim-office']).toBe('src/cli.ts');
  });
});
