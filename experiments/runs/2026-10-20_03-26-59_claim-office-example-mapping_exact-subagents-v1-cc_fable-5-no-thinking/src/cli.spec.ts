// cli.spec.ts
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

describe("claim-office CLI", () => {
  it("should read a quote scenario from stdin and write {results:[{premium}]} to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    const stdout = execFileSync("node", ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should process steps sequentially and resolve a claim against its quote step by zero-based policy index", () => {
    const scenario = {
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
    };

    const stdout = execFileSync("node", ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("should write {payout, remainingCap} for a claim step", () => {
    const scenario = {
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
    };

    const stdout = execFileSync("node", ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should exit non-zero and write an error to stderr for an unknown item type, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    try {
      execFileSync("node", ["--import", "tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });
      expect.unreachable("CLI should have exited non-zero");
    } catch (error) {
      const cliError = error as {
        status: number | null;
        stderr: string;
        stdout: string;
      };
      expect(cliError.status).not.toBe(0);
      expect(cliError.stderr).toContain("Unknown item type: broomstick");
      expect(cliError.stdout).toBe("");
    }
  });
  it("should exit non-zero and write an error to stderr for a claim error (e.g. negative damage amount)", () => {
    const scenario = {
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
    };

    try {
      execFileSync("node", ["--import", "tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });
      expect.unreachable("CLI should have exited non-zero");
    } catch (error) {
      const cliError = error as { status: number | null; stderr: string };
      expect(cliError.status).not.toBe(0);
      expect(cliError.stderr).toContain("Negative damage amount: -200");
    }
  });
});
