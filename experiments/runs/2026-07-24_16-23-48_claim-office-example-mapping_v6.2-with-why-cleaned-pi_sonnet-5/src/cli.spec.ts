import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const CLI_PATH = path.resolve(__dirname, "cli.ts");

const runCli = (input: unknown) => {
  return spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
};

describe("CLI - stdin/stdout contract", () => {
  it("reads a scenario JSON from stdin and writes a results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
  });
  it("exits with a non-zero status and writes an error to stderr for an unknown item type in a quote step, without writing results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("exits with a non-zero status and writes an error to stderr for a claim referencing an item not part of the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("exits with a non-zero status and writes an error to stderr for a negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
