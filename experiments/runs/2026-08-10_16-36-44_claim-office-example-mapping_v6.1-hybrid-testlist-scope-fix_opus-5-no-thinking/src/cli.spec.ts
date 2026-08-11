import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));
const TSX = fileURLToPath(new URL("../node_modules/.bin/tsx", import.meta.url));

const runCli = (input: unknown) =>
  spawnSync(TSX, [CLI], { input: JSON.stringify(input), encoding: "utf8" });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results in step order to stdout", () => {
    const result = runCli({
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

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("quote with an unknown item type (broomstick) → non-zero exit, error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim referencing an item not part of the policy → non-zero exit and error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with a damage amount of -200 → non-zero exit and error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200|negative/);
    expect(result.stdout).not.toContain("results");
  });
});
