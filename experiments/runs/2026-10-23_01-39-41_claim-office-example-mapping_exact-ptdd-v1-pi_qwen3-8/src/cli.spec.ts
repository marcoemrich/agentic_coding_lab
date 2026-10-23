import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runCli } from "./cli.js";

// The normative schema example, reused across the CLI contract tests.
const SCHEMA_EXAMPLE = JSON.stringify({
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
});

// The spec's observable failure contract: non-zero exit, an error on stderr,
// and no results written to stdout.
function expectCliRejects(input: string): void {
  const { code, stdout, stderr } = runCli(input);
  expect(code).not.toBe(0);
  expect(stderr).not.toBe("");
  expect(stdout).toBe("");
}

// CLI contract tests for the `claim-office` executable (src/cli.ts).
//
// The specification defines the observable failure contract at the CLI level:
// the process exits with a non-zero status code, writes an error description to
// stderr, and writes no `results` to stdout. `runCli(input)` is the pure adapter
// the executable wraps; it returns { code, stdout, stderr }, and the executable
// uses `code` as its process exit status. These tests therefore observe `runCli`.
//
// The specification does not fix a specific error type or message, only the
// observable outcome (non-zero exit + stderr + no results). Chosen reading: any
// thrown domain error is translated by the adapter into exit code 1 with the
// message on stderr and an empty stdout.

describe("claim-office CLI — success contract", () => {
  it("reads a scenario JSON from stdin and writes results JSON to stdout with exit code 0 and empty stderr (schema example)", () => {
    const { code, stdout, stderr } = runCli(SCHEMA_EXAMPLE);
    expect(code).toBe(0);
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});

describe("claim-office CLI — failure contract (non-zero exit, stderr set, no results on stdout)", () => {
  it("quote with an unknown item type (broomstick) -> non-zero exit code, error on stderr, no results on stdout", () => {
    expectCliRejects(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    }));
  });
  it("claim referencing an item not covered by the policy (amulet damaged, only sword insured) -> non-zero exit code, error on stderr, no results on stdout", () => {
    expectCliRejects(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    }));
  });
  it("claim referencing an unknown item type -> non-zero exit code, error on stderr, no results on stdout", () => {
    expectCliRejects(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "broomstick", amount: 100 }] } },
      ],
    }));
  });
  it("claim with more damage entries of a type than insured (two sword damages, one sword insured) -> non-zero exit code, whole claim rejected", () => {
    expectCliRejects(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }] } },
      ],
    }));
  });
  it("claim with a negative damage amount (-200) -> non-zero exit code, error on stderr, no results on stdout", () => {
    expectCliRejects(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "mishap", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    }));
  });
});

describe("claim-office CLI — executable entry point", () => {
  it("src/cli.ts run as a process (tsx) answers the schema example on stdin with results on stdout, exit code 0, and empty stderr", () => {
    const tsxBin = fileURLToPath(new URL("../node_modules/.bin/tsx", import.meta.url));
    const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));
    const proc = spawnSync(tsxBin, [cliPath], { input: SCHEMA_EXAMPLE, encoding: "utf8" });
    expect(proc.status).toBe(0);
    expect(proc.stderr).toBe("");
    expect(JSON.parse(proc.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
