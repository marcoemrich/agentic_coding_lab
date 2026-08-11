import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCliRaw = (scenario: unknown) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

const runCli = (scenario: unknown): string => {
  const { status, stdout, stderr } = runCliRaw(scenario);

  if (status !== 0) throw new Error(`CLI exited with ${status}: ${stderr}`);

  return stdout;
};

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums for main items ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("a single sword → base premium 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 100 base + 10 first insurance + 5 fee = 115
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single amulet → base premium 60 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };

    // 60 base + 6 first insurance + 5 fee = 71
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single staff → base premium 80 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };

    // 80 base + 8 first insurance + 5 fee = 93
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single potion → base premium 40 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };

    // 40 base + 4 first insurance + 5 fee = 49
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and the block of 3 alike ---
  it("a single rune → base premium 25 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("a single moonstone → base premium 25 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    // 50 base + 5 first insurance + 5 fee = 60
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    };

    // 60 block base + 6 first insurance + 5 fee = 71
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    // 100 base + 10 first insurance + 5 fee = 115
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    };

    // 175 base + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const scenario = {
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
    };

    // 60 + 60 blocks = 120 base + 12 first insurance + 5 fee = 137
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-scope modifiers ---
  it("a cursed sword adds a 50 % surcharge on its own base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("a sword with enchantment 5 adds a 30 % surcharge (threshold met)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };

    // 100 base + 30 high enchantment + 10 first insurance = 140 + 5 fee = 145
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("a sword with enchantment 4 adds no high-enchantment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };

    // 100 base + 10 first insurance = 110 + 5 fee = 115 (no surcharge)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a cursed sword with enchantment 5 gets both surcharges", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance = 190 + 5 fee = 195
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword (100 G) + plain amulet (60 G) → 210 G before further modifiers and fee (curse applies to the cursed item only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    // policy base 160 (100 + 60) + 50 curse (50 % of the sword's 100, not of 160)
    // = 210, + 16 first insurance (10 % of 160) = 226 + 5 fee = 231
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: policy-scope modifiers ---
  it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    // 100 base − 20 loyalty + 10 first insurance = 90 + 5 fee = 95
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("a customer with 1 year with MHPCO receives no loyalty discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    // 100 base + 10 first insurance = 110 + 5 fee = 115 (no loyalty discount)
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("the first insurance carries a 10 % initial assessment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };

    // 60 base + 6 first insurance (10 % of 60) = 66 + 5 fee = 71
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a second quote in the scenario receives a 15 % follow-up contract discount", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    // first quote:  100 base + 10 first insurance = 110 + 5 fee = 115
    // second quote: 100 base + 10 first insurance − 15 follow-up = 95 + 5 fee = 100
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // --- Quote: rounding ---

  // --- Quote: integration examples ---
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 → premium 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer (3 years) second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };

    // first quote:  100 base − 20 loyalty + 10 first insurance = 90 + 5 fee = 95
    // second quote: 100 base + 50 curse + 30 high enchantment − 20 loyalty
    //               + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    // payout: 500 damage − 100 deductible = 400 (no special clause)
    // cap: 2 × 1000 insurance sum = 2000; 2000 − 400 = 1600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };

    // payout: 200 − 100 deductible = 100 (no enchantment or material → no clause)
    // cap: 2 × 250 = 500; 500 − 100 = 400 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("a dragon attack damaging a sword (500 G) and an amulet (300 G) → payout 600 G (deductible per damaged item)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
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
    };

    // premium: 160 base + 16 first insurance + 5 fee = 181
    // payout: (500 − 100) + (300 − 100) = 600 — one deductible per damaged item
    // cap: 2 × (1000 + 600) = 3200; 3200 − 600 = 2600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: special clauses ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % clause, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };

    // premium: 100 base + 30 high enchantment + 10 first insurance = 140 + 5 fee = 145
    // payout: enchantment ≥ 8 → 50 % of 1000 = 500, then deductible: 500 − 100 = 400
    // cap: 2 × 1000 = 2000; 2000 − 400 = 1600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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
    };

    // premium: 100 base + 30 enchantment surcharge + 10 first insurance = 140 + 5 fee = 145
    // payout: dragon material → full reimbursement 800, then deductible: 800 − 100 = 700
    // cap: 2 × 1000 = 2000; 2000 − 700 = 1300 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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
    };

    // both clauses apply; the 50 % rule wins → 1000 × 0.5 = 500, then 500 − 100 = 400
    // cap: 2 × 1000 = 2000; 2000 − 400 = 1600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold met)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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
    };

    // enchantment exactly 8 meets the ≥ 8 threshold → 1000 × 0.5 = 500, then 500 − 100 = 400
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: rounding ---
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };

    // 901 × 0.5 = 450.5, then deductible: 450.5 − 100 = 350.5 → rounded down = 350
    // cap: 2000 − 350 = 1650 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claim: insurance sum and cap ---
  it("a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    // premium 165 (the curse raises it), but the cap stays 2 × 1000 = 2000
    // payout 500 − 100 = 400; 2000 − 400 = 1600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects the premium only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    // premium: 100 sword + 60 rune block = 160 base + 16 first insurance + 5 fee = 181
    // insurance sum: 1000 + 3 × 250 = 1750 — the block discount does NOT apply here
    // cap 3500; payout 500 − 100 = 400; 3500 − 400 = 3100 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });
  it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };

    // payout: 1500 − 100 deductible = 1400; cap 2000 − 1400 = 600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword policy, second claim of 1500 G after the first → payout 600 G, remaining cap 0 G", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    };

    // first claim pays 1400 of the 2000 cap, leaving 600
    // second claim wants 1400 but is reduced to the remaining 600, exhausting the cap
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Claim: multiple items of the same type ---
  it("two swords insured, a dragon attack damages both → each damage entry has its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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
    };

    // premium: 200 base + 20 first insurance + 5 fee = 225
    // payout: (500 − 100) + (300 − 100) = 600 — each entry its own deductible
    // insurance sum 2000, cap 4000; 4000 − 600 = 3400 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("more damage entries of a type than insured (two sword damages, one sword insured) → rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
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
    };

    expect(() => runScenario(scenario)).toThrow(/sword/);
  });

  // --- Errors ---
  it("a quote with an unknown item type (broomstick) → rejected with an error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("a claim for an item not part of the policy (amulet damaged, only a sword insured) → rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("a claim with a damage entry of an unknown item type → rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("a claim with a damage entry of amount -200 → rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/-200|negative/);
  });

  // --- CLI ---
  it("the CLI reads a JSON scenario from stdin and writes { results } to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    // quote: 60 base − 12 loyalty + 6 first insurance = 54 + 5 fee = 59
    // claim: 200 − 100 = 100; cap 1200 − 100 = 1100 remaining
    expect(JSON.parse(runCli(scenario))).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("the CLI exits with a non-zero status and writes to stderr on an invalid scenario, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { status, stdout, stderr } = runCliRaw(scenario);

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });
});
