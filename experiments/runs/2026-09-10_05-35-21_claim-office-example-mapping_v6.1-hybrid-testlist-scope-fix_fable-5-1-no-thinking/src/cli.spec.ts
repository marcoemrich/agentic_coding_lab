import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (stdin: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input: stdin, encoding: "utf8" });

describe("claim-office CLI", () => {
  it("schema example: amulet quote (5-year customer) → premium 59; fire claim 200 → payout 100, remainingCap 1100", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type (broomstick) → non-zero exit, error on stderr, no results on stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toContain("results");
  });
  it("claim for an item not in the policy → non-zero exit, error on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
    expect(stdout).not.toContain("results");
  });
});
