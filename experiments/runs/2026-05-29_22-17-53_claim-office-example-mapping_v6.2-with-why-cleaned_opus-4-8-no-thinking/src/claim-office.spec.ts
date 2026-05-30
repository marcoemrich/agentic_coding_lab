import { describe, it, expect } from "vitest";
import { quote, claim, buildPolicy } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums for single main items ---
  it("quote: empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toBe(5);
  });
  it("quote: single sword (steel, ench 3), 0 yrs first quote → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      })
    ).toBe(115);
  });
  it("quote: single amulet, 0 yrs first quote → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "amulet" }] })
    ).toBe(71);
  });
  it("quote: single staff, 0 yrs first quote → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "staff" }] })
    ).toBe(93);
  });
  it("quote: single potion, 0 yrs first quote → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "potion" }] })
    ).toBe(49);
  });

  // --- Quote: components and building blocks (base premiums; first insurance applies to policy base) ---
  it("quote: 2 runes, 0 yrs first quote → base 50 G → premium 60 G (50 + 5 first insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }],
      })
    ).toBe(60);
  });
  it("quote: 3 runes, 0 yrs first quote → base 60 G (block applies) → premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(71);
  });
  it("quote: 4 runes, 0 yrs first quote → base 100 G (no block, exactly 3 required) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(115);
  });
  it("quote: 7 runes, 0 yrs → base 175 G (no block, 7≠3, 7×25) → premium 198 G (175 + 17.5 first + 5 fee, rounded up)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ],
      })
    ).toBe(198);
  });
  it("quote: 2 runes + 1 moonstone, 0 yrs → base 75 G (no block, different types) → premium 88 G (75 + 7.5 first + 5 fee, ceil)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      })
    ).toBe(88);
  });
  it("quote: 3 runes + 3 moonstones, 0 yrs → base 120 G (two separate blocks) → premium 137 G (120 + 12 first + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      })
    ).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("quote: cursed sword (ench 3), 0 yrs first quote → base 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toBe(165);
  });
  it("quote: sword with exactly enchantment 5, 0 yrs → +30% high-enchantment surcharge → premium 145 G (100 + 30 high-ench + 10 first + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      })
    ).toBe(145);
  });
  it("quote: sword with enchantment 4, 0 yrs → no high-enchantment surcharge → premium 115 G (100 + 10 first + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      })
    ).toBe(115);
  });
  it("quote: cursed sword with enchantment 5, 0 yrs → both surcharges → premium 195 G (100 + 50 curse + 30 high-ench + 10 first + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      })
    ).toBe(195);
  });

  // --- Quote: policy-wide modifiers ---
  it("quote: loyalty discount applies at exactly 2 years (-20% of policy base) → premium 95 G (100 + 10 first - 20 loyalty + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      })
    ).toBe(95);
  });
  it("quote: first insurance surcharge (+10%) applies to a first contract (0 yrs plain sword) → premium 115 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      })
    ).toBe(115);
  });
  it("quote: follow-up contract discount (-15%) applies to the second quote in a scenario (0 yrs plain sword) → premium 100 G (100 + 10 first - 15 follow-up + 5 fee)", () => {
    expect(
      quote(
        {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        { isFollowUp: true }
      )
    ).toBe(100);
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("quote: cursed sword (100) + plain amulet (60), 0 yrs → base 160; curse +50 (50% of sword); first +16 (10% of 160) → premium 231 G (160 + 50 + 16 + 5)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      })
    ).toBe(231);
  });

  // --- Quote: rounding ---
  it("quote: premium of 197.5 G rounds UP to 198 G (MHPCO's favor) — 7 runes, 0 yrs", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ],
      })
    ).toBe(198);
  });

  // --- Quote: integration examples ---
  it("quote integration: newcomer (0 yrs, first contract) cursed sword (steel, ench 3) → 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toBe(165);
  });
  it("quote integration: long-standing (3 yrs), 2nd quote, cursed sword (steel, ench 7) → 160 G (100 + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up + 5 fee)", () => {
    expect(
      quote(
        {
          customer: { yearsWithMHPCO: 3 },
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
        { isFollowUp: true }
      )
    ).toBe(160);
  });

  // --- Claim: standard reimbursement ---
  it("claim: regular sword (steel, ench 3), damage 500 → payout 400 G (full minus 100 deductible)", () => {
    expect(
      claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          remainingCap: 2000,
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }
      )
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: rune (value 250), damage 200 → payout 100 G (full minus 100 deductible, no special clause)", () => {
    expect(
      claim(
        { items: [{ type: "rune" }], remainingCap: 500 },
        { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] }
      )
    ).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("claim: high-enchantment (≥8) sword, ench 8, dragon material, damage 1000 → payout 400 G (50% rule, then deductible)", () => {
    expect(
      claim(
        {
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          remainingCap: 2000,
        },
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }
      )
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, ench 9, damage 1000 → payout 400 G (both clauses, 50% wins, then deductible)", () => {
    expect(
      claim(
        {
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          remainingCap: 2000,
        },
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }
      )
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, ench 5, damage 800 → payout 700 G (dragon full reimbursement, then deductible)", () => {
    expect(
      claim(
        {
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          remainingCap: 2000,
        },
        { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] }
      )
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: steel sword, ench 9, damage 1000 → payout 400 G (high-enchantment 50% first, then deductible)", () => {
    expect(
      claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          remainingCap: 2000,
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }
      )
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("claim: dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per item)", () => {
    expect(
      claim(
        {
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
          remainingCap: 3200,
        },
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        }
      )
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap and insurance sum ---
  it("claim: sword + amulet → insurance sum 1600, cap 3200", () => {
    expect(
      buildPolicy([{ type: "sword" }, { type: "amulet" }]).remainingCap
    ).toBe(3200);
  });
  it("claim: two swords → insurance sum 2000, cap 4000; two damage entries each own deductible", () => {
    const policy = buildPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ]);
    expect(policy.remainingCap).toBe(4000);
    expect(
      claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      })
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim: cursed sword → cap 2000 based on unmodified insurance value (modifiers do not raise cap)", () => {
    expect(
      buildPolicy([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]).remainingCap
    ).toBe(2000);
  });
  it("claim: sword + 3 runes (block) → insurance sum 1750 (block discount affects premium only, not insurance sum); cap 3500", () => {
    expect(
      buildPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]).remainingCap
    ).toBe(3500);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("claim: sword (cap 2000), first claim 1500 → payout 1400, remaining cap 600", () => {
    expect(
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
      )
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("claim: sword (cap 2000), second claim 1500 → payout 600 (reduced to remaining cap), remaining cap 0", () => {
    expect(
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 600 },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
      )
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding ---
  it("claim: payout of 350.5 G rounds DOWN to 350 G (MHPCO's favor) — high-ench sword ench 8, damage 901 → 0.5×901−100=350.5 → 350", () => {
    expect(
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }], remainingCap: 2000 },
        { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] }
      )
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Error / edge cases ---
  it("error: quote includes an unknown item type (e.g. broomstick) → throws / rejected", () => {
    expect(() =>
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "broomstick" }] })
    ).toThrow();
  });
  it("error: claim references a damage item not in the policy (e.g. amulet when only sword insured) → rejected", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }
      )
    ).toThrow();
  });
  it("error: claim has more damage entries of a type than the policy covers (two sword damages, one sword insured) → rejected", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 100 },
            { itemType: "sword", amount: 100 },
          ],
        }
      )
    ).toThrow();
  });
  it("error: claim has a damage entry with negative amount (-200) → rejected", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }
      )
    ).toThrow();
  });
});
