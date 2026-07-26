import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for single main items (base + 10% first insurance + 5G fee) ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Component pricing and building blocks ---
  it("2 runes -> base premium 50 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 + 10% first insurance (5) + 5 fee = 60
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> base premium 60 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 60 (block) + 10% (6) + 5 fee = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> base premium 100 G (no block, block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 100 + 10% (10) + 5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> base premium 175 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // base 175 + 10% (17.5) + 5 fee = 197.5 -> round up 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // base 75 + 10% (7.5) + 5 fee = 87.5 -> round up 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // base 120 + 10% (12) + 5 fee = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> 210 G before further modifiers and fee (curse on cursed item only)", () => {
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
    // policy base 160 + curse 50 (on sword only) = 210; + 10% first insurance of 160 (16) + 5 fee = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    // base 100 + 10% first insurance (10) - 20% loyalty (20) + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    // base 100 + high ench 30 + 10% first insurance (10) + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    // base 100 + 10% first insurance (10) + 5 fee = 115 (no high-ench surcharge)
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // --- Integration examples (full premium) ---
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract: cursed sword (steel, ench 7) -> premium 160 G", () => {
    const cursedSword7 = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [cursedSword7] },
      ],
    });
    // 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding of premium ---
  it("premium yielding 197.5 G -> final premium 198 G (rounded up, MHPCO favor)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 175 base + 17.5 first insurance + 5 fee = 197.5 -> rounded up 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- Standard claim reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600 remaining
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (value 250 G), damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // full reimbursement 200 - 100 deductible = 100; cap 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Special claim clauses ---
  it("dragon-material sword, ench 5, damage 800 G -> payout 700 G (dragon full reimbursement)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    // dragon material -> full reimbursement 800 - 100 = 700; cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 G -> payout 400 G (high-enchantment 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // high-enchantment (>=8): 50% of 1000 = 500, then deductible 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 9, damage 1000 G -> payout 400 G (both clauses, 50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // both clauses apply, 50% wins: 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly ench 8, damage 1000 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // high-enchantment clause applies (ench >= 8): 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (deductible once per item)", () => {
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
    // sword 500-100=400, amulet 300-100=200, total 600; cap 3200-600=2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Payout rounding ---
  it("payout yielding 350.5 G -> final payout 350 G (rounded down, MHPCO favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // 50% of 901 = 450.5, - 100 deductible = 350.5 -> round down 350; cap 2000 - 350 = 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // cap 4000; payout 500-100=400; remaining 4000-400=3600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("dragon attack damages both swords (two entries) -> each treated as separate damage with own deductible", () => {
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
              { itemType: "sword", amount: 700 },
            ],
          },
        },
      ],
    });
    // sword 500-100=400, sword 700-100=600, total 1000; cap 4000-1000=3000
    expect(result.results[1]).toEqual({ payout: 1000, remainingCap: 3000 });
  });
  it("more damage entries of a type than covered -> claim rejected (non-zero exit)", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
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
    expect(run).toThrow();
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // sum 1000+600=1600, cap 3200; payout 400; remaining 3200-400=2800
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword (premium 165) -> cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // premium 165; cap based on unmodified insurance value 1000 -> 2000; payout 400; remaining 1600
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes block -> insurance sum 1750 G (block discount affects premium only)", () => {
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // sum 1000 + 3*250 = 1750, cap 3500; payout 400; remaining 3500-400=3100
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword cap 2000 G, two claims of 1500 G: first payout 1400 remaining 600, second payout 600 remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    // first: 1500-100=1400, remaining 2000-1400=600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second: desired 1400 capped to remaining 600 -> payout 600, remaining 0
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases (CLI error handling) ---
  it("quote with unknown item type -> non-zero exit, error to stderr, no results to stdout", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
    expect(run).toThrow();
  });
  it("claim referencing item not in policy -> non-zero exit, error to stderr", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
    expect(run).toThrow();
  });
  it("claim with negative damage amount -> non-zero exit, error to stderr", () => {
    const run = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
    expect(run).toThrow();
  });
});
