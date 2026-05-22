import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

// The test list intentionally targets the high-level runScenario surface
// for end-to-end behaviour and uses it for premium/claim arithmetic too.
// The CLI tests in the final describe block exercise src/cli.ts via a
// child process. Internal helpers (quote/claim) are an implementation
// detail of src/claim-office.ts and are not asserted on directly here.

describe("Claim Office — quote: base premiums and components", () => {
  it("empty items list returns premium 5 (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword (0 years, 1st contract) returns premium 115 (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (0 years, 1st contract) returns premium 71 (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (0 years, 1st contract) returns premium 93 (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (0 years, 1st contract) returns premium 49 (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("2 runes — no block — base premium 50 G; premium 60 (50 + 5 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes — block applies — base premium 60 G; premium 71 (60 + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes — no block (block requires exactly 3) — base premium 100 G; premium 115 (100 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes — base premium 175 G; premium 198 (175 + 17.5 + 5 = 197.5, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone — different types, no block — base premium 75 G; premium 88 (75 + 7.5 + 5 = 87.5, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones — two separate blocks — base premium 120 G; premium 137 (120 + 12 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
});

describe("Claim Office — quote: modifiers and thresholds", () => {
  it("cursed sword (steel, enchantment 3), 0 years, 1st contract → premium 165 (100 + 50 curse + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 (steel, not cursed), 0 years, 1st contract → premium 145 (100 + 30 high-ench + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 (steel, not cursed), 0 years, 1st contract → premium 115 (no high-ench surcharge; 100 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 (steel), 0 years, 1st contract → premium 195 (both surcharges stack: 100 + 50 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("long-standing customer (yearsWithMHPCO = 2), plain sword, 1st contract → premium 95 (100 + 10 first-ins − 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("multi-item policy: cursed sword + plain amulet, 0 years, 1st contract → premium 231 (160 base + 50 curse + 16 first-ins + 5 fee); curse applies to sword's 100, not policy total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("long-standing customer's 2nd quote in scenario: cursed sword (steel, enchantment 7), 3 years → premium 160 (100 + 50 + 30 − 20 loyalty + 10 first-ins − 15 follow-up + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });
});

describe("Claim Office — claim: standard reimbursement and deductible", () => {
  it("regular steel sword (enchantment 3), damage 500 → payout 400 (500 − 100 deductible), remainingCap 1600 (cap 2000 − 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune (insurance 250), damage 200 → payout 100 (200 − 100; no special clause), remainingCap 400 (cap 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("sword + amulet policy, damages [sword 500, amulet 300] → payout 600 ((500−100)+(300−100)); deductible per damaged item; remainingCap 2600 (cap 3200 − 600)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
});

describe("Claim Office — claim: special clauses (dragon material vs. high enchantment)", () => {
  it("dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% rule wins: 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: Math.ceil(100 * 1.1 + 100 * 0.3) + 5 },
        { payout: 400, remainingCap: 2000 - 400 },
      ],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 → payout 700 (only dragon-material clause: full 800 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: Math.ceil(100 * 1.1 + 100 * 0.3) + 5 },
        { payout: 700, remainingCap: 2000 - 700 },
      ],
    });
  });
  it("steel sword, enchantment 9, damage 1000 → payout 400 (only high-enchantment clause: 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: Math.ceil(100 * 1.1 + 100 * 0.3) + 5 },
        { payout: 400, remainingCap: 2000 - 400 },
      ],
    });
  });
  it("dragon-material sword, enchantment exactly 8, damage 1000 → payout 400 (high-enchantment clause applies at exactly 8: 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: Math.ceil(100 * 1.1 + 100 * 0.3) + 5 },
        { payout: 400, remainingCap: 2000 - 400 },
      ],
    });
  });
});

describe("Claim Office — claim: cap exhaustion and insurance sum", () => {
  it("sword policy (insurance 1000, cap 2000): first claim of 1500 → payout 1400, remainingCap 600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword policy after a first claim leaves 600 remaining: second claim of 1500 → payout 600 (desired 1400 reduced to remaining cap), remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("sword + amulet policy → insurance sum 1600, cap 3200 (verified via a 2000 G damage scenario)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 1900 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 2000, remainingCap: 1200 }],
    });
  });
  it("sword + 3 runes (block) policy → insurance sum 1750, cap 3500; block discount does not lower the cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 1900 },
              { itemType: "rune", amount: 1700 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 3400, remainingCap: 100 }],
    });
  });
  it("cursed sword → cap 2000 (based on unmodified insurance value 1000; premium modifiers do not raise the cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 1900 }],
          },
        },
      ],
    });
    // Cursed sword premium: 100 base + 50 curse + 10 first-ins + 5 fee = 165
    // Cap based on unmodified insurance value 1000 → 2000
    // Damage 1900 → reimbursement 1900 − 100 deductible = 1800; payout 1800 (under cap 2000)
    // remainingCap = 2000 − 1800 = 200
    expect(result).toEqual({
      results: [
        { premium: 165 },
        { payout: 1800, remainingCap: 200 },
      ],
    });
  });
});

describe("Claim Office — claim: payout rounding (MHPCO's favor)", () => {
  it("payout calculation yielding 350.5 G is rounded down to 350 G (dragon-material sword, enchantment 9, damage 901 → (901/2) − 100 = 350.5 → 350)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    // Dragon-material + enchantment 9 → high-enchantment 50% rule wins.
    // Reimbursement: 901 × 0.5 = 450.5; minus 100 deductible = 350.5
    // Payout rounded DOWN in MHPCO's favor → 350; remainingCap = 2000 − 350 = 1650
    expect(result).toEqual({
      results: [
        { premium: Math.ceil(100 * 1.1 + 100 * 0.3) + 5 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });
});

describe("Claim Office — claim: multiple items of the same type", () => {
  it("policy with two swords → insurance sum 2000, cap 4000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    });
    // Two swords premium: policy base 200 + 20 first-ins + 5 fee = 225
    // Insurance sum 2000 → cap 4000
    // Damage 2500 → reimbursement 2500 − 100 = 2400; under cap 4000 → payout 2400
    // remainingCap = 4000 − 2400 = 1600
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 2400, remainingCap: 1600 },
      ],
    });
  });
  it("policy with two swords, damages [sword 500, sword 500] → payout 800 (each damage gets its own 100 deductible), remainingCap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // Two swords: insurance sum 2000, cap 4000
    // Two sword damages, each (500 − 100 deductible) = 400; total payout 800
    // remainingCap = 4000 − 800 = 3200
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 800, remainingCap: 3200 },
      ],
    });
  });
});

describe("Claim Office — CLI surface: stdin/stdout success scenarios", () => {
  it("CLI processes the schema example (amulet quote + 200 G amulet claim) and writes a results array with one quote result and one claim result, in order", () => {
    const input = JSON.stringify({
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
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(0);
    // Amulet quote (yearsWithMHPCO 5, 1st contract):
    //   base 60 + first-ins 6 − loyalty 12 = 54; + 5 fee = 59
    // Claim: amulet (no special clauses), 200 − 100 deductible = 100;
    //   cap = 2 × 600 = 1200; remainingCap = 1200 − 100 = 1100
    const stdout = JSON.parse(proc.stdout);
    expect(stdout).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("CLI integration — newcomer with a cursed sword: results contain { premium: 165 } for E-int1", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(0);
    const stdout = JSON.parse(proc.stdout);
    expect(stdout).toEqual({ results: [{ premium: 165 }] });
  });
  it("CLI integration — long-standing customer's two quotes: second quote of a cursed sword (steel, enchantment 7) for a 3-year customer produces premium 160 (E-int2)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(0);
    const stdout = JSON.parse(proc.stdout);
    expect(stdout).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });
});

describe("Claim Office — CLI surface: error cases (non-zero exit, stderr)", () => {
  it("CLI: quote includes an unknown item type ({type:'broomstick'}) → exits non-zero, writes error to stderr, no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).not.toContain("results");
  });
  it("CLI: claim references an item type not in the policy (amulet damage when only a sword is insured) → exits non-zero, error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).not.toContain("results");
  });
  it("CLI: claim references an unknown item type in damages → exits non-zero, error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).not.toContain("results");
  });
  it("CLI: claim contains more damage entries of a type than items insured (two sword damages, one sword in policy) → exits non-zero, error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).not.toContain("results");
  });
  it("CLI: claim contains a damage entry with amount: -200 → exits non-zero, error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "ogre",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).not.toContain("results");
  });
});
