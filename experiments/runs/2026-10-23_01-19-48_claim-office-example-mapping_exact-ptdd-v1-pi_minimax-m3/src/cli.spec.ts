import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  runScenario,
  type ClaimStep,
  type QuoteStep,
  type Scenario,
} from "./scenario.js";

function quoteStep(items: QuoteStep["items"]): QuoteStep {
  return { op: "quote", items };
}

function claimStep(
  policy: number,
  damages: ClaimStep["incident"]["damages"],
  cause = "fire",
): ClaimStep {
  return { op: "claim", policy, incident: { cause, damages } };
}

describe("MHPCO Claim Office - Scenario runner", () => {
  describe("basic I/O", () => {
    it("quote scenario → results array with premium", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [quoteStep([{ type: "sword" }])],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });

    it("claim references an earlier quote by step index", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          quoteStep([{ type: "sword" }]),
          claimStep(0, [{ itemType: "sword", amount: 500 }]),
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("multi-step scenarios", () => {
    it("tracks first vs follow-up contract across multiple quotes", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          quoteStep([{ type: "sword" }]),
          quoteStep([{ type: "sword" }]),
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 95 },
          { premium: 80 },
        ],
      });
    });

    it("tracks cap exhaustion across successive claims on same policy", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          quoteStep([{ type: "sword" }]),
          claimStep(0, [{ itemType: "sword", amount: 1500 }]),
          claimStep(0, [{ itemType: "sword", amount: 1500 }]),
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });

    it("throws ClaimOfficeError when claim references an out-of-range policy", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [claimStep(0, [{ itemType: "sword", amount: 500 }])],
      };
      expect(() => runScenario(scenario)).toThrow();
    });
  });
});

describe("MHPCO Claim Office - CLI", () => {
  function runCli(input: string): { status: number; stdout: string; stderr: string } {
    const result = spawnSync("node", ["--import", "tsx/esm", "src/cli.ts"], {
      input,
      encoding: "utf8",
      cwd: process.cwd(),
    });
    return {
      status: result.status ?? -1,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
    };
  }

  it("reads scenario from stdin, writes JSON results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    const { status, stdout, stderr } = runCli(input);
    expect(status).toBe(0);
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });

  it("exits non-zero and writes error to stderr on unknown item type", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { status, stdout, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("exits non-zero and writes error to stderr on invalid claim", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -1 }] },
        },
      ],
    });
    const { status, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("writes no results to stdout when scenario fails", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { stdout, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stdout.trim()).toBe("");
  });
});
