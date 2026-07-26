import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
// CLI under test (to be created in the Green phase): src/cli.ts,
// executed as a child process with JSON on stdin.

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

// Spawning a real process is slow compared with an in-process call, so every
// CLI test gets a generous timeout.
const CLI_TIMEOUT_MS = 30_000;

type CliRun = {
  status: number | null;
  stdout: string;
  stderr: string;
};

// The CLI is exercised end to end: the scenario goes in as JSON on stdin and
// the test only looks at what a shell would see - stdout, stderr, exit status.
const runCli = (scenario: unknown): CliRun => {
  const { status, stdout, stderr } = spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status, stdout, stderr };
};

describe("claim-office CLI", () => {
  it(
    "should read a scenario from stdin and write {results:[{premium}]} to stdout for a single quote step",
    () => {
      const { stdout } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    },
    CLI_TIMEOUT_MS,
  );

  it(
    "should write one result per step, in the same order as the input steps",
    () => {
      const { stdout } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(JSON.parse(stdout)).toEqual({
        results: [
          { premium: 115 },
          { premium: 62 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    },
    CLI_TIMEOUT_MS,
  );

  it(
    "should write {payout, remainingCap} for a claim step referring to an earlier quote step by index",
    () => {
      const { stdout } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(JSON.parse(stdout).results[1]).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    },
    CLI_TIMEOUT_MS,
  );

  it(
    "should exit with status 0 for a valid scenario",
    () => {
      const { status, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(status).toBe(0);
      expect(stderr).toBe("");
    },
    CLI_TIMEOUT_MS,
  );
  it(
    "should exit non-zero and write an error description to stderr, with no results on stdout, for a quote with an unknown item type",
    () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

      expect(status).not.toBe(0);
      // A rejection is reported as a description of what was wrong, not as a
      // crash: the domain message reaches stderr without a stack trace.
      expect(stderr).toMatch(/unknown item type/i);
      expect(stderr).not.toContain("    at ");
      expect(stdout).not.toContain("results");
    },
    CLI_TIMEOUT_MS,
  );

  it(
    "should exit non-zero and write an error description to stderr for a claim with a negative damage amount",
    () => {
      const { status, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });

      expect(status).not.toBe(0);
      expect(stderr).toMatch(/negative damage amount/i);
      expect(stderr).not.toContain("    at ");
    },
    CLI_TIMEOUT_MS,
  );
});
