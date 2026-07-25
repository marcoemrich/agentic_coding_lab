import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";

describe("CLI", () => {
  it("valid scenario -> stdout JSON {results}, exit 0, stderr empty", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const output = runCli(input);
    expect(output.exit).toBe(0);
    expect(output.stderr).toBe("");
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote unknown item type -> exit non-zero, stderr non-empty, no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const output = runCli(input);
    expect(output.exit).not.toBe(0);
    expect(output.stderr).not.toBe("");
    expect(output.stdout).toBe("");
  });
  it("claim damage item not in policy -> exit non-zero, stderr non-empty", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const output = runCli(input);
    expect(output.exit).not.toBe(0);
    expect(output.stderr).not.toBe("");
  });
  it("claim negative amount -> exit non-zero, stderr non-empty", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    const output = runCli(input);
    expect(output.exit).not.toBe(0);
    expect(output.stderr).not.toBe("");
  });
  it("claim damages count exceeds coverage -> exit non-zero, stderr non-empty (whole claim rejected)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    const output = runCli(input);
    expect(output.exit).not.toBe(0);
    expect(output.stderr).not.toBe("");
  });
});
