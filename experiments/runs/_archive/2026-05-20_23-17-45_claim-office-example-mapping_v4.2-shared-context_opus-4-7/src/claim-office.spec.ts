import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for single main items (R1, R3 fee, first insurance) ---
  it("empty item list → premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword for a newcomer first contract → premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet for a newcomer first contract → premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff for a newcomer first contract → premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion for a newcomer first contract → premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component pricing and block discount (R1, R2) ---
  it("single rune for a newcomer first contract → premium 33 G (25 base + 2.5 first + 5 fee = 32.5 → up to 33)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes (no block) → base 50 G; premium 60 G for newcomer first contract (50 + 5 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (block applies) → base 60 G; premium 71 G for newcomer first contract (60 + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (no block) → base 100 G; premium 115 G for newcomer first contract (100 + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (no block) → base 175 G; premium 198 G for newcomer first contract (175 + 17.5 first + 5 fee = 197.5 → up to 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components — same type only ---
  it("2 runes + 1 moonstone → base 75 G (no block: different types); premium 88 G newcomer first (75 + 7.5 first + 5 fee = 87.5 → 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks); premium 137 G newcomer first (120 + 12 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed steel sword enchantment 3, newcomer first → premium 165 G (100 + 50 curse + 10 first + 5 fee) [integration example]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("steel sword enchantment 5, newcomer first → premium 145 G (100 + 30 high-ench + 10 first + 5 fee) [threshold]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("steel sword enchantment 4, newcomer first → premium 115 G (no high-ench surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed steel sword enchantment 5, newcomer first → premium 195 G (100 + 50 curse + 30 high-ench + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Multi-item modifier scope ---
  it("cursed sword + plain amulet, newcomer first → premium 231 G (sum base 160 + 50 curse on sword + 16 first on 160 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide modifiers ---
  it("plain sword for customer with exactly 2 years, first contract → premium 95 G (100 − 20 loyalty + 10 first + 5 fee) [loyalty threshold]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("long-standing 2nd contract: customer 3y, second quote, cursed sword enchantment 7 → premium 160 G [integration example]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // --- Claims: cap, deductible, clauses ---
  it("standard claim: steel sword enchantment 3, damage 500 → payout 400 G; remainingCap 1600 G (cap 2000 − 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "attack",
            damages: [{ type: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("standard claim on a rune (no enchantment/material), damage 200 → payout 100 G; remainingCap 400 G (cap 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "attack",
            damages: [{ type: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("high-enchantment clause: steel sword enchantment 9, damage 1000 → payout 400 G (500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "attack",
            damages: [{ type: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material clause: dragon sword enchantment 5, damage 800 → payout 700 G (800 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ type: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it.todo("both clauses (50 % wins): dragon sword enchantment 9, damage 1000 → payout 400 G");
  it.todo("enchantment threshold exactly 8: dragon sword enchantment 8, damage 1000 → payout 400 G");
  it.todo("payout rounded down: dragon sword enchantment 9, damage 801 → payout 300 G (400.5 − 100 = 300.5 → down to 300)");

  // --- Deductible per damage event ---
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible applied once per damaged item); remainingCap 2600 G");

  // --- Multiple items of the same type ---
  it.todo("policy with two swords → insurance sum 2000, cap 4000; dragon attack damages both (two entries 500 each) → payout 800 G; remainingCap 3200 G");

  // --- Cap exhaustion ---
  it.todo("single sword (cap 2000), two successive 1500 G claims → first {payout 1400, remainingCap 600}, second {payout 600, remainingCap 0}");

  // --- Insurance sum independent of block discount ---
  it.todo("policy with sword + 3 runes → insurance sum 1750 (block does not change insurance sum), cap 3500; small claim verifies remainingCap");

  // --- Cap is based on unmodified insurance value (not on modified premium) ---
  it.todo("cursed sword policy → cap is 2000 G (based on unmodified insurance value 1000, not on the modified premium); verify via a 1500 G claim that yields payout 1400 and remainingCap 600");

  // --- Error cases (CLI exit codes) ---
  it.todo("CLI error: quote contains an unknown item type (e.g. broomstick) → non-zero exit, error on stderr, no results on stdout");
  it.todo("CLI error: claim references an item not part of the policy (amulet damage when only sword insured) → non-zero exit, error on stderr");
  it.todo("CLI error: damage entry with negative amount (−200) → non-zero exit, error on stderr");
  it.todo("CLI error: more damages of a type than items insured (two sword damages, one sword insured) → non-zero exit");
});
