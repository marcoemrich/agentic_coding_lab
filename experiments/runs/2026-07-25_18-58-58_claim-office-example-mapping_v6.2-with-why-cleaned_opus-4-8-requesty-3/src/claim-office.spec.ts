import { describe, it, expect } from "vitest";
import { basePremium, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office — base premiums and component blocks", () => {
  // Base premiums for main items (price list)
  it("single sword → 100 G base premium", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet → 60 G base premium", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff → 80 G base premium", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion → 40 G base premium", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("single component (rune) → 25 G base premium", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });

  // Building block of 3 alike components
  it("2 runes → 50 G base premium (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(100);
  });
  it("7 runes → 175 G base premium", () => {
    expect(basePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });

  // "Alike" components — ❓ resolved: alike means exactly the same type
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
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
});

describe("MHPCO Claim Office — quote premiums with modifiers", () => {
  // Processing fee
  it.todo("empty item list → premium 5 G (only the processing fee)");

  // Integration example: newcomer with a cursed sword
  it.todo("newcomer (0 years, first contract) cursed sword (steel, ench 3) → premium 165 G");

  // Integration example: long-standing customer's second contract
  it.todo("long-standing (3 years) second contract cursed sword (steel, ench 7) → premium 160 G");

  // ❓ first insurance meaning: each item in a quote is treated as first insurance
  it.todo("first-insurance surcharge still applies to a new item on a follow-up contract");

  // Modifier scope on multi-item policies — ❓ resolved
  it.todo("cursed sword + plain amulet (0 years, first contract) → curse surcharge is 50% of the cursed item's base only");

  // Modifier thresholds
  it.todo("customer with exactly 2 years → loyalty discount applies");
  it.todo("customer with 1 year → no loyalty discount");
  it.todo("sword with exactly enchantment 5 → high-enchantment surcharge applies");
  it.todo("sword with enchantment 5 and cursed → both surcharges apply");
  it.todo("sword with enchantment 4 (not cursed) → no high-enchantment or curse surcharge");

  // Rounding in the MHPCO's favor (premium rounds up)
  it.todo("premium calculation yielding a half (X.5) → rounded up in MHPCO's favor");
});

describe("MHPCO Claim Office — claim payouts", () => {
  // Standard reimbursement (no special clauses)
  it.todo("regular sword (steel, ench 3), damage 500 G → payout 400 G");
  it.todo("rune (value 250 G), damage 200 G → payout 100 G (no enchantment/material clause)");

  // Enchantment threshold vs. dragon material
  it.todo("dragon sword, ench 8, damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("dragon sword, ench 9, damage 1000 G → payout 400 G (both clauses; 50% wins, then deductible)");
  it.todo("dragon sword, ench 5, damage 800 G → payout 700 G (dragon full, then deductible)");
  it.todo("steel sword, ench 9, damage 1000 G → payout 400 G (high-enchantment 50% then deductible)");

  // Deductible per damage event
  it.todo("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)");

  // Rounding in the MHPCO's favor (payout rounds down)
  it.todo("payout calculation yielding a half (X.5) → rounded down in MHPCO's favor");
});

describe("MHPCO Claim Office — insurance sum and cap", () => {
  it.todo("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value)");
  it.todo("policy covers sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)");
  it.todo("two successive claims of 1500 G on a sword (cap 2000) → payouts 1400 G then 600 G, cap exhausted");
});

describe("MHPCO Claim Office — multiple items of the same type", () => {
  it.todo("policy covers two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("dragon attack damages both swords → each entry is a separate damage with its own deductible");
  it.todo("more damages of a type than insured (two sword damages, one sword) → claim rejected (throws)");
});

describe("MHPCO Claim Office — error handling", () => {
  it.todo("quote with an unknown item type (broomstick) → throws");
  it.todo("claim referencing an item not in the policy → throws");
  it.todo("claim with a negative damage amount (-200) → throws");
});

describe("MHPCO Claim Office — CLI", () => {
  it.todo("reads a JSON scenario from stdin and writes results JSON to stdout");
  it.todo("exits non-zero and writes to stderr on an unknown item type; no results on stdout");
  it.todo("exits non-zero on a claim referencing an item not in the policy");
  it.todo("exits non-zero on a negative damage amount");
});
