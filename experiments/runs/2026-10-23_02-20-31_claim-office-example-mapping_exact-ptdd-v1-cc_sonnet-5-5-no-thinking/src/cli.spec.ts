import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown) {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("claim-office CLI", () => {
  it("schema example (5 years, silver amulet, fire damage 200) -- stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it("unknown item type in a quote -- non-zero exit, error description on stderr, nothing on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).toBe("");
  });
  it("claim damaging an uninsured item -- non-zero exit, error description on stderr, nothing on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toContain("amulet");
    expect(stdout).toBe("");
  });
});
