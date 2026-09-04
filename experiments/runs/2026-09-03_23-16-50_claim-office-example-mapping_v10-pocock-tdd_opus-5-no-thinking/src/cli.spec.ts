import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface Run {
  stdout: string;
  stderr: string;
  code: number;
}

/** Runs the claim-office CLI with the given stdin, as a user would. */
const runCli = (input: string): Promise<Run> =>
  new Promise((resolve) => {
    const child = execFile(
      "npx",
      ["tsx", CLI],
      (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          code: error && typeof error.code === "number" ? error.code : 0,
        });
      },
    );
    child.stdin!.end(input);
  });

describe("claim-office CLI", () => {
  test("writes a result for every step of the scenario", async () => {
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
    // 60 G base - 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
    // payout 200 - 100 = 100 G against a 1200 G cap
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  test("rejects a scenario it cannot process, explaining why on stderr", async () => {
    const { stdout, stderr, code } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });

  test("rejects input that is not valid JSON", async () => {
    const { stderr, code } = await runCli("not json at all");

    expect(code).not.toBe(0);
    expect(stderr).not.toBe("");
  });
});
