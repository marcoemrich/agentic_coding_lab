import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for main items (single item, no modifiers, newcomer with 0 years) ---
  // Note: a lone quote for a newcomer applies first-insurance surcharge + fee.
  // Simplest possible: empty item list.
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Components base premiums / building blocks ---
  it("2 runes -> 50 G base premium (total 60 G for newcomer)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + 10% first-insurance (5) + 5 fee = 60
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    // block base 60 + 10% first-insurance (6) + 5 fee = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // base 100 + 10% (10) + 5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium (no block, total rounds to 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // base 175 + 10% (17.5) + 5 fee = 197.5 -> rounded up to 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // base 75 + 10% (7.5) + 5 fee = 87.5 -> ceil 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
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
    // two blocks: 60 + 60 = 120 + 10% (12) + 5 fee = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> curse on cursed item only (210 before modifiers/fee)", () => {
    const result = runScenario({
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
    // policy base 160, curse +50 (50% of sword 100) = 210; first-insurance 10% of 160 = 16; +5 fee = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("policy-wide modifiers on policy base; item modifiers on item base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // policy base 160; high-ench +30 (30% of sword 100); first-insurance 16 (10% of 160); +5 fee = 211
    expect(result.results[0]).toEqual({ premium: 211 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    // base 60; loyalty -12 (20% of 60); first-insurance +6 (10% of 60); +5 fee = 59
    expect(result.results[0]).toEqual({ premium: 59 });
  });
  it("sword with exactly enchantment 5, cursed -> both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // base 100; curse +50; high-ench +30; first-insurance +10; +5 fee = 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    // base 100; no surcharges; first-insurance +10; +5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    // 175 base + 17.5 first-insurance + 5 fee = 197.5 -> 198 (rounded in MHPCO favor, up)
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> 350 G (rounded down)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901*0.5 = 450.5 - 100 = 350.5 -> floor 350; cap 2000 - 350 = 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first-insurance = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // second contract: 100 + 50 curse + 30 high-ench + 10 first-insurance
    //  - 20 loyalty - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword, damage 500 G -> payout 400 G", () => {
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
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // full 200 - 100 = 100; cap 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon-material sword ench 8, damage 1000 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // high-ench (>=8) 50%: 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9, damage 1000 G -> payout 400 G (50% wins)", () => {
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
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // both clauses; 50% wins: 500 - 100 = 400; cap 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5, damage 800 G -> payout 700 G (dragon full)", () => {
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
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // dragon full: 800 - 100 = 700; cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
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
    // high-ench 50%: 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword 500 + amulet 300 -> payout 600 G (deductible per item)", () => {
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
    // (500-100) + (300-100) = 600; cap 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("two swords -> insurance sum 2000 G, cap 4000 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    });
    // premium: base 200 + first-insurance 20 + fee 5 = 225
    expect(result.results[0]).toEqual({ premium: 225 });
    // cap = 2000*2 = 4000; payout 3000-100=2900; remaining 4000-2900=1100
    expect(result.results[1]).toEqual({ payout: 2900, remainingCap: 1100 });
  });
  it("dragon attack damages both swords -> each damage separate deductible", () => {
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // (500-100)*2 = 800; cap 4000 - 800 = 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damages of a type than insured -> claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
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
      })
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3100 }] },
        },
      ],
    });
    // cap = 1600*2 = 3200; payout 3100-100=3000; remaining 3200-3000=200
    expect(result.results[1]).toEqual({ payout: 3000, remainingCap: 200 });
  });
  it("cursed sword -> cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    });
    // premium with modifiers = 165 (does not affect cap)
    expect(result.results[0]).toEqual({ premium: 165 });
    // cap = 1000*2 = 2000; uncapped 2400 -> capped to 2000; remaining 0
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes block -> insurance sum 1750 G (block affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3400 }] },
        },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750; cap 3500; payout 3300; remaining 200
    expect(result.results[1]).toEqual({ payout: 3300, remainingCap: 200 });
  });
  it("two successive 1500 G claims -> 1400 then 600, cap exhausted", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // cap 2000; first: 1400, remaining 600; second: uncapped 1400 -> capped 600, remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("unknown item type in quote -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("claim references item not in policy -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      })
    ).toThrow();
  });
  it("claim with negative amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow();
  });
});
