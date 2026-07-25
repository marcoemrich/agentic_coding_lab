import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
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
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });

  // Integration example: newcomer with a cursed sword
  it("newcomer (0 years, first contract) cursed sword (steel, ench 3) → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result.results[0].premium).toBe(165);
  });

  // Integration example: long-standing customer's second contract
  it("long-standing (3 years) second contract cursed sword (steel, ench 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1].premium).toBe(160);
  });

  // ❓ first insurance meaning: each item in a quote is treated as first insurance
  it("first-insurance surcharge still applies to a new item on a follow-up contract", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result.results[1].premium).toBe(100);
  });

  // Modifier scope on multi-item policies — ❓ resolved
  it("cursed sword + plain amulet (0 years, first contract) → curse surcharge is 50% of the cursed item's base only", () => {
    const result = runScenario({
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
    });
    expect(result.results[0].premium).toBe(231);
  });

  // Modifier thresholds
  it("customer with exactly 2 years → loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result.results[0].premium).toBe(95);
  });
  it("customer with 1 year → no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    expect(result.results[0].premium).toBe(145);
  });
  it("sword with enchantment 5 and cursed → both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });
    expect(result.results[0].premium).toBe(195);
  });
  it("sword with enchantment 4 (not cursed) → no high-enchantment or curse surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    expect(result.results[0].premium).toBe(115);
  });

  // Rounding in the MHPCO's favor (premium rounds up)
  it("premium calculation yielding a half (X.5) → rounded up in MHPCO's favor", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0].premium).toBe(33);
  });
});

describe("MHPCO Claim Office — claim payouts", () => {
  // Standard reimbursement (no special clauses)
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("rune (value 250 G), damage 200 G → payout 100 G (no enchantment/material clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });

  // Enchantment threshold vs. dragon material
  it("dragon sword, ench 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("dragon sword, ench 9, damage 1000 G → payout 400 G (both clauses; 50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("dragon sword, ench 5, damage 800 G → payout 700 G (dragon full, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300);
  });
  it("steel sword, ench 9, damage 1000 G → payout 400 G (high-enchantment 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  // Deductible per damage event
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)", () => {
    const result = runScenario({
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
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(2600);
  });

  // Rounding in the MHPCO's favor (payout rounds down)
  it("payout calculation yielding a half (X.5) → rounded down in MHPCO's favor", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 801 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(300);
    expect(result.results[1].remainingCap).toBe(1700);
  });
});

describe("MHPCO Claim Office — insurance sum and cap", () => {
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(200);
    expect(result.results[1].remainingCap).toBe(3000);
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });
  it("policy covers sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)", () => {
    const result = runScenario({
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(200);
    expect(result.results[1].remainingCap).toBe(3300);
  });
  it("two successive claims of 1500 G on a sword (cap 2000) → payouts 1400 G then 600 G, cap exhausted", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });
});

describe("MHPCO Claim Office — multiple items of the same type", () => {
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(200);
    expect(result.results[1].remainingCap).toBe(3800);
  });
  it("dragon attack damages both swords → each entry is a separate damage with its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });
  it("more damages of a type than insured (two sword damages, one sword) → claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] },
          },
        ],
      }),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — error handling", () => {
  it("quote with an unknown item type (broomstick) → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not in the policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with a negative damage amount (-200) → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("reads a JSON scenario from stdin and writes results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(scenario) });
    const output = JSON.parse(stdout.toString());
    expect(output.results).toHaveLength(2);
    expect(typeof output.results[0].premium).toBe("number");
    expect(typeof output.results[1].payout).toBe("number");
    expect(typeof output.results[1].remainingCap).toBe("number");
  });
  it("exits non-zero and writes to stderr on an unknown item type; no results on stdout", () => {
    const badScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    try {
      execFileSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(badScenario) });
      expect.fail("expected the CLI to exit non-zero");
    } catch (e: any) {
      expect(e.status).not.toBe(0);
      expect(e.stderr.toString().length).toBeGreaterThan(0);
      expect(e.stdout.toString()).toBe("");
    }
  });
  it("exits non-zero on a claim referencing an item not in the policy", () => {
    const badScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    try {
      execFileSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(badScenario) });
      expect.fail("expected the CLI to exit non-zero");
    } catch (e: any) {
      expect(e.status).not.toBe(0);
      expect(e.stderr.toString().length).toBeGreaterThan(0);
      expect(e.stdout.toString()).toBe("");
    }
  });
  it("exits non-zero on a negative damage amount", () => {
    const badScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    try {
      execFileSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(badScenario) });
      expect.fail("expected the CLI to exit non-zero");
    } catch (e: any) {
      expect(e.status).not.toBe(0);
      expect(e.stderr.toString().length).toBeGreaterThan(0);
      expect(e.stdout.toString()).toBe("");
    }
  });
});
