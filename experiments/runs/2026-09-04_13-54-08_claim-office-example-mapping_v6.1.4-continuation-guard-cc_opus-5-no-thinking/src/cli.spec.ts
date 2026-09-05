import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Spawns the real CLI so the stdin/stdout contract itself is under test.
 *
 * Note `execFile`'s `input` option does NOT exist on the async variants — using
 * it leaves stdin open and the child waits for EOF forever. The write-then-end
 * below is what actually terminates the input stream.
 */
const runCli = (scenario: unknown): Promise<CliResult> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", "src/cli.ts"]);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (exitCode) => resolve({ stdout, stderr, exitCode: exitCode ?? 0 }));

    child.stdin.write(JSON.stringify(scenario));
    child.stdin.end();
  });

describe("claim-office CLI", () => {
  // "reads a scenario from stdin and writes {results}" and "quote → {premium},
  // claim → {payout, remainingCap}" are both asserted end to end by the schema
  // example below, which pins the exact output shape.

  it("processes the schema example (amulet quote + 200 G fire claim) end to end", async () => {
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

    const { stdout } = await runCli(scenario);

    // quote: 60 base − 12 loyalty (5 years) + 6 initial assessment = 54, + 5 fee = 59
    // claim: amulet value 600 → cap 1200; 200 − 100 deductible = 100; 1200 − 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it("exits with a non-zero status and writes to stderr on an unknown item type; no results on stdout", async () => {
    const { stdout, stderr, exitCode } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).not.toContain("results");
  }, 30000);

  it("reports errors as a clean message, not a raw stack trace", async () => {
    const { stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    // The previous test is satisfied by a stack trace, since a trace contains
    // the message. For a JSON-in/JSON-out tool that is still bad behaviour: it
    // leaks absolute paths and interpreter internals and buries the one line
    // the user needs. This pins the message the user should actually see.
    expect(stderr).toContain("unknown item type: broomstick");
    expect(stderr).not.toMatch(/^\s+at /m);
    expect(stderr).not.toContain("/src/claim-office.ts");
    expect(stderr.trim().split("\n")).toHaveLength(1);
  }, 30000);
});
