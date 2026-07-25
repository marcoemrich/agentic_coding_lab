import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums / simplest cases ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("single sword (base 100) newcomer first insurance -> 100 + 10 first + 5 fee = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  // --- Building block of 3 alike components (base premiums) ---
  it("2 runes -> base premium 50 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + 10% first (5) + fee 5 = 60
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> base premium 60 G (block applies)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // base 60 + 10% first (6) + fee 5 = 71
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> base premium 100 G (no block; block requires exactly 3)", () => {
    const out = runScenario({
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
    // base 100 + 10% first (10) + fee 5 = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> base premium 175 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // base 175 + 10% first (17.5) + fee 5 = 197.5 -> rounded up to 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });

  // --- 'Alike' components ---
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // base 75 + 10% first (7.5) + fee 5 = 87.5 -> 88
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const out = runScenario({
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
    // base 120 + 10% first (12) + fee 5 = 137
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // --- Item base premiums for all main items ---
  it("amulet base premium 60 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    // 60 + 6 first + 5 fee = 71
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("staff base premium 80 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    // 80 + 8 first + 5 fee = 93
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("potion base premium 40 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    // 40 + 4 first + 5 fee = 49
    expect(out.results[0]).toEqual({ premium: 49 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100) + plain amulet (60): base 160, curse adds 50 (of sword only) -> 210 before further modifiers and fee", () => {
    const out = runScenario({
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
    // policy base 160 + curse 50 = 210; + first 16 (10% of 160) + fee 5 = 231
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100 - loyalty 20 (20%) + first 10 (10%) + fee 5 = 95
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // base 100 + high-ench 30 (30%) + first 10 + fee 5 = 145
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword enchantment 5 and cursed -> both surcharges apply", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    // base 100 + curse 50 + high-ench 30 + first 10 + fee 5 = 195
    expect(out.results[0]).toEqual({ premium: 195 });
  });
  it("sword enchantment 4 -> no high-enchantment surcharge; curse only if cursed", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    // base 100 (no high-ench, not cursed) + first 10 + fee 5 = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3): premium 165 G", () => {
    const out = runScenario({
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
    // 100 base + 50 curse + 10 first + 5 fee = 165
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing (3y) 2nd contract, cursed sword (steel, ench 7): premium 160 G; first insurance still applies per item", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    // 2nd contract: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up + 5 fee = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> 198 G (rounded up, MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "moonstone" })),
        },
      ],
    });
    // base 175 + 17.5 first + 5 fee = 197.5 -> 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> 350 G (rounded down, MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    // ench 8 -> 50% clause: 901*0.5 = 450.5, - 100 deductible = 350.5 -> floor 350
    expect(out.results[1]).toMatchObject({ payout: 350 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (full minus 100 deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400
    expect(out.results[1]).toMatchObject({ payout: 400 });
  });
  it("rune damage 200 -> payout 100 (full minus deductible; no special clause)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    // full 200 - 100 = 100
    expect(out.results[1]).toMatchObject({ payout: 100 });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon-material sword ench 8, damage 1000 -> payout 400 (50% clause then deductible)", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // 50% of 1000 = 500, - 100 = 400
    expect(out.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword ench 9, damage 1000 -> payout 400 (both apply, 50% wins, then deductible)", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // 50% wins: 500 - 100 = 400
    expect(out.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword ench 5, damage 800 -> payout 700 (dragon full reimbursement, then deductible)", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    // dragon full reimbursement: 800 - 100 = 700
    expect(out.results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword ench 9, damage 1000 -> payout 400 (high-enchantment 50% then deductible)", () => {
    const out = runScenario({
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
            cause: "lightning",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // 50% of 1000 = 500, - 100 = 400
    expect(out.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per item)", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 600
    expect(out.results[1]).toMatchObject({ payout: 600 });
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords -> insurance sum 2000, cap 4000", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // payout (500-100)*2 = 800; cap 4000 - 800 = 3200 remaining
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("dragon attack damages both swords -> each entry separate damage with own deductible", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 1000 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // (1000-100) + (300-100) = 1100; cap 4000 - 1100 = 2900
    expect(out.results[1]).toEqual({ payout: 1100, remainingCap: 2900 });
  });
  it("more damages of a type than covered (2 sword damages, 1 sword insured) -> claim rejected (error)", () => {
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

  // --- Cap / insurance sum ---
  it("policy covers sword and amulet -> insurance sum 1600, cap 3200", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // payout 400; cap 3200 - 400 = 2800
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword (premium modifiers) -> cap 2000 (based on unmodified insurance value)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // cap based on unmodified value 1000 -> 2000; payout 400; remaining 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("policy covers sword and 3 runes (block) -> insurance sum 1750 (block affects premium only)", () => {
    const out = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // insurance sum 1000 + 3*250 = 1750; cap 3500; payout 400; remaining 3100
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword (cap 2000), two claims of 1500: first payout 1400 remaining 600; second payout 600 remaining 0", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    // first: 1500-100=1400, remaining 2000-1400=600
    // second: desired 1400 capped to remaining 600 -> payout 600, remaining 0
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("quote with unknown item type -> non-zero exit / error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> error", () => {
    expect(() =>
      runScenario({
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
    ).toThrow();
  });
  it("claim damage amount -200 -> error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
