// cli.spec.ts
import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";

type CliResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

const runCli = (input: string): Promise<CliResult> =>
  new Promise((resolve, reject) => {
    const child = execFile(
      "npx",
      ["tsx", "src/cli.ts"],
      (error, stdout, stderr) => {
        if (error && error.code === undefined) {
          reject(error);
          return;
        }
        resolve({
          stdout,
          stderr,
          exitCode: child.exitCode,
        });
      }
    );
    child.stdin?.write(input);
    child.stdin?.end();
  });

describe("Claim Office CLI", () => {
  it(
    "should write {\"results\": [...]} JSON to stdout and exit with code 0 for a valid scenario (quote silver amulet ench 2 → premium 59; claim fire amulet 200 → payout 100, remainingCap 1100)",
    async () => {
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
    },
    20000
  );
  it(
    "should exit with a non-zero code, write an error description to stderr, and write no results to stdout for an unknown item type",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const { stdout, stderr, exitCode } = await runCli(
        JSON.stringify(scenario)
      );

      expect(exitCode).not.toBe(0);
      expect(stderr).toContain("Unknown item type");
      expect(stdout).toBe("");
    },
    20000
  );
});
