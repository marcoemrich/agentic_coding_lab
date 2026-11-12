import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (stdin: string) =>
  spawnSync(process.execPath, ["--import", "tsx", cliPath], { input: stdin, encoding: "utf8" });

describe("claim-office CLI (src/cli.ts)", () => {
  it("schema example: reads the scenario JSON from stdin and writes {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]} to stdout with exit status 0", () => {
    const scenario = {
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
    };

    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));

    expect(stderr).toBe("");
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  // Adopted reading: the "error description" is a single line naming the problem, not a stack trace.
  it("quote with an unknown item type (broomstick) -> non-zero exit status, error description on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));

    expect(stderr).toMatch(/^[^\n]*broomstick[^\n]*\n$/);
    expect(stdout).toBe("");
    expect(status).not.toBe(0);
  });

  it("claim with a damage entry whose item is not part of the policy -> non-zero exit status, error description on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };

    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));

    expect(stderr).toMatch(/^[^\n]*amulet[^\n]*\n$/);
    expect(stdout).toBe("");
    expect(status).not.toBe(0);
  });
});
