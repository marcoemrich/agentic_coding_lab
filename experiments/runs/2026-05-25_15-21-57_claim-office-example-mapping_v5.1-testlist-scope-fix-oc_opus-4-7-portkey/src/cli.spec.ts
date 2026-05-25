import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, "cli.ts");

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("claim-office CLI", () => {
  it("reads JSON from stdin, writes JSON results to stdout for a simple quote", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("exits with non-zero status and writes error to stderr on unknown item type (no results on stdout)", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
  it("exits with non-zero status on claim referencing item type not in policy", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
  it("exits with non-zero status on claim with negative damage amount", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
