import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "cli.ts");

const runCli = (input: string): { stdout: string; status: number; stderr: string } => {
  try {
    const stdout = execFileSync("npx", ["tsx", cliPath], {
      input,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout, status: 0, stderr: "" };
  } catch (e) {
    const err = e as { status: number; stdout: Buffer; stderr: Buffer };
    return {
      stdout: err.stdout?.toString() ?? "",
      status: err.status ?? 1,
      stderr: err.stderr?.toString() ?? "",
    };
  }
};

describe("CLI", () => {
  it("processes a simple quote", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("exits non-zero with stderr on unknown item type", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
