import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (stdin: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: stdin,
    encoding: "utf8",
  });

// The spec's own schema example.
const SCHEMA_EXAMPLE = {
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

describe("claim-office CLI", () => {
  it("reads a JSON scenario from stdin and writes {results: [...]} to stdout", () => {
    const { status, stdout } = runCli(JSON.stringify(SCHEMA_EXAMPLE));

    expect(status).toBe(0);
    // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
    // then 200 G damage − 100 G deductible, against a cap of 1200 G
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("writes one result per input step, in order", () => {
    const { stdout } = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      }),
    );

    const { results } = JSON.parse(stdout);
    expect(results).toHaveLength(3);
    expect(results[0]).toHaveProperty("premium");
    expect(results[1]).toHaveProperty("premium");
    expect(results[2]).toHaveProperty("payout");
  });

  const swordPolicyThenClaim = (damages: unknown[]) => ({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages } },
    ],
  });

  // Every way a scenario can be rejected must reach the same contract: a non-zero
  // exit, a description on stderr, and — crucially — NO partial results on stdout.
  it.each([
    [
      "an unknown item type in a quote",
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      /broomstick/,
    ],
    ["malformed JSON", "not json", /JSON/i],
    [
      "a damage entry not covered by the policy",
      JSON.stringify(swordPolicyThenClaim([{ itemType: "amulet", amount: 200 }])),
      /amulet/,
    ],
    [
      "a negative damage amount",
      JSON.stringify(swordPolicyThenClaim([{ itemType: "sword", amount: -200 }])),
      /-200|negative/,
    ],
    [
      "a policy index that no step issued",
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 5,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      }),
      /policy/i,
    ],
  ])(
    "rejects %s → non-zero exit, error on stderr, nothing on stdout",
    (_case, input, expectedError) => {
      const { status, stdout, stderr } = runCli(input);

      expect(status).not.toBe(0);
      expect(stderr).toMatch(expectedError);
      expect(stdout).toBe("");
    },
  );
});
