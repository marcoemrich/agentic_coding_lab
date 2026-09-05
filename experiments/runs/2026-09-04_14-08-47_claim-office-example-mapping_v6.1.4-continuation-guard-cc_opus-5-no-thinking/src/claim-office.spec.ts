import { execFileSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { ClaimOfficeError, runScenario } from "./claim-office.js";

const runCli = (
  input: unknown,
): { stdout: string; stderr: string; status: number } => {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout, stderr: "", status: 0 };
  } catch (error) {
    const failure = error as {
      stdout?: string;
      stderr?: string;
      status?: number;
    };
    return {
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
      status: failure.status ?? 1,
    };
  }
};

describe("MHPCO Claim Office — quote", () => {
  // Simplest case
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items (newcomer: 0 years, first quote → +10% first insurance)
  it("a single sword (base 100 G) for a newcomer → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single amulet (base 60 G) for a newcomer → premium 71 G (60 + 6 + 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single staff (base 80 G) for a newcomer → premium 93 G (80 + 8 + 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single potion (base 40 G) for a newcomer → premium 49 G (40 + 4 + 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and the building block
  it("2 runes → 50 G base premium (newcomer, first quote: 50 + 5 + 5 = 60 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium, block applies (newcomer, first quote: 60 + 6 + 5 = 71 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium, no block since a block requires exactly 3 (newcomer, first quote: 100 + 10 + 5 = 115 G premium)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (newcomer, first quote: 175 + 17.5 + 5 = 197.5 → rounded up to 198 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium, no block since the types differ (newcomer, first quote: 75 + 7.5 + 5 = 87.5 → rounded up to 88 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (newcomer, first quote: 120 + 12 + 5 = 137 G premium)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers
  it("a cursed sword adds a 50 % surcharge on the sword's base premium, 100 → 150 G base (newcomer, first quote: 100 + 50 + 10 first insurance + 5 fee = 165 G premium)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("a sword with exactly enchantment 5 adds a 30 % high-enchantment surcharge, 100 → 130 G base (newcomer, first quote: 100 + 30 + 10 first insurance + 5 fee = 145 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("a sword with enchantment 4 gets no high-enchantment surcharge, 100 G base (newcomer, first quote: 100 + 10 + 5 = 115 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a cursed sword with exactly enchantment 5 gets both surcharges, 100 + 50 + 30 = 180 G base (newcomer, first quote: 180 + 10 first insurance + 5 fee = 195 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // Modifier scope on multi-item policies
  it("a cursed sword (100 G) and a plain amulet (60 G) → 210 G before further modifiers and fee, the curse adding 50 G as 50 % of the sword only (newcomer, first quote: 210 + 16 first insurance on the 160 G policy base + 5 fee = 231 G premium)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // Policy-wide modifiers
  it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount (plain sword, first quote: 100 − 20 + 10 = 90 + 5 fee = 95 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("a customer with 1 year with MHPCO receives no loyalty discount (plain sword, first quote: 100 + 10 + 5 = 115 G premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("every quote carries the 10 % first-insurance surcharge on the policy base premium, regardless of customer history (10-year customer, two staff quotes: 80 − 16 + 8 + 5 = 77, then 80 − 16 + 8 − 12 + 5 = 65 — the 8 G appears in both)", () => {
    const staffQuote = { op: "quote", items: [{ type: "staff" }] };
    const scenario = {
      customer: { yearsWithMHPCO: 10 },
      steps: [staffQuote, staffQuote],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 77 }, { premium: 65 }],
    });
  });
  it("the second quote in a scenario receives the 15 % follow-up-contract discount (two plain swords quoted separately: 115 G then 100 G)", () => {
    const swordQuote = {
      op: "quote",
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ],
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [swordQuote, swordQuote],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("the first quote in a scenario receives no follow-up-contract discount, and an intervening claim step is not itself a contract (quote 115, claim, then quote 100 — the second quote is the follow-up, not the claim)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 100, remainingCap: 1900 },
        { premium: 100 },
      ],
    });
  });
  it("the processing fee of 5 G is added at the very end, after all percentage modifiers (one potion: 40 + 4 first insurance = 44, then + 5 fee = 49; folding the fee into the base first would surcharge it too and yield 50)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // Rounding
  it("a premium calculation with a fractional result is rounded up in MHPCO's favor (one rune, loyal customer: 25 − 5 + 2.5 + 5 fee = 27.5 → 28 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 28 }] });
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded (one rune, loyal, second quote: 25 − 5 + 2.5 − 3.75 = 18.75, + 5 fee = 23.75 → 24 G, never rounding the parts)", () => {
    const runeQuote = { op: "quote", items: [{ type: "rune" }] };
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [runeQuote, runeQuote],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 28 }, { premium: 24 }],
    });
  });

  // Integration examples
  it("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 → premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G (100 + 50 curse + 30 high enchantment − 20 loyalty + 10 first insurance − 15 follow-up = 155 + 5 fee); the first quote is 175 G", () => {
    const cursedSwordQuote = {
      op: "quote",
      items: [
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ],
    };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [cursedSwordQuote, cursedSwordQuote],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });
});

describe("MHPCO Claim Office — insurance sum and cap", () => {
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G (visible as remainingCap 3100 after a 100 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
    });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G; a dragon attack damaging both gives each damage entry its own deductible (payout 600, remainingCap 3400)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, so the block discount affects the premium only (base 160 not 175, but cap 3500 = 2 × (1000 + 3×250))", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("a cursed sword (premium with modifiers 165 G) → cap 2000 G, based on the unmodified insurance value; premium modifiers do not raise the cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
    });
  });
});

describe("MHPCO Claim Office — claim", () => {
  // Standard reimbursement
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus the 100 G deductible; no special clause applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment level or material, so no special clause)", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // Deductible per damage event
  it("a dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // Enchantment threshold vs. dragon material
  it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (50 % clause, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only the dragon-material clause: full reimbursement, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only the high-enchantment clause: 50 % first, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // Cap exhaustion across successive claims
  it("a sword policy (cap 2000 G) with two successive claims of 1500 G each → first claim pays 1400 G leaving 600 G, second claim is reduced to the remaining 600 G leaving 0 G", () => {
    const claimOf1500 = {
      op: "claim",
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        claimOf1500,
        claimOf1500,
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Multiple items of the same type

  // A damage smaller than the deductible pays nothing — the deductible is a
  // share the customer absorbs, so it cannot invert into the customer owing the
  // office. Without a floor the payout would be −70 G, which would also raise
  // remainingCap to 2070 G, above the policy's own 2000 G ceiling.
  it("damage of 30 G, below the 100 G deductible → payout 0 G and the remaining cap is untouched at 2000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 30 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  // Rounding
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down in MHPCO's favor; enchantment 8, damage 901 → 450.5 − 100 deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
});

describe("MHPCO Claim Office — errors", () => {
  it("a quote with an item of an unknown type (e.g. broomstick) → error naming the type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("a claim damaging an amulet when only a sword is insured → error naming the item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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

    expect(() => runScenario(scenario)).toThrow(ClaimOfficeError);
    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("a claim damaging an item of an unknown type → error (an unknown type is trivially not covered by the policy)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(ClaimOfficeError);
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow(ClaimOfficeError);
  });
  it("a claim with a damage entry of amount -200 → error", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow(ClaimOfficeError);
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("reads a JSON scenario from stdin and writes {results: [...]} to stdout with one result per step", () => {
    const { stdout, status } = runCli({
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
    });

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  // The schema example (amulet quote + amulet claim, 5-year customer) is
  // already covered by the first CLI test above, which uses that exact scenario.
  it("exits with a non-zero status code and writes an error description to stderr on an unknown item type, with no results on stdout", () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/Unknown item type: broomstick/);
    // A rejection is a message for the operator, not a crash report.
    expect(stderr).not.toMatch(/at .*claim-office/);
  });
  it("exits with a non-zero status code and writes an error description to stderr on an invalid claim", () => {
    const { stdout, stderr, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/not covered by the policy: amulet/);
    expect(stderr).not.toMatch(/at .*claim-office/);
  });
});
