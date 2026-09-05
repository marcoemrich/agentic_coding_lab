import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve) => {
    const child = execFile(
      "npx",
      ["tsx", CLI],
      (error, stdout, stderr) => {
        resolve({ stdout, stderr, code: error?.code === undefined ? 0 : Number(error.code) });
      },
    );
    child.stdin?.end(input);
  });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results to stdout", async () => {
    const scenario = {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    const { stdout, code } = await runCli(JSON.stringify(scenario));

    // premium: 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 − 100 deductible = 100; cap 1200 − 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(code).toBe(0);
  });

  it("exits non-zero, writes to stderr, and writes no results when a quote has an unknown item type", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

    expect(code).not.toBe(0);
    expect(stdout).toBe("");
    // an error description, not a Node crash dump with a stack trace
    expect(stderr.trim()).toBe(
      "the MHPCO does not insure items of type broomstick",
    );
  });
  it("rejects the whole run when a later claim is not covered, writing no partial results", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
    };

    const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

    expect(code).not.toBe(0);
    expect(stderr.trim()).toBe("the policy does not cover a damaged amulet");
    // step 0 quoted successfully, but nothing is written on rejection
    expect(stdout).toBe("");
  });
});
