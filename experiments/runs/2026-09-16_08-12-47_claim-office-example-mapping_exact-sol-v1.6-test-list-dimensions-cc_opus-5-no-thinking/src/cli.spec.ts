import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const run = promisify(execFile);
const CLI = new URL("./cli.ts", import.meta.url).pathname;

async function runCli(input: unknown): Promise<{ stdout: string; stderr: string; code: number }> {
  const child = run("npx", ["tsx", CLI], { encoding: "utf8" });
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { stdout, stderr, code: 0 };
  } catch (error) {
    const failure = error as { stdout: string; stderr: string; code: number };
    return { stdout: failure.stdout, stderr: failure.stderr, code: failure.code };
  }
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} JSON to stdout with exit code 0", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes an error to stderr, with no results on stdout, for an unknown item type in a quote", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item type: broomstick/i);
    expect(result.stdout).not.toMatch(/results/);
  });

  it("exits non-zero and writes an error to stderr for an invalid claim", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/not covered by the policy: amulet/i);
  });
});
