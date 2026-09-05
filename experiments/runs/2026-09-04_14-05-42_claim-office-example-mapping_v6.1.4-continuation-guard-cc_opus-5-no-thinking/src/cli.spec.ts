import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

// The CLI's contract is its process behaviour — stdin, stdout, stderr and the
// exit code — so the tests drive a real subprocess rather than the module.
// A non-zero exit resolves rather than rejects; the rejection tests inspect it.
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", "src/cli.ts"], { stdio: "pipe" });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));

    child.stdin.write(input);
    child.stdin.end();
  });

// The spec's own "Schema example".
const SCHEMA_EXAMPLE = JSON.stringify({
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
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} to stdout", async () => {
    const { stdout, code } = await runCli(SCHEMA_EXAMPLE);

    expect(code).toBe(0);
    expect(JSON.parse(stdout).results).toHaveLength(2);
  }, 20000);

  it("writes a premium result for a quote step and a payout/remainingCap result for a claim step", async () => {
    const { stdout } = await runCli(SCHEMA_EXAMPLE);

    // Quote: amulet 60 base − 12 loyalty (5 years) + 6 first insurance + 5 fee.
    // Claim: cap 2 × 600 = 1200; 200 damage − 100 deductible, no clauses.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 20000);
  // Covers "writes no results to stdout when the scenario is rejected" too —
  // the two are halves of one rejection contract over the same scenario.
  it("exits with a non-zero status and writes to stderr when an item type is unknown", async () => {
    const { stdout, stderr, code } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stdout).not.toContain("results");

    // "an error description", not a stack trace: an uncaught throw would also
    // mention the broomstick, so assert the absence of internals too.
    expect(stderr).toMatch(/The MHPCO does not insure a broomstick\./);
    expect(stderr).not.toMatch(/\bat\s+\w+\s+\(/);
    expect(stderr).not.toContain("claim-office.ts");
  }, 20000);
});
