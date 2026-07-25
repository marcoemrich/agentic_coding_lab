import { describe, it, expect } from "vitest";
import {
  runScenario,
  calculateItemsBasePremium,
  calculatePolicyBasePremiumWithItemModifiers,
} from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums for main items (no modifiers, established customer to avoid first-insurance surcharge complexity is NOT possible per spec: every item is first insurance regardless -- so we always get the +10% surcharge unless combined with other rules explicitly shown in the spec) ---
  // NOTE: Per spec, every item in a quote is treated as first insurance, so a single-item
  // quote with a newcomer customer (0 years, first quote) always includes the 10% first
  // insurance surcharge. We use the "Newcomer with a cursed sword" example directly, and
  // build up isolated base-premium tests using multi-item policies where the spec gives us
  // a clean base-premium number before modifiers (as in "Modifier scope on multi-item policies").

  // --- Building block of 3 alike components ---
  it("2 runes -> base premium 50 G (no block)", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(base).toBe(50);
  });
  it("3 runes -> base premium 60 G (block applies)", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(base).toBe(60);
  });
  it("4 runes -> base premium 100 G (no block -- block requires exactly 3)", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(base).toBe(100);
  });
  it("7 runes -> base premium 175 G", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(base).toBe(175);
  });

  // --- "Alike" components ---
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types)", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ]);
    expect(base).toBe(75);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const base = calculateItemsBasePremium([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ]);
    expect(base).toBe(120);
  });

  // --- Modifier scope on multi-item policies ---
  it("policy with cursed sword (100 G base) + plain amulet (60 G base) -> curse surcharge applies only to cursed item's base premium (160 G base + 50 G curse = 210 G before further modifiers and fee)", () => {
    const result = calculatePolicyBasePremiumWithItemModifiers([
      { type: "sword", cursed: true },
      { type: "amulet", cursed: false },
    ]);
    expect(result).toBe(210);
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years with MHPCO -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
      ],
    });
    // policyBasePremium (raw base) = 60; no item-level surcharges (not cursed/enchanted);
    // +10% first insurance (10% of raw base) = +6; -20% loyalty (20% of raw base) = -12;
    // 60 + 6 - 12 = 54; + 5 fee = 59
    expect(result.results[0]).toEqual({ premium: 59 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies; if cursed, both surcharges apply", () => {
    const highEnchantedOnly = calculatePolicyBasePremiumWithItemModifiers([
      { type: "sword", enchantment: 5 },
    ]);
    const highEnchantedAndCursed = calculatePolicyBasePremiumWithItemModifiers([
      { type: "sword", enchantment: 5, cursed: true },
    ]);
    // sword base 100; +30% high enchantment = 130
    expect(highEnchantedOnly).toBe(130);
    // sword base 100; +30% high enchantment + 50% curse = 100 + 30 + 50 = 180
    expect(highEnchantedAndCursed).toBe(180);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge; curse surcharge applies only if cursed", () => {
    const plain = calculatePolicyBasePremiumWithItemModifiers([
      { type: "sword", enchantment: 4 },
    ]);
    const cursed = calculatePolicyBasePremiumWithItemModifiers([
      { type: "sword", enchantment: 4, cursed: true },
    ]);
    expect(plain).toBe(100);
    expect(cursed).toBe(150);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G (the 100 G deductible applies once per damaged item)", () => {
    const result = runScenario({
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 600 });
  });

  // --- Standard reimbursement (no special clauses) ---
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible; no special clause applies)", () => {
    const result = runScenario({
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
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus 100 G deductible; runes have no enchantment/material special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
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
    expect(result.results[1]).toMatchObject({ payout: 100 });
  });

  // --- Enchantment threshold vs. dragon material ---
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50% rule wins, then deductible: 500 - 100)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause: full reimbursement, then deductible: 800 - 100)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause: 50% first, then deductible: 500 - 100)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords -> insurance sum 2000 G (= 2x1000), cap 4000 G", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // payout = 500 - 100 = 400; cap = 4000; remainingCap = 4000 - 400 = 3600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("dragon attack damages both swords; damages contains two {itemType: 'sword', ...} entries -> each entry is treated as a separate damage with its own deductible", () => {
    const result = runScenario({
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // each: 500 - 100 = 400; total payout = 800
    expect(result.results[1]).toMatchObject({ payout: 800 });
  });
  it("damages array has more entries of a given type than the policy covers (e.g. two sword damages but only one sword insured) -> rejects the whole claim by throwing", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
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

  // --- Cap exhaustion ---
  it("policy covers a sword and an amulet -> insurance sum 1600 G (= 1000 + 600, the sum of the items' insurance values), cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    // payout = max(0, 100-100) = 0; cap = 3200; remainingCap = 3200
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (based on the unmodified insurance value; premium modifiers do not raise the cap)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    // cap = 1000 * 2 = 2000 (unmodified insurance value); payout = 0
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (= 1000 + 3x250); the block discount affects the premium only, not the insurance sum", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    // cap = (1000 + 3*250) * 2 = 3500; payout = 0
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword insured (insurance sum 1000 G, cap 2000 G); two successive claims of 1500 G each -> first claim payout 1400 G, cap remaining 600 G", () => {
    const result = runScenario({
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
      ],
    });
    // full reimbursement 1500 - 100 deductible = 1400; cap 2000; remainingCap = 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("second successive claim of 1500 G after a first claim of 1500 G -> payout 600 G, cap remaining 0 G (the desired 1400 G is reduced to the remaining cap)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second claim desires 1400 G payout, but only 600 G cap remains
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding in the MHPCO's favor ---
  it("premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
            { type: "rune" },
          ],
        },
      ],
    });
    // rawBase = 100 (sword) + 25 (1 rune) = 125
    // itemModified = (100 + 50 curse + 30 highEnch) + 25 = 205
    // firstInsurance = 125*0.1 = 12.5; loyalty = 125*0.2 = 25
    // total = 205 + 12.5 - 25 + 5 = 197.5 -> rounded up = 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    // 901 * 0.5 = 450.5 - 100 deductible = 350.5, rounded down in MHPCO's favor = 350
    expect(result.results[1]).toMatchObject({ payout: 350 });
  });

  // --- Edge cases ---
  it("quote includes an item with an unknown type (e.g. {type: 'broomstick'}) -> rejected by throwing", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references a damage entry whose item is not part of the policy (e.g. an amulet damaged when only a sword is insured) -> rejected by throwing", () => {
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
  it("claim references a damage entry with an unknown item type -> rejected by throwing", () => {
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
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 -> rejected by throwing", () => {
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

  // --- Integration examples ---
  it("newcomer with a cursed sword (steel, enchantment 3), 0 years, no previous contract -> premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165)", () => {
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
  it("long-standing customer's (3 years) second quote in scenario, cursed sword (steel, enchantment 7) -> premium 160 G (100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up contract = 155 + 5 fee = 160); the first insurance surcharge still applies to the new sword, even though the customer is on a follow-up contract", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

});
