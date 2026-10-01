import { execFile } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): Promise<CliOutcome> {
  return new Promise((resolve) => {
    const child = execFile(
      "node_modules/.bin/tsx",
      ["src/cli.ts"],
      (error, stdout, stderr) => {
        resolve({ status: error === null ? 0 : (error.code as number), stdout, stderr });
      },
    );

    child.stdin?.end(JSON.stringify(input));
  });
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
  it("reads the schema example from stdin and writes results to stdout", async () => {
    const { stdout } = await runCli(SCHEMA_EXAMPLE);

    // amulet base 60: 60 - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits 0 on a valid scenario", async () => {
    const { status, stderr } = await runCli(SCHEMA_EXAMPLE);

    expect({ status, stderr }).toEqual({ status: 0, stderr: "" });
  });
  it("exits non-zero, writes an error to stderr, and writes no results to stdout on an unknown item type", async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });
  it("exits non-zero and writes an error to stderr on an invalid claim", async () => {
    const { status, stdout, stderr } = await runCli({
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

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
    expect(stdout).toBe("");
  });
  it("processes steps sequentially so a claim can reference an earlier quote's policy by step index", async () => {
    const { stdout } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // the third step is the customer's second contract, so the follow-up discount applies
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 100 }],
    });
  });
});
