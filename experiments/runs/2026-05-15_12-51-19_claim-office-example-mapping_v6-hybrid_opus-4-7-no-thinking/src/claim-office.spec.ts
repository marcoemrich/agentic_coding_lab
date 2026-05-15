import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote - base premiums and processing fee
  it("empty item list yields premium of just the 5 G processing fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = runScenario(input);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("a plain sword (no modifiers, no customer history) yields 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    };
    const result = runScenario(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("a plain amulet yields 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });
  it("a plain staff yields 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 93 }] });
  });
  it("a plain potion yields 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and block discount
  it("a single rune yields 25 G base + 3 G first insurance (rounded up) + 5 G fee = 33 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }],
      }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes yield 50 G base + 5 G first insurance + 5 G fee = 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes form a block: 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes: no block, 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes: no block (requires exactly 3), 7*25 = 175 G base + 18 G first insurance (rounded up) + 5 G fee = 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone: no block (different types) = 75 G base + 8 G first insurance (rounded up) + 5 G fee = 88 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones: two separate blocks = 120 G base + 12 G first insurance + 5 G fee = 137 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-level modifiers
  it("a cursed sword: 100 G base + 50 G cursed surcharge + 10 G first insurance + 5 G fee = 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 165 }] });
  });
  it("a sword with enchantment 5: 100 G base + 30 G high-enchantment + 10 G first insurance + 5 G fee = 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 145 }] });
  });
  it("a sword with enchantment 4: no high-enchantment surcharge, 100 G + 10 G first + 5 G fee = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("a cursed sword with enchantment 5: 100 G base + 50 G + 30 G + 10 G first insurance + 5 G fee = 195 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("loyalty discount applies at exactly 2 years with MHPCO (sword: 100 base + 10 first - 20 loyalty + 5 fee = 95 G)", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 95 }] });
  });
  it("first-ever contract: only first insurance surcharge applies (no follow-up discount)", () => {
    // Already covered: a plain sword first contract = 115
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("second contract in the scenario: follow-up contract -15% applies (sword: 100 base + 10 first - 15 follow-up + 5 fee = 100 G)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("multi-item policy: cursed sword + plain amulet = 160 base + 50 curse (item-specific) + 16 first ins + 5 fee = 231 G", () => {
    // 100 + 60 = 160 base, +50 (50% of cursed sword's 100), +16 (10% of 160 base), +5 fee = 231
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("premium with fractional result is rounded UP (in MHPCO's favor)", () => {
    // single moonstone: 25 base + 2.5 first + 5 = 32.5 -> rounds up to 33
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 33 }] });
  });

  // Integration examples from spec
  it("newcomer (0 years) with a cursed sword yields 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(runScenario(input)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's (3 years) second contract: cursed sword enchantment 7 yields 160 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    const result = runScenario(input) as { results: { premium: number }[] };
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim processing - basic
  it("standard sword damage: 500 G damage on insured sword yields payout 400 G (after 100 G deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number; premium?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (250 G insurance value, 200 G damage) yields payout 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number; premium?: number }[] };
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim - enchantment threshold
  it("dragon-material sword at exactly enchantment 8, damage 1000 G: payout 400 G (50% rule wins, then deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 G: payout 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 G: payout 700 G (full reimbursement, deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 G: payout 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim - multiple damages
  it("two damaged items: deductible applies once per damage (sword 500 + amulet 300 = 600 G payout)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    // Insurance sum 1000+600=1600, cap 3200; payout 400 (sword) + 200 (amulet) = 600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap
  it("cap exhaustion: sword (cap 2000), two 1500 G claims yield payouts 1400 and 600 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const result = runScenario(input) as { results: { payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Validation/errors
  it("quote with unknown item type throws an error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(input)).toThrow();
  });
  it("claim with item type not in policy throws an error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => runScenario(input)).toThrow();
  });
  it("claim with negative damage amount throws an error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => runScenario(input)).toThrow();
  });
  it("claim with more damage entries of a type than policy covers throws an error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [
          { itemType: "sword", amount: 100 },
          { itemType: "sword", amount: 100 },
        ] } },
      ],
    };
    expect(() => runScenario(input)).toThrow();
  });
});
