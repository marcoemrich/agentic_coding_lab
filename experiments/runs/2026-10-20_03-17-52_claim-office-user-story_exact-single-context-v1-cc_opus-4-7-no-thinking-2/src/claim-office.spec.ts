import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quoting - base items and processing fee
  it("quotes a single sword for a new customer (base + first-insurance surcharge + fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet, staff, and potion with proper base premiums", () => {
    const quote = (type: string) =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type, material: "steel", enchantment: 1, cursed: false }] },
        ],
      });
    expect(quote("amulet")).toEqual({ results: [{ premium: 71 }] });
    expect(quote("staff")).toEqual({ results: [{ premium: 93 }] });
    expect(quote("potion")).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single component (rune) at 25 G base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a building block of 3 alike components at 60 G special base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Risk surcharges and discounts
  it("applies 50% cursed surcharge on an item", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("applies 30% high-enchantment surcharge for enchantment >= 5", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies 20% loyalty discount when yearsWithMHPCO >= 2", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies 15% repeat-contract discount from the second quote onwards", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("rounds premium up to whole G (in MHPCO's favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });

  // Claims
  it("pays a claim minus 100 G deductible, rounded in MHPCO's favor", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("caps total payout at twice the insurance sum of the policy", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 3000 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "lightning", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    expect(result.results[2]).toEqual({ payout: 0, remainingCap: 0 });
  });
  it("reimburses damage to items with enchantment >= 8 at 50%", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "arcane blast", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
  });
  it("fully reimburses damage to dragon-material items (no 50% reduction)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 10, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "troll attack", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});
