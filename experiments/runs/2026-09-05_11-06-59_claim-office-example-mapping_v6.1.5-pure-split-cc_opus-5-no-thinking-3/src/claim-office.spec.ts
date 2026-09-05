import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single items -------------------------------------
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("sword → base premium 100 G", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("amulet → base premium 60 G", () => {
    // 60 G base + 6 G first insurance + 5 G fee = 71 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("staff → base premium 80 G", () => {
    // 80 G base + 8 G first insurance + 5 G fee = 93 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("potion → base premium 40 G", () => {
    // 40 G base + 4 G first insurance + 5 G fee = 49 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune → base premium 25 G", () => {
    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G → 33 G (rounded up)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone → base premium 25 G", () => {
    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G → 33 G (rounded up)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Component blocks --------------------------------------------------
  it("2 runes → 50 G base premium", () => {
    // 50 G base + 5 G first insurance + 5 G fee = 60 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    // block of 3 = 60 G base + 6 G first insurance + 5 G fee = 71 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G (rounded up)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // "alike" means the same type, not the same family
    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G → 88 G (rounded up)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // 60 G + 60 G base + 12 G first insurance + 5 G fee = 137 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array(3).fill({ type: "rune" }),
            ...Array(3).fill({ type: "moonstone" }),
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ------------------------------------------
  it("cursed sword adds 50 % of its base premium as risk surcharge", () => {
    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });

    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 → high-enchantment surcharge applies (30 %)", () => {
    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });

    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → both surcharges apply", () => {
    // 100 G base + 50 G curse + 30 G high enchantment
    //   + 10 G first insurance + 5 G fee = 195 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---------------------------------------------
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee = 95 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("first quote carries a 10 % initial assessment surcharge", () => {
    // amulet 60 G base + 6 G first insurance + 5 G fee = 71 G;
    // without the surcharge it would be 65 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("second quote in a scenario receives a 15 % follow-up contract discount", () => {
    // first quote:  100 G base + 10 G first insurance + 5 G fee = 115 G
    // second quote: 100 G base + 10 G first insurance − 15 G follow-up
    //               + 5 G fee = 100 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("first insurance surcharge still applies on a follow-up contract", () => {
    // each item in a quote is treated as a first insurance, regardless of
    // customer history — so the +10 % applies alongside the −15 % follow-up
    // second quote: 100 G base − 20 G loyalty + 10 G first insurance
    //               − 15 G follow-up + 5 G fee = 80 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 80 });
  });

  // --- Modifier scope on multi-item policies ------------------------------
  it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G → 210 G before further modifiers and fee", () => {
    // the curse surcharge is 50 % of the cursed SWORD's base premium (50 G),
    // not 50 % of the 160 G policy total
    // 160 G base + 50 G curse + 16 G first insurance + 5 G fee = 231 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ------------------------------------------------------------
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    // 7 runes: 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G
    const sevenRunes = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(sevenRunes).toEqual({ results: [{ premium: 198 }] });

    // a second fractional case: rune + amulet
    // 85 G base + 8.5 G first insurance + 5 G fee = 98.5 G → 99 G
    const runeAndAmulet = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "amulet" }] },
      ],
    });

    expect(runeAndAmulet).toEqual({ results: [{ premium: 99 }] });
  });
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    // enchantment 9 → 50 % of 901 = 450.5, − 100 deductible = 350.5 → 350 G
    // the cap must be reduced by the rounded 350, not the fractional 350.5:
    // 2000 − 350 = 1650, and the follow-up claim leaves it there
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    expect(result.results[2]).toEqual({ payout: 0, remainingCap: 1650 });
  });

  // --- Integration examples -------------------------------------------------
  it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
    // 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
    //   + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee = 160 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ----------------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    // full reimbursement minus the 100 G deductible; no special clause applies
    // cap = 2 × 1000 G insurance value = 2000 G, so 1600 G remains
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G", () => {
    // runes have no enchantment level or material, so no special clause applies
    // cap = 2 × 250 G = 500 G, so 400 G remains
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ------------------------------------------------
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
    // only the dragon-material clause applies (enchantment 5 < 8):
    // full reimbursement, then deductible: 800 − 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
    // only the high-enchantment clause applies: 50 % first, then deductible
    // 500 − 100 = 400; cap 2000 G → 1600 G remains
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
    // both clauses apply; the 50 % rule wins, then deductible: 500 − 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    // the high-enchantment clause applies at exactly 8, then the deductible
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event -------------------------------------
  it("dragon attack damaging sword (500 G) and amulet (300 G) → payout 600 G", () => {
    // the 100 G deductible applies once per damaged item:
    // (500 − 100) + (300 − 100) = 600
    // cap = 2 × (1000 + 600) = 3200 G → 2600 G remains
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap ---------------------------------------------------------------
  it("policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    // insurance sum = 1000 + 600 = 1600 G, cap = 3200 G
    // a 100 G damage pays exactly the deductible away, leaving the cap intact
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    // insurance sum = 2 × 1000 G = 2000 G, cap = 4000 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
    // premium with modifiers is 165 G, but the cap is based on the unmodified
    // 1000 G insurance value: 2 × 1000 = 2000 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G", () => {
    // the block discount applies to the premium (100 + 60 base) but the
    // insurance sum uses full unit values: 1000 + 3 × 250 = 1750 G, cap 3500 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // 160 G base + 16 G first insurance + 5 G fee = 181 G
    expect(result.results[0]).toEqual({ premium: 181 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword, two successive claims of 1500 G → first payout 1400 G, remaining cap 600 G", () => {
    // insurance sum 1000 G, cap 2000 G; first claim: 1500 − 100 = 1400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword, second claim of 1500 G → payout 600 G, remaining cap 0 G", () => {
    // the desired 1400 G is reduced to the 600 G remaining cap
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type -------------------------------------
  it("two swords insured, two sword damages → each damage gets its own deductible", () => {
    // two {itemType: "sword"} entries are two separate damages:
    // (500 − 100) + (300 − 100) = 600; cap 4000 G → 3400 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than insured → claim rejected (error)", () => {
    // two sword damages but only one sword insured
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Errors ------------------------------------------------------------------------
  it("quote with an unknown item type (broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not part of the policy (amulet, only sword insured) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim referencing a damage entry with an unknown item type → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with a damage entry of amount -200 → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- CLI ---------------------------------------------------------------------------
  it("CLI reads a scenario from stdin and writes results JSON to stdout", () => {
    // the spec's own schema example
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    const cli = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(cli.status).toBe(0);
    // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G
    // claim: 200 − 100 = 100; cap = 2 × 600 = 1200 → 1100
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes to stderr on an invalid scenario", () => {
    const cli = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf8",
    });

    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    // an error description, not a raw crash dump
    expect(cli.stderr).toContain("Unknown item type: broomstick");
    expect(cli.stderr).not.toContain("at runScenario");
  });
});
