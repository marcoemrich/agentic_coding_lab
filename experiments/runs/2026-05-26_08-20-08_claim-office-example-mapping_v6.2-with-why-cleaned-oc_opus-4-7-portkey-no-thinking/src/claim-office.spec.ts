import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: simplest scenario
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(5);
  });

  // Base premiums for main items
  it("single sword (no modifiers, 0 years) -> base 100 + first 10 + fee 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(115);
  });
  it("single amulet (no modifiers, 0 years) -> base 60 + first 6 + fee 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(71);
  });
  it("single staff (no modifiers, 0 years) -> base 80 + first 8 + fee 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(93);
  });
  it("single potion (no modifiers, 0 years) -> base 40 + first 4 + fee 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(49);
  });

  // Building block of 3 alike components
  it("2 runes -> base 50 + first 5 + fee 5 = 60 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(60);
  });
  it("3 runes -> base 60 + first 6 + fee 5 = 71 G total (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(71);
  });
  it("4 runes -> base 100 + first 10 + fee 5 = 115 G (no block, requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(115);
  });
  it("7 runes -> base 175 + first 17.5 + fee 5 = 197.5 -> rounded up 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" as const })),
        },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(198);
  });

  // 'Alike' components clarification
  it("2 runes + 1 moonstone -> base 75 + first 7.5 + fee 5 = 87.5 -> 88 G (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(88);
  });
  it("3 runes + 3 moonstones -> base 120 + first 12 + fee 5 = 137 G (two separate blocks)", () => {
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
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(137);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + amulet (newcomer) -> 160 base + 50 curse + 16 first + 5 fee = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(231);
  });

  // Modifier thresholds
  it("customer with exactly 2 years -> loyalty discount (sword: 100 - 20 + 10 + 5 = 95 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(95);
  });
  it("sword enchantment exactly 5 -> high-enchant surcharge (100 + 30 + 10 + 5 = 145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(145);
  });
  it("sword enchantment 5 + cursed -> both surcharges (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(195);
  });
  it("sword enchantment 4 -> no high-enchant surcharge (100 + 10 + 5 = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(115);
  });

  // Standard claim reimbursement
  it("regular sword damage 500 G -> payout 400 G (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("rune damage 200 G -> payout 100 G (no special clauses)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(100);
  });

  // Enchantment threshold vs dragon material
  it("dragon-material sword enchantment 8, damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50% rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (dragon: full)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (high-enchant only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack on sword (500) + amulet (300) -> payout 600 (deductible per item)", () => {
    const result = runScenario({
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
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(600);
  });

  // Multiple items of the same type
  it("two swords policy, both damaged 500 each -> payout 800, remainingCap 3200", () => {
    const result = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });
  it("damages contains more entries of a type than insured -> runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // Cap exhaustion
  it("sword + amulet policy -> small damage uses cap 3200 (small claim shows remaining)", () => {
    // 1000 + 600 = 1600 insurance sum; cap = 3200
    // claim 200 on sword -> payout 100; remainingCap 3100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].remainingCap).toBe(3100);
  });
  it("cursed sword policy -> cap 2000 (unmodified insurance value); claim 200 -> remainingCap 1900", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].remainingCap).toBe(1900);
  });
  it("sword + 3 runes (block) -> insurance sum 1750, cap 3500 (block doesn't affect sum)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].remainingCap).toBe(3400);
  });
  it("sword cap 2000; two claims 1500 each -> 1400+600 (cap exhausts on second)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // Rounding
  it("premium yielding fractional value rounds up (7 runes -> 198 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" as const })),
        },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(198);
  });
  it("payout yielding 350.5 G -> rounded down to 350 G (high-enchant 901 damage)", () => {
    // sword enchant 8, damage 901 -> 901 * 0.5 = 450.5, - 100 = 350.5 -> 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(350);
  });

  // Edge cases (errors)
  it("quote with unknown item type -> runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" as unknown as "sword" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> throws (e.g. amulet damaged when only sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // Integration examples
  it("newcomer cursed sword (steel, enchant 3) -> premium 165 G (integration)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(165);
  });
  it("long-standing 3yr customer 2nd quote, cursed sword (steel, enchant 7) -> 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // First quote (any item)
        { op: "quote", items: [{ type: "sword" }] },
        // Second quote: cursed sword enchant 7
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[1].premium).toBe(160);
  });
});
