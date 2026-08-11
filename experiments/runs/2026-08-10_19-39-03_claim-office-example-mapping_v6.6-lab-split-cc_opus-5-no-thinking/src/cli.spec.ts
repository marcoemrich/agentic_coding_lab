import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

// Spawns the real executable so the tests exercise the actual stdin/stdout and
// exit-code contract rather than a stand-in for it.
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const cli = spawn("npx", ["tsx", "src/cli.ts"]);
    let stdout = "";
    let stderr = "";

    cli.stdout.on("data", (chunk) => (stdout += chunk));
    cli.stderr.on("data", (chunk) => (stderr += chunk));
    cli.on("error", reject);
    cli.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));

    cli.stdin.write(input);
    cli.stdin.end();
  });

const CLI_TIMEOUT_MS = 30_000;

// What a described refusal looks like from outside the process, in one place.
// Every refusal the MHPCO issues has the same four-part shape regardless of
// which rule was broken: a non-zero status, nothing resembling results on
// stdout, the offending word named on stderr, and no stack trace — the office
// explains itself rather than leaking Node's default handler. Naming the shape
// is what lets each test below say only which rule it is testing.
const expectDescribedRefusal = (
  { stdout, stderr, code }: CliRun,
  offendingWord: string,
): void => {
  expect(code).not.toBe(0);
  expect(stdout).not.toContain("results");
  expect(stderr).toContain(offendingWord);
  expect(stderr).not.toMatch(/^\s+at /m);
};

describe("claim-office CLI", () => {
  it(
    "reads a scenario from stdin and writes {results: [...]} to stdout",
    async () => {
      const { stdout, code } = await runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword" }] }],
        }),
      );

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    },
    CLI_TIMEOUT_MS,
  );

  it(
    "returns a premium result for a quote step and payout + remainingCap for a claim step (schema example)",
    async () => {
      const { stdout, code } = await runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [
                {
                  type: "amulet",
                  material: "silver",
                  enchantment: 2,
                  cursed: false,
                },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      );

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    },
    CLI_TIMEOUT_MS,
  );
  it(
    "exits with a non-zero status and writes to stderr when a quote contains an unknown item type, writing no results to stdout",
    async () => {
      const run = await runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expectDescribedRefusal(run, "broomstick");
    },
    CLI_TIMEOUT_MS,
  );
  it(
    "exits with a non-zero status and writes to stderr when a claim references an item not in the policy",
    async () => {
      const run = await runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      );

      expectDescribedRefusal(run, "amulet");
    },
    CLI_TIMEOUT_MS,
  );
  it(
    "exits with a non-zero status and writes to stderr when a damage amount is negative",
    async () => {
      const run = await runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      );

      expectDescribedRefusal(run, "negative");
    },
    CLI_TIMEOUT_MS,
  );
});
