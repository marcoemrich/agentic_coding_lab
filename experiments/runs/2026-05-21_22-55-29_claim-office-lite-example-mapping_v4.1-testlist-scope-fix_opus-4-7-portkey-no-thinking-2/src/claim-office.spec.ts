import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty policy ---
  it("quote with empty item list returns premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items (with 5 G fee, newcomer 10% first-insurance) ---
  // Note: a single-item quote for a newcomer with 0 years is the minimal sensible scenario.
  // To keep the simplest tests truly simple, we test the base-premium examples through
  // long-standing-customer follow-up scenarios where only the base + fee apply.
  // We test base premiums first via the spec examples about building blocks (which are
  // explicitly described as "base premiums"). So we start there.

  // --- Building block of 3 alike components (base premium examples from spec) ---
  it("2 runes have base premium 50 G (2 x 25 G, no block)", () => {
    // 50 base + 5 first-insurance (10% of 50) + 5 fee = 60
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes have base premium 60 G (block applies)", () => {
    // 60 base + 6 first-insurance (10% of 60) + 5 fee = 71
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes have base premium 100 G (no block — block requires exactly 3)", () => {
    // 100 base + 10 first-insurance + 5 fee = 115
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes have base premium 175 G (no block possible across 7)", () => {
    // 175 base + 17.5 first-insurance + 5 fee = 197.5 → rounds UP to 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components clarification (❓ same type, not same family) ---
  it("2 runes + 1 moonstone have base premium 75 G (no block — different types)", () => {
    // 75 base + 7.5 first-insurance + 5 fee = 87.5 → rounds UP to 88
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones have base premium 120 G (two separate blocks of 3 same type)", () => {
    // 120 base + 12 first-insurance + 5 fee = 137
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years receives loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword with exactly enchantment 5 gets high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 does NOT get high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 gets both curse and high-enchantment surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Rounding rules ---
  it("premium calculation yielding 197.5 G rounds UP to 198 G (MHPCO favor)", () => {
    // customer 2y with 2nd quote: cursed sword (ench 5) + 2 runes
    // base = 100 + 50 = 150
    // cursed = 50, high-ench = 30, first-insurance = 15 (10% of policy base 150)
    // loyalty = 30 (20% of 150), follow-up = 22.5 (15% of 150)
    // total = 150 + 50 + 30 + 15 - 30 - 22.5 + 5 = 197.5 -> rounds UP to 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 198 });
  });
  it("payout calculation yielding 350.5 G rounds DOWN to 350 G (MHPCO favor)", () => {
    // dragon-material sword ench 8: half-payment rule applies.
    // damage 901 → 901 * 0.5 = 450.5 → minus 100 deductible = 350.5 → rounds DOWN to 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 350 });
  });
  it("intermediate amounts are kept as fractions; only the final premium/payout is rounded", () => {
    // customer 2y, follow-up quote (step index 1) with 1 rune:
    // policy base = 25; first-ins = 2.5; loyalty = -5; follow-up = -3.75; fee = 5
    // total = 25 + 2.5 - 5 - 3.75 + 5 = 23.75 → ceil 24
    // If intermediate amounts were rounded early (e.g. follow-up rounded to 3),
    // we'd get 25 + 2.5 - 5 - 3 + 5 = 24.5 → ceil 25 (wrong).
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "rune" }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 24 });
  });

  // --- Modifier scope on multi-item policies (❓ item-specific vs policy-wide) ---
  it("policy with cursed sword (100 G base) + plain amulet (60 G base) has policy base 160 G; curse adds 50 G (50% of sword base, not policy total) → 210 G before further modifiers and fee", () => {
    // policy base = 100 + 60 = 160
    // cursed = 50 (50% of sword base 100, not policy 160)
    // first-insurance = 16 (10% of 160)
    // fee = 5
    // total = 160 + 50 + 16 + 5 = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }, { type: "amulet", material: "gold", enchantment: 0 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("item-specific modifiers (cursed, high enchantment) apply to the affected item's base premium", () => {
    // customer 0y, items: cursed sword (no ench), staff with ench 6
    // Policy base = 100 + 80 = 180
    // Cursed surcharge = 50 (50% of sword base 100, NOT staff)
    // High-ench surcharge = 24 (30% of staff base 80, NOT sword which has no ench)
    // First-ins = 18 (10% of 180)
    // Premium = 180 + 50 + 24 + 18 + 5 = 277
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }, { type: "staff", material: "wood", enchantment: 6 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 277 }] });
  });
  it("policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium", () => {
    // customer 2y, items: sword + amulet (multi-item), step 1 follow-up.
    // Policy base = 100 + 60 = 160
    // First-ins = 16 (10% of 160)
    // Loyalty = -32 (20% of 160)
    // Follow-up = -24 (15% of 160)
    // Premium step 1 = 160 + 16 - 32 - 24 + 5 = 125
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }, { type: "amulet", material: "silver", enchantment: 0 }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 125 });
  });
  it("processing fee is added at the very end after all other modifiers", () => {
    // customer 5y (loyalty applies), single rune.
    // Base 25 + first-ins 2.5 - loyalty 5 + fee 5 = 27.5 → ceil 28
    // If fee were applied before loyalty: (25 + 2.5 + 5) * 0.8 = 26 (wrong)
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 28 }] });
  });

  // --- Integration example 1: Newcomer with cursed sword ---
  it("newcomer (0 years, no previous contract) with cursed sword (steel, ench 3) → premium 165 G (100 base + 50 curse + 10 first-insurance = 160 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Integration example 2: Long-standing customer's second contract ---
  it("long-standing customer (3 years, 2nd quote) with cursed sword (steel, ench 7) → premium 160 G (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up = 155 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 160 });
  });
  it("first-insurance surcharge applies to every item in every quote, regardless of customer history (❓ clarification)", () => {
    // Long-standing customer (10 years) with follow-up quote of a plain amulet (silver, ench 0).
    // Policy base = 60; first-ins = 6 (10% of 60); loyalty = -12 (20% of 60);
    // follow-up = -9 (15% of 60); fee = 5.
    // Premium step 1 = 60 + 6 - 12 - 9 + 5 = 50.
    // If first-insurance were suppressed for long-standing customers or for follow-up quotes,
    // the premium would be different (44).
    const result = runScenario({
      customer: { yearsWithMHPCO: 10 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0 }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 50 });
  });

  // --- Claim processing: standard reimbursement (no special clauses) ---
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "drop", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 400 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (full minus 100 deductible; no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 100 });
  });

  // --- Claim processing: deductible per damage event ---
  it("dragon attack damages insured sword (500 G) and amulet (300 G) → payout 600 G (100 deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0 },
          { type: "amulet", material: "silver", enchantment: 0 },
        ]},
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]}},
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 600 });
  });

  // --- Enchantment threshold vs. dragon material ---
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause: 50%, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 400 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins over dragon material, then deductible: 500 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 400 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause: full, then deductible: 800 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 700 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause: 50%, then deductible: 500 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 400 });
  });

  // --- Multiple items of the same type (❓ two swords) ---
  it("policy covers two swords → insurance sum 2000 G (= 2 x 1000)", () => {
    // customer 0y, items: [sword, sword]
    // Policy base = 100 * 2 = 200 (two swords, not deduplicated)
    // First-insurance = 20 (10% of 200)
    // Fee = 5
    // Premium = 200 + 20 + 5 = 225
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0 },
        { type: "sword", material: "steel", enchantment: 0 },
      ]}],
    });
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });
  it("dragon attack damages both swords; each damages entry treated as separate damage with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0 },
          { type: "sword", material: "steel", enchantment: 0 },
        ]},
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]}},
      ],
    });
    expect((result as { results: Array<{ payout?: number; premium?: number }> }).results[1]).toEqual({ payout: 600 });
  });
  it("damages array contains more entries of a type than the policy covers → whole claim rejected (non-zero exit)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]}},
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Edge cases ---
  it("quote includes item with unknown type (e.g. broomstick) → non-zero exit, error on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim references damage entry for an item not part of the policy (e.g. amulet damaged when only sword insured) → non-zero exit, error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "drop", damages: [
          { itemType: "amulet", amount: 200 },
        ]}},
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim references damage entry with unknown item type → non-zero exit, error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "drop", damages: [
          { itemType: "broomstick", amount: 200 },
        ]}},
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim contains a damage entry with amount -200 → non-zero exit, error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "drop", damages: [
          { itemType: "sword", amount: -200 },
        ]}},
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- CLI integration (reads JSON from stdin, writes results to stdout) ---
  it("CLI scenario with a quote step writes {results: [{premium: N}]} to stdout", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf-8",
      cwd: process.cwd(),
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 60 }] });
  });
  it("CLI scenario with quote followed by claim referencing policy by zero-based step index produces results in same order as steps", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0 }] },
        { op: "claim", policy: 0, incident: { cause: "drop", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf-8",
      cwd: process.cwd(),
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400 }] });
  });
});
