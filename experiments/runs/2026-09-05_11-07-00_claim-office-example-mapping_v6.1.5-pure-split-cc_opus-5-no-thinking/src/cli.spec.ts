import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

/** Runs the claim-office CLI with the given stdin, capturing its output. */
const runCli = (stdin: string): CliRun => {
  const { status, stdout, stderr } = spawnSync("npx", ["tsx", CLI], {
    input: stdin,
    encoding: "utf8",
  });
  return { status: status ?? 1, stdout, stderr };
};

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    const { status, stdout } = runCli(JSON.stringify(scenario));

    // quote: 60 base − 12 loyalty (5 years) + 6 first insurance + 5 fee = 59
    // claim: 200 − 100 deductible = 100; insurance sum 600 → cap 1200 → 1100 left
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it("writes premium for quote steps and payout + remainingCap for claim steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", cursed: false }],
        },
      ],
    };

    const { status, stdout } = runCli(JSON.stringify(scenario));
    const { results } = JSON.parse(stdout);

    expect(status).toBe(0);
    // quote 115; claim 400 with 1600 of the 2000 cap left; second quote
    // 40 base + 4 first insurance − 6 follow-up + 5 fee = 43
    expect(results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
      { premium: 43 },
    ]);
    // A quote result carries only a premium; a claim result only the payout
    // and what the cap has left.
    expect(Object.keys(results[0])).toEqual(["premium"]);
    expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
    expect(Object.keys(results[2])).toEqual(["premium"]);
  }, 30000);
  it("exits with a non-zero status code and writes an error to stderr for an unknown item type, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toContain("results");
    // An error description for the customer, not a crash: no stack trace.
    expect(stderr).not.toMatch(/\bat .*\.ts:\d+/);
  }, 30000);
  it("exits with a non-zero status code and writes an error to stderr for an invalid claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/sword/);
    // The quote at step 0 succeeded, but a scenario that fails part-way
    // writes nothing at all to stdout.
    expect(stdout).not.toContain("results");
    expect(stderr).not.toMatch(/\bat .*\.ts:\d+/);
  }, 30000);
});
