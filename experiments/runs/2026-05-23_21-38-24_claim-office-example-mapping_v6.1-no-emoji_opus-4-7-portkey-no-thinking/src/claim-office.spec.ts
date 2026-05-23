import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Trivial / edge cases ---
  it.todo("empty item list yields premium 5 G (only the processing fee)");

  // --- Base premiums for main items (newcomer, 0 years, first contract, single item) ---
  // These all include: base + 10% first-insurance + 5 G fee (newcomer => no loyalty, no follow-up)
  // Sword: 100 + 10 + 5 = 115; Amulet: 60 + 6 + 5 = 71; Staff: 80 + 8 + 5 = 93; Potion: 40 + 4 + 5 = 49
  it.todo("quote for a single plain sword (newcomer) yields 115 G (100 base + 10 first + 5 fee)");
  it.todo("quote for a single plain amulet (newcomer) yields 71 G (60 base + 6 first + 5 fee)");
  it.todo("quote for a single plain staff (newcomer) yields 93 G (80 base + 8 first + 5 fee)");
  it.todo("quote for a single plain potion (newcomer) yields 49 G (40 base + 4 first + 5 fee)");

  // --- Components and the block-of-3 rule ---
  // Each rune: 25 G base. Block-of-3 = 60 G. Newcomer multipliers apply (10% + 5 G fee).
  it.todo("quote for 2 runes yields 50 G base premium (no block)");
  it.todo("quote for 3 runes yields 60 G base premium (block applies)");
  it.todo("quote for 4 runes yields 100 G base premium (no block — block requires exactly 3)");
  it.todo("quote for 7 runes yields 175 G base premium (one block of 3 + 4 singles: 60 + 100)");

  // --- 'Alike' clarification ---
  it.todo("quote for 2 runes + 1 moonstone yields 75 G base premium (different types, no block)");
  it.todo("quote for 3 runes + 3 moonstones yields 120 G base premium (two separate blocks)");

  // --- Item-level modifiers in isolation ---
  it.todo("cursed sword adds 50% surcharge to that item's base premium");
  it.todo("highly enchanted (>=5) sword adds 30% surcharge");
  it.todo("sword with exactly enchantment 5 triggers the high-enchantment surcharge");
  it.todo("sword with enchantment 4 does not trigger the high-enchantment surcharge");
  it.todo("cursed sword with exactly enchantment 5 triggers both surcharges");

  // --- Policy-wide modifiers ---
  it.todo("long-standing customer (>=2 years) receives a 20% loyalty discount on policy base");
  it.todo("customer with exactly 2 years with MHPCO receives the loyalty discount");
  it.todo("follow-up contract (2nd quote in scenario) receives a 15% discount on policy base");
  it.todo("each item in a quote carries a 10% first-insurance surcharge on its base premium");

  // --- Modifier scope on multi-item policies (the clarifying example) ---
  it.todo(
    "cursed sword + plain amulet: cursed surcharge applies only to the cursed item — 210 G before further modifiers and fee",
  );

  // --- Rounding (in MHPCO's favor) ---
  it.todo("premium calculation yielding 197.5 G rounds up to 198 G");
  it.todo("payout calculation yielding 350.5 G rounds down to 350 G");

  // --- Claim processing: basics ---
  it.todo("regular sword damage 500 G yields payout 400 G (full reimbursement − 100 G deductible)");
  it.todo("rune damage 200 G yields payout 100 G (no special clause — full reimbursement − deductible)");
  it.todo("claim returns the remaining cap after payout");

  // --- Claim special clauses ---
  it.todo(
    "dragon-material sword, enchantment 5, damage 800 G yields payout 700 G (dragon clause only — full minus deductible)",
  );
  it.todo("steel sword, enchantment 9, damage 1000 G yields payout 400 G (50% then deductible)");
  it.todo(
    "dragon-material sword with exactly enchantment 8, damage 1000 G yields payout 400 G (50% clause wins, then deductible)",
  );
  it.todo(
    "dragon-material sword, enchantment 9, damage 1000 G yields payout 400 G (both clauses: 50% wins, then deductible)",
  );

  // --- Deductible per damage event ---
  it.todo(
    "dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible applies once per damaged item)",
  );

  // --- Multiple items of the same type ---
  it.todo("policy with two swords: insurance sum 2000 G and cap 4000 G");
  it.todo("two-sword policy: two damage entries each get their own deductible");
  it.todo("more damage entries of a type than the policy covers → CLI exits non-zero (rejected)");

  // --- Cap exhaustion ---
  it.todo("sword + amulet policy: insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword (premium with modifiers 165 G): cap based on unmodified insurance value → cap 2000 G");
  it.todo("sword + 3 runes (block): insurance sum 1750 G (= 1000 + 3×250); block discount does not affect insurance sum");
  it.todo(
    "successive claims drain the cap: 1st claim 1500 → payout 1400, remainingCap 600; 2nd claim 1500 → payout 600, remainingCap 0",
  );

  // --- Integration examples ---
  it.todo("newcomer (0 yrs, no prev contract) with a cursed steel sword (enchantment 3) → premium 165 G");
  it.todo("3-yr customer's 2nd quote: cursed steel sword (enchantment 7) → premium 160 G");

  // --- Error handling (CLI) ---
  it.todo("quote with an unknown item type (e.g. broomstick) → CLI exits non-zero with error on stderr");
  it.todo("claim damage entry whose item is not part of the policy → CLI exits non-zero with stderr error");
  it.todo("claim damage entry with a negative amount → CLI exits non-zero with stderr error");
});
