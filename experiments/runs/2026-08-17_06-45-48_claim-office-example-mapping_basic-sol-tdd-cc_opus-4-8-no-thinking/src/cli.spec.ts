import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(input: string): { stdout: string; status: number } {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI], { input, encoding: "utf8" });
    return { stdout, status: 0 };
  } catch (error) {
    const err = error as { status?: number; stdout?: string };
    return { stdout: err.stdout ?? "", status: err.status ?? 1 };
  }
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    // amulet base 60, loyalty -12 (>=2y), first +6, fee 5 => 59
    expect(output.results[0]).toEqual({ premium: 59 });
    // amulet cap 1200; damage 200 -> 100 payout, remaining 1100
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("exits non-zero and writes nothing to stdout for an unknown item type", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { stdout, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stdout.trim()).toBe("");
  });
});
