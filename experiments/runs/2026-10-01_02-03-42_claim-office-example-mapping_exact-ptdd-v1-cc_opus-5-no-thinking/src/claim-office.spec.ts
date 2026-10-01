import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", "src/cli.ts"]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += String(chunk)));
    child.stderr.on("data", (chunk) => (stderr += String(chunk)));
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));
    child.stdin.end(JSON.stringify(input));
  });
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and simplest cases ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a single plain sword for a 0-year customer as 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Price list: every main item type has its own base premium ---
  it("quotes a plain amulet for a 0-year customer as 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff for a 0-year customer as 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion for a 0-year customer as 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components: base premium 25 G each ---
  it("quotes 1 rune as a 25 G base premium (25 + 2.5 first insurance + 5 fee = 32.5 -> 33 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 1 moonstone as a 25 G base premium (32.5 -> 33 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 2 runes as a 50 G base premium (no block) -- 50 + 5 + 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes 3 runes as a 60 G base premium (block applies) -- 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes as a 100 G base premium (no block -- block requires exactly 3) -- 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes as a 175 G base premium (no block -- 7 is not exactly 3) -- 197.5 -> 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes + 1 moonstone as a 75 G base premium (no block: alike means same type) -- 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes + 3 moonstones as a 120 G base premium (two separate blocks) -- 137 G", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item modifiers ---
  it("adds a 50% curse surcharge to the cursed item's base premium (cursed sword contributes 150 G) -- 100 base + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds a 30% high-enchantment surcharge at enchantment exactly 5 (sword contributes 130 G) -- 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- plain sword stays at 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5 (180 G contribution) -- 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("applies the curse surcharge only to the cursed item on a multi-item policy -- cursed sword + plain amulet = 210 G before policy modifiers and fee (+16 first insurance +5 fee = 231 G total)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide modifiers ---
  it("applies a 20% loyalty discount at exactly 2 years with MHPCO -- plain sword 100 - 20 + 10 + 5 = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies no loyalty discount at 1 year with MHPCO -- plain sword stays at 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 10% first-insurance surcharge on the policy base premium -- sword + amulet 160 base + 16 + 5 = 181 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("applies a 15% follow-up discount on every contract after the first quote in a scenario -- second plain sword 100 + 10 - 15 + 5 = 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("applies no follow-up discount to the first quote in a scenario -- plain sword 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("still applies the first-insurance surcharge on a follow-up contract (each quote is a first insurance for its items)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 1 rune, 2 years: 25 + 2.5 - 5 + 5 = 27.5 -> 28 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 28 }] });
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Insurance sum and cap ---
  it("reports an insurance sum of 1600 G and cap 3200 G for a policy of a sword and an amulet", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("reports an insurance sum of 2000 G and cap 4000 G for a policy of two swords", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("reports an insurance sum of 1750 G and cap 3500 G for a sword plus a 3-rune block (block discount affects premium only)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("bases the cap on the unmodified insurance value -- cursed sword premium 165 G, cap still 2000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claims: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword (enchantment 3) with 500 G damage (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a damaged rune with 200 G damage (runes have no enchantment or material)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G = 600 G payout", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
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
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claims: special clauses ---
  it("reimburses 50% for enchantment exactly 8 -- dragon sword, 1000 G damage, payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies only the high-enchantment clause for a steel sword at enchantment 9 -- 1000 G damage, payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies only the dragon-material clause at enchantment 5 -- dragon sword, 800 G damage, payout 700 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50% rule win when both clauses apply -- dragon sword, enchantment 9, 1000 G damage, payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies no special clause below enchantment 8 for non-dragon material -- oak staff enchantment 7, 500 G damage, payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 7, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1200 });
  });

  // --- Claims: multiple items of the same type ---
  it("treats two sword damage entries on a two-sword policy as separate damages, each with its own deductible -- 500 + 300 damage, payout 600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Claims: cap exhaustion across successive claims ---
  it("reports remainingCap after a claim -- sword policy cap 2000 G, first claim of 1500 G pays 1400 G leaving 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later payout to the remaining cap -- second claim of 1500 G pays only 600 G leaving 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claim,
        claim,
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claims: rounding in the MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    // enchantment 8: 901 * 0.5 = 450.5, minus the 100 G deductible = 350.5 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Error cases (observable contract: the domain layer throws an Error;
  //     the CLI translates that into a non-zero exit and a stderr description) ---
  it("throws an Error when a quote contains an unknown item type such as broomstick", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("throws an Error when a claim damages an item type not covered by the policy (amulet damaged, only a sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow(/not covered/);
  });
  it("throws an Error when a claim damages an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      }),
    ).toThrow(Error);
  });
  it("throws an Error when a claim has more damage entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
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
    ).toThrow(/more .*sword/);
  });
  it("throws an Error when a claim damage amount is negative (-200)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow(/negative/);
  });

  // --- CLI adapter ---
  it("CLI reads the schema example from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout with exit code 0", async () => {
    const { stdout, code } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);
  it("CLI exits non-zero and writes an error description to stderr for an unknown item type, writing no results to stdout", async () => {
    const { stdout, stderr, code } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  }, 30000);
  it("CLI exits non-zero and writes an error description to stderr for a negative damage amount", async () => {
    const { stdout, stderr, code } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/negative/);
    expect(stdout).toBe("");
  }, 30000);
  it("CLI processes steps sequentially so a claim can reference an earlier quote's policy by step index", async () => {
    const { stdout, code } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }, { payout: 400, remainingCap: 1600 }],
    });
  }, 30000);
});
