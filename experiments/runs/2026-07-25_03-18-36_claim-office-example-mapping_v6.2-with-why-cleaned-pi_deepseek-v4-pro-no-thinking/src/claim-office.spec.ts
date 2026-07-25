import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === Quote: Item base premiums ===
  it("should return 5 G for empty item list — only processing fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("should return 115 G for a single sword — 100 base + 10 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return 71 G for a single amulet — 60 base + 6 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return 93 G for a single staff — 80 base + 8 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "staff" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("should return 49 G for a single potion — 40 base + 4 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "potion" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  it("should return 33 G for a single rune — 25 base + 2.5 first insurance + 5 fee, rounded up", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // === Quote: Component blocks ===
  it("should return 60 G for 2 runes — 50 base + 5 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("should return 71 G for 3 runes — 60 block + 6 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return 115 G for 4 runes — 100 base + 10 first + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return 198 G for 7 runes — 175 base + 17.5 first + 5 fee, rounded up", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: Array(7).fill({ type: "rune" }) }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  it("should return 88 G for 2 runes + 1 moonstone — 75 base + 7.5 first + 5 fee, rounded up", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "rune" }, { type: "rune" }, { type: "moonstone" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("should return 137 G for 3 runes + 3 moonstones — 120 base + 12 first + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // === Quote: Premium modifiers ===
  it("should apply 50% cursed surcharge — cursed sword: 100 base + 50 curse + 10 first + 5 fee = 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("should apply 30% high-enchantment surcharge — enchant 5 sword: 100 base + 30 enchant + 10 first + 5 fee = 145 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 5 }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("should apply both cursed and high-enchantment surcharges: 100 + 50 + 30 + 10 first + 5 fee = 195 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 5 }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  it("should NOT apply high-enchantment surcharge to sword with enchantment 4: 100 + 10 first + 5 fee = 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 4 }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply 20% loyalty discount for customer with exactly 2 years: 100 + 10 first - 20 loyalty + 5 fee = 95 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should apply 10% first-insurance surcharge: 100 + 10 first + 5 fee = 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply 15% follow-up contract discount on second quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    // First quote: 100 + 10 (first) + 5 = 115. Second quote: 100 + 10 (first) - 15 (follow-up) + 5 = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // === Quote: Multi-item modifier scope ===
  it("should apply cursed surcharge only to the cursed item, not the full policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "sword", cursed: true }, { type: "amulet" }
        ] }
      ]
    };
    const result = processScenario(scenario);
    // base: 100+60=160, curse: 50 (only on sword), first: 16 (10% of 160), fee: 5 → 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // === Quote: Integration examples ===
  it("should return 165 G for newcomer (0 years, no previous) with cursed sword", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("should return 160 G for long-standing customer (3 years, second contract) with cursed sword enchant 7", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "sword", cursed: true, material: "steel", enchantment: 7 }] }
      ]
    };
    const result = processScenario(scenario);
    // Second quote: 100 base + 50 curse + 30 enchant + 10 first - 20 loyalty - 15 follow-up = 155 + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { premium: 160 }] });
  });

  // === Quote: Rounding ===
  it("should round premium up in MHPCO's favor — 197.5 G becomes 198 G", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 → 198
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: Array(7).fill({ type: "rune" }) }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // === Claim: Standard reimbursement ===
  it("should reimburse 400 G for steel sword enchant 3 damaged 500 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 1600 }] });
  });

  it("should reimburse 100 G for rune damaged 200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Rune insurance value 250, cap 500. Damage 200 - 100 deductible = 100. Remaining cap = 500 - 100 = 400.
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 100, remainingCap: 400 }] });
  });

  // === Claim: Deductible per damage event ===
  it("should apply 100 G deductible per damaged item — payout 600 G for two items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim" as const, policy: 0, incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]
        } }
      ]
    };
    const result = processScenario(scenario);
    // Sword: 500-100=400, Amulet: 300-100=200, total=600. Insurance sum=1600, cap=3200, remaining=2600
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 600, remainingCap: 2600 }] });
  });

  // === Claim: High enchantment ≥8 (50% rule) ===
  it("should reimburse at 50% for enchantment ≥8", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // 50% of 1000 = 500, minus 100 deductible = 400. Insurance sum 1000, cap 2000, remaining 1600
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 1600 }] });
  });

  // === Claim: Dragon material ===
  it("should fully reimburse dragon-material items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Full reimbursement: 800 - 100 deductible = 700
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 700, remainingCap: 1300 }] });
  });

  // === Claim: Enchantment vs dragon material ===
  it("should apply 50% rule when both dragon material AND enchantment ≥8 — 400 G payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // 50% of 1000 = 500, minus 100 deductible = 400
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 1600 }] });
  });

  it("should NOT apply 50% rule to dragon sword enchant 5 — 700 G payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Full reimbursement: 800 - 100 = 700
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 700, remainingCap: 1300 }] });
  });

  it("should apply 50% rule to steel sword enchant 9 — 400 G payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // 50% of 1000 = 500, minus 100 = 400. Cap: 2000, remaining: 1600
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 1600 }] });
  });

  // === Claim: Cap ===
  it("should set cap at twice the insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000+600=1600, cap=3200. Payout: 500-100=400, remaining: 2800
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 2800 }] });
  });

  it("should base cap on unmodified insurance value", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000 (not affected by cursed), cap: 2000. Payout: 900, remaining: 1100
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 900, remainingCap: 1100 }] });
  });

  it("should NOT include block discount in insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [
          { type: "sword" },
          { type: "rune" }, { type: "rune" }, { type: "rune" }
        ] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // Insurance sum: 1000 + 3×250 = 1750. Cap: 3500. Payout: 400, remaining: 3100
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 400, remainingCap: 3100 }] });
  });

  it("should exhaust cap across successive claims", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = processScenario(scenario);
    // First claim: 1500-100=1400 ≤ 2000 cap, payout=1400, remaining=600
    // Second claim: 1500-100=1400 but cap=600, so payout=600, remaining=0
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) as number },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 }
      ]
    });
  });

  // === Claim: Rounding ===
  it("should round payout down in MHPCO's favor — 350.5 G becomes 350 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    };
    const result = processScenario(scenario);
    // 50% of 901 = 450.5, minus 100 deductible = 350.5, rounded down = 350
    expect(result).toEqual({ results: [{ premium: expect.any(Number) as number }, { payout: 350, remainingCap: 1650 }] });
  });

  // === Validation: Errors ===
  it("should exit with error for unknown item type in quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "broomstick" }] }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should exit with error for unknown item type in claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should exit with error for damage to item not in policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should exit with error for negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should exit with error when more damage entries than insured items of that type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 200 }]
        } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // === CLI Integration: Full scenarios ===
  it("should process the schema example scenario — quote amulet + claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    };
    const result = processScenario(scenario);
    // premium: 60 base + 6 (first 10%) - 12 (loyalty 20%) = 54 + 5 fee = 59? 
    // Wait: first_i=10% of 60=6, loyalty=20% of 60=12. 60+6-12=54+5=59.
    // Claim: 200 - 100 deductible = 100 payout.
    // Insurance sum: 600, cap: 1200. Remaining: 1100.
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it("should process multi-step scenario with sequential quotes and claims", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 200 }] } },
        { op: "quote" as const, items: [{ type: "amulet" }] },
        { op: "claim" as const, policy: 2, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    };
    const result = processScenario(scenario);
    // First quote: sword 100 + 10 (first) + 5 fee = 115
    // First claim: 200-100=100 payout, cap=2000, remaining=1900
    // Second quote: amulet 60 + 6 (first) - 9 (follow-up) + 5 = 62
    // Second claim: 100-100=0 payout (deductible exceeds damage), cap=1200, remaining=1200
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 100, remainingCap: 1900 },
        { premium: 62 },
        { payout: 0, remainingCap: 1200 }
      ]
    });
  });
});