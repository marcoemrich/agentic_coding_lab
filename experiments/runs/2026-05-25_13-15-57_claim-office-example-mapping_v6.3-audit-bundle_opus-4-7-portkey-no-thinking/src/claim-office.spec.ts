import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / processing fee ---
  it("empty item list returns premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per item ---
  it("single plain sword returns premium 105 G (100 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("single plain amulet returns premium 65 G (60 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("single plain staff returns premium 85 G (80 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("single plain potion returns premium 45 G (40 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });

  // --- Components ---
  it("single rune returns premium 30 G (25 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 30 }] });
  });
  it("2 runes returns premium 55 G (50 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it.todo("3 runes returns premium 65 G (block: 60 base + 5 fee)");
  it.todo("4 runes returns premium 105 G (no block: 100 base + 5 fee)");
  it.todo("7 runes returns premium 180 G (175 base + 5 fee)");

  // --- 'Alike' clarification (❓) ---
  it.todo("2 runes + 1 moonstone returns premium 80 G (75 base + 5 fee — different types, no block)");
  it.todo("3 runes + 3 moonstones returns premium 125 G (120 base + 5 fee — two separate blocks)");

  // --- Cursed surcharge ---
  it.todo("single cursed sword (newcomer) returns 165 G (100 base + 50 curse + 10 first + 5 fee)");

  // --- High enchantment threshold ---
  it.todo("sword with enchantment 5 (newcomer) adds 30% high-enchantment surcharge → 145 G (100 + 30 + 10 + 5)");
  it.todo("sword with enchantment 4 (newcomer) does not add high-enchantment surcharge → 115 G (100 + 10 + 5)");

  // --- Modifier scope on multi-item policies (❓) ---
  it.todo("policy with cursed sword + plain amulet (newcomer) → 231 G (160 base + 50 curse + 16 first + 5 fee)");

  // --- Loyalty (≥ 2 years) ---
  it.todo("plain sword for 2-year customer → loyalty applies; first contract → 95 G (100 − 20 + 10 + 5)");

  // --- Follow-up contract ---
  it.todo("second quote for newcomer (0 years) of plain sword → follow-up discount applies → 100 G (100 − 15 + 10 + 5)");

  // --- Rounding in MHPCO favor (premium rounds up) ---
  it.todo("premium calculation yielding 197.5 G rounds up to 198 G");

  // --- Integration: long-standing 2nd contract ---
  it.todo("long-standing customer's 2nd contract with cursed sword enchantment 7 → 160 G");

  // --- Claim: standard reimbursement ---
  it.todo("standard sword damage 500 G → payout 400 G (500 − 100 deductible)");
  it.todo("rune damage 200 G → payout 100 G (200 − 100 deductible; no special clause)");

  // --- Claim: high enchantment ---
  it.todo("steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");

  // --- Claim: dragon material ---
  it.todo("dragon sword enchantment 5, damage 800 G → payout 700 G (full then deductible)");

  // --- Claim: both clauses (high enchantment wins) ---
  it.todo("dragon sword enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)");
  it.todo("dragon sword enchantment exactly 8, damage 1000 G → payout 400 G (high-enchantment clause applies)");

  // --- Multiple damages: deductible per event ---
  it.todo("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per item)");

  // --- Multiple same-type items ---
  it.todo("policy with two swords, both damaged → each gets own deductible");
  it.todo("damages array has more items of a type than policy covers → CLI exits non-zero (claim rejected)");

  // --- Cap ---
  it.todo("sword (cap 2000) with two 1500 G claims → first payout 1400, remaining 600; second payout 600, remaining 0");
  it.todo("cursed sword cap based on unmodified insurance value → 2000 G");

  // --- Rounding payout (rounds down) ---
  it.todo("payout calculation yielding 350.5 G rounds down to 350 G");

  // --- Edge cases ---
  it.todo("quote with unknown item type → CLI exits non-zero; error to stderr");
  it.todo("claim references item not in policy → CLI exits non-zero");
  it.todo("claim damage with negative amount → CLI exits non-zero");
});
