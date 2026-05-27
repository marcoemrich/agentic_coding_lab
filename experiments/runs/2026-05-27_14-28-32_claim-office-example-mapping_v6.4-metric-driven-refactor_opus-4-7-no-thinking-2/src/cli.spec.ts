import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (input: string): { stdout: string; stderr: string; status: number | null } => {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input,
    encoding: "utf-8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
};

describe("claim-office CLI", () => {
  it("reads scenario from stdin and writes results to stdout", () => {
    const input = JSON.stringify({
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
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("exits non-zero and writes to stderr on unknown item type", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
  });
});
