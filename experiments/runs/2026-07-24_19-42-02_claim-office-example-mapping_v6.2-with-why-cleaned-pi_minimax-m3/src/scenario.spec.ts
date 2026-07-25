import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("scenario (CLI integration)", () => {
  // -- integration examples from the spec --
  it(
    "newcomer with cursed sword (0 years, first contract) → premium 165 G " +
      "(100 base + 50 curse + 10 first insurance + 5 fee)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
        ],
      });
      expect(result.results).toEqual([{ premium: 165 }]);
    },
  );
  it(
    "long-standing customer's second contract with cursed enchanted sword " +
      "(3 years, steel, enchantment 7) → premium 160 G " +
      "(100 + 50 + 30 - 20 + 10 - 15 + 5)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(result.results).toEqual([{ premium: 145 }, { premium: 160 }]);
    },
  );

  // -- empty quote --
  it("empty quote (no items) → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // -- error cases: CLI exits with non-zero status / throws --
  it("unknown item type in quote → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("damage for non-insured item → throws error", () => {
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
      }),
    ).toThrow();
  });
  it("negative damage amount → throws error", () => {
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
      }),
    ).toThrow();
  });
  it("more damages of a type than insured items of that type → throws error", () => {
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
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // -- multi-step scenarios --
  it(
    "sword insured (cap 2000), two successive claims of 1500 G each " +
      "→ first payout 1400 / remaining 600; second payout 600 / remaining 0",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result.results).toEqual([
        { premium: expect.any(Number) },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    },
  );

  // -- placeholder --
  it("expect placeholder", () => {
    expect(true).toBe(true);
  });
});
