import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

type CliRun = { stdout: string; stderr: string; code: number };

// The CLI is exercised as a real subprocess so that stdin, stdout and the
// exit code — the whole of its contract — are genuinely under test.
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", CLI], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));

    child.stdin.end(input);
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
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
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
    "writes one result per step, in the same order as the input steps",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 500 }] },
          },
        ],
      };

      const { stdout, code } = await runCli(JSON.stringify(scenario));
      const { results } = JSON.parse(stdout);

      expect(code).toBe(0);
      expect(results).toHaveLength(4);
      expect(results).toEqual([
        { premium: 115 },
        { premium: 62 },
        { payout: 200, remainingCap: 1800 },
        { payout: 400, remainingCap: 800 },
      ]);
    },
    30000,
  );
  // Result shapes per step type — {premium} vs {payout, remainingCap} — are
  // asserted exactly by the ordering test above.
  it(
    "exits with a non-zero status and writes to stderr on an unknown item type",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

      expect(code).not.toBe(0);
      expect(stderr).toMatch(/broomstick/i);
      expect(stdout.trim()).toBe("");
      // A description of the problem, not a stack trace dumped at the customer.
      expect(stderr).not.toMatch(/^\s*at\s/m);
    },
    30000,
  );
  it(
    "exits with a non-zero status and writes to stderr on an invalid claim",
    async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      };

      const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

      expect(code).not.toBe(0);
      expect(stderr).toMatch(/amulet/i);
      expect(stdout.trim()).toBe("");
      expect(stderr).not.toMatch(/^\s*at\s/m);
    },
    30000,
  );
  // "No results on stdout when the scenario is rejected" is asserted by the
  // `stdout.trim()` expectation in both rejection tests above.
});
