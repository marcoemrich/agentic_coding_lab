import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Inactive test list for the claim-office CLI contract.
// Chosen reading for unspecified error text: the specification requires a
// non-zero exit status, a non-empty stderr description and no results on
// stdout; it does not fix an error message, so tests assert only that contract.
const CLI = "src/cli.ts";

interface CliRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliRun {
  const result = spawnSync("node_modules/.bin/tsx", [CLI], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("claim-office CLI", () => {
  it("schema example: amulet quote 59 G then amulet claim 200 G -> [{premium:59},{payout:100,remainingCap:1100}]", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(run.stderr).toBe("");
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("empty item list -> [{premium:5}]", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(run.stderr).toBe("");
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("results array has one entry per step in input order (quote, quote, claim)", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claim refers to the policy of the quote step named by its zero-based index", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout).results[2]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("quote with unknown item type (broomstick) -> non-zero exit, stderr description, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("claim damage for an item not in the policy -> non-zero exit, stderr description, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("claim damage with unknown item type -> non-zero exit, stderr description, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("claim damage with amount -200 -> non-zero exit, stderr description, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("two sword damages but only one sword insured -> non-zero exit, whole claim rejected", () => {
    const run = runCli({
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
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
});
