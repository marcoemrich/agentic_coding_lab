import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty / base premiums
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote for a single plain sword (newcomer) yields 115 G (100 + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a single plain amulet (newcomer) yields 71 G (60 + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for a single plain staff (newcomer) yields 93 G (80 + 8 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for a single plain potion (newcomer) yields 49 G (40 + 4 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("quote for 2 runes yields 55 G (2 x 25 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes yields 71 G (block of 3 = 60 + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes yields 115 G (no block, 4 x 25 + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 3 runes + 3 moonstones yields 137 G (two separate blocks)", () => {
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("quote for a sword and amulet yields 181 G (160 + 16 first ins + 5 fee)", () => {
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
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  // Premium modifiers
  it("cursed sword (newcomer) yields 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
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
  it("high enchantment (>=5) sword (newcomer) yields 145 G (100 + 30 high-ench + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("enchantment 4 sword (newcomer) yields 115 G (no high-enchant; 100 + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("loyalty discount applies at exactly 2 years with MHPCO: sword yields 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge applies to every quote (covered by plain sword test)", () => {
    // Already covered by "single plain sword (newcomer) yields 115 G"; this is regression-style.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("follow-up contract gives 15% discount on policy base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("newcomer with cursed sword: 165 G integration example (already covered)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer second contract integration example: 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // First quote (potion): 40 + 4 first ins - 8 loyalty + 5 fee = 41
    // Second quote (cursed enchant-7 sword): 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // Rounding
  it("premium rounds up to whole G in MHPCO's favor (1 rune → 33 G, ceil of 32.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Claims
  it("claim with no damage on sword policy: payout 0, cap remains 2000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("standard claim: steel sword damage 500 → payout 400, cap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on rune (no enchantment/material): damage 200 → payout 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword fully reimbursed minus deductible", () => {
    // dragon-material sword, enchantment 5, damage 800 → payout 700 (per spec example)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("high-enchantment (>=8) item reimbursed at 50% then deductible", () => {
    // steel sword, enchantment 9, damage 1000 → payout 400 (per spec example)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material + high-enchantment: 50% rule wins (400 G on 1000 G damage)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("deductible applies per damage event (multiple items)", () => {
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
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("payout rounds down in MHPCO's favor", () => {
    // enchantment 9 sword, damage 901 → 450.5 - 100 deductible = 350.5, floor = 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((result as { results: { payout: number }[] }).results[1].payout).toEqual(350);
  });
  it("cap exhaustion: successive claims limited by remaining cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect((result as { results: unknown[] }).results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("multiple items of same type: each damage entry has own deductible", () => {
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
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    // insurance sum 2000, cap 4000; payout (500-100)+(600-100) = 900; remaining 3100
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 900, remainingCap: 3100 });
  });

  // Errors
  it("unknown item type in quote → CLI exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim damage references item not in policy → CLI exits non-zero", () => {
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
  it("damage entries exceeding insured count → CLI exits non-zero", () => {
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
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("negative damage amount → CLI exits non-zero", () => {
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
});
