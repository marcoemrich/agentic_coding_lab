import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (input: unknown) => {
  const result = spawnSync("node", ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return result;
};

describe("CLI", () => {
  it("schema example: amulet quote followed by fire claim → stdout results array matches shape {premium} then {payout, remainingCap}", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
  it("quote includes an item with an unknown type → exits non-zero, writes error to stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toMatch(/"results"/);
  });
  it("claim step references an unmatched or unknown item → exits non-zero, error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim step with a negative damage amount → exits non-zero, error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
});
