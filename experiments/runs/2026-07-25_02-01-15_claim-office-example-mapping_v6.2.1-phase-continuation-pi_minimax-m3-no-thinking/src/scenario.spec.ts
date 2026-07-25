import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import { runScenario } from "./scenario.js";

/** Run the claim-office CLI with a given stdin string and capture its output. */
function runCli(stdin: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["tsx", "src/cli.ts"], {
      cwd: new URL("..", import.meta.url).pathname,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("error", reject);
    proc.on("close", (code) => resolve({ exitCode: code ?? -1, stdout, stderr }));
    proc.stdin.end(stdin);
  });
}

describe("runScenario", () => {
  it("schema example: customer 5y, quote amulet then claim fire damage 200 → results match spec", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    // amulet: 60 base + 0 enchant (2 < 5) - 12 loyalty (60 * 0.2) + 6 first insurance (60 * 0.1) + 5 fee = 59
    expect(result.results[0]).toEqual({ premium: 59 });
    // damage 200 - 100 = 100; cap 600 * 2 = 1200
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("empty items quote → premium 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("multi-step: quote plain sword (new customer) → premium 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("multi-step: quote then claim steel sword enchantment 3 damage 500 → payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("multi-step: quote two swords then claim two damages → each damage processed independently", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("multi-step: cap exhaustion across two claim steps → first payout 1400 remainingCap 600, second payout 600 remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("multi-step: follow-up contract on second quote (isFollowup applied to 2nd quote only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // first quote: 100 + 10 first + 5 fee = 115 (no follow-up)
    expect(result.results[0]).toEqual({ premium: 115 });
    // second quote: 100 + 10 first - 15 follow-up + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("error: unknown item type in quote → throws Error, no results", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("error: damage itemType not in policy → throws Error, no results", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("error: negative damage amount → throws Error, no results", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
  it("error: more damages of sword type than swords in policy → throws Error, no results", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }] } },
      ],
    })).toThrow();
  });
});

describe("CLI subprocess", () => {
  it("reads JSON from stdin, writes JSON to stdout for valid scenario", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    const result = await runCli(input);
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
    expect(result.stderr).toBe("");
  });
  it("exits non-zero with stderr error and empty stdout on unknown item type", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = await runCli(input);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("exits non-zero with stderr error on damage itemType not in policy", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = await runCli(input);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("exits non-zero with stderr error on negative damage amount", async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    const result = await runCli(input);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
