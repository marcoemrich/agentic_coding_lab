import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CLI_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "cli.ts");

interface CliRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliRun {
  const result = spawnSync("node", ["--import", "tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("claim-office CLI (src/cli.ts)", () => {
  // End-to-end scenarios via stdin/stdout
  it("runs a scenario with one quote step and writes {results: [{premium}]} to stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("schema example: amulet quote then fire claim -- writes 2 results in order", () => {
    // customer 5 years (loyalty), 1st contract
    // amulet base 60, item mods 0, policy mods: -20% loyalty + 10% first = -10% of 60 = -6
    // premium = 60 - 12 + 6 + 5 = 59
    // claim: amount 200 -> 100 deductible -> payout 100, cap 1200 - 100 = 1100
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty("premium");
    expect(out.results[1]).toHaveProperty("payout");
    expect(out.results[1]).toHaveProperty("remainingCap");
    // verified specific amounts
    expect(out.results[0].premium).toBe(59);
    expect(out.results[1].payout).toBe(100);
    expect(out.results[1].remainingCap).toBe(1100);
  });
  it("newcomer + cursed sword integration scenario -- premium 165", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer 2nd contract scenario -- premium 160 (steps reflect ordering)", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out.results[1]).toEqual({ premium: 160 });
  });
  it("multi-step: quote then claim referencing earlier policy by index -- correct payout and remainingCap", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("two successive claims against same policy demonstrate cap exhaustion (1400 then 600)", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Error paths
  it("unknown item type in quote -- exits non-zero, writes error to stderr, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("claim references item not in policy -- exits non-zero, writes error to stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
  });
  it("claim has more damage entries of a type than the policy covers -- exits non-zero", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ] } },
      ],
    });
    expect(run.status).not.toBe(0);
  });
  it("claim contains negative damage amount -- exits non-zero, writes error to stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
  });
});
