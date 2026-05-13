import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Scenario plumbing
  it("returns an empty results array when steps is empty", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [],
    });
    expect(result).toEqual({ results: [] });
  });

  // Quote: main items
  it("quotes a single sword for a brand-new customer with first-insurance surcharge and processing fee", () => {
    const result = runScenario({
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
    // Base 100 G * 1.10 (first insurance) + 5 G (processing) = 115 G
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet using its base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // Base 60 G * 1.10 (first insurance) + 5 G (processing) = 71 G
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a staff using its base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // Base 80 G * 1.10 + 5 G = 93 G
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a potion using its base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // Base 40 G * 1.10 + 5 G = 49 G
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Quote: components and component blocks
  it("quotes a single rune component at 25 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // Base 25 G * 1.10 = 27.5 → ceil 28 G; + 5 G processing = 33 G
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a block of 3 alike components at the special 60 G base premium", () => {
    const result = runScenario({
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
    // 3 alike components → block premium 60 G * 1.10 + 5 G = 71 G
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Quote: modifiers
  it("adds a 50% risk surcharge for cursed items", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
          ],
        },
      ],
    });
    // Base 100 G * (1 + 0.10 first-insurance + 0.50 cursed) + 5 G = 165 G
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds a 30% risk surcharge for items with enchantment level >= 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    // Base 100 G * (1 + 0.10 + 0.30 high-enchantment) + 5 G = 145 G
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("applies a 20% loyalty discount for customers with >= 2 years with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // Base 100 G * (1 + 0.10 first-insurance - 0.20 loyalty) + 5 G = 95 G
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies a 15% discount on contracts after the first contract", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 2,
      cursed: false,
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    // First contract: 100 * (1 + 0.10) + 5 = 115 G (first-insurance surcharge)
    // Second contract: 100 * (1 - 0.15) + 5 = 90 G (subsequent-contract discount)
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });
  it("rounds the premium up in MHPCO's favor", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune] },
        { op: "quote", items: [rune] },
      ],
    });
    // First quote: 25 * 1.10 = 27.5 → ceil 28 + 5 = 33 G
    // Second quote: 25 * (1 - 0.15) = 21.25 → ceil 22 + 5 = 27 G
    // The fractional intermediates prove rounding is up (in MHPCO's favor),
    // not nearest (which would give 22 then 21) nor floor (21 then 21).
    expect(result).toEqual({
      results: [{ premium: 33 }, { premium: 27 }],
    });
  });

  // Claim
  it("processes a claim by subtracting the 100 G deductible from the damage", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
      ],
    });
    // Quote: amulet base 60 * 1.10 + 5 = 71 G
    // Claim: damage 200 G - 100 G deductible = 100 G payout
    // Cap: amulet insurance sum 600 G * 2 = 1200 G; remaining = 1200 - 100 = 1100 G
    expect(result).toEqual({
      results: [
        { premium: 71 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("fully reimburses damage to items made of dragon material", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    // Quote: sword 100 * 1.10 + 5 = 115 G
    // Dragon material: 300 G fully reimbursed (deductible waived).
    // Cap: 1000 * 2 = 2000 G; remaining = 2000 - 300 = 1700 G.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 300, remainingCap: 1700 },
      ],
    });
  });
  it("reimburses damage to items with enchantment level >= 8 at 50%", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "staff", amount: 400 }],
          },
        },
      ],
    });
    // Quote: staff base 80 * (1 + 0.10 first-insurance + 0.30 high-enchantment) + 5 = 117 G
    // Claim: 50% of 400 G = 200 G reimbursable; minus 100 G deductible = 100 G payout
    // Cap: 800 G * 2 = 1600 G; remaining = 1600 - 100 = 1500 G
    expect(result).toEqual({
      results: [
        { premium: 117 },
        { payout: 100, remainingCap: 1500 },
      ],
    });
  });
  it("caps total payout at twice the insurance sum and reports remaining cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
            damages: [{ itemType: "amulet", amount: 1100 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "storm",
            damages: [{ itemType: "amulet", amount: 1000 }],
          },
        },
      ],
    });
    // Quote: 71 G; insurance sum 600 G → cap 1200 G.
    // Claim 1: 1100 - 100 deductible = 1000 G payout; remaining cap 200 G.
    // Claim 2: 1000 - 100 = 900 G reimbursable, but cap of 200 G remains;
    //          payout is capped to 200 G; remaining cap 0 G.
    expect(result).toEqual({
      results: [
        { premium: 71 },
        { payout: 1000, remainingCap: 200 },
        { payout: 200, remainingCap: 0 },
      ],
    });
  });
});
