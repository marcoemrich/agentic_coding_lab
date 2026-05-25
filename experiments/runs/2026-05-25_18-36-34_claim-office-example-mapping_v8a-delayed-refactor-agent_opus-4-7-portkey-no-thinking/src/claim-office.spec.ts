import { describe, it, expect } from "vitest";
import { runScenario, Scenario } from "./claim-office.js";

function run(scenario: Scenario) {
  return runScenario(scenario);
}

describe("base premiums for main items", () => {
  it("sword: base premium 100 → 105 after fee for newcomer first item", () => {
    // base 100 + first 10 + fee 5 = 115; wait newcomer 0 years, first insurance per-item: 100 + 10 = 110 + 5 = 115
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  it("amulet base premium 60 → 60 + 6 first + 5 fee = 71", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });

  it("staff base premium 80 → 80 + 8 + 5 = 93", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 93 });
  });

  it("potion base premium 40 → 40 + 4 + 5 = 49", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 49 });
  });
});

describe("component building block (3-alike block)", () => {
  it("2 runes → 50 G base premium", () => {
    // base 50 + first 5 + fee 5 = 60
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });

  it("3 runes → 60 G base premium (block applies)", () => {
    // base 60 + first 6 + fee 5 = 71
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // base 100 + first 10 + fee 5 = 115
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  it("7 runes → 175 G base premium (2 blocks × 60 + 1 × 25 = 145? No: 2 blocks = 6 runes use 120 G, remainder 1 × 25 = 25 → 145; but spec says 175 — let's verify reading)", () => {
    // The spec says 7 runes → 175 G base premium.
    // Reading more carefully: 7 runes: maybe block applies only once? Re-read:
    // "A building block of 3 alike components is offered at a special base premium of 60 G."
    // 7 runes: one block of 3 (60) + 4 individual (100) = 160? Or 175?
    // Hmm. Spec says 175. So perhaps the block is purely additional - or perhaps blocks happen only once.
    // Most natural: one block of 3 at 60 G + 4 leftover runes at 25 G each = 60 + 100 = 160. Spec: 175.
    // Try: 7 × 25 = 175 means no block applied? But "4 runes → 100 G (no block — block requires exactly 3)".
    // So "exactly 3" — block only applies when count is exactly 3? Then 7 runes → 7 × 25 = 175. Yes.
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    // base 175 + 17.5 first + 5 fee = 197.5 → round up to 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
});

describe("alike components — clarifying question", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // base 75 + 7.5 first + 5 fee = 87.5 → 88
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 88 });
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // base 120 + 12 first + 5 fee = 137
    const out = run({
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
    expect(out.results[0]).toEqual({ premium: 137 });
  });
});

describe("modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet: base 160 + 50 curse → 210; with first insurance and fee", () => {
    // newcomer, no prior: base sword 100 + amulet 60 = 160
    // curse on sword: +50 (50% of sword base only)
    // first insurance: each item per-base: 100*0.1 + 60*0.1 = 16
    // subtotal: 160 + 50 + 16 = 226 + 5 = 231
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 231 });
  });
});

describe("modifier thresholds", () => {
  it("customer with exactly 2 years with MHPCO → loyalty discount applies (sword)", () => {
    // base 100, loyalty -20, first 10 → 90 + 5 = 95
    const out = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // base 100, high enchant 30, first 10 → 140 + 5 = 145
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });

  it("sword with enchantment 5 and cursed → both surcharges apply", () => {
    // base 100, curse 50, high 30, first 10 → 190 + 5 = 195
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(out.results[0]).toEqual({ premium: 195 });
  });

  it("sword enchantment 4 → no high-enchantment surcharge", () => {
    // base 100 + first 10 + fee = 115
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  it("sword enchantment 4 cursed → curse only", () => {
    // base 100 + 50 + 10 + 5 = 165
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });

  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
});

describe("claim — deductible per damage event", () => {
  it("dragon attack damages an insured sword (500) and amulet (300); payout 600 (deductible per item)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    expect(out.results[1]).toMatchObject({ payout: 600 });
  });
});

describe("claim — standard reimbursement", () => {
  it("regular sword (steel, enchant 3), damage 500 → 400 (no special clause)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });

  it("damage to a rune (value 250), damage 200 → payout 100 (full reimbursement minus 100 deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(100);
  });
});

describe("claim — enchantment threshold vs dragon material", () => {
  it("dragon sword, ench 9, damage 1000 → 400 (50% rule wins)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });

  it("dragon sword, ench 5, damage 800 → 700 (dragon clause only, full minus deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(700);
  });

  it("steel sword, ench 9, damage 1000 → 400 (50% then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
});

describe("claim — multiple items of the same type", () => {
  it("two swords: insurance sum 2000, cap 4000", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
    // each: 500-100=400, 300-100=200, total 600; cap 4000 → remaining 3400
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it("rejects claim with more damages of a type than insured items", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "x",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
});

describe("cap exhaustion", () => {
  it("sword + amulet: insurance sum 1600, cap 3200", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // payout 100, cap 3200, remaining 3100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });

  it("cursed sword: cap 2000 based on unmodified insurance value", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  it("sword + 3 runes block: insurance sum 1750 (block discount affects premium only, not insurance sum)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // cap = 3500
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  it("sword cap 2000; two successive claims of 1500 each → 1400 then 600", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("rounding in MHPCO's favor", () => {
  it("premium yielding 197.5 → final 198 (round up)", () => {
    // 7 runes (from earlier test) yields 197.5 → 198
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });

  it("payout yielding 350.5 → 350 (round down)", () => {
    // High-enchant 8 sword, damage 901 → 901*0.5=450.5, -100=350.5 → 350
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(350);
  });
});

describe("edge cases", () => {
  it("empty item list → premium 5 (only fee)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });

  it("quote with unknown item type → throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });

  it("claim references damage entry whose item is not in the policy → throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      })
    ).toThrow();
  });

  it("claim references unknown damage item type → throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
          },
        ],
      })
    ).toThrow();
  });

  it("claim with negative damage amount → throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow();
  });
});

describe("integration examples", () => {
  it("newcomer with a cursed sword → premium 165", () => {
    // 0 years, no prior, cursed sword (steel, enchant 3)
    // base 100 + curse 50 + first 10 = 160 + fee 5 = 165
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });

  it("long-standing customer's second contract → premium 160", () => {
    // 3 years, second quote, cursed sword steel enchant 7
    // base 100 + curse 50 + high 30 - loyalty 20 + first 10 - follow-up 15 = 155 + fee 5 = 160
    const out = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first contract — some throwaway
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});

describe("CLI schema example", () => {
  it("amulet quote then claim runs end-to-end", () => {
    const out = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    // amulet: base 60, loyalty -12, first 6 → 54 + 5 = 59
    expect(out.results[0]).toEqual({ premium: 59 });
    // claim: standard, 200-100=100; cap = 1200; remaining 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
