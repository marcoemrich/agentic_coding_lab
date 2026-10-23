import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): RunResult {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

describe("claim-office CLI", () => {
  it("writes {premium: 59} for a 5-year customer's plain amulet quote and {payout: 100, remainingCap: 1100} for a claim on that policy (schema example)", () => {
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

  it("writes one result per step in input order across quote and claim steps", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [
        { premium: 115 },
        { premium: 62 },
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 1000 },
      ],
    });
  });
  it("exits non-zero and writes an error description to stderr with no results on stdout for an unknown item type in a quote", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("exits non-zero and writes an error description to stderr when a claim damages an item that is not part of the policy", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
    expect(result.stdout).toBe("");
  });
  it("exits non-zero and writes an error description to stderr when a claim damages an item with an unknown type", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("exits non-zero and writes an error description to stderr for a damage entry with amount -200", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("exits non-zero and rejects the whole claim when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
});

describe("claim-office CLI contract history", () => {
  it("charges 160 G for a long-standing customer's second quote of a cursed enchantment-7 sword (follow-up contract discount applies)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { premium: 160 }],
    });
  });
});
