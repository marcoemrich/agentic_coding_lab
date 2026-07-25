import { describe, it, expect } from "vitest";
import { basePremium, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for main items (price list) ---
  it("basePremium: a sword → 100 G base premium", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("basePremium: an amulet → 60 G base premium", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("basePremium: a staff → 80 G base premium", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("basePremium: a potion → 40 G base premium", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  // --- Component pricing and the building block of 3 alike components ---
  it("basePremium: a single rune → 25 G base premium", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("basePremium: 2 runes → 50 G base premium (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("basePremium: 3 runes → 60 G base premium (block applies)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("basePremium: 4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("basePremium: 7 runes → 175 G base premium", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });

  // --- "Alike" components: block requires same type ---
  it("basePremium: 2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("basePremium: 3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });

  // --- Processing fee and empty policy ---
  it("quote: empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });

  // --- Individual premium modifiers ---
  it.todo("quote: newcomer with a cursed sword (0 yrs, steel, enchantment 3) → premium 165 G");
  it.todo("quote: high-enchantment surcharge applies at exactly enchantment 5");
  it.todo("quote: enchantment 4 → no high-enchantment surcharge");
  it.todo("quote: cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply");
  it.todo("quote: customer with exactly 2 years → loyalty discount applies");

  // --- Modifier scope on multi-item policies ---
  it.todo("quote: cursed surcharge is 50% of the cursed item's base premium, not of the policy total");
  it.todo("quote: each item in a quote is treated as a first insurance regardless of customer history");

  // --- Integration examples ---
  it.todo("quote: long-standing customer's second contract, cursed sword enchantment 7 (3 yrs) → premium 160 G");

  // --- Rounding in the MHPCO's favor ---
  it.todo("quote: a premium that yields 197.5 G → final premium 198 G (rounded up)");
  it.todo("claim: a payout that yields 350.5 G → final payout 350 G (rounded down)");

  // --- Claim processing: standard reimbursement ---
  it.todo("claim: regular sword (steel, enchantment 3), damage 500 G → payout 400 G");
  it.todo("claim: rune (value 250 G), damage 200 G → payout 100 G (no special clause)");

  // --- Claim processing: enchantment threshold vs dragon material ---
  it.todo("claim: dragon-material sword enchantment 8, damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("claim: dragon-material sword enchantment 5, damage 800 G → payout 700 G (full then deductible)");
  it.todo("claim: steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("claim: dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins)");

  // --- Deductible per damage event ---
  it.todo("claim: dragon attack damages sword 500 G and amulet 300 G → payout 600 G (deductible per item)");

  // --- Multiple items of the same type ---
  it.todo("claim: two swords, damages to both → each entry is a separate damage with its own deductible");
  it.todo("claim: more damage entries of a type than the policy covers → whole claim rejected (throws)");

  // --- Insurance sum and cap ---
  it.todo("claim: cursed sword cap is 2000 G, based on the unmodified insurance value");
  it.todo("claim: sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("claim: sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)");

  // --- Cap exhaustion across successive claims ---
  it.todo("claim: sword (cap 2000 G), two 1500 G claims → 1400 G (rem 600), then 600 G (rem 0)");

  // --- Error handling / edge cases ---
  it.todo("quote: unknown item type (e.g. broomstick) → throws (non-zero exit, error to stderr)");
  it.todo("claim: damage entry for an item not in the policy → throws");
  it.todo("claim: damage entry with a negative amount → throws");

  // --- End-to-end multi-step scenario (CLI shape) ---
  it.todo("runScenario: quote then claim produces results in the same order as steps");
});
