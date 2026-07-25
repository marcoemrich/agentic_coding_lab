import { describe, it, expect } from "vitest";
import { runScenario, basePremium, premium } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums / price list (base premium in isolation) ---
  it("empty item list → base premium 0", () => {
    expect(basePremium([])).toBe(0);
  });
  it("single sword → base premium 100", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet → base premium 60", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff → base premium 80", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion → base premium 40", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("single rune (component) → base premium 25", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });

  // --- Building block of 3 alike components ---
  it("2 runes → base premium 50 (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes → base premium 60 (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes → base premium 100 (no block — block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes → base premium 175 (no block — 7 is not exactly 3, so all singles: 7×25)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(sevenRunes)).toBe(175);
  });

  // --- "Alike" components (❓ same type, not same family) ---
  it("2 runes + 1 moonstone → base premium 75 (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones → base premium 120 (two separate blocks)", () => {
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

  // --- Modifier thresholds ---
  it("customer with exactly 2 years → loyalty discount applies", () => {
    expect(
      premium([{ type: "sword" }], { yearsWithMHPCO: 2, isFollowUp: false }),
    ).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    expect(
      premium([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0, isFollowUp: false }),
    ).toBe(145);
  });
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply");

  // --- Modifier scope on multi-item policies ---
  it.todo(
    "cursed sword (100) + plain amulet (60) → curse surcharge is 50 (50% of cursed item base, not policy total)",
  );

  // --- Integration examples (full final premium incl. fee) ---
  it.todo("newcomer (0 yrs, first contract) with cursed sword (steel, ench 3) → premium 165");
  it.todo(
    "long-standing customer (3 yrs) second contract, cursed sword (steel, ench 7) → premium 160 (first-insurance still applies per item)",
  );

  // --- Rounding ---
  it.todo("premium calculation yielding 197.5 → final premium 198 (rounded up, MHPCO favor)");
  it.todo("payout calculation yielding 350.5 → final payout 350 (rounded down, MHPCO favor)");

  // --- Edge cases: quote ---
  it.todo("empty item list quote → premium 5 (processing fee only)");
  it.todo("quote with unknown item type (broomstick) → throws / non-zero exit");

  // --- Claim: standard reimbursement ---
  it.todo("regular sword (steel, ench 3), damage 500 → payout 400 (full minus 100 deductible)");
  it.todo("rune (value 250), damage 200 → payout 100 (full minus 100 deductible, no special clause)");

  // --- Claim: enchantment threshold vs dragon material ---
  it.todo("dragon sword, ench 8, damage 1000 → payout 400 (50% then deductible)");
  it.todo("dragon sword, ench 5, damage 800 → payout 700 (dragon full reimburse, then deductible)");
  it.todo("steel sword, ench 9, damage 1000 → payout 400 (high-ench 50%, then deductible)");
  it.todo("dragon sword, ench 9, damage 1000 → payout 400 (both clauses, 50% wins, then deductible)");

  // --- Claim: deductible per damage event ---
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible once per item)");
  it.todo("two swords both damaged → each damage entry gets its own deductible");
  it.todo("more damage entries of a type than covered → throws / non-zero exit (claim rejected)");

  // --- Claim: cap ---
  it.todo("policy of sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword → cap 2000 (based on unmodified insurance value)");
  it.todo("policy of sword + 3 runes → insurance sum 1750 (block affects premium only)");
  it.todo("sword (cap 2000), two 1500 claims → first payout 1400 (cap left 600), second payout 600 (cap left 0)");

  // --- Claim: edge cases / errors ---
  it.todo("claim references item not in policy (amulet when only sword insured) → throws / non-zero exit");
  it.todo("claim with damage amount -200 → throws / non-zero exit");
});
