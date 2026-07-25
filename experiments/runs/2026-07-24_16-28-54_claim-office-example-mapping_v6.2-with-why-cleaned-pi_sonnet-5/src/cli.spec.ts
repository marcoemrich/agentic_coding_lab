import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, "cli.ts");

const runCli = (input: unknown): { status: number | null; stdout: string; stderr: string } => {
  const result = spawnSync("node", ["--import", "tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

describe("CLI - claim-office", () => {
  it(
    "reads a scenario JSON from stdin and writes a results JSON to stdout matching the schema example",
    () => {
      const { status, stdout } = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        ],
      });
      expect(status).toBe(0);
      const output = JSON.parse(stdout);
      expect(output).toHaveProperty("results");
      expect(output.results).toHaveLength(1);
      expect(typeof output.results[0].premium).toBe("number");
    },
    10000
  );
  it(
    "processes a quote step followed by a claim step referencing it via zero-based policy index",
    () => {
      const { status, stdout } = runCli({
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
      expect(status).toBe(0);
      const output = JSON.parse(stdout);
      expect(output.results).toHaveLength(2);
      expect(typeof output.results[1].payout).toBe("number");
      expect(typeof output.results[1].remainingCap).toBe("number");
    },
    10000
  );
  it(
    "quote with an unknown item type -> exits with non-zero status and writes error to stderr, no results on stdout",
    () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
      expect(stdout).not.toContain("results");
    },
    10000
  );
  it(
    "claim referencing a damage item not part of the policy -> exits with non-zero status and writes error to stderr",
    () => {
      const { status, stderr } = runCli({
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
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    },
    10000
  );
  it(
    "claim with a damage amount of -200 -> exits with non-zero status and writes error to stderr",
    () => {
      const { status, stderr } = runCli({
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
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    },
    10000
  );
});
