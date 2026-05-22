import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // =====================================================
  // QUOTE: Edge case — empty item list
  // =====================================================

  it("should return premium 5 G for an empty item list — only processing fee applies", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // =====================================================
  // QUOTE: Single item base premiums (0-year customer, first quote)
  // First insurance surcharge (+10%) always applies to every quote.
  // Final = base + 10% first insurance + 5 fee
  // =====================================================

  it("should return premium 115 G for a single plain sword (0-year customer) — 100 base + 10 first insurance + 5 fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return premium 71 G for a single plain amulet (0-year customer) — 60 base + 6 first insurance + 5 fee = 71", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return premium 93 G for a single plain staff (0-year customer) — 80 base + 8 first insurance + 5 fee = 93", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("should return premium 49 G for a single plain potion (0-year customer) — 40 base + 4 first insurance + 5 fee = 49", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  it("should return premium 33 G for a single rune (0-year customer) — 25 base + 2.5 first insurance = 27.5, + 5 fee = 32.5, rounded up = 33", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  it("should return premium 33 G for a single moonstone (0-year customer) — 25 base + 2.5 first insurance = 27.5, + 5 fee = 32.5, rounded up = 33", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // =====================================================
  // QUOTE: Building block of 3 alike components
  // Tested with 0-year customer: base + 10% first insurance + 5 fee
  // =====================================================

  it("should return premium 60 G for 2 runes (0-year customer) — base 50 + 5 first insurance + 5 fee = 60", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("should return premium 71 G for 3 runes with block discount (0-year customer) — base 60 + 6 first insurance + 5 fee = 71", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return premium 115 G for 4 runes, no block (0-year customer) — base 100 (block requires exactly 3) + 10 first insurance + 5 fee = 115", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return premium 198 G for 7 runes, no block (0-year customer) — base 175 (not multiple of 3) + 17.5 first insurance = 192.5 + 5 fee = 197.5, rounded up = 198", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // =====================================================
  // QUOTE: "Alike" components — different types do not form blocks
  // =====================================================

  it("should return premium 88 G for 2 runes + 1 moonstone (0-year customer) — base 75 (no block, different types) + 7.5 first insurance = 82.5 + 5 fee = 87.5, rounded up = 88", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("should return premium 137 G for 3 runes + 3 moonstones (0-year customer) — base 120 (two separate blocks) + 12 first insurance + 5 fee = 137", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // =====================================================
  // QUOTE: Cursed item surcharge (+50% on affected item only)
  // =====================================================

  it("should return premium 165 G for newcomer with cursed sword (steel, enchantment 3) — 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // =====================================================
  // QUOTE: High enchantment surcharge (enchantment >= 5, +30%)
  // =====================================================

  it("should apply 30% surcharge for sword with enchantment exactly 5 (0-year customer) — 100 base + 30 enchantment + 10 first insurance = 140 + 5 fee = 145", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("should not apply enchantment surcharge for sword with enchantment 4 (0-year customer) — 100 base + 10 first insurance + 5 fee = 115", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // =====================================================
  // QUOTE: Both cursed and high enchantment on same item
  // =====================================================

  it("should apply both surcharges for cursed sword with enchantment 5 (0-year customer) — 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 fee = 195", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // =====================================================
  // QUOTE: Modifier scope — item-specific vs policy-wide
  // =====================================================

  it("should apply cursed surcharge only to affected item in multi-item policy (0-year customer) — policy base 160, curse +50, first insurance +16 (10% of 160) = 226 + 5 fee = 231", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // =====================================================
  // QUOTE: Loyalty discount (customer >= 2 years, -20% on policy base)
  // =====================================================

  it("should apply 20% loyalty discount for customer with exactly 2 years — sword: 100 base - 20 loyalty + 10 first insurance + 5 fee = 95", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should not apply loyalty discount for customer with 1 year — sword: 100 base + 10 first insurance + 5 fee = 115", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // =====================================================
  // QUOTE: Follow-up contract discount (-15% on each contract after first)
  // =====================================================

  it("should apply 15% follow-up discount on second quote in scenario (0-year customer) — sword: 100 base + 10 first insurance - 15 follow-up = 95 + 5 fee = 100", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // =====================================================
  // QUOTE: Integration — Long-standing customer's second contract
  // =====================================================

  it("should return premium 160 G for 3-year customer on second quote with cursed sword (steel, enchantment 7) — 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { premium: 160 }],
    });
  });

  // =====================================================
  // CLAIM: Standard reimbursement — no special clauses
  // =====================================================

  it("should return payout 400 G for regular sword (steel, enchantment 3) with 500 G damage — full reimbursement minus 100 G deductible", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should return payout 100 G for rune with 200 G damage — full reimbursement minus 100 G deductible", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // =====================================================
  // CLAIM: Deductible per damaged item
  // =====================================================

  it("should apply 100 G deductible per damaged item — sword 500 G + amulet 300 G damage = 400 + 200 = 600 G total payout", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 600, remainingCap: 2600 }],
    });
  });

  // =====================================================
  // CLAIM: Enchantment >= 8 — reimbursed at 50%
  // =====================================================

  it("should reimburse at 50% for steel sword with enchantment 9, damage 1000 G — 500 - 100 deductible = 400 G payout", () => {
    const scenario = {
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
            cause: "accident",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 1600 }],
    });
  });

  // =====================================================
  // CLAIM: Dragon material — fully reimbursed
  // =====================================================

  it("should fully reimburse dragon-material sword with enchantment 5, damage 800 G — 800 - 100 deductible = 700 G payout", () => {
    const scenario = {
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 700, remainingCap: 1300 }],
    });
  });

  // =====================================================
  // CLAIM: Both enchantment >= 8 and dragon material — 50% wins
  // =====================================================

  it("should apply 50% rule when both clauses apply — dragon-material sword, enchantment 9, damage 1000 G — 500 - 100 = 400 G payout", () => {
    const scenario = {
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 1600 }],
    });
  });

  // =====================================================
  // CLAIM: Dragon material with exactly enchantment 8
  // =====================================================

  it("should return payout 400 G for dragon-material sword, enchantment 8, damage 1000 G — 50% rule applies at threshold, 500 - 100 = 400", () => {
    const scenario = {
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 1600 }],
    });
  });

  // =====================================================
  // CLAIM: Rounding — payouts rounded down (in MHPCO's favor)
  // =====================================================

  it("should round payout down — a calculation yielding 350.5 G becomes 350 G", () => {
    const scenario = {
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
            cause: "accident",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // =====================================================
  // CLAIM: Multiple items of the same type
  // =====================================================

  it("should handle two swords in policy — insurance sum 2000 G, cap 4000 G", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 3600 }],
    });
  });

  it("should treat each damage entry for same item type as separate damage with its own deductible", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 600, remainingCap: 3400 }],
    });
  });

  // =====================================================
  // CLAIM: Cap — based on unmodified insurance values
  // =====================================================

  it("should set cap at 3200 G for policy with sword and amulet — insurance sum 1600 G (1000 + 600), cap = 2 x 1600 = 3200", () => {
    const scenario = {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 2800 }],
    });
  });

  it("should set cap at 2000 G for cursed sword — cap based on unmodified insurance value 1000 G, not on premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should set insurance sum to 1750 G for sword + 3 runes — block discount affects premium only, not insurance sum (1000 + 3 x 250 = 1750)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
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
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 400, remainingCap: 3100 }],
    });
  });

  // =====================================================
  // CLAIM: Cap exhaustion — successive claims on same policy
  // =====================================================

  it("should pay 1400 G on first claim of 1500 G damage on sword (cap 2000 G) — 1500 - 100 = 1400 payout, remaining cap 600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "accident",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [expect.any(Object), { payout: 1400, remainingCap: 600 }],
    });
  });

  it("should pay only 600 G on second claim of 1500 G when cap remaining is 600 G — desired 1400 reduced to remaining cap, remaining cap 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "accident",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // =====================================================
  // ERROR: Unknown item type in quote
  // =====================================================

  it("should throw error for unknown item type in quote — e.g. type 'broomstick'", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // =====================================================
  // ERROR: Claim references item not in policy
  // =====================================================

  it("should throw error when claim references item not in policy — e.g. amulet damaged but only sword insured", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
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
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // =====================================================
  // ERROR: More damage entries than policy covers
  // =====================================================

  it("should throw error when damages array has more entries of a type than policy covers — e.g. two sword damages but one sword insured", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
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
    expect(() => processScenario(scenario)).toThrow();
  });

  // =====================================================
  // ERROR: Negative damage amount
  // =====================================================

  it("should throw error for negative damage amount in claim — e.g. amount: -200", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "accident",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
