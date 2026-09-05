import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

type CliRun = { stdout: string; stderr: string; code: number };

// Spawns the real CLI so the tests exercise the actual stdin/stdout contract.
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", CLI], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));

    child.stdin.write(input);
    child.stdin.end();
  });

describe("claim-office CLI", () => {
  it(
    "reads a scenario from stdin and writes {results: [...]} to stdout",
    async () => {
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
        ],
      };

      const { stdout, code } = await runCli(JSON.stringify(scenario));

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }] });
    },
    30000,
  );

  it(
    "writes one result per step, in the same order as the input steps, with quote results carrying a premium and claim results a payout and remainingCap",
    async () => {
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

      const { stdout, code } = await runCli(JSON.stringify(scenario));

      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    },
    30000,
  );
  it(
    "exits with a non-zero status and writes to stderr for an unknown item type, with no results on stdout",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

      expect(code).not.toBe(0);
      expect(stderr).toContain("broomstick");
      expect(stdout).not.toContain("results");
      // A description, not a crash: an uncaught throw would dump a multi-line
      // stack trace, which is not an error description a caller can act on.
      expect(stderr.trim().split("\n")).toHaveLength(1);
    },
    30000,
  );
  it(
    "exits with a non-zero status and writes to stderr for a damage entry not covered by the policy",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
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

      const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

      expect(code).not.toBe(0);
      expect(stderr).toContain("amulet");
      expect(stdout).not.toContain("results");
      expect(stderr.trim().split("\n")).toHaveLength(1);
    },
    30000,
  );
  it(
    "exits with a non-zero status and writes to stderr for a negative damage amount",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
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

      const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

      expect(code).not.toBe(0);
      expect(stderr).toContain("negative");
      expect(stdout).not.toContain("results");
      expect(stderr.trim().split("\n")).toHaveLength(1);
    },
    30000,
  );
  it(
    "exits with a non-zero status and writes to stderr for stdin that is not a valid scenario",
    async () => {
      const { stdout, stderr, code } = await runCli("{}");

      expect(code).not.toBe(0);
      expect(stdout).not.toContain("results");
      expect(stderr.trim().split("\n")).toHaveLength(1);
      // The description must name what is wrong with the input, not leak a
      // JavaScript internal like "steps.reduce is not a function".
      expect(stderr).toMatch(/scenario|steps|customer/i);
      expect(stderr).not.toContain("reduce");
    },
    30000,
  );
});
