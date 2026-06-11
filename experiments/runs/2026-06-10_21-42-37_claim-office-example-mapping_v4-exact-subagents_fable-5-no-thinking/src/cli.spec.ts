// cli.spec.ts
//
// Tests spawn the CLI as a child process (`npx tsx src/cli.ts`), piping a
// scenario JSON document to stdin and capturing stdout/stderr/exit code.
// Expected outputs are computed via the core `processScenario` import rather
// than hardcoded constants, so the tests verify wiring, not arithmetic.
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

const runCli = (scenario: unknown) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("Claim Office CLI", () => {
  it("should write {\"results\": [...]} with the premium to stdout and exit 0 for a quote scenario on stdin", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    const result = runCli(scenario);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(processScenario(scenario));
  });
  it("should write results matching processScenario output (premium, then payout and remainingCap) and exit 0 for a quote+claim scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin ambush",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    const result = runCli(scenario);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(processScenario(scenario));
  });
  it("should exit non-zero with an error description on stderr and no results on stdout for an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const result = runCli(scenario);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
});
