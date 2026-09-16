import { execFile } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): Promise<CliOutcome> {
  return new Promise((resolve) => {
    const child = execFile("npx", ["tsx", "src/cli.ts"], (error, stdout, stderr) => {
      resolve({ status: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin?.end(JSON.stringify(scenario));
  });
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results:[{premium}]} for a quote step to stdout", async () => {
    const outcome = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({ results: [{ premium: 115 }] });
  }, 30000);

  it("writes {payout, remainingCap} for a claim step referencing an earlier quote step by index", async () => {
    const outcome = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  }, 30000);

  it("processes the schema example (amulet quote then 200 G fire claim)", async () => {
    const outcome = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it("exits non-zero and writes an error description to stderr for an invalid scenario, writing no results to stdout", async () => {
    const outcome = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).toBe("");
  }, 30000);
});
