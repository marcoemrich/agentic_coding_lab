import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: string): CliRun {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input,
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

const VALID_SCENARIO = JSON.stringify({
  customer: { yearsWithMHPCO: 5 },
  steps: [
    {
      op: "quote",
      items: [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ],
    },
    {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
    },
  ],
});

const UNKNOWN_ITEM_QUOTE = JSON.stringify({
  customer: { yearsWithMHPCO: 0 },
  steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
});

const UNINSURED_CLAIM = JSON.stringify({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items: [{ type: "sword" }] },
    {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
    },
  ],
});

describe("claim-office CLI contract (spawned process)", () => {
  it("valid scenario -> exit code 0 and stdout contains the results JSON [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
    const run = runCli(VALID_SCENARIO);
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("quote with unknown item type -> non-zero exit code, error description on stderr, no results written to stdout", () => {
    const run = runCli(UNKNOWN_ITEM_QUOTE);
    expect(run.status).not.toBe(0);
    expect(run.stderr.trim().length).toBeGreaterThan(0);
    expect(run.stdout).not.toContain("results");
  });
  it("claim for an uninsured item -> non-zero exit code and error description on stderr", () => {
    const run = runCli(UNINSURED_CLAIM);
    expect(run.status).not.toBe(0);
    expect(run.stderr.trim().length).toBeGreaterThan(0);
  });
});
