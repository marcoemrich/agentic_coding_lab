import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = async (
  stdin: string,
): Promise<{ stdout: string; stderr: string; code: number }> => {
  const child = execFile("npx", ["tsx", "src/cli.ts"]);
  child.stdin?.end(stdin);

  const [stdout, stderr] = await Promise.all([
    collect(child.stdout),
    collect(child.stderr),
  ]);
  const code = await new Promise<number>((resolve) =>
    child.on("close", (exitCode) => resolve(exitCode ?? 0)),
  );

  return { stdout, stderr, code };
};

const collect = (stream: NodeJS.ReadableStream | null): Promise<string> =>
  new Promise((resolve) => {
    if (!stream) return resolve("");
    let text = "";
    stream.on("data", (chunk) => (text += chunk));
    stream.on("end", () => resolve(text));
  });

const SCENARIO = JSON.stringify({
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
      incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
    },
  ],
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes the results JSON to stdout", async () => {
    const { stdout, code } = await run(SCENARIO);

    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      // 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero, describes the error on stderr, and writes no results to stdout for an invalid scenario", async () => {
    const { stdout, stderr, code } = await run(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(code).not.toBe(0);
    expect(stdout).toBe("");
    // A description of the problem, not a crash: no stack trace, one line.
    expect(stderr).toMatch(/broomstick/);
    expect(stderr).not.toMatch(/\s+at\s/);
    expect(stderr.trim().split("\n")).toHaveLength(1);
  });
});
