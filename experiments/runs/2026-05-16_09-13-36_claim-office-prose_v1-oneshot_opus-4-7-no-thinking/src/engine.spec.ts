import { describe, it, expect } from "vitest";
import { runScenario } from "./engine.js";

describe("runScenario", () => {
  it("schema example 1: single quote", () => {
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
    expect((out.results[0] as { premium: number }).premium).toBe(115);
  });

  it("schema example 2: quote + two claims with non-covered amulet", () => {
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
    // amulet not covered (not dragon, ench < 8) -> payout 0
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(out.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it("contract index advances across multiple quotes", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });
    // first contract: 100 * 1.1 + 5 = 115
    // second contract: 100 * 0.85 + 5 = 90
    expect((out.results[0] as { premium: number }).premium).toBe(115);
    expect((out.results[1] as { premium: number }).premium).toBe(90);
  });

  it("policy cap is enforced across multiple claims", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 1, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // sword dragon, value 1000, cap = 2000
    // claim 1: 1500-100=1400, cap left 600
    // claim 2: 1500-100=1400, capped at 600, cap left 0
    // claim 3: 1500-100=1400, capped at 0
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    expect(out.results[3]).toEqual({ payout: 0, remainingCap: 0 });
  });
});
