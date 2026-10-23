import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base premiums and empty list
  it("empty item list yields premium 5 G (only the processing fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword has base premium 100 G (total premium 115 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet has base premium 60 G (total premium 71 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff has base premium 80 G (total premium 93 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion has base premium 40 G (total premium 49 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune has base premium 25 G (total premium 33 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone has base premium 25 G (total premium 33 G for newcomer with first insurance and fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });

  // Component building blocks
  it("2 runes yield 50 G base premium (total premium 60 G for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes yield 60 G base premium via building block of 3 alike components (total premium 71 G for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes yield 100 G base premium with no block applied because block requires exactly 3 (total premium 115 G for newcomer)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes yield 175 G base premium with no block applied (total premium 198 G rounded up from 197.5 G for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone yield 75 G base premium with no block because different types (total premium 88 G rounded up from 87.5 G for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones yield 120 G base premium from two separate blocks (total premium 137 G for newcomer)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers and thresholds
  it("cursed sword adds 50% risk surcharge to item base premium (newcomer with cursed sword steel enchantment 3 yields 165 G)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge (115 G uncursed, 165 G cursed for newcomer)", () => {
    const uncursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: false }],
        },
      ],
    });
    const cursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: true }],
        },
      ],
    });
    expect(uncursedOutput).toEqual({ results: [{ premium: 115 }] });
    expect(cursedOutput).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 adds 30% high-enchantment surcharge (145 G uncursed, 195 G cursed for newcomer)", () => {
    const uncursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: false }],
        },
      ],
    });
    const cursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(uncursedOutput).toEqual({ results: [{ premium: 145 }] });
    expect(cursedOutput).toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword and plain amulet: cursed surcharge applies only to cursed sword base premium (210 G before policy modifiers and fee, 231 G total for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // Policy-wide customer modifiers, rounding, and multi-quote scenarios
  it("customer with 1 year with MHPCO does not receive loyalty discount (plain sword yields 115 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("customer with exactly 2 years with MHPCO receives 20% loyalty discount on policy base premium (plain sword yields 95 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("long-standing customer (3 years) second contract on cursed sword (enchantment 7) combines curse, high-enchantment, loyalty, first-insurance, follow-up discount, and fee to yield 160 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });
  it("intermediate amounts are kept as fractions and only final premium is rounded up in MHPCO's favor (cursed rune for newcomer yields 40.25 G -> 41 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "rune", cursed: true }] },
      ],
    });
    // 25 base + 12.5 curse + 2.5 first insurance - 3.75 follow-up + 5 fee = 41.25 -> 42
    expect(output).toEqual({ results: [{ premium: 5 }, { premium: 42 }] });
  });

  // Standard claim processing and deductible per damage event
  it("regular sword (steel, enchantment 3) with 500 G damage yields 400 G payout (full reimbursement minus 100 G deductible) and 1600 G remaining cap", () => {
    const output = processScenario({
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
            cause: "accident",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune (insurance value 250 G) with 200 G damage yields 100 G payout and 400 G remaining cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("moonstone (insurance value 250 G) with 200 G damage yields 100 G payout and 400 G remaining cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "moonstone", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("damage event of 80 G below 100 G deductible yields 0 G payout (clamped at zero, never negative)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 80 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("dragon attack damaging insured sword (500 G) and insured amulet (300 G) applies 100 G deductible per damaged item for 600 G payout and 2600 G remaining cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
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
    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // Claim special clauses: high enchantment and dragon material, plus payout rounding
  it("steel sword with enchantment 7 and 1000 G damage yields 900 G payout (below high-enchantment claim threshold of 8)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 900, remainingCap: 1100 }],
    });
  });
  it("steel sword with enchantment 9 and 1000 G damage yields 400 G payout (50% high-enchantment clause first, then 100 G deductible)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with enchantment 5 and 800 G damage yields 700 G payout (full reimbursement, then 100 G deductible)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8 and 1000 G damage yields 400 G payout (50% high-enchantment clause applies, then 100 G deductible)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with enchantment 9 and 1000 G damage yields 400 G payout (both clauses apply, 50% rule wins, then 100 G deductible)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("payout calculation yielding fractional amount (350.5 G from enchantment 8 sword with 901 G damage) rounds down in MHPCO's favor to 350 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // Policy insurance sum and cap exhaustion across item types and successive claims
  it("policy with staff (800 G) and potion (400 G) has insurance sum 1200 G and cap 2400 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff" }, { type: "potion" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "staff", amount: 300 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 137 }, { payout: 200, remainingCap: 2200 }],
    });
  });
  it("policy with two swords has insurance sum 2000 G and cap 4000 G, and two sword damage entries each get their own deductible", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
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
    });
    expect(output).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("cursed sword has cap 2000 G based on unmodified insurance value 1000 G regardless of premium modifiers", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("policy with sword and 3 runes (block) has insurance sum 1750 G and cap 3500 G (block discount affects premium only)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });
  it("two successive claims of 1500 G on a single sword (cap 2000 G) yield 1400 G with 600 G remaining cap, then 600 G with 0 G remaining cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "first battle",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "second battle",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Validation and rejection edge cases
  it("quote with unknown item type (e.g. broomstick) is rejected with an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/Unknown item type: broomstick/);
  });
  it("claim referencing damage to an item type not in the policy (e.g. amulet when only sword insured) is rejected with an Error", () => {
    expect(() =>
      processScenario({
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
      }),
    ).toThrow(/not covered by policy/);
  });
  it("claim with more damage entries of a given type than the policy covers (e.g. two sword damages when one sword insured) is rejected with an Error", () => {
    expect(() =>
      processScenario({
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
    ).toThrow(/not covered by policy/);
  });
  it("claim containing a negative damage amount (e.g. -200) is rejected with an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/Damage amount cannot be negative/);
  });

  // CLI adapter integration
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout for valid quote and claim steps", () => {
    const input = JSON.stringify({
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
    const proc = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(0);
    expect(proc.stderr).toBe("");
    expect(JSON.parse(proc.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with non-zero status code, writes error description to stderr, and writes no results to stdout when scenario is rejected", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const proc = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(1);
    expect(proc.stderr).toMatch(/Unknown item type: broomstick/);
    expect(proc.stdout).toBe("");
  });
});
