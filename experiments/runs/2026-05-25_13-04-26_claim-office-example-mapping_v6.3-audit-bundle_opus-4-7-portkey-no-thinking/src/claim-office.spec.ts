import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial cases ---
  it("empty quote → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per item type (single-item quote, no modifiers, newcomer fresh customer adjustments excluded by using long-standing 2yr + follow-up — actually keep simple: use no modifiers via test inputs that neutralize all) ---
  // For isolation, the simplest approach: customer with 0 years, single item (first insurance applies). We will design test inputs so we can read off rules directly.

  // Single item, no surcharges, fresh customer first contract: base + 10% first insurance + 5 fee
  it("quote single sword (steel, ench 3), newcomer first contract → 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote single amulet (silver, ench 2), newcomer first contract → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote single staff (wood, ench 1), newcomer first contract → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote single potion (glass, ench 0), newcomer first contract → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and blocks ---
  it("quote 2 runes, newcomer first contract → base 50 G; +5 first ins + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote 3 runes (block applies) → base 60 G; +6 first ins + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote 4 runes (no block — block requires exactly 3) → 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("quote 7 runes → base 175 G (60 block + 4×25); +18 first ins (rounded up from 17.5) + 5 fee = 198 G");

  // --- 'Alike' components clarification ---
  it.todo("quote 2 runes + 1 moonstone → base 75 G (no block: different types)");
  it.todo("quote 3 runes + 3 moonstones → base 120 G (two separate blocks of 60 each)");

  // --- Item-specific modifiers ---
  it.todo("quote cursed sword (steel, ench 3), newcomer first → 100 + 50 curse + 10 first ins + 5 fee = 165 G");
  it.todo("quote sword with enchantment exactly 5 → high-enchantment surcharge applies (100 + 30 + 10 first ins + 5 fee = 145 G)");
  it.todo("quote sword with enchantment 4 → no high-enchantment surcharge (100 + 10 first ins + 5 fee = 115 G)");
  it.todo("quote cursed sword with enchantment 5 → both surcharges (100 + 50 + 30 + 10 first ins + 5 fee = 195 G)");

  // --- Policy-wide modifiers: loyalty threshold ---
  it.todo("customer with exactly 2 years → loyalty discount applies (sword steel ench 3: 100 + 10 first ins − 22 loyalty + 5 fee = 93 G)");
  it.todo("customer with 1 year → no loyalty discount (sword steel ench 3 → 115 G)");

  // --- First-insurance surcharge always applies per item (clarifying ❓) ---
  it.todo("long-standing customer's brand-new sword still gets first-insurance surcharge per item");

  // --- Follow-up contract discount ---
  it.todo("second quote in scenario → follow-up contract discount (15%) applies on policy total");

  // --- Modifier scope: cursed surcharge applies only to cursed item, loyalty/follow-up apply to policy ---
  it.todo("cursed sword + plain amulet, newcomer first contract → policy base 160 + 50 curse + 16 first ins (10% of 160) + 5 fee = 231 G");

  // --- Rounding in MHPCO's favor ---
  it.todo("premium calculation yielding 197.5 → rounded up to 198 G");

  // --- Integration examples ---
  it.todo("newcomer (0y, no prev contract) with cursed sword (steel, ench 3) → premium 165 G");
  it.todo("3y customer's second quote of cursed sword (steel, ench 7) → premium 160 G");

  // --- Unknown item type error ---
  it.todo("quote with unknown item type (broomstick) → throws (CLI must exit non-zero, stderr message)");

  // --- Claims: basic standard reimbursement ---
  it.todo("standard reimbursement: regular sword (steel, ench 3) damage 500 → payout 400");
  it.todo("damage to a rune (insurance value 250), damage 200 → payout 100");

  // --- Claims: enchantment >= 8 50% reimbursement ---
  it.todo("steel sword, enchantment 9, damage 1000 → payout 400 (50% then deductible)");

  // --- Claims: dragon material full reimbursement ---
  it.todo("dragon-material sword, enchantment 5, damage 800 → payout 700 (full minus deductible)");

  // --- Claims: dragon wins over high-enchantment ---
  it.todo("dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% wins, then deductible)");
  it.todo("dragon-material sword, enchantment exactly 8, damage 1000 → payout 400 (high-enchant clause applies, then deductible)");

  // --- Claims: deductible per damage event ---
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible applies per damaged item)");

  // --- Claims: multiple items of same type ---
  it.todo("policy with 2 swords, dragon damages both — each entry treated as separate damage with own deductible");
  it.todo("claim with more sword damages than swords insured → CLI exits non-zero, whole claim rejected");

  // --- Claims: cap exhaustion ---
  it.todo("policy sword + amulet: insurance sum 1600, cap 3200");
  it.todo("cursed sword (modified premium) → cap based on unmodified insurance value: cap 2000");
  it.todo("policy sword + 3 runes (block): insurance sum 1750 (block discount affects premium only)");
  it.todo("sword insured (cap 2000); two successive claims of 1500 each → 1st payout 1400 remainingCap 600; 2nd payout 600 remainingCap 0");

  // --- Claims: payout rounding (down, MHPCO favor) ---
  it.todo("payout calculation yielding 350.5 → rounded down to 350");

  // --- Claims: error cases ---
  it.todo("claim references damage entry whose item is not part of policy → exits non-zero, stderr");
  it.todo("claim references damage with unknown item type → exits non-zero, stderr");
  it.todo("claim with damage amount -200 → exits non-zero, stderr");
});
