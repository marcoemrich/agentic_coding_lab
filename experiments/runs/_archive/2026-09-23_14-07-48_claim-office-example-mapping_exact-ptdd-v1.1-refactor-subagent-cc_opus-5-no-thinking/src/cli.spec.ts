import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const CLI = new URL("cli.ts", import.meta.url).pathname;

interface FailedRun {
  status: number;
  stderr: string;
  stdout: string;
}

function runCliExpectingRejection(scenario: unknown): FailedRun {
  const result = spawnSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return {
    status: result.status ?? 0,
    stderr: result.stderr,
    stdout: result.stdout,
  };
}

function runCli(scenario: unknown): unknown {
  const stdout = execFileSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes one result per step to stdout -- amulet quote then a 200 G amulet claim for a 5-year customer", () => {
    expect(
      runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
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
      }),
    ).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it("resolves a claim's policy field as the zero-based index of the quote step that created the policy -- a claim on step 0 draws on the sword policy, not the later amulet policy", () => {
    expect(
      runCli({
        customer: { yearsWithMHPCO: 0 },
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
      }),
    ).toEqual({
      results: [
        { premium: 115 },
        { premium: 62 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("rejects a quote containing an unknown item type -- exits non-zero, writes an error description to stderr, and writes no results to stdout", () => {
    const run = runCliExpectingRejection({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).not.toMatch(/results/);
  });

  it("rejects a claim whose damaged item is not part of the policy -- an amulet damaged when only a sword is insured: exits non-zero with an error description on stderr", () => {
    const run = runCliExpectingRejection({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/amulet/);
    expect(run.stdout).not.toMatch(/results/);
  });

  it("rejects a claim referencing an unknown item type -- exits non-zero with an error description on stderr", () => {
    const run = runCliExpectingRejection({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).not.toMatch(/results/);
  });

  it("rejects a claim containing a damage entry with a negative amount (-200) -- exits non-zero with an error description on stderr", () => {
    const run = runCliExpectingRejection({
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
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/-200/);
    expect(run.stdout).not.toMatch(/results/);
  });

  it("rejects a claim with more damage entries of a type than the policy covers -- two sword damages but only one sword insured: exits non-zero with an error description on stderr", () => {
    const run = runCliExpectingRejection({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/sword/);
    expect(run.stdout).not.toMatch(/results/);
  });
});
