import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";
import { insuranceSum, insuredItemsPremium, policyBasePremium, runScenario } from "./claim-office.js";

const CLI_TIMEOUT_MS = 30_000;

const runCli = (scenario: unknown): Promise<{ code: number; stdout: string; stderr: string }> =>
  new Promise((resolve) => {
    const child = spawn("npx", ["tsx", "src/cli.ts"]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (stderr += chunk.toString()));
    child.on("close", (code) => resolve({ code: code ?? 0, stdout, stderr }));
    child.stdin.end(JSON.stringify(scenario));
  });

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and base premiums ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword (base 100 G) for a new customer as 115 G (100 + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a plain amulet (base 60 G) for a new customer as 71 G (60 + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff (base 80 G) for a new customer as 93 G (80 + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion (base 40 G) for a new customer as 49 G (40 + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results).toEqual([{ premium: 49 }]);
  });
  it("quotes a single rune (base 25 G) for a new customer as 33 G (25 + 2.5 first insurance = 27.5 -> rounded up 28 + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone (base 25 G) for a new customer as 33 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Building block of 3 alike components ---
  it("quotes 2 runes as base premium 50 G", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 4 runes as base premium 100 G (no block -- block requires exactly 3)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("quotes 7 runes as base premium 175 G", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(policyBasePremium(sevenRunes)).toBe(175);
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(policyBasePremium(items)).toBe(120);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium (cursed sword base 100 G -> 150 G)", () => {
    expect(insuredItemsPremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(150);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 (sword 100 G -> 130 G)", () => {
    expect(insuredItemsPremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(130);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (sword stays 100 G)", () => {
    expect(insuredItemsPremium([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(100);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5 (100 -> 180 G)", () => {
    expect(insuredItemsPremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(insuredItemsPremium(items)).toBe(210);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO -- sword premium 95 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 10 % first insurance surcharge to the policy base premium of every quote -- loyal customer's amulet 59 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 59 }]);
  });
  it("applies a 15 % follow-up discount to every contract after the customer's first -- second sword quote 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies no follow-up discount to the customer's first contract -- staff premium 93 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("adds the 5 G processing fee at the very end -- the fee is not touched by the loyalty discount (95 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 4 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 1 rune at 0 years: 27.5 + 5 = 32.5 -> 33 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed sword (0 years, first contract) as 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes a long-standing customer's second contract cursed sword with enchantment 7 (3 years) as 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote errors ---
  it("throws an Error when a quote contains an item with an unknown type (e.g. broomstick)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy covering a sword and an amulet at 3200 G (insurance sum 1600 G)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(insuranceSum(items)).toBe(1600);
  });
  it("caps a cursed sword policy at 2000 G -- premium modifiers do not raise the cap (insurance sum 1000 G)", () => {
    expect(insuranceSum([{ type: "sword", material: "steel", enchantment: 9, cursed: true }])).toBe(1000);
  });
  it("computes the insurance sum of a sword and 3 runes as 1750 G -- the block discount does not lower the sum", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(insuranceSum(items)).toBe(1750);
  });
  it("caps a policy covering two swords at 4000 G (insurance sum 2000 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(insuranceSum([sword, sword])).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays 400 G for 500 G damage to a regular sword (steel, enchantment 3) -- full reimbursement minus 100 G deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune -- runes have no enchantment or material, so no special clause applies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const results = runScenario({
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
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats two damage entries of the same item type as separate damages with their own deductible -- two swords at 500 G -> payout 800 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claim: special clauses ---
  it("reimburses 50 % of the damage at enchantment exactly 8: dragon sword, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword with enchantment 9, damage 1000 G, at 400 G (50 % rule wins, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword with enchantment 5, damage 800 G, at 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses a steel sword with enchantment 9, damage 1000 G, at 400 G (50 % first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: cap exhaustion across claims ---
  it("pays 1400 G on a first 1500 G claim against a sword policy, leaving cap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remaining cap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claim,
        claim,
      ],
    });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: payout rounding ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor) -- 50 % of 901 G minus deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim errors ---
  it("throws an Error when a damage entry references an item type not covered by the policy (amulet damaged, only sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("throws an Error when a damage entry references an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("throws an Error when the damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("throws an Error when a damage entry has a negative amount (-200)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow(/-200|negative/);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results: [...]} in step order to stdout", async () => {
    const { code, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  }, CLI_TIMEOUT_MS);
  it("CLI exits with a non-zero status and writes an error description to stderr for an unknown item type, writing no results to stdout", async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  }, CLI_TIMEOUT_MS);
  it("CLI exits with a non-zero status and writes an error description to stderr for a rejected claim", async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
  }, CLI_TIMEOUT_MS);
});
