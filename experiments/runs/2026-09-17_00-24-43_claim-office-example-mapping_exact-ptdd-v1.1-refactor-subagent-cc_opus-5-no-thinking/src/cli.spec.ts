import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliResult {
  readonly status: number;
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs the claim-office CLI over a scenario, the way MHPCO's clerks do. */
function runCli(scenario: unknown): CliResult {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

describe("claim-office CLI", () => {
  it("reads a JSON scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { premium: 62 }] });
  });

  it("resolves a claim step's policy field to the zero-based index of the earlier quote step", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // the claim settles against the sword policy of step 0: cap 2000, payout 400
    expect(JSON.parse(result.stdout).results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("processes the schema example -- amulet quote then a 200 G amulet claim", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // amulet: 60 base - 12 loyalty + 6 first insurance = 54, + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 leaves 1100
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes to stderr when a quote names an unknown item type, writing no results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });

  it("exits non-zero and writes to stderr when a claim names an item the policy does not cover", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).toBe("");
  });

  it("exits non-zero and writes to stderr when a damage amount is negative", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200/);
    expect(result.stdout).toBe("");
  });
});
