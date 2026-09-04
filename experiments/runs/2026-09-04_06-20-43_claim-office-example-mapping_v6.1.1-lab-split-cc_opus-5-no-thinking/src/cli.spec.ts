import { describe, it, expect } from "vitest";
import { run } from "./cli.js";

describe("claim-office CLI", () => {
  it("writes the results JSON to stdout and exits 0 for a quote-only scenario", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    const { stdout, stderr, exitCode } = run(input);

    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    expect(stderr).toBe("");
    expect(exitCode).toBe(0);
  });
  it("handles the spec's schema example — a quote followed by a claim", () => {
    const input = `{
      "customer": {"yearsWithMHPCO": 5},
      "steps": [
        {
          "op": "quote",
          "items": [
            {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
          ]
        },
        {
          "op": "claim",
          "policy": 0,
          "incident": {
            "cause": "fire",
            "damages": [{"itemType": "amulet", "amount": 200}]
          }
        }
      ]
    }`;

    const { stdout, exitCode } = run(input);

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(exitCode).toBe(0);
  });
  it("rejects malformed JSON: empty stdout, a message on stderr, non-zero exit code", () => {
    const { stdout, stderr, exitCode } = run("not json at all");

    expect(stdout).toBe("");
    expect(stderr).not.toBe("");
    expect(exitCode).toBeGreaterThan(0);
  });
  it("rejects a scenario with an unknown item type: empty stdout, the type named on stderr, non-zero exit code", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    const { stdout, stderr, exitCode } = run(input);

    expect(stdout).toBe("");
    expect(stderr).toMatch(/broomstick/);
    expect(exitCode).toBeGreaterThan(0);
  });
  it("rejects a claim against an item not covered by the policy: empty stdout, non-zero exit code", () => {
    const input = JSON.stringify({
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

    const { stdout, stderr, exitCode } = run(input);

    expect(stdout).toBe("");
    expect(stderr).toMatch(/amulet/);
    expect(exitCode).toBeGreaterThan(0);
  });
  it("rejects a claim with a negative damage amount: empty stdout, non-zero exit code", () => {
    const input = JSON.stringify({
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

    const { stdout, stderr, exitCode } = run(input);

    expect(stdout).toBe("");
    expect(stderr).toMatch(/negative/);
    expect(exitCode).toBeGreaterThan(0);
  });
});
