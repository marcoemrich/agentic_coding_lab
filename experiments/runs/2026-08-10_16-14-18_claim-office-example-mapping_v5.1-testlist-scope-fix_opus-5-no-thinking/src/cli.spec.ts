import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  code: number;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile("npx", ["tsx", CLI], (error, stdout, stderr) => {
      resolve({ code: error ? (error as { code?: number }).code ?? 1 : 0, stdout, stderr });
    });
    child.stdin!.end(input);
  });
}

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes results to stdout", async () => {
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

    const { code, stdout } = await runCli(JSON.stringify(scenario));

    expect(code).toBe(0);
    // 60 base − 12 loyalty + 6 first insurance + 5 fee = 59 G; payout 200 − 100 = 100 G,
    // cap 1200 G → 1100 G remaining.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it("exits non-zero and writes to stderr when an item type is unknown, with no results on stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { code, stdout, stderr } = await runCli(JSON.stringify(scenario));

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  }, 30000);
});
