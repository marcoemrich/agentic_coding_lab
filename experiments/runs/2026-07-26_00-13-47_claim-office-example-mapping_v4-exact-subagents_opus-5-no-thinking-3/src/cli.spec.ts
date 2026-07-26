import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

type CliRun = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["exec", "tsx", CLI_PATH], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += String(chunk)));
    child.stderr.on("data", (chunk) => (stderr += String(chunk)));
    child.on("error", reject);
    child.on("close", (exitCode) => resolve({ stdout, stderr, exitCode }));
    child.stdin.end(input);
  });

describe("claim-office CLI", () => {
  it("should read a single-step quote scenario from stdin and write the results JSON to stdout with exit code 0", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 3,
              cursed: false,
            },
          ],
        },
      ],
    };

    const { stdout, exitCode } = await runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    expect(exitCode).toBe(0);
  });
  it("should write one result per step, in order, for a multi-step quote-then-claim scenario", async () => {
    const scenario = {
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
    };

    const { stdout, exitCode } = await runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(exitCode).toBe(0);
  });
  it("should exit with a non-zero status code and write an error description to stderr when the scenario is rejected", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stderr, exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).not.toBe(0);
    expect(stderr.trim()).not.toBe("");
    expect(stderr).toContain("broomstick");
    expect(stderr).not.toMatch(/^\s*at /m);
    expect(stderr).not.toContain("throw ");
  });
  it("should write nothing to stdout when the scenario is rejected", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
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
            damages: [{ itemType: "amulet", amount: -200 }],
          },
        },
      ],
    };

    const { stdout, exitCode } = await runCli(JSON.stringify(scenario));

    expect(stdout).toBe("");
    expect(exitCode).not.toBe(0);
  });
});
