import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const CLI_PATH = "src/cli.ts";
const TSX_PATH = "node_modules/.bin/tsx";

function runCli(input: string): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(TSX_PATH, [CLI_PATH], {
    input,
    encoding: "utf8",
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("CLI", () => {
  it("reads JSON from stdin, writes JSON results to stdout (spec example)", () => {
    const scenario = JSON.stringify({
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
    });
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
  });

  it("writes error to stderr and exits non-zero on unknown item type", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    });
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type");
    expect(result.stdout).toBe("");
  });

  it("writes error to stderr and exits non-zero on negative damage amount", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("negative");
    expect(result.stdout).toBe("");
  });
});
