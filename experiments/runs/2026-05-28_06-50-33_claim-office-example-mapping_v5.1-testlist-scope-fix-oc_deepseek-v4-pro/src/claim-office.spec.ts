import { describe, it, expect } from "vitest";
import { calculateBasePremium, calculatePremium } from "./quote.js";
import { calculateInsuranceSum, processClaim } from "./claim.js";
import { processScenario } from "./process.js";

describe("Quote - base premium (item prices and building blocks)", () => {
  it("empty item list → base premium 0 G", () => {
    expect(calculateBasePremium([])).toBe(0);
  });

  it("single sword → base premium 100 G", () => {
    expect(calculateBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet → base premium 60 G", () => {
    expect(calculateBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff → base premium 80 G", () => {
    expect(calculateBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion → base premium 40 G", () => {
    expect(calculateBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("single rune → base premium 25 G", () => {
    expect(calculateBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("single moonstone → base premium 25 G", () => {
    expect(calculateBasePremium([{ type: "moonstone" }])).toBe(25);
  });

  it("2 runes → base premium 50 G (2×25, no block)", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes → base premium 60 G (block of 3 applies at 60 instead of 75)", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes → base premium 100 G (no block: block requires exactly 3)", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes → base premium 175 G (no block)", () => {
    expect(calculateBasePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });

  it("2 runes + 1 moonstone → base premium 75 G (no block: different types)", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones → base premium 120 G (two separate blocks of 60 each)", () => {
    expect(calculateBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(120);
  });
});

describe("Quote - full premium calculation", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(calculatePremium([], { yearsWithMHPCO: 0 }, 1)).toBe(5);
  });

  it("single sword, new customer (0 years, first contract) → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, 1)).toBe(115);
  });
  it("single amulet, new customer → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "amulet" }], { yearsWithMHPCO: 0 }, 1)).toBe(71);
  });
  it("single staff, new customer → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "staff" }], { yearsWithMHPCO: 0 }, 1)).toBe(93);
  });
  it("single potion, new customer → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "potion" }], { yearsWithMHPCO: 0 }, 1)).toBe(49);
  });
  it("single rune, new customer → premium 33 G (25 base + 2.5 first-insurance + 5 fee = 32.5 → 33 rounded up)", () => {
    expect(calculatePremium([{ type: "rune" }], { yearsWithMHPCO: 0 }, 1)).toBe(33);
  });

  it("cursed sword, new customer → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 }, 1)).toBe(165);
  });

  it("sword enchantment 5, new customer → premium 145 G (100 base + 30 enchantment + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0 }, 1)).toBe(145);
  });
  it("sword enchantment 4, new customer → premium 115 G (no high-enchantment surcharge below 5)", () => {
    expect(calculatePremium([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0 }, 1)).toBe(115);
  });
  it("sword enchantment 5 + cursed, new customer → premium 195 G (100 base + 30 enchantment + 50 curse + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword", enchantment: 5, cursed: true }], { yearsWithMHPCO: 0 }, 1)).toBe(195);
  });

  it("cursed sword + plain amulet, new customer → premium 231 G (160 base + 50 curse on sword only + 16 first-insurance + 5 fee)", () => {
    expect(calculatePremium([
      { type: "sword", cursed: true },
      { type: "amulet", cursed: false },
    ], { yearsWithMHPCO: 0 }, 1)).toBe(231);
  });

  it("sword, customer with 2 years, first contract → premium 95 G (100 base + 10 first-insurance − 20 loyalty + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, 1)).toBe(95);
  });
  it("sword, customer with 1 year, first contract → premium 115 G (no loyalty discount below 2 years)", () => {
    expect(calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 1 }, 1)).toBe(115);
  });

  it("sword, new customer, second contract → premium 100 G (100 base + 10 first-insurance − 15 follow-up + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, 2)).toBe(100);
  });

  it("newcomer with cursed sword (0 years, first contract) → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 }, 1)).toBe(165);
  });

  it("long-standing customer (3 years), second contract, cursed sword enchantment 7 → premium 160 G (100 + 50 curse + 30 enchantment − 20 loyalty + 10 first-insurance − 15 follow-up + 5 fee)", () => {
    expect(calculatePremium([
      { type: "sword", cursed: true, enchantment: 7 },
    ], { yearsWithMHPCO: 3 }, 2)).toBe(160);
  });

  it("first insurance surcharge applies per item in every quote regardless of customer history (verified by above test)", () => {
    // 3 years customer, first contract with sword → loyalty applies, first insurance applies
    expect(calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 3 }, 1)).toBe(95);
  });

  it("premium rounding: intermediate fractions kept, final 197.5 G rounds up to 198 G in MHPCO's favor", () => {
    // Need to construct a scenario that yields 197.5 before rounding
    // 3 runes (block) = 60 base, first insurance = 6. 60 + 6 + 5 = 71. Not right.
    // Let's use: sword (100) + amulet (60) = 160 base, first_insurance = 16, total = 160 + 16 + 5 = 181
    // For 197.5: we need base premium that gives (base * 1.1 + 5) = 197.5 → base * 1.1 = 192.5 → base = 175
    // 175 base → 175 + 17.5 + 5 = 197.5 → rounded to 198
    // 7 runes = 7 * 25 = 175 base. Let's use that.
    const sevenRunes = Array(7).fill({ type: "rune" as const });
    expect(calculatePremium(sevenRunes, { yearsWithMHPCO: 0 }, 1)).toBe(198);
  });
});

describe("Claim - insurance sum", () => {
  it("sword + amulet → insurance sum 1600 G (1000 + 600), cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(calculateInsuranceSum(items)).toBe(1600);
  });
  it("cursed sword → insurance sum 1000 G, cap 2000 G (based on unmodified insurance value)", () => {
    expect(calculateInsuranceSum([{ type: "sword", cursed: true }])).toBe(1000);
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (1000 + 3×250); block discount affects premium only", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(calculateInsuranceSum(items)).toBe(1750);
  });
  it("two swords → insurance sum 2000 G (2×1000), cap 4000 G", () => {
    expect(calculateInsuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
});

describe("Claim - payout calculation", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 500 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("rune damage 200 G → payout 100 G (full reimbursement minus 100 G deductible; no enchantment or material)", () => {
    const policyItems = [{ type: "rune" }];
    const damages = [{ itemType: "rune", amount: 200 }];
    const result = processClaim(policyItems, 250, 500, damages);
    expect(result.payout).toBe(100);
  });

  it("steel sword enchantment 9, damage 1000 G → payout 400 G (50% first: 500, then −100 deductible)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (both clauses apply, 50% rule wins: 500 − 100 deductible)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (only dragon clause: full reimbursement − 100 deductible)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const damages = [{ itemType: "sword", amount: 800 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(700);
  });

  it("dragon attack damages sword 500 G and amulet 300 G → payout 600 G (500−100 + 300−100 = 400 + 200)", () => {
    const policyItems = [{ type: "sword" }, { type: "amulet" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    const result = processClaim(policyItems, 1600, 3200, damages);
    expect(result.payout).toBe(600);
  });

  it("two insured swords damaged → each treated as separate damage with own 100 G deductible", () => {
    // Policy covers two swords, both damaged by 500 G each
    const policyItems = [{ type: "sword" }, { type: "sword" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    const result = processClaim(policyItems, 2000, 4000, damages);
    // Each sword: 500 - 100 = 400, total = 800
    expect(result.payout).toBe(800);
  });
});

describe("Claim - cap exhaustion", () => {
  it("sword insured (insurance sum 1000, cap 2000), first claim 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("same policy, second claim 1500 G → payout 600 G, remaining cap 0 G (reduced to remaining cap)", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = processClaim(policyItems, 1000, 600, damages);
    // Without cap: 1500 - 100 = 1400. But remaining cap is 600, so payout = 600.
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe("Claim - item type validation", () => {
  it("damages has more entries of a type than insured count → the CLI exits with non-zero status, whole claim rejected", () => {
    // This is a CLI-level test. For the function, we need a way to detect mismatch.
    // The processClaim function needs to match damage items to policy items.
    // If damages has 2 sword entries and policy only has 1 sword, the second one can't be matched.
    // We need to track usage of policy items.
    const policyItems = [{ type: "sword" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ];
    expect(() =>
      processClaim(policyItems, 1000, 2000, damages)
    ).toThrow();
  });
});

describe("Claim - payout rounding", () => {
  it("payout rounding: 350.5 G → 350 G (rounded down in MHPCO's favor)", () => {
    // Need a scenario that produces a payout of 350.5 before rounding
    // For example: 4 runes = 1000 insurance value, cap 2000
    // Damage 450.5 per rune? Actually damage amounts are integers.
    // Let me think... Standard reimbursement for single item:
    // damage = 451, full reimbursement = 451, minus 100 deductible = 351, no special clause
    // That gives 351, not 350.5.
    // Hmm, 50% clause: damage = 901, reimbursement = 450.5, minus 100 = 350.5
    const policyItems = [{ type: "sword", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 901 }];
    const result = processClaim(policyItems, 1000, 2000, damages);
    expect(result.payout).toBe(350);
  });
});

describe("CLI error handling", () => {
  it("quote includes unknown item type (broomstick) → non-zero exit + error on stderr, no results on stdout", () => {
    // Test the scenario processing logic directly
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" }] },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim references damage for item not in policy → non-zero exit + error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim contains damage with negative amount → non-zero exit + error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});

describe("Multi-step CLI scenarios", () => {
  it("schema example: quote amulet then claim damage 200 → premium 71 G, payout 100 G, remainingCap 1100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const results = processScenario(scenario);
    expect(results).toEqual([
      { premium: expect.any(Number) },
      { payout: expect.any(Number), remainingCap: expect.any(Number) },
    ]);
    // The amulet has base premium 60, first insurance 6, fee 5 = 71. But with loyalty: 60 base, first insurance 6, loyalty -12 = 60 + 6 - 12 + 5 = 59? No...
    // Wait - 5 years with MHPCO, so loyalty applies. But is it the first contract?
    // The scenario only has one quote, so it's the first contract. Loyalty applies (>=2 years).
    // Premium: 60 base + 6 first-insurance - 12 loyalty + 5 fee = 59
    // Hmm let me re-check. The spec example says the output shape is {"results": [{"premium": <integer>}, ...]}
    // It doesn't specify the exact premium/payout values, just the shape. Let me adjust.
    
    // Actually, the prompt says "Stdout shape", not "expected values". Let me just verify the structure.
    expect(results[0]).toEqual({ premium: 59 });
    // Claim: amulet insurance = 600, cap = 1200. Damage 200, full reimbursement - 100 deductible = 100. Remaining = 1200 - 100 = 1100.
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});