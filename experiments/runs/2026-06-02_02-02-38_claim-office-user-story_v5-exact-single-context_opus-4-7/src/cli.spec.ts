import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";

describe("claim-office CLI", () => {
  it("transforms a JSON scenario on stdin to a JSON results document on stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(JSON.parse(runCli(input))).toEqual({ results: [] });
  });

  it("processes schema example 1 (quote-only)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    const out = JSON.parse(runCli(input));
    // 100 × 1.10 + 5 = 115
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  it("processes schema example 2 (quote followed by two claims)", () => {
    const input = JSON.stringify({
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
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
        },
      ],
    });
    const out = JSON.parse(runCli(input));
    expect(out).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
});
