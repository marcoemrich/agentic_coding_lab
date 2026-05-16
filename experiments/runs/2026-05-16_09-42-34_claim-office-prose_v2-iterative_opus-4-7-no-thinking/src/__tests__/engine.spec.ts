import { describe, it, expect } from "vitest";
import { runScenario } from "../engine.js";

describe("runScenario", () => {
  it("matches schema example 1 shape (quote only)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(out.results).toHaveLength(1);
    expect(out.results[0]).toHaveProperty("premium");
    expect((out.results[0] as { premium: number }).premium).toBe(115);
  });

  it("matches schema example 2 shape (quote + 2 claims)", () => {
    const out = runScenario({
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
    });
    expect(out.results).toHaveLength(3);
    expect((out.results[0] as { premium: number }).premium).toBe(58);
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    expect(out.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it("subsequent contracts get 15% discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1 }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1 }],
        },
      ],
    });
    expect((out.results[0] as { premium: number }).premium).toBe(115);
    // Second: 100 * 0.85 + 5 = 90
    expect((out.results[1] as { premium: number }).premium).toBe(90);
  });
});
