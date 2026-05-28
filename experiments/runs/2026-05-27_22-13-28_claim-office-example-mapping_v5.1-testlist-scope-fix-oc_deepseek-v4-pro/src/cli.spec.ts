import { describe, it, expect } from "vitest";
import { processScenario } from "./cli.js";

describe("CLI integration", () => {
  it("should process the schema example: quote an amulet then file a claim — outputs results array with premium, payout, and remainingCap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    });

    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toEqual({ premium: expect.any(Number) });
    expect(output.results[1]).toMatchObject({
      payout: expect.any(Number),
      remainingCap: expect.any(Number),
    });
  });

  it("should exit with non-zero status and write error to stderr for quote with unknown item type (e.g. \"broomstick\")", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" as unknown as never }],
          },
        ],
      })
    ).toThrow();
  });

  it("should exit with non-zero status and write error to stderr for claim referencing an uninsured item type", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
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
      })
    ).toThrow();
  });

  it("should exit with non-zero status and write error to stderr for negative damage amount in claim", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })
    ).toThrow();
  });

  it("should exit with non-zero status and write error to stderr when damages contain more entries of a type than insured", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
});