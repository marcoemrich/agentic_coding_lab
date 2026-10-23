import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: string) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input, encoding: "utf8" });
}

const SCHEMA_EXAMPLE = {
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

describe("claim-office CLI", () => {
  it("schema example on stdin -> stdout {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}, exit 0", () => {
    const run = runCli(JSON.stringify(SCHEMA_EXAMPLE));
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("quote with unknown item type broomstick -> non-zero exit, error description on stderr, nothing on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const run = runCli(JSON.stringify(scenario));
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr.trim()).toBe("Unknown item type: broomstick");
  });
  it("claim with damage amount -200 -> non-zero exit, error description on stderr, nothing on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const run = runCli(JSON.stringify(scenario));
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr.trim()).not.toBe("");
  });
  it("claim damaging an item not in the policy -> non-zero exit, error description on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };
    const run = runCli(JSON.stringify(scenario));
    expect(run.status).not.toBe(0);
    expect(run.stderr.trim()).not.toBe("");
  });
  it("malformed JSON on stdin -> non-zero exit, error description on stderr", () => {
    const run = runCli("{not json");
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/^Invalid JSON input: .+\n$/);
  });
});
