import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";
import { computePremium } from "./pricing.js";

describe("computePremium", () => {
  it("sword for first-time customer: 100 base * 1.1 first + 5 fee = 115", () => {
    const p = computePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { yearsWithMHPCO: 0 },
      0,
    );
    expect(p).toBe(115);
  });

  it("amulet for loyal customer (5y): 60 * 0.8 loyalty * 1.1 first + 5 = 57.8 ⇒ 58", () => {
    const p = computePremium(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      { yearsWithMHPCO: 5 },
      0,
    );
    // 60 * (1 - 0.2 + 0.1) = 60 * 0.9 = 54 + 5 = 59
    expect(p).toBe(59);
  });

  it("cursed staff first-time: 80 * 1.5 cursed = 120 * 1.1 first + 5 = 137", () => {
    const p = computePremium(
      [{ type: "staff", material: "oak", enchantment: 0, cursed: true }],
      { yearsWithMHPCO: 0 },
      0,
    );
    // 80 * 1.5 = 120; * 1.1 = 132; + 5 = 137
    expect(p).toBe(137);
  });

  it("highly enchanted potion first-time: 40 * 1.3 = 52; * 1.1 = 57.2; +5 = 62.2 ⇒ 63", () => {
    const p = computePremium(
      [{ type: "potion", material: "glass", enchantment: 7, cursed: false }],
      { yearsWithMHPCO: 0 },
      0,
    );
    expect(p).toBe(63);
  });

  it("3 runes block of 3: 60 base * 1.1 + 5 = 71", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const p = computePremium(items, { yearsWithMHPCO: 0 }, 0);
    // block base 60 * 1.1 = 66 + 5 = 71
    expect(p).toBe(71);
  });

  it("4 runes: block of 3 (60) + 1 single (25) = 85; * 1.1 + 5 = 98.5 ⇒ 99", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const p = computePremium(items, { yearsWithMHPCO: 0 }, 0);
    expect(p).toBe(99);
  });

  it("second contract gets 15% discount (no first surcharge)", () => {
    const p = computePremium(
      [{ type: "sword" }],
      { yearsWithMHPCO: 0 },
      1,
    );
    // 100 * 0.85 = 85 + 5 = 90
    expect(p).toBe(90);
  });
});

describe("scenario", () => {
  it("processes quote + claims with deductible and cap", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 8, cursed: false },
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
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    });
    // amulet insurance sum = 600 ; cap = 1200
    // damage 200, enchant 8 ⇒ 50% = 100 - 100 deductible = 0
    // damage 250, enchant 8 ⇒ 50% = 125 - 100 = 25
    expect(out.results[0]).toEqual({ premium: expect.any(Number) });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(out.results[2]).toEqual({ payout: 25, remainingCap: 1175 });
  });

  it("dragon material is fully reimbursed and cap limits payout", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 1 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    });
    // sword insurance 1000, cap 2000
    // dragon ⇒ full 5000 - 100 = 4900, capped at 2000
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  it("non-enchanted, non-dragon item: no reimbursement", () => {
    const out = runScenario({
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
            cause: "rust",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});
