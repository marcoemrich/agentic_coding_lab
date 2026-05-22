import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / minimal quote ---
  it("empty item list quote returns premium 5 G (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(5);
  });

  // --- Single main items, no modifiers (base + 10% first insurance + 5G fee) ---
  // Note: each item in a quote is treated as a first insurance (per spec clarification).
  it("quote with one plain sword returns 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(115);
  });
  it("quote with one plain amulet returns 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "amulet" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(71);
  });
  it("quote with one plain staff returns 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "staff" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(93);
  });
  it("quote with one plain potion returns 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "potion" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(49);
  });

  // --- Component base premiums (block-of-3 rule) ---
  it("quote with 2 runes returns base premium 50 G before policy modifiers/fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    const { results } = runScenario(scenario);
    expect((results[0] as { premium: number }).premium).toBe(60);
  });
  it("quote with 3 runes applies block-of-3: base premium 60 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(71);
  });
  it("quote with 4 runes does NOT apply block (requires exactly 3): base premium 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(115);
  });
  it("quote with 7 runes returns base premium 175 G (spec: 7 runes → 175 G; block requires exactly 3 alike)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
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
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(198);
  });

  // --- "Alike" components (clarification: same type, not family) ---
  it("quote with 2 runes + 1 moonstone: no block applies (different types), base premium 75 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(88);
  });
  it("quote with 3 runes + 3 moonstones: two separate blocks, base premium 120 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
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
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(137);
  });

  // --- Item-level modifiers in isolation ---
  it("cursed sword adds 50% curse surcharge on the item's base premium (50 G on a sword)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword", cursed: true }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(165);
  });
  it("sword with enchantment exactly 5 adds 30% high-enchantment surcharge (30 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(145);
  });
  it("sword with enchantment 4 does NOT add high-enchantment surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(115);
  });
  it("cursed sword with enchantment 5 stacks both surcharges (+50 G curse + 30 G high-ench)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(195);
  });

  // --- Policy-level modifiers in isolation ---
  it("customer with exactly 2 years receives 20% loyalty discount on policy base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ type: "quote", items: [{ type: "sword" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(95);
  });
  it("customer with less than 2 years does NOT receive loyalty discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ type: "quote", items: [{ type: "sword" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(115);
  });
  it("second quote in scenario applies 15% follow-up contract discount to policy base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { type: "quote", items: [{ type: "sword" }] },
        { type: "quote", items: [{ type: "sword" }] },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(115);
    expect(results[1].premium).toBe(100);
  });

  // --- Multi-item policy: modifier scope (❓ resolved) ---
  it("policy with cursed sword + plain amulet: curse adds 50 G (50% of sword base only), totalling 231 G (100+60 base + 50 curse + 16 first-ins + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(231);
  });

  // --- Integration example: Newcomer with cursed sword ---
  it("newcomer (0 years) with cursed sword (steel, ench 3) → premium 165 G (100 base + 50 curse + 10 first-ins + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(165);
  });

  // --- Integration example: Long-standing customer's second contract ---
  it("3-year customer's second quote with cursed sword (ench 7) → premium 160 G (100 + 50 curse + 30 high-ench − 20 loyalty + 10 first-ins − 15 follow-up + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { type: "quote", items: [{ type: "sword" }] },
        {
          type: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[1].premium).toBe(160);
  });

  // --- Rounding (premium rounded UP) ---
  it("premium yielding 197.5 G rounds UP to 198 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
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
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(198);
  });
  it("intermediate fractional amounts are kept; only the final premium is rounded", () => {
    // Single rune, customer 0 years, two quotes.
    // Step 1 calculation: base 25 + first-ins 2.5 - follow-up 3.75 + fee 5 = 28.75 → ceil = 29
    // A naive impl rounding each intermediate (e.g., ceil first-ins to 3, ceil follow-up to 4)
    // would yield 25 + 3 - 4 + 5 = 29 (same), but rounding follow-up DOWN to 3 would yield 30.
    // Keeping fractions ensures consistent 29.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { type: "quote", items: [{ type: "rune" }] },
        { type: "quote", items: [{ type: "rune" }] },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[1].premium).toBe(29);
  });

  // --- Claim: basic deductible ---
  it("claim: regular sword (steel, ench 3) damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "training accident",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(400);
  });
  it("claim: rune damage 200 G → payout 100 G (full reimbursement minus deductible; no enchantment/material on runes)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "rune" }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(100);
  });

  // --- Claim: enchantment ≥ 8 → 50% reimbursement ---
  it("claim: steel sword ench 9, damage 1000 G → payout 400 G (500 minus 100 deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(400);
  });
  it("claim: dragon sword ench 8, damage 1000 G → payout 400 G (high-ench clause applies first, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: dragon material → full reimbursement ---
  it("claim: dragon sword ench 5, damage 800 G → payout 700 G (dragon clause only: full reimbursement minus deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(700);
  });
  it("claim: dragon sword ench 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("claim: dragon attack damages insured sword (500 G) and amulet (300 G) → payout 600 G (deductible applied once per damaged item)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          type: "claim",
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
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Claim: multiple items of the same type ---
  it("policy with two swords: insurance sum is 2000 G (2 × 1000) — tested indirectly via premium 225 G (200 base + 20 first-ins + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ type: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    };
    const { results } = runScenario(scenario);
    expect(results[0].premium).toBe(225);
  });
  it("claim with two sword damages against a 2-sword policy: each entry is its own damage with its own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Payout rounding (rounded DOWN) ---
  it("payout yielding 350.5 G rounds DOWN to 350 G", () => {
    // sword with enchantment 8 triggers 50% rule
    // 901 * 0.5 = 450.5, minus 100 deductible = 350.5, floor to 350
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          type: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect((results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Error / edge cases (CLI behaviour) ---
  it("quote with unknown item type (e.g. broomstick) exits non-zero with stderr message and no results", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ type: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not in the policy (e.g. amulet damaged when only sword insured) exits non-zero with stderr message", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "monster attack",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount (e.g. -200) exits non-zero with stderr message", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "training accident",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with more damages of a type than the policy covers (e.g. 2 sword damages, 1 sword insured) exits non-zero, whole claim rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "battle",
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

  // --- CLI scenario integration ---
  it("scenario with a quote step followed by a claim step referencing it by policy index returns results array of matching length and order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { type: "quote", items: [{ type: "sword" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "training accident",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toHaveLength(2);
    expect(results[0]).toHaveProperty("premium");
    expect(results[1]).toHaveProperty("payout");
  });
});
