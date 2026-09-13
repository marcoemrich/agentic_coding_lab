import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes ordered JSON results to stdout", () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const execution = runCli(input);
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("exits non-zero with stderr and no stdout when a scenario is rejected", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("Unknown item type: broomstick");
    expect(execution.stdout).toBe("");
  });
});
