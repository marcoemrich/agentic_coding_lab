import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (input: object) =>
  spawnSync("npx", ["tsx", cliPath], { input: JSON.stringify(input), encoding: "utf8" });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results} JSON to stdout", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
    expect(status).toBe(0);
  });
  it("unknown item type → non-zero exit, error on stderr, no results on stdout", () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });
});
