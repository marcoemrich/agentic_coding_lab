import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums and processing fee
  it("should return premium of 5 G (processing fee only) for an empty item list", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("should compute premium for a single plain sword (100 G base + 10 G first insurance + 5 G fee = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should compute premium for a single plain amulet (60 + 6 + 5 = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should compute premium for a single plain staff (80 + 8 + 5 = 93 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should compute premium for a single plain potion (40 + 4 + 5 = 49 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Quote: components and blocks
  it("should compute premium for 2 runes (50 G base + 5 G first insurance + 5 G fee = 60 G)", () => {
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
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("should apply block discount for 3 alike runes (60 G base + 6 G first insurance + 5 G fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should not apply block for 4 runes (100 G base + 10 G first insurance + 5 G fee = 115 G)", () => {
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
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should treat 2 runes + 1 moonstone as different types (no block, base 75 G, premium 88 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("should apply two separate blocks for 3 runes + 3 moonstones (120 G base, premium 137 G)", () => {
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
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Quote: premium modifiers
  it("should add 50% curse surcharge on cursed sword (100 base + 50 curse + 10 first ins + 5 fee = 165 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("should add 30% high-enchantment surcharge for enchantment >= 5 (sword e=5: 100 base + 30 high-ench + 10 first ins + 5 fee = 145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("should apply 20% loyalty discount for >=2-year customers (sword 100, -20 loyalty +10 first ins +5 fee = 95)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should apply 15% follow-up discount on contracts after the first (2nd quote: 100 + 10 first ins - 15 follow-up + 5 fee = 100 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("should round premium up in MHPCO's favor (single rune: 25 + 2.5 first ins = 27.5 → ceil 28 + 5 fee = 33 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  // Quote: multi-item policy
  it("should combine cursed sword + plain amulet correctly (newcomer cursed sword example yields 165 G)", () => {
    const cursedSwordOnly = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(cursedSwordOnly.results[0]).toEqual({ premium: 165 });

    const cursedSwordPlusAmulet = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // base sum 160 (100+60), curse 50 (item-specific), first ins 16 (10% of 160 base sum), + 5 fee = 231
    expect(cursedSwordPlusAmulet.results[0]).toEqual({ premium: 231 });
  });
  it("should handle long-standing customer second contract integration example (160 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first ins - 15 follow-up = 155, + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim: basic
  it("should pay damage minus 100 G deductible for a regular sword (500 damage → 400 payout, remaining cap 1600)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay 50% for high-enchantment item (>=8) then deduct 100 G (steel sword e=9, 1000 dmg → 500 - 100 = 400 payout)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should fully reimburse dragon-material items then deduct 100 G (dragon sword e=5, 800 dmg → 800 - 100 = 700 payout)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should apply deductible per damaged item separately (sword 500 + amulet 300 → (500-100) + (300-100) = 600 payout)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
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
  it("should cap total payout at twice the insurance sum (sword 1000 cap 2000; two 1500-dmg claims → 1400 then 600)", () => {
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
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // CLI errors
  it("should reject quote with unknown item type (throws error)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "broomstick" }] },
        ],
      }),
    ).toThrow();
  });
  it("should reject claim referencing item not in policy (throws error)", () => {
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 100 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("should reject claim with negative damage amount (throws error)", () => {
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
              cause: "test",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("should reject claim with more damage entries of a type than policy covers (throws error)", () => {
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
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
