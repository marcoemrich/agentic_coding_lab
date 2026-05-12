import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should compute base premium for a single sword (100G + 5G processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("should compute base premium for each main item type (amulet, staff, potion)", () => {
    const amuletResult = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(amuletResult.results[0].premium).toBe(71);

    const staffResult = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(staffResult.results[0].premium).toBe(93);

    const potionResult = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(potionResult.results[0].premium).toBe(49);
  });
  it("should compute base premium for a single component (25G + 5G fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(33);
  });
  it("should compute premium for multiple items summing their base premiums", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(181);
  });
  it("should apply component bundle discount (3 alike components at 60G instead of 75G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(71);
  });
  it("should apply cursed item surcharge of 50%", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(170);
  });
  it("should apply high enchantment surcharge of 30% for enchantment level >= 5", () => {
    const result = processScenario({
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
    expect(result.results[0].premium).toBe(148);
  });
  it("should apply loyalty discount of 20% for customers with >= 2 years", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(95);
  });
  it("should apply first insurance surcharge of 10%", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // staff base 80 + 10% first insurance surcharge (8) + 5 fee = 93
    expect(result.results[0].premium).toBe(93);
  });
  it("should apply repeat customer discount of 15% on contracts after the first", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // First quote: 100 + 10 (first insurance) + 5 = 115
    expect(result.results[0].premium).toBe(115);
    // Second quote: 100 - 15 (repeat discount) + 5 = 90 (no first insurance surcharge)
    expect(result.results[1].premium).toBe(90);
  });
  it("should round amounts in MHPCO's favor (ceiling)", () => {
    // Amulet (60G) cursed + enchantment 5:
    // cursed surcharge: ceil(60*0.50) = 30, enchantment surcharge: ceil(60*0.30) = 18
    // item premium: 60+30+18 = 108
    // first insurance surcharge: ceil(108*0.10) = ceil(10.8) = 11
    // total: 108 + 11 + 5 = 124
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(124);
  });
  it("should process a basic claim with 100G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // Payout: 300 - 100 (deductible) = 200
    // Remaining cap: 2 * 1000 (sword insured value) - 200 = 1800
    expect(result.results[1].payout).toBe(200);
    expect(result.results[1].remainingCap).toBe(1800);
  });
  it("should cap total payout at twice the insurance sum", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "explosion",
            damages: [
              { itemType: "sword", amount: 2500 },
            ],
          },
        },
      ],
    });
    // Sword insurance value: 1000G, cap = 2 * 1000 = 2000
    // Damage: 2500 - 100 (deductible) = 2400, capped at 2000
    expect(result.results[1].payout).toBe(2000);
    expect(result.results[1].remainingCap).toBe(0);
  });
  it("should reimburse enchantment >= 8 damage at 50%", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [
              { itemType: "sword", amount: 500, enchantment: 9 },
            ],
          },
        },
      ],
    });
    // Damage 500, enchantment >= 8 → reimbursed at 50% → effective 250
    // 250 - 100 (deductible) = 150 payout
    // Remaining cap: 2000 - 150 = 1850
    expect(result.results[1].payout).toBe(150);
    expect(result.results[1].remainingCap).toBe(1850);
  });
  it("should fully reimburse dragon material damage", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [
              { itemType: "sword", amount: 500, enchantment: 9, material: "dragon" },
            ],
          },
        },
      ],
    });
    // Dragon material → fully reimbursed (overrides enchantment >= 8 halving)
    // Damage: 500 (full) - 100 (deductible) = 400 payout
    // Remaining cap: 2000 - 400 = 1600
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("should handle a quote followed by multiple claims tracking remaining cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 800 },
            ],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [
              { itemType: "sword", amount: 1500 },
            ],
          },
        },
      ],
    });
    // Sword insurance value: 1000G, cap = 2 * 1000 = 2000
    // Claim 1: 800 - 100 (deductible) = 700 payout, remaining cap = 2000 - 700 = 1300
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300);
    // Claim 2: 1500 - 100 (deductible) = 1400, capped at remaining 1300
    expect(result.results[2].payout).toBe(1300);
    expect(result.results[2].remainingCap).toBe(0);
  });
});
