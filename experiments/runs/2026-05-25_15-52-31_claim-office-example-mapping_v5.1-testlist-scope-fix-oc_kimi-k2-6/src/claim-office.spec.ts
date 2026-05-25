import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Quote: empty and single-item base premiums ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("plain sword → 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet → 75 G (60 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 75 }] });
  });
  it("plain staff → 95 G (80 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("plain potion → 55 G (40 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it("1 rune → 40 G (25 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 40 }] });
  });
  it("1 moonstone → 40 G (25 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 40 }] });
  });

  // === Quote: component blocks ===
  it("2 runes → 65 G (50 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("3 runes → 75 G (60 base block + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 75 }] });
  });
  it("4 runes → 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("7 runes → 190 G (175 base + 10 first insurance + 5 fee)", () => {
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
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 190 }] });
  });
  it("2 runes + 1 moonstone → 90 G (75 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 90 }] });
  });
  it("3 runes + 3 moonstones → 135 G (120 base + 10 first insurance + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 135 }] });
  });

  // === Quote: item-specific modifiers ===
  it("cursed sword → 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 (high enchantment) → 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4, not cursed → 115 G (no high-enchantment surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword enchantment 4, cursed → 165 G (only curse surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("cursed sword enchantment 5 → 195 G (100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // === Quote: policy-wide modifiers ===
  it("loyalty discount applies at exactly 2 years → 95 G (100 base + 10 first insurance − 20 loyalty + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge always applies regardless of customer history → plain sword at 3 years is 95 G (with loyalty)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contract discount (second quote step) → 100 G (100 base + 10 first insurance − 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // === Quote: modifier scope and integration ===
  it("cursed sword + plain amulet → cursed surcharge applies only to the cursed item, not the policy total", () => {
    const result = processScenario({
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
    // base: 100 + 60 = 160
    // cursed sword surcharge: 50
    // policy modifiers: 10
    // fee: 5
    // total: 160 + 50 + 10 + 5 = 225
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });
  it("newcomer with cursed sword (0 years, first contract) → 165 G", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract (3 years, 2nd quote) with cursed sword enchantment 7 → 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });

  // === Quote: multiple items and rounding ===
  it("two swords → insurance sum 2000 G, base premium 200 G", () => {
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
      ],
    });
    // base: 100 + 100 = 200
    // modifiers: 10
    // fee: 5
    // total: 200 + 10 + 5 = 215
    expect(result).toEqual({ results: [{ premium: 215 }] });
  });
  it("premium rounding in MHPCO's favor: 52.5 → 53 G (cursed rune)", () => {
    // Cursed rune: 25 base + 12.5 curse surcharge + 10 first insurance + 5 fee = 52.5 → 53
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 53 }] });
  });
  it("unknown item type → throws error", () => {
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

  // === Claim: standard reimbursement ===
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("rune damage 200 G → payout 100 G (full minus 100 deductible)", () => {
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
            damages: [
              { itemType: "rune", amount: 200 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 40 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // === Claim: special clauses ===
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon material: full reimbursement minus deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 800 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% rule then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses: 50% wins, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (50% rule then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // === Claim: deductible per damage event ===
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (100 deductible per damaged item)", () => {
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
    expect(result).toEqual({
      results: [
        { premium: 175 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // === Claim: cap and cap exhaustion ===
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
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
            damages: [
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 175 },
        { payout: 0, remainingCap: 3200 },
      ],
    });
  });
  it("cursed sword policy → cap 2000 G (unmodified insurance value)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 165 },
        { payout: 0, remainingCap: 2000 },
      ],
    });
  });
  it("sword + 3 runes policy → insurance sum 1750 G, cap 3500 G", () => {
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
            damages: [
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 175 },
        { payout: 0, remainingCap: 3500 },
      ],
    });
  });
  it("cap exhaustion: two claims of 1500 G on sword (cap 2000 G) → first 1400 G, second 600 G remaining cap 0 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "first damage",
            damages: [
              { itemType: "sword", amount: 1500 },
            ],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "second damage",
            damages: [
              { itemType: "sword", amount: 1500 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  it("two swords insured, two sword damage entries → each treated as separate damage with own deductible", () => {
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
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // Each sword damage: 500 - 100 deductible = 400, total = 800
    expect(result).toEqual({
      results: [
        { premium: 215 },
        { payout: 800, remainingCap: 3200 },
      ],
    });
  });
  it("more damage entries of a type than policy covers → throws error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("damage to item not in policy → throws error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("unknown item type in damage → throws error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "broomstick", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("negative damage amount → throws error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: -200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("payout rounding in MHPCO's favor: 350.5 → 350 G", () => {
    // Dragon sword enchantment 8, damage 901: 901 * 0.5 = 450.5, minus 100 = 350.5
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 901 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });
});
