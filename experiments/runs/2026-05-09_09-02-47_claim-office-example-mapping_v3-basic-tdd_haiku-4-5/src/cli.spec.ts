import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('MHPCO CLI', () => {
  const cliPath = 'src/cli.ts';

  function runCli(input: string): Promise<{ stdout: string; stderr: string; code: number }> {
    return new Promise((resolve) => {
      const child = exec(`npx tsx ${cliPath}`, (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          code: error?.code || 0,
        });
      });

      child.stdin?.write(input);
      child.stdin?.end();
    });
  }

  it('should process a simple quote', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }],
        },
      ],
    });

    const result = await runCli(input);
    const output = JSON.parse(result.stdout);

    expect(output.results).toHaveLength(1);
    expect(output.results[0]).toHaveProperty('premium');
    expect(output.results[0].premium).toBe(115); // 100 + 10 + 5
  });

  it('should process quote and claim steps', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'damage',
            damages: [{ itemType: 'sword', amount: 500 }],
          },
        },
      ],
    });

    const result = await runCli(input);
    const output = JSON.parse(result.stdout);

    expect(output.results).toHaveLength(2);
    expect(output.results[0].premium).toBe(115);
    expect(output.results[1].payout).toBe(400);
    expect(output.results[1].remainingCap).toBe(1600);
  });

  it('should handle invalid JSON', async () => {
    const input = 'invalid json {';

    const result = await runCli(input);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('Invalid JSON');
  });

  it('should reject claim with uninsured item', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'damage',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });

    const result = await runCli(input);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('policy only covers');
  });

  it('should reject negative damage amounts', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'damage',
            damages: [{ itemType: 'sword', amount: -200 }],
          },
        },
      ],
    });

    const result = await runCli(input);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('Invalid damage amount');
  });
});
