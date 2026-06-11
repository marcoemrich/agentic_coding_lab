// cli.spec.ts
// The CLI is exercised as a child process: `npx tsx src/cli.ts` with JSON piped to stdin.
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const validScenario = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    {
      op: "quote",
      items: [
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ],
    },
  ],
};

const invalidScenario = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    {
      op: "quote",
      items: [
        { type: "broomstick", material: "silver", enchantment: 2, cursed: false },
      ],
    },
  ],
};

const runCli = (scenario: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
    timeout: 30_000,
  });

describe("claim-office CLI", () => {
  it('should write {"results": [...]} to stdout for a valid scenario', () => {
    const result = runCli(validScenario);

    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }] });
  }, 30_000);
  it("should exit with status 0 for a valid scenario", () => {
    const result = runCli(validScenario);

    expect(result.status).toBe(0);
  }, 30_000);
  it("should exit with a non-zero status for an invalid scenario", () => {
    const result = runCli(invalidScenario);

    expect(result.status).not.toBe(0);
  }, 30_000);
  it("should write an error description to stderr for an invalid scenario", () => {
    const result = runCli(invalidScenario);

    expect(result.stderr).toContain("broomstick");
  }, 30_000);
  it("should not write results to stdout for an invalid scenario", () => {
    const result = runCli(invalidScenario);

    expect(result.stdout).toBe("");
  }, 30_000);
  // NOT: premium/payout business rules (covered in claim-office.spec.ts),
  // malformed/non-JSON stdin handling, CLI flags, output formatting options
});
