import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    cwd: projectRoot,
    input: JSON.stringify(input),
    encoding: "utf8",
  });

describe("claim-office CLI", () => {
  it("reads the schema-example scenario from stdin and writes {results:[{premium:59},{payout:100,remainingCap:1100}]} to stdout", () => {
    const { status, stdout } = runCli({
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
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("unknown item type in quote → non-zero exit, error on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.trim()).toBe("Error: Unknown item type: broomstick");
  });
  it("claim with negative amount → non-zero exit, error on stderr", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/negative/i);
  });
});
