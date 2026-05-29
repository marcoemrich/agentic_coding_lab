import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./cli.js";

describe("claim-office CLI — runScenario", () => {
  // --- Valid scenarios, simple → complex ---

  it("returns { results: [] } for a scenario with no steps", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 5 }, steps: [] })).toEqual({
      results: [],
    });
  });

  it("returns premium 59 for a single amulet quote (customer yearsWithMHPCO 5, first contract): 60 base - 12 loyalty + 6 first-insurance + 5 fee", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      }),
    ).toEqual({ results: [{ premium: 59 }] });
  });

  it("returns payout 100 and remainingCap 1100 for a claim of amount 200 on an amulet quote (200 - 100 deductible; cap 2*600 - 100)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
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
    ).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("returns results in the same order and length as steps for a quote followed by a claim (quote premium then claim payout/remainingCap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
    expect(result.results).toHaveLength(2);
  });

  it("applies the follow-up discount to the second quote of the same customer (first quote previousContracts 0, second quote previousContracts 1: first-insurance + 15% follow-up)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  it("draws down a shared cap across two successive claims on the same policy: first sword claim 1500 → payout 1400 remainingCap 600, second sword claim 1500 → payout 600 remainingCap 0", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      }),
    ).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Error cases ---

  it("throws when a quote includes an item with an unknown type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  it("throws when a claim references a damage entry whose itemType is not part of the referenced policy", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
    ).toThrow();
  });

  it("throws when a claim contains a damage entry with a negative amount", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow();
  });

  it("throws when a claim's damages contain more entries of a type than the policy covers (e.g. two sword damages but only one sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

describe("claim-office CLI — process entry point", () => {
  it("reads a JSON scenario from stdin, writes { results } JSON to stdout, and exits 0 on success", () => {
    const scenario = JSON.stringify({
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
      ],
    });

    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf-8",
      timeout: 20000,
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }] });
  });

  it("exits non-zero, writes an error to stderr, and writes no results to stdout when a step has an unknown item type", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf-8",
      timeout: 20000,
    });

    expect(result.status).not.toBe(0);
    expect(String(result.stderr).length).toBeGreaterThan(0);
    expect(String(result.stdout)).toBe("");
  });
});
