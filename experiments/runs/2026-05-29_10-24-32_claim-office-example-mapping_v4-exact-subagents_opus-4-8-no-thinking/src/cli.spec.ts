import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// CLI integration tests: spawn src/cli.ts, write a JSON scenario to stdin,
// read the JSON results from stdout, and assert on the process exit code.

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("npx", ["tsx", cliPath], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("claim-office CLI (stdin -> stdout)", () => {
  it("should read a scenario from stdin and write a results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };

    const { status, stdout } = runCli(scenario);

    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(Array.isArray(parsed.results)).toBe(true);
  });
  it("should return one result per step, in the same order as the input steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };

    const { status, stdout } = runCli(scenario);

    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(scenario.steps.length);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
    expect(parsed.results[2]).toHaveProperty("premium");
  });
  it("should emit a quote result with a premium field for a quote step", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    const { status, stdout } = runCli(scenario);

    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(typeof parsed.results[0].premium).toBe("number");
  });
  it("should emit a claim result with payout and remainingCap fields for a claim step", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };

    const { status, stdout } = runCli(scenario);

    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(typeof parsed.results[1].payout).toBe("number");
    expect(typeof parsed.results[1].remainingCap).toBe("number");
  });
  it("should process the schema example (amulet quote then fire claim) end to end", () => {
    const scenario = {
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
    };

    const { status, stdout } = runCli(scenario);

    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  describe("error exits (non-zero status, stderr, no results on stdout)", () => {
    it("should exit non-zero for a quote with an unknown item type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const { status, stdout, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);

      let parsedResults: unknown = undefined;
      try {
        parsedResults = JSON.parse(stdout).results;
      } catch {
        parsedResults = undefined;
      }
      expect(parsedResults).toBeUndefined();
    });
    it("should exit non-zero for a claim referencing an item not in the policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
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
      };

      const { status, stdout, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);

      let parsedResults: unknown = undefined;
      try {
        parsedResults = JSON.parse(stdout).results;
      } catch {
        parsedResults = undefined;
      }
      expect(parsedResults).toBeUndefined();
    });
    it("should exit non-zero for a claim with more damage entries than the policy covers", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };

      const { status, stdout, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);

      let parsedResults: unknown = undefined;
      try {
        parsedResults = JSON.parse(stdout).results;
      } catch {
        parsedResults = undefined;
      }
      expect(parsedResults).toBeUndefined();
    });
    it("should exit non-zero for a claim with a negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
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

      const { status, stdout, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);

      let parsedResults: unknown = undefined;
      try {
        parsedResults = JSON.parse(stdout).results;
      } catch {
        parsedResults = undefined;
      }
      expect(parsedResults).toBeUndefined();
    });
  });
});
