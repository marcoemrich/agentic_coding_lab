import { describe, it, expect } from "vitest";
import { runScenario } from "./runner.js";

describe("runScenario", () => {
  it("schema example 1: quote only", () => {
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

  it("schema example 2: quote then two claims", () => {
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
    // Quote: amulet base 60; loyalty(-20%) + first(+10%) => 0.9 mult => 54; +5 fee => 59
    expect((out.results[0] as { premium: number }).premium).toBe(59);
    // Claim 1: 200 - 100 = 100; cap was 1200, remaining = 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    // Claim 2: 250 - 100 = 150; remaining = 950
    expect(out.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it("second contract uses 15% discount (no first-contract surcharge)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // First: 100 * 1.1 + 5 = 115
    expect((out.results[0] as { premium: number }).premium).toBe(115);
    // Second: 100 * 0.85 + 5 = 90
    expect((out.results[1] as { premium: number }).premium).toBe(90);
  });
});
