import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown) {
  return spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("claim-office CLI", () => {
  it("schema example: quote then claim -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}", () => {
    const run = runCli({
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
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("quote with unknown item type -> non-zero exit status, error on stderr, nothing on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/^claim-office: .*broomstick/);
    expect(run.stdout).toBe("");
  });

  it("claim with a damage outside the policy -> non-zero exit status, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/^claim-office: .*amulet/);
    expect(run.stdout).toBe("");
  });

});
