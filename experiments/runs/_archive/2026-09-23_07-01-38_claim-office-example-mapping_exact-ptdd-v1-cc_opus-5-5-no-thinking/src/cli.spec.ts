import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

describe("claim-office CLI", () => {
  it("schema example on stdin -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.status).toBe(0);
  });
  it("unknown item type -> non-zero exit, error on stderr, nothing on stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type: broomstick");
    expect(result.stdout).toBe("");
  });
  it("negative damage amount -> non-zero exit, error on stderr, nothing on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("negative");
    expect(result.stdout).toBe("");
  });
});
