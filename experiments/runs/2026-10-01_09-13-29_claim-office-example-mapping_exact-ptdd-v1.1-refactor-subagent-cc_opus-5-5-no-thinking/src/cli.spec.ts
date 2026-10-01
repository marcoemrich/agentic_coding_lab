import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });

const schemaExample = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};

describe("claim-office CLI", () => {
  it("schema example on stdin → exit 0 and stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}", () => {
    const result = runCli(schemaExample);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type → non-zero exit, error on stderr, nothing on stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("claim with negative damage amount → non-zero exit, error on stderr, nothing on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
});
