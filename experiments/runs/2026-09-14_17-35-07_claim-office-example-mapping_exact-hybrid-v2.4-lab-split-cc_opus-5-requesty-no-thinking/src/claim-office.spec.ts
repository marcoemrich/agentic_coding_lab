import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claim-office.js";

/**
 * Both the runner and the script it runs are located relative to this spec
 * file rather than to the working directory, so the CLI tests do not quietly
 * depend on being launched from the project root.
 */
const fromHere = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const TSX = fromHere("../node_modules/.bin/tsx");
const CLI = fromHere("./cli.ts");

/** Runs the CLI as a real process, feeding `input` to its stdin. */
const runCli = (input: string) =>
  spawnSync(TSX, [CLI], {
    input,
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("a single plain sword → base premium 100 G, plus first insurance 10 G and 5 G fee → 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single plain amulet → base premium 60 G (+10 % first insurance, +5 G fee) → 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single plain staff → base premium 80 G (+10 % first insurance, +5 G fee) → 93 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single plain potion → base premium 40 G (+10 % first insurance, +5 G fee) → 49 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("a single rune → base premium 25 G (+10 % first insurance, +5 G fee) → 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("a single moonstone → base premium 25 G (+10 % first insurance, +5 G fee) → 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Component blocks of 3 alike ---
  it("2 runes → 50 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    // 50 base + 10 % first insurance + 5 G fee = 60 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    // 60 base + 10 % first insurance + 5 G fee = 71 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    // 100 base + 10 % first insurance + 5 G fee = 115 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };
    // 175 base + 10 % first insurance + 5 G fee = 197.5 → 198 G (rounded up)
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
    // 75 base + 10 % first insurance + 5 G fee = 87.5 → 88 G
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
    // 120 base + 10 % first insurance + 5 G fee = 137 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds a 50 % risk surcharge on the item's base premium (100 G → +50 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (+30 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };
    // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };
    // 100 base + 10 first insurance + 5 fee = 115 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with exactly enchantment 5 → both surcharges apply (+50 G and +30 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    // 100 base − 20 loyalty + 10 first insurance + 5 fee = 95 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    // 100 base + 10 first insurance + 5 fee = 115 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("first insurance carries a 10 % initial assessment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    // 40 G base + 4 G first insurance (10 % of 40) + 5 G fee = 49 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("each contract after the customer's first receives a 15 % discount", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };
    // step 0: 100 base + 10 first insurance + 5 fee = 115 G
    // step 1: 100 base + 10 first insurance − 15 follow-up + 5 fee = 100 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("a 5 G processing fee is added to every premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    // 80 G base + 8 G first insurance = 88 G; the fee makes it 93 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (item-scoped) → 210 G before further modifiers and fee", () => {
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
    // 160 base + 50 curse (50 % of the sword alone)
    // + 16 first insurance (10 % of the 160 policy base) + 5 fee = 231 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium, the fee is added at the very end", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items },
        { op: "quote", items },
      ],
    };
    // policy base 160 G in both steps
    // step 0: 160 + (0.10 − 0.20) × 160 = 144 + 5 fee = 149 G
    // step 1: 160 + (0.10 − 0.20 − 0.15) × 160 = 120 + 5 fee = 125 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 149 }, { premium: 125 }],
    });
  });

  // --- Rounding ---
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
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
    // 901 × 50 % = 450.5, − 100 deductible = 350.5 → rounded down to 350 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", cursed: true },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };

    // 125 G base + 12.5 G curse (50 % of 25) + 12.5 G first insurance (10 %
    // of 125) + 5 G fee = 155 G exactly. Rounding each fractional part up on
    // its own would give 13 + 13 = 156 G instead.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 155 }] });
  });

  // --- Claim: standard reimbursement ---
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
    // sword insured for 1000 G → cap 2000 G
    // 500 damage, no special clause, − 100 G deductible = 400 G payout
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
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
    // rune insured for 250 G → cap 500 G; runes have no enchantment or material,
    // so no special clause: 200 − 100 deductible = 100 G payout
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ---
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
    // quote: 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145 G
    // claim: dragon material → full reimbursement, then deductible: 800 − 100 = 700 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
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
    // quote: 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145 G
    // claim: enchantment 9 ≥ 8 → 50 % of 1000 = 500, then deductible: 500 − 100 = 400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
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
    // both clauses apply; the 50 % rule wins: 500 − 100 deductible = 400 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
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
    // enchantment exactly 8 → the reduced-reimbursement clause applies
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
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
    // quote: 160 base + 16 first insurance + 5 fee = 181 G
    // claim: (500 − 100) + (300 − 100) = 600 G; cap 3200 → 2600 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: insurance sum and cap ---
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
            {
              type: "amulet",
              material: "silver",
              enchantment: 1,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };

    // Premium: 160 G base + 16 G first insurance + 5 G fee = 181 G.
    // Insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G; a 200 G
    // payout leaves 3000 G.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 200, remainingCap: 3000 }],
    });
  });
  it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    };
    // the cap rests on the unmodified insurance value: 2 × 1000 = 2000 G,
    // so a gross payout of 2400 G is cut back to 2000 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (the block discount affects the premium only)", () => {
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
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    // quote: 100 sword + 60 rune block = 160 base, + 16 first insurance + 5 fee = 181 G
    // insurance sum 1000 + 3 × 250 = 1750 G → cap 3500 G, untouched by the block discount
    // claim: 200 − 100 = 100 G → 3400 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    // quote: 200 base + 20 first insurance + 5 fee = 225 G
    // insurance sum 2 × 1000 = 2000 G → cap 4000 G; claim 200 − 100 = 100 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
    });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
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
    // 1500 − 100 deductible = 1400 G, within the 2000 G cap → 600 G remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword insured (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
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
    // first claim takes 1400 of the 2000 G cap; the second wants 1400 but only
    // 600 G remains, so the payout is reduced to the remaining cap
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  it("two swords insured and both damaged → each damage entry gets its own deductible", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
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
    // two separate damage entries → two deductibles: 400 + 200 = 600 G
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });

  // --- Error cases ---
  it("quote with an unknown item type (e.g. broomstick) → error, no results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });

  it("quote with a complete block of an unknown type → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "broomstick" },
            { type: "broomstick" },
            { type: "broomstick" },
          ],
        },
      ],
    };

    // Exactly three alike items take the block path, which never looks the
    // type up in the price list. An unpriceable block must still be rejected.
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet damaged, only a sword insured) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("claim referencing an item with an unknown type → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse",
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 400 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/sword/);
  });
  it("claim with a damage entry of amount -200 → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "mishap",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/-200|negative/);
  });

  // --- Integration examples ---
  it("newcomer (0 years, no previous contract) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee.
    // Enchantment 3 is below the level-5 threshold, so no surcharge for it.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };

    // Second quote: 100 G base + 50 G curse + 30 G high enchantment
    // − 20 G loyalty + 10 G first insurance − 15 G follow-up = 155 G,
    // + 5 G fee = 160 G. The first-insurance surcharge still applies on a
    // follow-up contract: every newly insured item is a first insurance.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 5 }, { premium: 160 }],
    });
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    // The scenario from the spec's own schema example.
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

    const cli = runCli(JSON.stringify(scenario));

    expect(cli.status).toBe(0);
    // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
    // amulet insured 600 G → cap 1200 G, payout 200 − 100 = 100 G.
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr on an invalid scenario", () => {
    // The spec's first edge case: a quote naming a type MHPCO does not insure.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const cli = runCli(JSON.stringify(scenario));

    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick/);
    // "no `results` are written to stdout" — the office reports the refusal
    // and nothing else.
    expect(cli.stdout).toBe("");
  });
});
