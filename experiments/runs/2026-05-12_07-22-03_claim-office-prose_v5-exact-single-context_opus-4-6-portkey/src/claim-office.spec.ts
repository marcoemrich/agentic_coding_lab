import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Quoting", () => {
  it("should compute premium for a single sword (new customer, first policy)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should compute premium for other main item types (amulet, staff, potion)", () => {
    const amulet = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(amulet.results[0]).toEqual({ premium: 71 });

    const staff = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "staff", material: "wood", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(staff.results[0]).toEqual({ premium: 93 });

    const potion = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(potion.results[0]).toEqual({ premium: 49 });
  });
  it("should compute premium for a single component", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should sum premiums for multiple items", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 181 });
  });
  it("should apply building block discount for 3 alike components", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should add 50% surcharge for cursed items", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 170 });
  });
  it("should add 30% surcharge for enchantment level >= 5", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 148 });
  });
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should apply 15% discount on subsequent contracts instead of first-insurance surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 56 });
  });
  it("should round premium in MHPCO's favor (ceiling)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: true },
          ],
        },
      ],
    });
    // 60 * 1.5 = 90, +10% first = 99, *0.8 loyalty = 79.2, +5 = 84.2, ceil = 85
    expect(result.results[0]).toEqual({ premium: 85 });
  });
});

describe("Claims", () => {
  it("should apply 100G deductible and compute payout for a basic claim", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("should pay zero when damage is within deductible");
  it.todo("should track remaining payout cap at 2x insurance sum");
  it.todo("should reimburse 50% for items with enchantment >= 8");
  it.todo("should fully reimburse dragon material items");
  it.todo("should reduce remaining cap across multiple claims on same policy");
});

describe("CLI", () => {
  it.todo("should read JSON from stdin and write results to stdout");
});
