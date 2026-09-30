import { spawnSync } from 'node:child_process';
import { runCli } from './claim-office';

const schemaExample = JSON.stringify({
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
  ],
});

describe('runCli', () => {
  it('writes the results JSON to stdout with exit code 0 for a valid scenario', () => {
    const stdin = schemaExample;

    const output = runCli(stdin);

    expect(output.exitCode).toBe(0);
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('writes an error to stderr and nothing to stdout with a non-zero exit code for an invalid scenario', () => {
    const stdin = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });

    const output = runCli(stdin);

    expect(output).toEqual({ exitCode: 1, stdout: '', stderr: 'Unknown item type: broomstick\n' });
  });

  it('exits non-zero for malformed JSON', () => {
    const stdin = '{ not json';

    const output = runCli(stdin);

    expect(output.exitCode).toBe(1);
    expect(output.stdout).toBe('');
    expect(output.stderr).not.toBe('');
  });
});

describe('cli.ts', () => {
  const runEntryPoint = (input: string) =>
    spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });

  it('reads the scenario from stdin and writes the results to stdout', () => {
    const input = schemaExample;

    const child = runEntryPoint(input);

    expect(child.status).toBe(0);
    expect(JSON.parse(child.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exits non-zero and writes the error to stderr for an invalid scenario', () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });

    const child = runEntryPoint(input);

    expect(child.status).toBe(1);
    expect(child.stdout).toBe('');
    expect(child.stderr).toContain('Unknown item type: broomstick');
  });
});
