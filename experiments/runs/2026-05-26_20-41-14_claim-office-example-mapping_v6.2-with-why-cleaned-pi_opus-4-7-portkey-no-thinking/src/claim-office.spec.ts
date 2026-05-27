import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty
  it("empty item list -- premium 5 G (just processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Single item base premiums (newcomer, 1st insurance applies)
  it("single plain sword for newcomer -- 100 base + 10 first + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet for newcomer -- 60 base + 6 first + 5 fee = 71 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff for newcomer -- 80 base + 8 first + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion for newcomer -- 40 base + 4 first + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("2 runes -- 50 G base premium (each rune 25 G); newcomer total 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + first insurance 10% (5) + fee 5 = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes block -- 60 G base premium; newcomer total 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 60 (block) + first insurance 6 + fee 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -- 100 G base premium (no block, requires exactly 3); newcomer 115 G", () => {
    const result = runScenario({
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
    // base 100 + first insurance 10 + fee 5 = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -- 175 G base premium (block requires exactly 3, all loose); newcomer 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // base 175 + first insurance 17.5 = 192.5 ceil = 193; +5 fee = 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -- 75 G base premium (no block, different types); newcomer 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // base 75 + first 7.5 = 82.5 ceil = 83; +5 fee = 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -- 120 G base premium (two separate blocks); newcomer 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    // base 60+60=120 + first 12 + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Modifiers
  it("cursed sword adds 50% surcharge -- 100 base + 50 curse + 10 first + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 -- adds 30% high-enchantment surcharge; newcomer 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // 100 base + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge; newcomer 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 -- both surcharges apply; newcomer 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    // 100 + 50 curse + 30 high-ench + 10 first + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years -- loyalty discount applies; sword 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // 100 base - 20 loyalty + 10 first + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet -- curse surcharge only on cursed item base; newcomer 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    // base 160 + curse 50 (on sword's 100) + first 16 (10% of 160) + fee 5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("premium rounds up in MHPCO favor (5 runes: 137.5 -> 138; fee 5 -> 143)", () => {
    const items = Array.from({ length: 5 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // base 125 + first 12.5 = 137.5 ceil = 138; +5 = 143
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });

  // Edge cases - errors
  it("unknown item type -- throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) -- premium 165 G", () => {
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
  it("long-standing customer second contract with cursed sword (enchantment 7) -- 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1 }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // 2nd quote: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 = 160
    expect(result).toEqual({
      results: [expect.any(Object), { premium: 160 }],
    });
  });

  // Claim processing - basic
  it("regular sword (steel, enchantment 3), damage 500 -- payout 400 (minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (250 G value), damage 200 -- payout 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim - enchantment threshold
  it("steel sword, enchantment 9, damage 1000 -- payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 -- payout 700", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 -- payout 400 (50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 -- payout 400 (high-ench applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim - deductible per damage event
  it("dragon attack damages sword 500 + amulet 300 -- payout 600 (deductible per damage)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    // (500-100) + (300-100) = 600; cap = 2*1600 = 3200; remaining = 3200-600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim - multiple items of same type
  it("two swords, both damaged -- two separate damages each with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
    // insurance sum 2000, cap 4000. Payout: 400+400=800; remaining 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages contain more entries of a type than policy covers -- throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
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

  // Claim - cap
  it("cap is twice insurance sum -- sword+amulet insurance 1600, cap 3200", () => {
    const result = runScenario({
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
    // payout = 100; cap 3200 -> remaining 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap is 2000 (based on unmodified insurance value)", () => {
    const result = runScenario({
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
    // payout = 100; cap = 2000 (not based on cursed-modified premium); remaining 1900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("policy with sword + 3 runes -- insurance sum 1750, cap 3500", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // insurance sum 1000+3*250=1750, cap 3500; payout=100; remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("successive claims exhaust cap -- first 1400, second 600 (cap remaining 0)", () => {
    const result = runScenario({
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
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim - rounding
  it("payout rounds down in MHPCO favor (raw 350.5 -> 350)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901 * 0.5 = 450.5 - 100 deductible = 350.5 floored -> 350; cap 2000, remaining 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Claim - errors
  it("claim references item not in policy -- throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim references unknown item type -- throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount -- throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
