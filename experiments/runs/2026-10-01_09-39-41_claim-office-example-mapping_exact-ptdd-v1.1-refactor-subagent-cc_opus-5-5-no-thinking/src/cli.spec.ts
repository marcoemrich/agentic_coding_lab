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
  it("reads the schema example scenario from stdin and writes {results:[{premium:59},{payout:100,remainingCap:1100}]} to stdout with exit code 0", () => {
    const { status, stdout } = runCli(schemaExample);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type -> non-zero exit code, error description on stderr, nothing on stdout", () => {
    const { status, stdout, stderr } = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).toBe("");
  });
  it("claim with negative damage amount -> non-zero exit code, error description on stderr, nothing on stdout", () => {
    const negativeDamage = { itemType: "amulet", amount: -200 };
    const scenario = {
      ...schemaExample,
      steps: [schemaExample.steps[0], { op: "claim", policy: 0, incident: { cause: "fire", damages: [negativeDamage] } }],
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).toContain("negative");
    expect(stdout).toBe("");
  });
});
