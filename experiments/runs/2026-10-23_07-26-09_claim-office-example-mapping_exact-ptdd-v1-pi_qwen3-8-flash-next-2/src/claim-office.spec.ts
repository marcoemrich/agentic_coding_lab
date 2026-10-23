import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./scenario.js";

// Inactive test list for the MHPCO Claim Office kata.
// Chosen observable contract for rejection cases (spec says only "CLI exits with a
// non-zero status code and writes an error description to stderr"): the scenario
// runner runScenario() throws an Error, which the CLI adapter maps to a non-zero
// exit code and a stderr description with no `results` on stdout.
describe("MHPCO Claim Office", () => {
  it("quote empty item list yields premium 5 (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results.results).toEqual([{ premium: 5 }]);
  });
  it("quote single sword for 0-year first-time customer yields premium 115 (100 base + 10 first-insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results.results).toEqual([{ premium: 115 }]);
  });
  it("quote single amulet for 0-year first-time customer yields premium 71 (60 base + 6 first-insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(results.results).toEqual([{ premium: 71 }]);
  });
  it("quote single staff for 0-year first-time customer yields premium 93 (80 base + 8 first-insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(results.results).toEqual([{ premium: 93 }]);
  });
  it("quote single potion for 0-year first-time customer yields premium 49 (40 base + 4 first-insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results.results).toEqual([{ premium: 49 }]);
  });
  it("quote 2 runes yields premium 60 (2x25 base, no block; +10% first insurance; +5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results.results).toEqual([{ premium: 60 }]);
  });
  it("quote 3 alike runes yields premium 71 (block base premium 60; +10% first insurance; +5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(results.results).toEqual([{ premium: 71 }]);
  });
  it("quote 4 runes yields premium 115 (no block - block requires exactly 3, base 100)", () => {
    const results = runScenario({
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
    });
    expect(results.results).toEqual([{ premium: 115 }]);
  });
  it("quote 7 runes yields premium 198 (base 175, intermediate 197.5 rounded up in MHPCO favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(results.results).toEqual([{ premium: 198 }]);
  });
  it("quote 2 runes + 1 moonstone yields premium 88 (alike means same type - no block; 87.5 rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(results.results).toEqual([{ premium: 88 }]);
  });
  it("quote 3 runes + 3 moonstones yields premium 137 (two separate blocks: 60+60=120 base)", () => {
    const results = runScenario({
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
    expect(results.results).toEqual([{ premium: 137 }]);
  });
  it("quote cursed sword + plain amulet for 0-year first-time customer yields premium 231 (curse surcharge 50 applies only to cursed item base; first-insurance 16 on policy base 160; +5 fee)", () => {
    const results = runScenario({
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
    expect(results.results).toEqual([{ premium: 231 }]);
  });
  it("quote single amulet for customer with exactly 2 years yields premium 59 (loyalty discount -20% applies at exactly 2 years)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(results.results).toEqual([{ premium: 59 }]);
  });
  it("quote single sword for customer with 1 year yields premium 115 (loyalty discount does not apply below 2 years)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results.results).toEqual([{ premium: 115 }]);
  });
  it("quote sword with enchantment exactly 5 yields premium 145 (high-enchantment surcharge 30 applies at exactly 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] },
      ],
    });
    expect(results.results).toEqual([{ premium: 145 }]);
  });
  it("quote sword with enchantment 4 yields premium 115 (no high-enchantment surcharge below 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4 }] },
      ],
    });
    expect(results.results).toEqual([{ premium: 115 }]);
  });
  it("quote cursed sword with enchantment 5 yields premium 195 (both curse 50% and high-enchantment 30% surcharges apply)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(results.results).toEqual([{ premium: 195 }]);
  });
  it("integration: newcomer (0 years, no previous contract) with cursed steel sword enchantment 3 yields premium 165 (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
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
    expect(results.results).toEqual([{ premium: 165 }]);
  });
  it("multi-step: 3-year customer second quote of cursed steel sword enchantment 7 yields premium 160 (follow-up -15% on second contract; first-insurance still applies per item)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(results.results[1]).toEqual({ premium: 160 });
  });
  it("claim standard reimbursement: amulet damage 200 yields payout 100 and remainingCap 1100 (full reimbursement minus 100 deductible; cap 2x600)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("claim rune damage 200 yields payout 100 and remainingCap 400 (runes have no enchantment or material - no special clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "falling masonry", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 100, remainingCap: 2400 });
  });
  it("claim steel sword enchantment 9 damage 1000 yields payout 400 and remainingCap 1600 (50% first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim sword with enchantment exactly 8 damage 1000 yields payout 400 (high-enchantment clause applies at exactly 8)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon sneeze", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim steel sword enchantment 7 damage 1000 yields payout 900 and remainingCap 1100 (no high-enchantment clause below 8)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "barroom brawl", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("claim dragon-material sword enchantment 5 damage 800 yields payout 700 and remainingCap 1300 (dragon material fully reimbursed)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rival adventurer", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim dragon-material sword enchantment 9 damage 1000 yields payout 400 and remainingCap 1600 (50% rule wins over dragon material, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon jealousy", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim dragon attack damaging sword 500 and amulet 300 yields payout 600 and remainingCap 2600 (deductible applies once per damaged item)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", material: "silver", enchantment: 2 }] },
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
    expect(results.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claim steel sword enchantment 9 damage 901 yields payout 350 (350.5 rounds down in MHPCO favor) and remainingCap 1650", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "improper storage", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("claim capped at twice insurance sum: sword+amulet policy, single sword damage 1900 yields payout 1800 and remainingCap 1400", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", material: "silver", enchantment: 2 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "giant wasp swarm", damages: [{ itemType: "sword", amount: 1900 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 1800, remainingCap: 1400 });
  });
  it("cap exhaustion: sword policy cap 2000, two successive claims of 1500 yield payout 1400/remainingCap 600 then payout 600/remainingCap 0", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "troll toll dispute", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "troll toll dispute, second crossing", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("two insured swords: dragon attack damaging both for 500 each yields payout 800 and remainingCap 3200 (insurance sum 2000, cap 4000, deductible per damage entry)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }] },
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
    expect(results.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim with two sword damage entries but only one sword insured throws Error (spec: CLI exits non-zero; chosen reading: scenario runner throws, CLI maps to non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "wishful thinking",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("quote with unknown item type broomstick throws Error (spec: CLI exits non-zero with stderr description, no results on stdout)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(Error);
  });
  it("claim damage entry referencing item not part of policy (amulet damaged when only sword insured) throws Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "wrong ledger", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("claim damage entry with amount -200 throws Error (spec: CLI exits non-zero with stderr description)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "impossible ledger", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("claim damage entry with unknown item type broomstick throws Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "witch mishap", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("CLI end-to-end: src/cli.ts reads schema-example JSON from stdin, exits 0, stdout is exactly {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":500}]} (amulet 600 cap 1200)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("CLI error path: scenario with unknown quote item type exits non-zero, stderr non-empty, stdout contains no results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
});
