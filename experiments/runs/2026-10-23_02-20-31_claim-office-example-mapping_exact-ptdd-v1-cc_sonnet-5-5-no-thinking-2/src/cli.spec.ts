import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const runCli = (stdin: string) => {
  const { status, stdout, stderr } = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: stdin,
    encoding: "utf8",
  });
  return { status, stdout, stderr };
};

describe("claim-office CLI", () => {
  it("valid scenario on stdin -> exit status 0 and JSON results on stdout", () => {
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

  it("rejected scenario (unknown item type) -> non-zero exit status, error on stderr, empty stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).toBe("");
  });
  it("rejected claim (negative amount) -> non-zero exit status, error on stderr, empty stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toContain("-200");
    expect(stdout).toBe("");
  });
  it("malformed JSON on stdin -> non-zero exit status and error on stderr (chosen reading)", () => {
    const { status, stdout, stderr } = runCli("{not json");
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
});
