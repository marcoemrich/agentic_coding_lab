import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("Scenario Runner", () => {
  // 1. Single quote step → one {premium}, using yearsWithMHPCO and isFollowUp=false
  it("should return one premium result for a single quote step using yearsWithMHPCO and isFollowUp=false", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 59 }] });
  });

  // 2. Multiple quotes: first isFollowUp=false, every subsequent isFollowUp=true
  it("should treat the first quote as not a follow-up and every subsequent quote as a follow-up", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });

  // 3. Claim references a quote step by zero-based policy index; result is {payout, remainingCap}
  it("should resolve a claim's policy from the referenced quote step and return payout and remainingCap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  // 4. Successive claims on the same policy share the cap
  it("should start a second claim on the same policy from the remainingCap left by the first claim", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // 5. Results preserve order and length of steps (interleaved quote/claim)
  it("should return results in the same order and length as the steps", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(result.results.length).toBe(3);
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
    expect(result.results[2].premium).toBe(62);
  });

  // 6. Schema example end-to-end
  it("should produce premium then payout/remainingCap for the prompt's schema example", () => {
    const result = runScenario({
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
      ],
    });
    expect(result.results[0].premium).toBe(59);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });
});
