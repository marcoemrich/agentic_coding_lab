import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("quotes", () => {
  it("prices basic items and an empty policy", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [] },
    ] })).toEqual({ results: [{ premium: 115 }, { premium: 5 }] });
  });

  it("only blocks exactly three components of an alike type", () => {
    const quote = (types: Array<"rune" | "moonstone">) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    }).results[0];
    expect(quote(["rune", "rune", "rune"])).toEqual({ premium: 71 });
    expect(quote(["rune", "rune", "rune", "rune"])).toEqual({ premium: 115 });
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ premium: 88 });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"]))
      .toEqual({ premium: 137 });
  });

  it("stacks item and policy modifiers and rounds upward only at the end", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
    ] }).results).toEqual([
      { premium: 59 },
      { premium: 160 },
      { premium: 175 },
    ]);
  });
});

describe("claims", () => {
  it("applies a deductible per damage, enchantment reimbursement, and dragon precedence", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "dragon", enchantment: 9 },
        { type: "amulet", material: "dragon", enchantment: 5 },
        { type: "rune" },
      ] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 },
        { itemType: "amulet", amount: 800 },
        { itemType: "rune", amount: 200 },
      ] } },
    ] }).results[1]).toEqual({ payout: 1200, remainingCap: 2500 });
  });

  it("rounds fractional payout down only at the end", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: {
        cause: "magic", damages: [{ itemType: "sword", amount: 901 }],
      } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it("allows one damage per covered occurrence and uses a deductible for each", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 },
      ] } },
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it("tracks and exhausts the policy cap over claims", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("rejects unknown, excess, and negative damage entries", () => {
    const scenario = (damages: Array<{ itemType: string; amount: number }>) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" as const }] },
        { op: "claim" as const, policy: 0, incident: { cause: "x", damages } },
      ],
    });
    expect(() => processScenario(scenario([{ itemType: "amulet", amount: 10 }]))).toThrow();
    expect(() => processScenario(scenario([{ itemType: "sword", amount: -1 }]))).toThrow();
    expect(() => processScenario(scenario([
      { itemType: "sword", amount: 10 }, { itemType: "sword", amount: 10 },
    ]))).toThrow();
  });
});
