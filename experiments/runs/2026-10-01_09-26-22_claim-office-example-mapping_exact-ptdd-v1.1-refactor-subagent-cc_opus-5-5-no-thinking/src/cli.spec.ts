import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

const amuletQuote = {
  op: "quote",
  items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
};

describe("claim-office CLI", () => {
  it("schema example (5-year customer, silver amulet enchantment 2, fire damage 200) -> stdout results [{premium 59}, {payout 100, remainingCap 1100}], exit 0", () => {
    const fireClaim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } };
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [amuletQuote, fireClaim] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type -> exit status non-zero, error description on stderr, empty stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("claim with negative damage amount -> exit status non-zero, error description on stderr", () => {
    const negativeClaim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: -200 }] } };
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [amuletQuote, negativeClaim] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("-200");
  });
});
