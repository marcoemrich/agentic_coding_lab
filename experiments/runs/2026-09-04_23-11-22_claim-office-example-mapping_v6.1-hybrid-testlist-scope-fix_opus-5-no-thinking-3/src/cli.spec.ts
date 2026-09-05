import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

const runCli = (scenario: unknown): string =>
  execFileSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes { results } JSON to stdout", () => {
    const stdout = runCli({
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

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits with a non-zero status code and writes an error to stderr on an invalid scenario", () => {
    const invalidScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const failure = (() => {
      try {
        runCli(invalidScenario);
        return undefined;
      } catch (error) {
        return error as { status: number; stdout: string; stderr: string };
      }
    })();

    expect(failure?.status).toBeGreaterThan(0);
    expect(failure?.stderr).toMatch(/broomstick/);
    expect(failure?.stdout).toBe("");
    // A description of what went wrong, not a crash dump.
    expect(failure?.stderr).not.toMatch(/at .*claim-office\.ts/);
  });
});
