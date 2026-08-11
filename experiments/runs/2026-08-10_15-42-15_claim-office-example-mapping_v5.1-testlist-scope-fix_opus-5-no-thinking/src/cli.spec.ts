import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

/** Runs the claim-office CLI with `input` on stdin. */
function runCli(input: string): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile("npx", ["tsx", CLI], (error, stdout, stderr) => {
      resolve({ stdout, stderr, code: error ? ((error as { code?: number }).code ?? 1) : 0 });
    });
    child.stdin!.end(input);
  });
}

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes results to stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const { stdout, code } = await runCli(JSON.stringify(scenario));
    expect(code).toBe(0);
    // amulet: 60 base + 6 first insurance − 12 loyalty + 5 fee = 59 G
    // claim: 200 − 100 deductible = 100 G, cap 1200 − 100 = 1100 G
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes an error to stderr for an unknown item type, with no results on stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });
});
