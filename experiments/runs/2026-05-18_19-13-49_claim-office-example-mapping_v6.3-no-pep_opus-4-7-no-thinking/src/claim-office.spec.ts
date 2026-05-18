import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premiums and processing fee
  it("empty item list quote returns premium 5 (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword quote newcomer returns 115 (100 + 10 first ins + 5 fee)", () => {
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
  it("single amulet quote newcomer returns 71 (60 + 6 first ins + 5 fee)", () => {
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
  it("single staff quote newcomer returns 93 (80 + 8 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion quote newcomer returns 49 (40 + 4 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("multiple items sum their base premiums plus first ins plus fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base = 100 + 60 + 40 = 200; first ins +20 = 220; +5 fee = 225
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });

  // Components and building blocks
  it("2 runes quote newcomer returns 60 (50 + 5 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes quote newcomer returns 71 (60 block + 6 first ins + 5 fee)", () => {
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
  it("4 runes quote newcomer returns 115 (100 + 10 first ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes quote newcomer returns 198 (175 + 17.5 first ins + 5 fee rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 175 + 17.5 + 5 = 197.5 → rounded up = 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone quote newcomer returns 88 (75 + 7.5 first ins + 5 fee rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // 75 + 7.5 + 5 = 87.5 → rounded up = 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones quote newcomer returns 137 (120 + 12 first ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers
  it("cursed sword adds 50% surcharge on item base", () => {
    // Newcomer with a cursed sword (steel, enchantment 3)
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
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
  it("highly enchanted item (level 5) adds 30% surcharge", () => {
    // 100 base + 30 high-ench + 10 first ins + 5 fee = 145
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
  it("enchantment 4 does not trigger high-enchantment surcharge", () => {
    // 100 base + 10 first ins + 5 fee = 115
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
  it("cursed + high enchantment both apply to item base", () => {
    // 100 base + 50 curse + 30 high-ench + 10 first ins + 5 fee = 195
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("long-standing customer (2+ years) gets 20% loyalty discount on policy base", () => {
    // sword, 2 yrs: 100 + 10 first ins - 20 loyalty + 5 = 95
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
  it("follow-up contract (after first) gets 15% discount on policy base", () => {
    // first quote: 100 + 10 + 5 = 115
    // second quote (follow-up): 100 + 10 - 15 + 5 = 100
    const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Modifier scope on multi-item policies
  it("item-specific modifier applies only to that item, not the whole policy", () => {
    // cursed sword (100) + plain amulet (60), newcomer
    // base 160, curse +50 (sword only), first ins +16, fee 5 = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Integration examples
  it("long-standing customer's second contract integration example -> 160", () => {
    // 3 years, second quote, cursed sword (steel, enchantment 7)
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [sword] },
      ],
    });
    // First quote: 100 + 10 first ins - 20 loyalty + 5 = 95
    // Second quote: 160 (per spec example)
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Rounding (already verified by the "7 runes" test above)

  // Unknown item type
  it("unknown item type in quote throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // Claim — basic payout
  it("regular sword damage 500 returns payout 400 (500 - 100 deductible)", () => {
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 returns payout 100 (200 - 100 deductible)", () => {
    // rune insurance value 250 → cap 500. payout = 200-100 = 100. remaining cap = 400.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim — special clauses
  it("enchantment 8+ item damage is reimbursed at 50% then deductible", () => {
    // steel sword ench 9, damage 1000 → 50% = 500, -100 deductible = 400
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material item damage is fully reimbursed then deductible", () => {
    // dragon sword ench 5, damage 800 → full reimburse 800, -100 = 700
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon + enchantment 9: 50% rule wins, then deductible", () => {
    // dragon sword ench 9, damage 1000 → 50% wins = 500, -100 = 400
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  // dragon-material with enchantment 5 is covered by the dragon-material test above

  // Claim — multiple damages, deductible per event
  it("multiple item damages each get their own deductible", () => {
    // sword + amulet, dragon damages: sword 500, amulet 300
    // payout = (500-100) + (300-100) = 400 + 200 = 600
    // cap = 2 * (1000 + 600) = 3200; remaining = 3200 - 600 = 2600
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim — cap
  it("payout capped at twice the insurance sum", () => {
    // sword: insurance value 1000, cap = 2000. Damage 5000 → capped at 2000.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("cap is based on unmodified insurance value", () => {
    // cursed sword: insurance value 1000 (unmodified) → cap 2000.
    // Damage 5000 → capped at 2000.
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("successive claims reduce the remaining cap", () => {
    // sword: cap 2000. Two claims of 1500 each.
    // claim 1: 1500-100=1400 payout, remaining 600
    // claim 2: requested 1400, capped at remaining 600 → payout 600, remaining 0
    const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim — multiple items of same type
  it("policy with two swords: insurance sum 2000, cap 4000", () => {
    // 2 swords, dragon attack damages both: each 500-100=400 → payout 800; cap 4000; remaining 3200
    const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damage entries exceeding insured count of that type rejects claim", () => {
    // 1 sword insured, 2 sword damages → reject
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
      }),
    ).toThrow();
  });

  // Claim — errors
  it("claim referencing item not in policy throws an error", () => {
    // sword insured, amulet damage referenced → reject
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // Payout rounding
  it("payout is rounded down (MHPCO favor)", () => {
    // ench 8 sword, damage 901 → 50% = 450.5, -100 = 350.5 → rounded DOWN to 350
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
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
