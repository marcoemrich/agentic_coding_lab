import { describe, it, expect } from "vitest";
import {
  computeBasePremium,
  computePremium,
  claim,
  processScenario,
  type Item,
  type Customer,
  type Policy,
  type Incident,
  type Scenario,
} from "./claim-office.js";

// ---------------------------------------------------------------------------
// Item base premiums (computeBasePremium) -- only sums of base premiums,
// no modifiers, no fees. The "block of 3 alike components" rule lives here.
// ---------------------------------------------------------------------------
describe("Item base premiums (computeBasePremium)", () => {
  it("should compute 100 G base premium for a sword", () => {
    expect(computeBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("should compute 60 G base premium for an amulet", () => {
    expect(computeBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("should compute 80 G base premium for a staff", () => {
    expect(computeBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("should compute 40 G base premium for a potion", () => {
    expect(computeBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("should compute 25 G base premium for a single rune", () => {
    expect(computeBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("should compute 25 G base premium for a single moonstone", () => {
    expect(computeBasePremium([{ type: "moonstone" }])).toBe(25);
  });

  it("should compute 50 G base premium for 2 runes", () => {
    expect(computeBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("should compute 60 G base premium for 3 runes (block applies)", () => {
    expect(computeBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ])).toBe(60);
  });
  it("should compute 100 G base premium for 4 runes (no block)", () => {
    expect(computeBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
    ])).toBe(100);
  });
  it("should compute 175 G base premium for 7 runes (no block)", () => {
    expect(computeBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" },
    ])).toBe(175);
  });

  it("should compute 75 G base premium for 2 runes + 1 moonstone (no block: different types)", () => {
    expect(computeBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ])).toBe(75);
  });
  it("should compute 120 G base premium for 3 runes + 3 moonstones (two blocks)", () => {
    expect(computeBasePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(120);
  });

  it("should compute 160 G base premium for sword + amulet", () => {
    expect(computeBasePremium([
      { type: "sword" }, { type: "amulet" },
    ])).toBe(160);
  });

  it("should throw on unknown item type", () => {
    expect(() => computeBasePremium([{ type: "broomstick" }])).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Quote (computePremium) -- per-item and policy-wide modifiers, fee, rounding
// ---------------------------------------------------------------------------
describe("Quote: per-item base modifiers and fee", () => {
  it("should return 5 G premium for empty item list (only processing fee)", () => {
    expect(computePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });
  it("should compute premium for single sword (newcomer, first quote): 115 G", () => {
    expect(computePremium(
      [{ type: "sword" }],
      { yearsWithMHPCO: 0 },
      0,
    )).toBe(115);
  });
  it("should compute premium for single amulet (newcomer, first quote): 71 G", () => {
    expect(computePremium(
      [{ type: "amulet" }],
      { yearsWithMHPCO: 0 },
      0,
    )).toBe(71);
  });
  it.todo("should compute premium for single staff (newcomer, first quote): 93 G");
  it.todo("should compute premium for single potion (newcomer, first quote): 49 G");
  it.todo("should compute premium for single rune (newcomer, first quote): 33 G");
});

describe("Quote: component blocks", () => {
  it.todo("should compute premium for 3 runes (block): 71 G");
  it.todo("should compute premium for 7 runes: 198 G (rounded up from 197.5)");
  it.todo("should compute premium for 3 runes + 3 moonstones (two blocks): 137 G");
  it.todo("should compute premium for 2 runes + 1 moonstone (no block): 88 G");
});

describe("Quote: per-item modifiers (cursed, enchantment)", () => {
  it.todo("should add 50% cursed surcharge on a cursed sword");
  it.todo("should add 30% enchantment surcharge on sword with exactly enchantment 5");
  it.todo("should add 30% enchantment surcharge on sword with enchantment >= 5");
  it.todo("should NOT add enchantment surcharge on sword with enchantment 4");
  it.todo("should add both cursed and enchantment surcharges when both apply");
});

describe("Quote: policy-wide modifiers (loyalty, first insurance, follow-up)", () => {
  it.todo("should add 10% first insurance surcharge for each item");
  it.todo("should apply 20% loyalty discount for customer with exactly 2 years");
  it.todo("should apply 20% loyalty discount for customer with >2 years");
  it.todo("should NOT apply loyalty discount for customer with 1 year");
  it.todo("should NOT apply loyalty discount for customer with 0 years");
  it.todo("should apply 15% follow-up discount on second quote");
  it.todo("should NOT apply follow-up discount on first quote");
});

describe("Quote: integration examples from the spec", () => {
  it.todo("newcomer with cursed sword (0 years, first quote, steel, enchantment 3): 165 G");
  it.todo("long-standing customer 2nd contract cursed sword enchantment 7: 160 G");
  it.todo("multi-item: cursed sword + plain amulet before policy-wide + fee: 210 G");
});

describe("Quote: rounding in MHPCO's favor (ceil)", () => {
  it.todo("should round premium UP for MHPCO's favor: 197.5 -> 198");
});

// ---------------------------------------------------------------------------
// Claim (claim) -- reimbursement, deductible, cap, special clauses
// ---------------------------------------------------------------------------
describe("Claim: standard reimbursement", () => {
  it.todo("regular sword (steel, enchantment 3) damage 500: payout 400");
  it.todo("rune damage 200: payout 100");
});

describe("Claim: special clauses (dragon material vs enchantment)", () => {
  it.todo("dragon-material sword enchantment 8 damage 1000: payout 400 (50% wins, then -100)");
  it.todo("dragon-material sword enchantment 5 damage 800: payout 700 (full - 100)");
  it.todo("steel sword enchantment 9 damage 1000: payout 400 (50% then -100)");
  it.todo("dragon-material sword enchantment 9 damage 1000: payout 400 (both clauses apply)");
});

describe("Claim: multiple damage events with per-event deductible", () => {
  it.todo("dragon attack damages sword 500 + amulet 300: payout 600");
});

describe("Claim: insurance sum and cap", () => {
  it.todo("sword insurance sum 1000, cap 2000");
  it.todo("sword + amulet insurance sum 1600, cap 3200");
  it.todo("sword + 3 runes insurance sum 1750 (block discount does not affect insurance)");
  it.todo("cursed sword: cap is 2x UNMODIFIED insurance value (premium modifiers don't raise cap)");
});

describe("Claim: cap exhaustion across multiple claims", () => {
  it.todo("sword insurance 1000, two claims of 1500 each: first payout 1400 cap 600; second payout 600 cap 0");
});

describe("Claim: multiple items of same type", () => {
  it.todo("two swords: insurance sum 2000, cap 4000");
  it.todo("dragon attack damages both swords, each treated as separate damage with own deductible");
});

describe("Claim: payout rounding (floor, MHPCO's favor)", () => {
  it.todo("should round payout DOWN for MHPCO's favor: 350.5 -> 350");
});

describe("Claim: validation errors", () => {
  it.todo("should throw if damage entry's item is not part of the policy");
  it.todo("should throw if damage entry has unknown type");
  it.todo("should throw if damage amount is negative");
  it.todo("should throw if damages array has more entries of a type than the policy covers");
});

// ---------------------------------------------------------------------------
// Scenario (processScenario) -- multi-step processing
// ---------------------------------------------------------------------------
describe("Scenario: multi-step processing", () => {
  it.todo("quote step returns premium; subsequent claim step returns payout + remainingCap");
  it.todo("two quote steps, claim references the first policy");
  it.todo("two successive claims on same policy exhaust the cap");
  it.todo("follow-up discount applies based on quote order in the scenario");
});

describe("Scenario: validation errors", () => {
  it.todo("should throw on unknown item type in a quote step");
  it.todo("should throw on negative damage amount in a claim step");
  it.todo("should throw on more damages than covered in a claim step");
  it.todo("should throw on damage entry item not in policy");
  it.todo("should throw on damage entry item with unknown type");
});
