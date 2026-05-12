import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("returns empty results for empty steps", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] })).toEqual({ results: [] });
  });
  it("returns processing fee only for empty item list", () => {
    expect(
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })
    ).toEqual({ results: [{ premium: 5 }] });
  });
  it("computes base premium for a single sword", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
      })
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies cursed surcharge to item base premium", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      })
    ).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies high enchantment surcharge for enchantment level 5 or above", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
      })
    ).toEqual({ results: [{ premium: 145 }] });
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
      })
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("processes a simple claim with deductible", () => {
    expect(
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      })
    ).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
});
