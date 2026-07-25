import { describe, it, expect } from "vitest";
import { runScenario, basePremium, itemsPremiumBeforePolicyModifiers, roundPremium, roundPayout } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty item list ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums for main items (single item, no modifiers, newcomer 0 years) ---
  // Note: a single-item quote for a newcomer includes first-insurance surcharge and processing fee.
  // We keep base-premium tests focused via zero-year new customer known amounts.

  // --- Building block of 3 alike components (base premium in isolation) ---
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block, block requires exactly 3)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });

  // --- 'Alike' components ---
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(basePremium(items)).toBe(120);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> 210 G before further modifiers and fee", () => {
    expect(
      itemsPremiumBeforePolicyModifiers([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(210);
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    // plain sword, first contract: base 100 + 10% first insurance - 20% loyalty + 5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    // base 100 + 30% high-enchantment = 130
    expect(itemsPremiumBeforePolicyModifiers([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply", () => {
    // base 100 + 50 curse + 30 high-enchantment = 180
    expect(
      itemsPremiumBeforePolicyModifiers([{ type: "sword", cursed: true, enchantment: 5 }]),
    ).toBe(180);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    // base 100, enchantment below threshold 5, not cursed = 100
    expect(itemsPremiumBeforePolicyModifiers([{ type: "sword", enchantment: 4 }])).toBe(100);
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword -> premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance (10% of base 100) = 160 + 5 fee = 165
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract cursed sword ench 7 -> premium 160 G", () => {
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up = 155 + 5 fee = 160
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    expect(roundPremium(197.5)).toBe(198);
  });

  // --- Standard reimbursement (claims) ---
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250 G), damage 200 G -> payout 100 G", () => {
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
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Enchantment threshold clause ---
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Dragon material clause ---
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(700);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
  it("dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G (high-ench applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible once per item)", () => {
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
    });
    expect((result.results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Payout rounding ---
  it("payout yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    expect(roundPayout(350.5)).toBe(350);
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G; both damaged -> separate deductibles", () => {
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
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damage entries of a type than covered -> claim rejected (non-zero exit)", () => {
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

  // --- Cap ---
  it("sword and amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // payout 100 (200-100); cap 3200 - 100 = 3100 remaining
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // cap unaffected by curse: 1000*2 = 2000; payout 100; remaining 1900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes block -> insurance sum 1750 G", () => {
    const result = runScenario({
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
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750; cap 3500; payout 100; remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("cap exhaustion: two successive 1500 G claims -> 1400 then 600, remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error edge cases ---
  it("quote with unknown item type -> error thrown", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> error thrown", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative amount -> error thrown", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
