import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const run = promisify(execFile);

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

async function claimOffice(input: unknown): Promise<CliRun> {
  const child = execFile("npx", ["tsx", "src/cli.ts"]);
  child.stdin?.end(JSON.stringify(input));
  return await new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk: string) => (stdout += chunk));
    child.stderr?.on("data", (chunk: string) => (stderr += chunk));
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));
  });
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes the results as JSON to stdout", async () => {
    const result = await claimOffice({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes an error to stderr for an unknown item type, with no results on stdout", async () => {
    const result = await claimOffice({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
});
