import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items (single item, no modifiers, 1st-time customer with no prior contract) ---
  // For these isolated base-premium tests we expect: base + 10% first insurance + 5 fee, rounded up in MHPCO's favor.
  it("quote for a single plain sword (steel, enchantment 3) → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a single plain amulet → 60 base + 6 first-insurance + 5 fee = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for a single plain staff → 80 base + 8 first-insurance + 5 fee = 93 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for a single plain potion → 40 base + 4 first-insurance + 5 fee = 49 G", () => {
    const result = processScenario({
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

  // --- Component base premiums and blocks of 3 alike ---
  it("2 runes → 50 base + 5 first-insurance + 5 fee = 60 G", () => {
    const result = processScenario({
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
  it("3 runes → 60 base (block) + 6 first-insurance + 5 fee = 71 G", () => {
    const result = processScenario({
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
  it("4 runes → 100 base (no block) + 10 first-insurance + 5 fee = 115 G", () => {
    const result = processScenario({
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
  it("7 runes → 175 base + 17.5 first-insurance + 5 fee = 197.5 → 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 base + 7.5 first-insurance + 5 fee = 87.5 → 88 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 base (two blocks) + 12 first-insurance + 5 fee = 137 G", () => {
    const result = processScenario({
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

  // --- Premium modifiers in isolation (newcomer scenarios anchor expected totals) ---
  it("newcomer with a cursed sword (steel, ench 3) → 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
    const result = processScenario({
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
  it("sword (ench 4, not cursed) → no high-enchantment surcharge → 115 G", () => {
    const result = processScenario({
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
  it("sword (ench 5, not cursed) → 100 + 30 high-ench + 10 first + 5 fee = 145 G", () => {
    const result = processScenario({
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
  it("cursed sword (ench 5) → 100 + 50 curse + 30 high-ench + 10 first + 5 fee = 195 G", () => {
    const result = processScenario({
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

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → 160 base + 50 curse (sword only) + 16 first-insurance + 5 fee = 231 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Loyalty / first insurance / follow-up modifiers ---
  it("2-year customer with a plain sword → 100 + 10 first − 20 loyalty + 5 fee = 95 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("long-standing customer's second contract: cursed sword enchantment 7 → premium 160 G (integration example; first insurance surcharge still applies per item)", () => {
    const result = processScenario({
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
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding in MHPCO's favor ---
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(350);
  });

  // --- Claim processing: deductibles and standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (full reimbursement minus 100 G deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(100);
  });
  it("dragon attack damages an insured sword (500 G) and amulet (300 G) → payout 600 G (100 G deductible per damaged item)", () => {
    const result = processScenario({
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(600);
  });

  // --- Claim processing: special clauses ---
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(400);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies first, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(400);
  });

  // --- Multiple items of same type and cap exhaustion ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G; dragon attack damages both → each entry treated as separate damage with its own deductible", () => {
    const result = processScenario({
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number }> }).results[1].payout).toBe(600);
  });
  it("policy covers a sword and an amulet → insurance sum 1600 G, cap 3200 G (verified via remainingCap after a 200 G claim → 3100 G)", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1]).toEqual({
      payout: 100,
      remainingCap: 3100,
    });
  });
  it("cursed sword (insurance value 1000 G) → cap 2000 G (based on unmodified insurance value; verified via remainingCap after a 200 G claim → 1900 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1]).toEqual({
      payout: 100,
      remainingCap: 1900,
    });
  });
  it("policy covers a sword and 3 runes (block) → insurance sum 1750 G (block discount affects premium only, not insurance sum; verified via remainingCap after a 200 G claim → 3400 G of a 3500 G cap)", () => {
    const result = processScenario({
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1]).toEqual({
      payout: 100,
      remainingCap: 3400,
    });
  });
  it("sword insured (cap 2000 G); first claim 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1]).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("sword insured (cap 2000 G); after first 1500 G claim, second claim 1500 G → payout 600 G, remainingCap 0 G", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect((result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[2]).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- Error/edge cases ---
  it("quote includes an item with an unknown type → throws an error (CLI exits non-zero)", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      }),
    ).toThrow();
  });
  it("claim references a damage entry whose item is not part of the policy → throws an error", () => {
    expect(() =>
      processScenario({
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim has more damage entries of a given type than the policy covers → throws an error", () => {
    expect(() =>
      processScenario({
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 → throws an error", () => {
    expect(() =>
      processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
