import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tsx = resolve("node_modules/.bin/tsx");
const cli = resolve("src/cli.ts");

function scenario(itemType: string): string {
  return JSON.stringify({
    customer: { yearsWithMHPCO: 5 },
    steps: [
      { op: "quote", items: [{ type: itemType, material: "silver", enchantment: 2, cursed: false }] },
      {
        op: "claim",
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType, amount: 200 }] },
      },
    ],
  });
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results as JSON", () => {
    const stdout = execFileSync(tsx, [cli], { input: scenario("amulet"), encoding: "utf8" });
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("reports errors on stderr without writing results", () => {
    const execution = spawnSync(tsx, [cli], {
      input: scenario("broomstick"),
      encoding: "utf8",
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stdout).toBe("");
    expect(execution.stderr).toContain("Unknown item type");
  });

  it("rejects input outside the normative schema", () => {
    const execution = spawnSync(tsx, [cli], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: "many" }, steps: [] }),
      encoding: "utf8",
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stdout).toBe("");
    expect(execution.stderr).toContain("yearsWithMHPCO must be an integer");
  });
});
