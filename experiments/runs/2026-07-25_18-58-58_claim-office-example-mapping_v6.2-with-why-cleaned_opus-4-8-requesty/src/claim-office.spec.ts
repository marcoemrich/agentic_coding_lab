import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest / edge ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Quote: single main items (base + always-on first insurance + fee) ---
  it("single plain sword (base 100) → newcomer premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single plain amulet (base 60) → newcomer premium 71 G (60 + 6 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single plain staff (base 80) → newcomer premium 93 G (80 + 8 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single plain potion (base 40) → newcomer premium 49 G (40 + 4 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Quote: component building blocks ---
  it("2 runes → base premium 50 G (no block); newcomer full premium 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → base premium 60 G (block of exactly 3 applies); newcomer full premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → base premium 100 G (no block — block requires exactly 3); newcomer full premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes → base premium 175 G (group of 7, no block); newcomer full premium 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- Quote: "alike" components ---
  it("2 runes + 1 moonstone → base premium 75 G (no block: different types); newcomer full 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones → base premium 120 G (two separate blocks); newcomer full 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Quote: item-level modifiers in isolation ---
  it("cursed sword adds 50% of the item base premium (curse surcharge = 50 G); newcomer full 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (30 G); newcomer full 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply");

  // --- Quote: policy-level modifiers ---
  it.todo("customer with exactly 2 years with MHPCO → 20% loyalty discount applies");
  it.todo("customer with 1 year → no loyalty discount");
  it.todo("second quote in a scenario → 15% follow-up contract discount applies");
  it.todo("first insurance surcharge (10%) applies to every item regardless of customer history");

  // --- Quote: modifier scope on multi-item policies ---
  it.todo("cursed sword (base 100) + plain amulet (base 60) → policy base 160, curse adds 50 (of sword base) → 210 before loyalty/follow-up/fee");

  // --- Quote: rounding ---
  it.todo("premium calculation yielding 197.5 G → final premium 198 G (rounded up, MHPCO favor)");

  // --- Quote: integration examples ---
  it.todo("newcomer with a cursed sword (steel, ench 3) → premium 165 G");
  it.todo("long-standing customer's second contract, cursed sword (steel, ench 7) → premium 160 G");

  // --- Claim: standard reimbursement ---
  it.todo("regular sword (steel, ench 3), damage 500 → payout 400 G (full minus 100 deductible)");
  it.todo("damage to a rune (value 250), damage 200 → payout 100 G (full minus 100 deductible, no special clause)");

  // --- Claim: special clauses ---
  it.todo("dragon-material sword, ench 5, damage 800 → payout 700 G (dragon full reimbursement, then deductible)");
  it.todo("steel sword, ench 9, damage 1000 → payout 400 G (high-enchantment 50% first, then deductible)");
  it.todo("dragon-material sword, ench 9, damage 1000 → payout 400 G (both clauses; 50% wins, then deductible)");
  it.todo("dragon-material sword, exactly ench 8, damage 1000 → payout 400 G (high-enchantment clause, then deductible)");

  // --- Claim: deductible per damage event ---
  it.todo("dragon attack damaging insured sword (500) and amulet (300) → payout 600 G (deductible once per damaged item)");

  // --- Claim: rounding ---
  it.todo("payout calculation yielding 350.5 G → final payout 350 G (rounded down, MHPCO favor)");

  // --- Claim: insurance sum & cap ---
  it.todo("policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value; premium modifiers do not raise the cap)");
  it.todo("policy covering a sword and 3 runes (block) → insurance sum 1750 G (block discount affects premium only)");

  // --- Claim: multiple items of the same type ---
  it.todo("policy covering two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("dragon attack damaging both swords (two sword entries) → each treated as separate damage with its own deductible");

  // --- Claim: cap exhaustion across successive claims ---
  it.todo("sword (cap 2000), first claim 1500 → payout 1400 G, remaining cap 600 G");
  it.todo("sword (cap 2000), two successive 1500 claims → second payout 600 G, remaining cap 0 G (reduced to remaining cap)");

  // --- Errors (CLI exits non-zero) ---
  it.todo("quote with an unknown item type (e.g. broomstick) → error (no results produced)");
  it.todo("claim referencing an item not part of the policy → error");
  it.todo("claim with more damage entries of a type than the policy covers → error");
  it.todo("claim with a negative damage amount → error");

  // --- CLI schema example (end-to-end shape) ---
  it.todo("schema example: amulet quote then amulet claim → results [{premium}, {payout, remainingCap}]");
});
