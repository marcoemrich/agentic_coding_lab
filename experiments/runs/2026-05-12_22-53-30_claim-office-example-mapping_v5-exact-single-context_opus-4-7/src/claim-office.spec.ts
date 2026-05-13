import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (
  items: unknown[],
  customer: { yearsWithMHPCO: number } = { yearsWithMHPCO: 0 },
  priorQuotes: unknown[] = [],
): number => {
  const steps = [
    ...priorQuotes.map((items) => ({ op: "quote" as const, items: items as never })),
    { op: "quote" as const, items: items as never },
  ];
  const result = runScenario({ customer, steps });
  const last = result.results[result.results.length - 1];
  return (last as { premium: number }).premium;
};

describe("MHPCO Claim Office - Premium (quote)", () => {
  // Empty / single main item base premiums (newcomer first contract: base + 10% first ins + 5 fee)
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    expect(quote([])).toBe(5);
  });
  it("a plain sword yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("a plain amulet yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
  });
  it("a plain staff yields 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote([{ type: "staff", material: "oak", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("a plain potion yields 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });
  it("a single rune component yields 33 G (25 base + 2.5 first ins -> rounded up + 5 fee = 32.5 -> 33)", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });

  // Multiple items / blocks (newcomer)
  it("two plain swords yield 225 G (200 base + 20 first ins + 5 fee)", () => {
    expect(quote([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ])).toBe(225);
  });
  it("two runes yield 60 G (50 base + 5 first ins + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("three runes form a block yielding 71 G (60 block + 6 first ins + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("four runes yield 115 G (100 base + 10 first ins + 5 fee, block requires exactly 3)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
  });
  it("seven runes yield 198 G (175 base + 17.5 first ins + 5 fee = 197.5 -> 198)", () => {
    expect(quote([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ])).toBe(198);
  });
  it("2 runes + 1 moonstone yield 88 G (75 base + 7.5 first ins + 5 fee = 87.5 -> 88)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones yield 137 G (120 base + 12 first ins + 5 fee, two separate blocks)", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });

  // Item-specific modifiers (newcomer)
  it("a cursed sword yields 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: true }])).toBe(165);
  });
  it("a sword with enchantment 5 yields 145 G (100 + 30 high ench + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("a sword with enchantment 4 has no high-enchantment surcharge: 115 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("a cursed sword with enchantment 5 stacks both surcharges: 195 G (100 + 50 + 30 + 10 + 5)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });

  // Policy-wide modifiers (loyalty, first insurance, follow-up)
  it("long-standing customer (>=2 years) sword yields 95 G (100 + 10 first ins - 20 loyalty + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 3 })).toBe(95);
  });
  it("customer with exactly 2 years gets loyalty discount", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("first insurance always applies: newcomer sword without curse yields 115 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("second contract gets 15% follow-up discount: 0-year customer's second sword yields 100 G (100 + 10 first - 15 followup + 5)", () => {
    expect(quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0 },
      [[{ type: "sword", material: "steel", enchantment: 0, cursed: false }]],
    )).toBe(100);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet: curse applies to sword, first ins on policy base, totalling 231 G", () => {
    // policy base = 160, curse = 50, first ins = 16, fee = 5 -> 231
    expect(quote([
      { type: "sword", material: "steel", enchantment: 0, cursed: true },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ])).toBe(231);
  });

  // Rounding
  it("premium rounds up in MHPCO's favor (197.5 -> 198)", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ])).toBe(198);
  });

  // Integration examples from the spec
  it("newcomer with a cursed sword yields 165 G (spec integration example)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("long-standing customer's second contract cursed sword enchantment 7 yields 160 G (spec integration)", () => {
    expect(quote(
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      { yearsWithMHPCO: 3 },
      [[{ type: "sword", material: "steel", enchantment: 0, cursed: false }]],
    )).toBe(160);
  });
});

describe("MHPCO Claim Office - Claim", () => {
  // Standard reimbursement
  it("standard sword damage 500 G yields payout 400 G (full minus 100 G deductible)", () => {
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
  it("damage to a rune (250 G) of 200 G yields payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // High enchantment clause
  it("sword with enchantment 8 and damage 1000 G yields payout 400 G (50% rule then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword with enchantment 9 (steel) and damage 1000 G yields payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Dragon material clause
  it("dragon-material sword with enchantment 5 and damage 800 G yields payout 700 G (full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword with enchantment 9 and damage 1000 G yields payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with enchantment 8 and damage 1000 G yields payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("multi-item damage applies 100 G deductible per damaged item (sword 500 + amulet 300 -> 600 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3200 - 600 });
  });

  // Cap
  it("policy cap is twice the insurance sum (sword: cap 2000 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    // sword damage 5000, default full reimbursement, 5000 - 100 = 4900, capped at 2000 (= 2 * 1000)
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("cursed sword cap is still 2000 G (modifiers do not raise the cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy with sword + 3 runes has insurance sum 1750 G (block discount does not affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 10000 }] },
        },
      ],
    });
    // cap = 1750 * 2 = 3500; damage 10000 - 100 ded = 9900, capped at 3500
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("two successive claims of 1500 G against sword: first payout 1400 G then 600 G with remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple items of the same type
  it("two swords on one policy: insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 10000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("damage entries match policy items by type/count - separate deductibles per entry", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // Each damage gets its own deductible: (500 - 100) + (500 - 100) = 800
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // Payout rounding
  it("payout rounds down in MHPCO's favor (350.5 G -> 350 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // ench 8: 901 * 0.5 = 450.5; minus 100 = 350.5 -> rounded down = 350
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO Claim Office - Error handling", () => {
  it("quote with unknown item type throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" } as never] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not in the policy throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with more damage entries of a type than insured throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
