import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const CLI_PATH = join(__dirname, "cli.ts");

const runCli = (
  input: unknown
): { stdout: string; stderr: string; status: number } => {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify(input),
      encoding: "utf-8",
    });
    return { stdout, stderr: "", status: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout?.toString() ?? "",
      stderr: error.stderr?.toString() ?? "",
      status: error.status ?? 1,
    };
  }
};

describe("CLI end-to-end scenarios", () => {
  it("schema example from the spec: single amulet quote followed by a claim on it -> produces results array with premium and payout/remainingCap", () => {
    const input = {
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
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    expect(output.results).toHaveLength(2);
    expect(typeof output.results[0].premium).toBe("number");
    expect(typeof output.results[1].payout).toBe("number");
    expect(typeof output.results[1].remainingCap).toBe("number");
  });

  it("unknown item type in a quote step (e.g. broomstick) -> CLI exits with non-zero status and writes an error description to stderr, no results written to stdout", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });

  it("claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only a sword is insured) -> CLI exits with non-zero status and writes an error description to stderr", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("claim contains a damage entry with amount: -200 -> CLI exits with non-zero status and writes an error description to stderr", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("damages array contains more entries of a given type than the policy covers (e.g. two sword damages but only one sword insured) -> CLI exits with non-zero status, whole claim rejected", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const { stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
