import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "cli.ts");
const tsxBin = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../node_modules/.bin/tsx");

const runCli = (input: unknown) => {
  const result = spawnSync(tsxBin, [cliPath], { input: JSON.stringify(input), encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

const schemaExample = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};

describe("claim-office CLI", () => {
  it("should read a scenario from stdin and write results to stdout (schema example: 5 years, amulet quote then fire claim 200 G) — {results: [{premium: 59}, {payout: 100, remainingCap: 1100}]}", () => {
    const { status, stdout } = runCli(schemaExample);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("should exit non-zero, write an error to stderr and no results to stdout for an unknown item type in a quote", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toContain("results");
  });
  it("should exit non-zero and write an error to stderr for a claim referencing an item not in the policy", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
  });
});
