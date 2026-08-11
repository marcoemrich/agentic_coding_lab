import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

const runCli = (input: unknown): unknown =>
  JSON.parse(
    execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    }),
  );

describe("claim-office CLI", () => {
  it("writes a results document to stdout for a quote scenario (schema example 1)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(runCli(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("writes one result per step for a quote followed by two claims (schema example 2)", () => {
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
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    };

    expect(runCli(scenario)).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
});
