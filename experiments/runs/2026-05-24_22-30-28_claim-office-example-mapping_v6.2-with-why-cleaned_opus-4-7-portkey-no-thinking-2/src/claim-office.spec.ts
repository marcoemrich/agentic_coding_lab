import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim-office", () => {
  // --- Edge case: empty policy ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items (single item, newcomer with first insurance) ---
  it("single sword (newcomer, first insurance) → 100 base + 10 first + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (newcomer, first insurance) → 60 base + 6 first + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (newcomer, first insurance) → 80 base + 8 first + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (newcomer, first insurance) → 40 base + 4 first + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components base premium ---
  it("single rune → 25 base + 2.5 first + 5 fee = 32.5, rounded up to 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 base + 5 first + 5 fee = 60 G (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 base (block) + 6 first + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 base + 10 first + 5 fee = 115 G (no block: requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("7 runes → 175 G base premium (one block of 3 + 4 singles? No — block requires exactly 3; 7 → 7×25 = 175)");

  // --- Alike components (clarifying question) ---
  it.todo("2 runes + 1 moonstone → 75 G base premium (no block: different types)");
  it.todo("3 runes + 3 moonstones → 120 G base premium (two separate blocks)");

  // --- Premium modifiers in isolation ---
  it.todo("cursed sword (newcomer) → 100 + 50 curse + 10 first + 5 fee = 165 G");
  it.todo("sword with exactly enchantment 5 → high-enchantment surcharge applies");
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("sword cursed AND enchantment 5 → both surcharges apply");
  it.todo("customer with exactly 2 years → loyalty discount applies (20%)");
  it.todo("customer's second contract → follow-up discount (15%) applies");

  // --- Modifier scope on multi-item policies ---
  it.todo("policy with cursed sword + plain amulet → base 160, curse 50 (on sword only) = 210 before further modifiers/fee");

  // --- Rounding ---
  it.todo("premium calculation yielding 197.5 → 198 (rounded up)");
  it.todo("payout calculation yielding 350.5 → 350 (rounded down)");

  // --- Integration premium examples ---
  it.todo("newcomer with cursed sword → 165 G");
  it.todo("long-standing (3y) customer, second contract, cursed sword enchantment 7 → 160 G");

  // --- Claim processing ---
  it.todo("regular sword (steel, enchantment 3), damage 500 → payout 400 (500 - 100 deductible)");
  it.todo("rune (insurance 250), damage 200 → payout 100 (200 - 100 deductible)");
  it.todo("dragon-material sword, enchantment 5, damage 800 → payout 700 (dragon = full, then deductible)");
  it.todo("steel sword, enchantment 9, damage 1000 → payout 400 (50% then deductible)");
  it.todo("dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% rule wins, then deductible)");
  it.todo("dragon-material sword, enchantment exactly 8, damage 1000 → payout 400 (high-enchantment then deductible)");
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)");

  // --- Cap exhaustion ---
  it.todo("policy: sword + amulet → insurance sum 1600, cap 3200");
  it.todo("policy: cursed sword → cap 2000 (based on unmodified insurance value)");
  it.todo("policy: sword + 3 runes → insurance sum 1750 (block discount doesn't affect insurance sum)");
  it.todo("sword cap 2000; first claim 1500 → payout 1400, remaining cap 600");
  it.todo("sword cap 2000; second claim 1500 after first claim → payout 600, remaining cap 0");

  // --- Multiple items of same type ---
  it.todo("policy with two swords → insurance sum 2000, cap 4000");
  it.todo("policy with two swords; both damaged in one claim → each entry treated as separate damage with own deductible");
  it.todo("policy with one sword; claim has two sword damages → CLI exits non-zero (rejected)");

  // --- Edge cases / errors ---
  it.todo("unknown item type in quote (e.g., broomstick) → CLI exits non-zero, error to stderr");
  it.todo("claim references damage entry whose item is not in policy → CLI exits non-zero");
  it.todo("claim contains negative damage amount → CLI exits non-zero");
});
