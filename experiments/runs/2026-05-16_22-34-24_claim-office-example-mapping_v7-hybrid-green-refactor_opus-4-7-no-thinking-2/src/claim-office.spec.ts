import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty and single items
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword (no modifiers, first-time customer) yields 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet yields 71 G (60 base + 6 first + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff yields 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion yields 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("single rune yields 33 G (25 base + 2.5 first rounded up + 5 fee = 32.5 -> 33)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("3 alike runes form a block: 60 G base premium", () => {
    // Block of 3 runes: 60 base, +6 first insurance, +5 fee = 71
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
  it("4 runes do not form a block: 100 G base premium", () => {
    // 4 runes: 4*25 = 100 base, +10 first insurance = 110, +5 fee = 115
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("2 runes + 1 moonstone: no block (different types), 75 G base premium", () => {
    // 2 runes (50) + 1 moonstone (25) = 75 base, +7.5 first = 82.5, +5 fee = 87.5 -> 88
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
  it("3 runes + 3 moonstones: two separate blocks, 120 G base premium", () => {
    // Two blocks: 60+60 = 120 base, +12 first = 132, +5 fee = 137
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers
  it("cursed sword adds 50% surcharge on item base premium (newcomer cursed sword: 165 G)", () => {
    // 100 base + 50 curse + 10 first = 160, +5 fee = 165
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("high enchantment (>=5) sword adds 30% surcharge", () => {
    // 100 base + 30 high-ench + 10 first = 140, +5 fee = 145
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("enchantment 4 sword does not add high-enchantment surcharge", () => {
    // 100 + 10 first + 5 fee = 115
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed AND high-enchantment sword stacks both surcharges", () => {
    // 100 + 50 curse + 30 high-ench + 10 first = 190, +5 fee = 195
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("loyalty discount (>=2 years) applies 20% off the policy base premium", () => {
    // sword 100 base, +10 first = 110 item premium; loyalty -20% of policy base (100) = -20
    // 110 - 20 = 90, +5 fee = 95
    // Actually re-reading spec: "policy-wide modifiers apply to policy base premium (sum of item base premiums)"
    // Policy base = 100. Item-specific surcharges (none here) = 0. First-insurance per item = 10.
    // Total = 100 + 10 - 20 (loyalty) + 5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("exactly 2 years customer receives loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contract (second quote in scenario) applies 15% discount", () => {
    // newcomer (0 years), two quotes:
    // 1st: sword 100 base, +10 first, +5 = 115
    // 2nd: sword 100 base, +10 first - 15 follow-up = 95, +5 = 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("first-insurance surcharge applies per item even for follow-up contracts", () => {
    // From spec: 3 years customer, second quote, cursed sword (steel, ench 7):
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // Multi-item modifier scope
  it("cursed surcharge applies only to cursed item, not whole policy", () => {
    // Cursed sword + plain amulet, newcomer (0 years).
    // Policy base = 100 + 60 = 160.
    // Item-specific: 50 curse on sword. (No high-ench).
    // First insurance per item: 10 (sword) + 6 (amulet) = 16
    // No loyalty, no follow-up.
    // Total = 160 + 50 + 16 + 5 fee = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("premium rounds up in MHPCO's favor", () => {
    // single amulet first insurance 60 + 6 = 66, + 5 fee = 71 (no fractional involved)
    // To force a fractional: rune+rune+moonstone = 50 + 25 = 75 base, +7.5 first = 82.5, +5 fee = 87.5 -> 88
    // Already tested as part of the moonstone case. Just confirm rounding behavior here.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    // 25 + 2.5 + 5 = 32.5 -> 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Integration examples
  it("newcomer with cursed sword: 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract with cursed enchantment-7 sword: 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // Claim: basic payouts
  it("regular sword damage 500 G yields payout 400 G (minus 100 deductible)", () => {
    const result = runScenario({
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
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("damage to rune (250 G value) of 200 G yields payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // Insurance sum = 250, cap = 500. Payout = 200 - 100 = 100. Remaining = 400.
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("high-enchantment (>=8) item: 50% reimbursement then deductible", () => {
    const result = runScenario({
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
    });
    // 1000 * 0.5 = 500, - 100 = 400. cap 2000, remaining = 1600.
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon material item: full reimbursement then deductible", () => {
    // dragon sword, enchantment 5 (NOT high), damage 800 -> full reimbursement 800 - 100 = 700
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon material with enchantment 9: 50% wins, then deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: cap and deductible
  it("payout capped at 2x insurance sum across multiple claims", () => {
    // sword, cap 2000. Two claims of 1500 each.
    // First: 1500-100=1400 payout, remaining 600.
    // Second: 1500-100=1400, but only 600 remaining → payout 600, remaining 0.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const r = (result as { results: { payout: number; remainingCap: number }[] }).results;
    expect(r[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(r[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("deductible applies per damaged item entry", () => {
    // Policy: sword + amulet. Dragon attack damages both: damages [{sword, 500}, {amulet, 300}].
    // Each gets its own 100 deductible. Payout = (500-100) + (300-100) = 600.
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
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // insurance sum 1600, cap 3200; remaining 3200 - 600 = 2600
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two-sword policy: insurance sum 2000, cap 4000", () => {
    // Two swords. Dragon attack damages both: two sword entries.
    // Each gets its own deductible. Payout = (500-100) + (300-100) = 600. Cap remaining = 4000-600 = 3400.
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
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("payout rounds down in MHPCO's favor", () => {
    // sword enchantment 8, damage 1001 → 1001*0.5 = 500.5, -100 = 400.5 → floor = 400.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Errors
  it("quote with unknown item type causes non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim against item not in policy causes non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount causes non-zero exit", () => {
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
  it("more damages of a type than insured items causes non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // CLI
  it("CLI reads JSON from stdin and writes results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const { execSync } = require("node:child_process") as typeof import("node:child_process");
    const output = execSync("pnpm tsx src/cli.ts", { input }).toString();
    expect(JSON.parse(output)).toEqual({ results: [{ premium: 5 }] });
  });
});
