import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single-item base premiums (each + 5 G fee + 10 G first insurance) ---
  it("single sword (plain, newcomer) → base 100 G + 10 G first ins + 5 G fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (plain, newcomer) → base 60 G + 6 G first ins + 5 G fee = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (plain, newcomer) → base 80 G + 8 G first ins + 5 G fee = 93 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (plain, newcomer) → base 40 G + 4 G first ins + 5 G fee = 49 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component pricing & block discount ---
  it("single rune (component) → base 25 G + 2.5 first ins + 5 fee → rounded up = 33 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes (newcomer) → 2×25 base = 50; +10% first ins = 55; +5 fee = 60", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (newcomer) → block base 60; +10% first ins = 66; +5 fee = 71", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (newcomer) → 100 base; +10% = 110; +5 fee = 115", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("7 runes → base 175 G (one block of 3 + 4 singles = 60 + 100)");

  // --- "Alike" components — block requires same type ---
  it.todo("2 runes + 1 moonstone → base 75 G (no block)");
  it.todo("3 runes + 3 moonstones → base 120 G (two separate blocks)");

  // --- Cursed surcharge ---
  it.todo("newcomer with cursed sword (steel, ench 3) → 165 G (integration example)");

  // --- High enchantment ---
  it.todo("sword with enchantment exactly 5 → high-ench surcharge applies");
  it.todo("sword with enchantment 4 → no high-ench surcharge");

  // --- Loyalty discount ---
  it.todo("customer with exactly 2 years → loyalty discount applies");

  // --- Multi-item modifier scope ---
  it.todo("cursed sword + plain amulet → 210 G before fee (curse on sword only)");

  // --- Multi-quote scenario with follow-up contract ---
  it.todo("long-standing customer's second contract (cursed sword ench 7) → 160 G");

  // --- Rounding in MHPCO's favor (premium) ---
  it.todo("premium calculation yielding 197.5 G → rounded up to 198 G");

  // --- Claim: standard reimbursement ---
  it.todo("regular sword (ench 3), damage 500 G → payout 400 G (500 − 100 deductible)");
  it.todo("rune damage 200 G → payout 100 G (200 − 100 deductible)");

  // --- Claim: high-enchantment 50% rule ---
  it.todo("steel sword ench 9, damage 1000 G → payout 400 G (500 − 100)");

  // --- Claim: dragon material full reimbursement ---
  it.todo("dragon sword ench 5, damage 800 G → payout 700 G (full − 100)");

  // --- Claim: both clauses, 50% wins ---
  it.todo("dragon sword ench 9, damage 1000 G → payout 400 G (500 − 100)");
  it.todo("dragon sword exactly ench 8, damage 1000 G → payout 400 G");

  // --- Claim: deductible per damage event ---
  it.todo("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per item)");

  // --- Claim rounding (down, MHPCO's favor) ---
  it.todo("payout calculation yielding 350.5 G → rounded down to 350 G");

  // --- Cap behaviour ---
  it.todo("sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value)");
  it.todo("sword + 3 runes → insurance sum 1750 G (block discount doesn't affect sum)");
  it.todo("two successive 1500 G claims on a sword (cap 2000) → 1400 then 600, remaining 0");

  // --- Multiple items of same type ---
  it.todo("two swords → insurance sum 2000 G; dragon damages both → each its own deductible");
  it.todo("more damage entries of a type than insured → CLI rejects (non-zero exit)");

  // --- Error cases ---
  it.todo("quote with unknown item type → CLI exits non-zero, error on stderr");
  it.todo("claim with damage referencing item not in policy → CLI exits non-zero");
  it.todo("claim with negative damage amount → CLI exits non-zero");
});
