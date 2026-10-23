import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

type CliRun = { stdout: string; stderr: string; exitCode: number };

const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", CLI_PATH], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, exitCode: code ?? 0 }));
    child.stdin.end(input);
  });

describe("claim-office CLI", () => {
  it("should read a quote scenario from stdin and write {\"results\":[{\"premium\":...}]} to stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };

    const { stdout } = await runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }] });
  }, 30000);

  it("should write a results array of the same length and order as the input steps", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        { op: "quote", items: [{ type: "potion" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "sword", amount: 500 }] },
        },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "potion", amount: 300 }] },
        },
      ],
    };

    const { stdout } = await runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({
      results: [
        { premium: 95 },
        { premium: 54 },
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 1100 },
      ],
    });
  }, 30000);
  it("should write payout and remainingCap for a claim step referencing an earlier quote by its step index", async () => {
    const scenario = {
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
    };

    const { stdout } = await runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);
  it("should exit with code 0 for a valid scenario", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };

    const { exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).toBe(0);
  }, 30000);
  it("should exit with a non-zero status code and write an error description to stderr for an unknown item type, with no results on stdout", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stdout, stderr, exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stderr).not.toContain("at ");
    expect(stdout).not.toContain("results");
  }, 30000);
  it("should exit with a non-zero status code and write an error description to stderr for a damage to an uninsured item", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const { stdout, stderr, exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("amulet");
    expect(stderr).not.toContain("at ");
    expect(stdout).not.toContain("results");
  }, 30000);
  it("should exit with a non-zero status code and write an error description to stderr for a negative damage amount", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    const { stdout, stderr, exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("-200");
    expect(stderr).not.toContain("at ");
    expect(stdout).not.toContain("results");
  }, 30000);
  it("should exit with a non-zero status code and write an error description to stderr for more damage entries than insured items", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    const { stdout, stderr, exitCode } = await runCli(JSON.stringify(scenario));

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("sword");
    expect(stderr).not.toContain("at ");
    expect(stdout).not.toContain("results");
  }, 30000);
});
