import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, "cli.ts");

const runCli = (
  input: unknown
): { status: number; stdout: string; stderr: string } => {
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, "..", "node_modules", "tsx", "dist", "cli.mjs"), CLI_PATH],
    {
      input: JSON.stringify(input),
      encoding: "utf-8",
    }
  );
  return {
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

describe("CLI end-to-end", () => {
  it("schema example: single amulet quote then claim -> stdout results array with premium, payout, remainingCap", () => {
    const input = {
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
    };
    const result = runCli(input);
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
  it("quote step with unknown item type (e.g. broomstick) -> CLI exits non-zero, writes error to stderr, no results written to stdout", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toMatch(/"results"/);
  });
  it("scenario with multiple steps -> results array has same length and order as input steps", () => {
    const input = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = runCli(input);
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(3);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("premium");
    expect(output.results[2]).toHaveProperty("payout");
    expect(output.results[2]).toHaveProperty("remainingCap");
  });
});
