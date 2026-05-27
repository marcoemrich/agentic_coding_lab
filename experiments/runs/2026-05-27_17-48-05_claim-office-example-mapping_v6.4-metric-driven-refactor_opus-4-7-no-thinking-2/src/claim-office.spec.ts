import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===== Edge cases / simplest =====
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // ===== Base premiums for main items (newcomer, first contract) =====
  it("quote for plain sword (newcomer) — premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for plain amulet (newcomer) — premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for plain staff (newcomer) — premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for plain potion (newcomer) — premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ===== Components and building blocks =====
  it("2 runes yield 50 G base premium (no block) — total 60 G for newcomer (50 base + 5 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes yield 60 G base premium (block of 3 alike applies) — total 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes yield 100 G base premium (no block — block requires exactly 3) — total 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes yield 175 G base premium (no block formation) — total 198 G", () => {
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
  it("2 runes + 1 moonstone yield 75 G base premium (no block: different types) — total 88 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones yield 120 G base premium (two separate blocks) — total 137 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // ===== Premium modifiers — thresholds and isolation =====
  it("cursed sword (newcomer) adds 50% surcharge — 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 triggers high-enchantment surcharge — 145 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 does not trigger high-enchantment surcharge — 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with exactly enchantment 5 triggers both surcharges — 195 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years receives 20% loyalty discount — plain sword 95 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contracts: first insurance still applies (per item), follow-up discount applies — step 0 = 115, step 1 = 100", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // ===== Modifier scope on multi-item policies =====
  it("cursed sword + plain amulet (newcomer) — total 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 2, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // ===== Rounding (MHPCO's favor) =====
  it("premium calculation that produces fractional value rounds up to whole G (MHPCO's favor)", () => {
    // 1 cursed rune (ench 5) (newcomer, first quote):
    //   base 25 + curse 12.5 + high-ench 7.5 + first insurance 2.5 + fee 5 = 52.5 → 53
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 53 }] });
  });
  it("payout calculation yielding 350.5 G rounds down to 350 G", () => {
    // sword ench 9, damage 901: 901*0.5 = 450.5, -100 = 350.5 → 350
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // ===== Integration: newcomer with cursed sword =====
  // Newcomer cursed sword 165 G is already covered by the "cursed sword (newcomer) — 165 G" test above.

  // ===== Integration: long-standing customer's second contract =====
  it("3-year customer's 2nd quote, cursed sword (steel, ench 7) — premium 160 G", () => {
    // 100 base + 50 curse + 30 high ench + 10 first ins - 20 loyalty - 15 follow-up + 5 fee = 160
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // ===== Claim processing: standard reimbursement =====
  it("regular sword damage 500 G — payout 400 G, remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G — payout 100 G, remainingCap 400 G (no special clause)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // ===== Claim processing: special clauses =====
  it("dragon-material sword, ench 5, damage 800 G — payout 700 G, remainingCap 1300 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9, damage 1000 G — payout 400 G, remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9, damage 1000 G — payout 400 G (50% wins)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exact ench 8, damage 1000 G — payout 400 G (boundary)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ===== Deductible per damage event =====
  it("dragon attack damages sword (500 G) and amulet (300 G) — payout 600 G, remainingCap 2600 G", () => {
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

  // ===== Multiple items of same type =====
  it("policy covers 2 swords — cap 4000 G; damage 3000 G yields payout 2900, remainingCap 1100", () => {
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2900, remainingCap: 1100 });
  });
  it("2 swords, two sword damages (500 G each) — payout 800, remainingCap 3200", () => {
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
  it("claim with more damages of a type than insured throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    })).toThrow();
  });

  // ===== Cap exhaustion =====
  it("policy with sword + amulet — cap 3200 G; damage 1700 sword yields payout 1600, remainingCap 1600", () => {
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
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1700 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1600, remainingCap: 1600 });
  });
  it("cursed sword — cap stays at 2000 G; damage 2500 yields payout 2000 (capped), remainingCap 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy with sword + 3 runes (block) — premium 181 G; cap 3500 G unaffected by block", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1900 }] } },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 181 });
    expect(result.results[1]).toEqual({ payout: 1800, remainingCap: 1700 });
  });
  it("sword cap 2000 G, two successive 1500 G claims — payouts 1400 then 600; remainingCap 600 then 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ===== Error cases =====
  it("quote with unknown item type throws (drives CLI non-zero exit)", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage type not in policy throws (drives CLI non-zero exit)", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    })).toThrow();
  });
  it("claim damage with negative amount throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // ===== Multi-step scenario =====
  it("scenario: quote then claim referencing it by step index — returns both results in order", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});
