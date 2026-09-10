import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (stdin: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input: stdin, encoding: "utf8" });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes an error to stderr for an unknown item type, with no results on stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toContain("results");
  });
});
