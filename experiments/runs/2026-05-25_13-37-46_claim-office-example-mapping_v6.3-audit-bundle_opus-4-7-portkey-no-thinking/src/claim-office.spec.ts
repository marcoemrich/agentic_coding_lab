import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums for main items (each + 5 G fee) ---
  it("quote a plain sword → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("quote a plain amulet → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("quote a plain staff → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("quote a plain potion → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 49 });
  });

  // --- Components and blocks ---
  it("quote 2 runes → 50 G base premium (50 + 5 first-insurance + 5 fee = 60)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("quote 3 runes → 60 G base premium block (60 + 6 first-insurance + 5 fee = 71)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("quote 4 runes → 100 G base premium, no block (100 + 10 first-insurance + 5 fee = 115)", () => {
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
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("quote 7 runes → 175 G base premium (175 + 17.5 first-insurance + 5 fee = 197.5 → rounds up to 198)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("quote 2 runes + 1 moonstone → 75 G base premium (75 + 7.5 first-insurance + 5 fee = 87.5 → rounds up to 88)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("quote 3 runes + 3 moonstones → 120 G base premium (120 + 12 first-insurance + 5 fee = 137)", () => {
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
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds 50% surcharge on its base premium → 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("sword with enchantment 5 adds 30% surcharge → 145 G (100 base + 30 ench + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge → 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 has both surcharges → 195 G (100 base + 50 curse + 30 ench + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 5 }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 195 });
  });

  // --- Policy-wide modifiers ---
  it("long-standing customer (≥ 2 years) gets 20% loyalty discount on policy base", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years gets loyalty discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance carries 10% initial assessment surcharge on policy base", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("second contract gets 15% follow-up discount on policy base", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 100 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → curse on sword only (160 + 50 + 16 first-insurance + 5 fee = 231 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G rounds up to 198 G (MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (0 years, no prev contract, ench 3) → 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 3 }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second cursed enchanted sword (3 yrs, ench 7) → 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 7 }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: basic standard reimbursement ---
  it("regular sword damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G → payout 100 G (no special clause)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword ench 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
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
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
  it("dragon-material sword ench 5, damage 800 G → payout 700 G (full minus deductible)", () => {
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
    expect((out.results[1] as { payout: number }).payout).toBe(700);
  });
  it("steel sword ench 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });
  it("dragon-material sword exactly ench 8, damage 1000 G → payout 400 G", () => {
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
    expect((out.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: per-damage-event deductible ---
  it("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const out = runScenario({
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
    expect((out.results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Claim: rounding ---
  it("payout yielding 350.5 G rounds down to 350 G (MHPCO favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 8 }],
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
    expect((out.results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Claim: cap ---
  it("policy of sword and amulet → insurance sum 1600 G, cap 3200 G", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
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
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)", () => {
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
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword 1500 G claim then 1500 G claim → payouts 1400, 600; cap 600 then 0", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of same type ---
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damages on two-sword policy → each gets own deductible", () => {
    const out = runScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((out.results[1] as { payout: number }).payout).toBe(600);
  });
  it("damages array has more entries of a type than policy covers → CLI errors", () => {
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

  // --- Edge cases / error handling ---
  it("quote with unknown item type → CLI errors non-zero, stderr message, no results", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy → CLI errors", () => {
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
  it("claim damage amount negative → CLI errors", () => {
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
