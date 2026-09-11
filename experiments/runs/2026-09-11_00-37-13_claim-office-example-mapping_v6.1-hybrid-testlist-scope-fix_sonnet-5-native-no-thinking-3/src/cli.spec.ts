import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";
import { calculatePremium, processClaim } from "./policy.js";

describe("CLI input/output", () => {
  it("schema example: quote for one amulet then claim against it → results array with premium then payout+remainingCap", () => {
    const customer = { yearsWithMHPCO: 5 };
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
    const damages = [{ itemType: "amulet", amount: 200 }];
    const scenario = {
      customer,
      steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "fire", damages } },
      ],
    };

    const expectedPremium = calculatePremium(customer, items);
    const expectedClaim = processClaim(items, damages);

    const result = runCli(JSON.stringify(scenario));
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: expectedPremium }, expectedClaim],
    });
  });
  it("multiple steps: quote step result contains only 'premium'; claim step result contains 'payout' and 'remainingCap'", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };

    const result = runCli(JSON.stringify(scenario));
    const { results } = JSON.parse(result.stdout);

    expect(Object.keys(results[0]).sort()).toEqual(["premium"]);
    expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
  });

  // Error cases
  it("quote includes an item with an unknown type (e.g. {type: 'broomstick'}) → non-zero exit code, error written to stderr, no results written to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });
  it("claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only a sword is insured) → non-zero exit code, error written to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim references a damage entry with an unknown item type → non-zero exit code, error written to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim contains a damage entry with amount: -200 → non-zero exit code, error written to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("damages array contains more entries of a given type than the policy actually covers (e.g. two sword damages but only one sword insured) → non-zero exit code, whole claim rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    };

    const result = runCli(JSON.stringify(scenario));

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
});
