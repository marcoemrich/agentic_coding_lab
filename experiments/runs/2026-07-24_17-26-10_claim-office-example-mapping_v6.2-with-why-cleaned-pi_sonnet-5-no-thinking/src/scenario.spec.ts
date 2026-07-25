import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("Scenario / CLI orchestration", () => {
  // --- Insurance sum & cap derivation from policy items ---
  it("policy covers two swords -> insurance sum 2000 G (=2x1000), cap 4000 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    });
    const claimResult = output.results[1] as { payout: number; remainingCap: number };
    expect(claimResult.payout + claimResult.remainingCap).toBe(4000);
  });
  it("policy covers a sword and an amulet -> insurance sum 1600 G (=1000+600), cap 3200 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    });
    const claimResult = output.results[1] as { payout: number; remainingCap: number };
    expect(claimResult.payout + claimResult.remainingCap).toBe(3200);
  });
  it(
    "cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (based on unmodified insurance value; premium modifiers do not raise the cap)",
    () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      });
      const quoteResult = output.results[0] as { premium: number };
      const claimResult = output.results[1] as {
        payout: number;
        remainingCap: number;
      };
      expect(quoteResult.premium).toBe(165);
      expect(claimResult.payout + claimResult.remainingCap).toBe(2000);
    }
  );
  it(
    "policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (=1000+3x250); block discount affects premium only, not insurance sum",
    () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      });
      const claimResult = output.results[1] as {
        payout: number;
        remainingCap: number;
      };
      expect(claimResult.payout + claimResult.remainingCap).toBe(3500);
    }
  );

  // --- Multi-step scenario: quote then claim referencing policy index ---
  it(
    "scenario with one quote step then one claim step referencing policy 0 -> results array has matching quote and claim entries in order",
    () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
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
      expect(output.results[0]).toHaveProperty("premium");
      expect(output.results[1]).toHaveProperty("payout");
      expect(output.results[1]).toHaveProperty("remainingCap");
    }
  );

  // --- Error cases surfaced at the CLI/scenario level ---
  it(
    "quote step includes an item with unknown type -> CLI exits non-zero, writes error to stderr, no results written to stdout",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      ).toThrow();
    }
  );
  it(
    "claim step references a damage entry whose item is not part of the policy -> CLI exits non-zero with error",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
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
    }
  );
  it("claim step contains a damage entry with amount: -200 -> CLI exits non-zero with error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
});
