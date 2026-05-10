// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO quote - base premiums and processing fee", () => {
  it("quote with empty item list returns premium of 5 G (only the processing fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [],
    });
    expect(result).toBe(5);
  });
  it("quote for a plain sword (no modifiers, no customer history) returns 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword" }],
    });
    expect(result).toBe(115);
  });
  it("quote for a plain amulet returns 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "amulet" }],
    });
    expect(result).toBe(71);
  });
  it("quote for a plain staff returns 93 G (80 + 8 first insurance + 5 fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "staff" }],
    });
    expect(result).toBe(93);
  });
  it("quote for a plain potion returns 49 G (40 + 4 first insurance + 5 fee)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "potion" }],
    });
    expect(result).toBe(49);
  });
  it("quote for a single rune returns 33 G (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "rune" }],
    });
    expect(result).toBe(33);
  });
});

describe("MHPCO quote - components and block-of-3 discount", () => {
  it("quote for 2 runes uses 50 G base premium (no block, requires exactly 3)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "rune" }, { type: "rune" }],
    });
    expect(result).toBe(60);
  });
  it("quote for 3 runes uses 60 G base premium (block applies)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
    });
    expect(result).toBe(71);
  });
  it("quote for 4 runes uses 100 G base premium (no block, block requires exactly 3)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
    });
    expect(result).toBe(115);
  });
  it("quote for 7 runes uses 175 G base premium (no block applies on leftovers beyond 3)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
    });
    expect(result).toBe(198);
  });
  it("quote for 2 runes + 1 moonstone uses 75 G base premium (no block: different types)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
    });
    expect(result).toBe(88);
  });
  it("quote for 3 runes + 3 moonstones uses 120 G base premium (two separate blocks)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ],
    });
    expect(result).toBe(137);
  });
});

describe("MHPCO quote - item-specific modifiers", () => {
  it("cursed sword adds 50% surcharge to that item's base premium only", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", cursed: true }],
    });
    expect(result).toBe(165);
  });
  it("sword with enchantment exactly 5 adds 30% high-enchantment surcharge", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", enchantment: 5 }],
    });
    expect(result).toBe(145);
  });
  it("sword with enchantment 4 does not add high-enchantment surcharge", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", enchantment: 4 }],
    });
    expect(result).toBe(115);
  });
  it("a cursed sword with enchantment 5 applies both surcharges (curse + high enchantment)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", cursed: true, enchantment: 5 }],
    });
    expect(result).toBe(195);
  });
  it("on a multi-item policy, cursed surcharge applies only to the cursed item's base premium (cursed sword + plain amulet → 210 G before fee/policy modifiers)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", cursed: true }, { type: "amulet" }],
    });
    expect(result).toBe(231);
  });
});

describe("MHPCO quote - policy-wide modifiers and processing fee", () => {
  it("customer with exactly 2 years receives 20% loyalty discount on policy base premium", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 2, isFollowUpContract: false },
      items: [{ type: "sword" }],
    });
    expect(result).toBe(95);
  });
  it("customer with less than 2 years does not receive loyalty discount", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 1, isFollowUpContract: false },
      items: [{ type: "sword" }],
    });
    expect(result).toBe(115);
  });
  it("each item in a quote is treated as a first insurance (10% surcharge per item)", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword" }, { type: "amulet" }],
    });
    expect(result).toBe(181);
  });
  it("follow-up contract (customer's second quote in scenario) applies 15% discount on policy base premium", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: true },
      items: [{ type: "sword" }],
    });
    expect(result).toBe(100);
  });
  it("processing fee of 5 G is added at the very end after all modifiers", () => {
    // cursed sword with loyalty (2 years):
    // base 100 + 50 curse surcharge + 10 first insurance - 20 loyalty = 140, + 5 fee = 145
    const result = quote({
      customer: { yearsWithMHPCO: 2, isFollowUpContract: false },
      items: [{ type: "sword", cursed: true }],
    });
    expect(result).toBe(145);
  });
  it("premium is rounded up in MHPCO's favor (197.5 G → 198 G)", () => {
    // 5 runes: base 5*25 = 125, first insurance 12.5, fee 5 → 142.5 → 143
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
    });
    expect(result).toBe(143);
  });
});

describe("MHPCO quote - integration examples from the spec", () => {
  it("newcomer with cursed sword (steel, enchantment 3), 0 years, no previous contract → premium 165 G", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
      items: [{ type: "sword", cursed: true, enchantment: 3, material: "steel" } as any],
    });
    expect(result).toBe(165);
  });
  it("long-standing customer's second contract: cursed sword (steel, enchantment 7), 3 years → premium 160 G", () => {
    const result = quote({
      customer: { yearsWithMHPCO: 3, isFollowUpContract: true },
      items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" } as any],
    });
    expect(result).toBe(160);
  });
});

describe("MHPCO claim - basic reimbursement and deductible", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      incident: { damages: [{ itemType: "sword", amount: 500 }] },
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (200 − 100 deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "rune" }] },
      incident: { damages: [{ itemType: "rune", amount: 200 }] },
    });
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("each damaged item has its own 100 G deductible (sword 500 + amulet 300 → payout 600 G)", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "amulet" }] },
      incident: {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
    });
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("MHPCO claim - special clauses", () => {
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement minus deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      incident: { damages: [{ itemType: "sword", amount: 800 }] },
    });
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% high-enchantment, then deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      incident: { damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with enchantment exactly 8, damage 1000 G → payout 400 G (high-enchantment 50% applies, then deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      incident: { damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with enchantment 9, damage 1000 G → payout 400 G (50% rule wins over dragon material, then deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      incident: { damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO claim - cap and rounding", () => {
  it("policy cap is 2× insurance sum (cursed sword: cap 2000 G regardless of premium modifiers)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", cursed: true }] },
      incident: { damages: [{ itemType: "sword", amount: 2500 }] },
    });
    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("insurance sum for sword + amulet is 1600 G → cap 3200 G", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "amulet" }] },
      incident: { damages: [{ itemType: "sword", amount: 5000 }] },
    });
    expect(result).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("insurance sum for sword + 3 runes is 1750 G (block discount affects premium only, not insurance sum)", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      incident: { damages: [{ itemType: "sword", amount: 4000 }] },
    });
    expect(result).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("first claim of 1500 G on sword (cap 2000) → payout 1400 G, remainingCap 600 G", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }] },
      incident: { damages: [{ itemType: "sword", amount: 1500 }] },
    });
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("second claim of 1500 G on same sword → payout 600 G, remainingCap 0 G (limited by remaining cap)", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }], remainingCap: 600 },
      incident: { damages: [{ itemType: "sword", amount: 1500 }] },
    });
    expect(result).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("payout is rounded down in MHPCO's favor (350.5 G → 350 G)", () => {
    // sword with enchantment 8: high-enchantment 50% applies to claim.
    // damage 901 → halved = 450.5 → minus 100 deductible = 350.5 → floor = 350.
    // remainingCap = cap (2000) − floored payout (350) = 1650.
    const result = claim({
      policy: { items: [{ type: "sword", enchantment: 8 }] },
      incident: { damages: [{ itemType: "sword", amount: 901 }] },
    });
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO claim - multiple items of the same type", () => {
  it("policy with two swords has insurance sum 2000 G and cap 4000 G", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "sword" }] },
      incident: { damages: [{ itemType: "sword", amount: 5000 }] },
    });
    expect(result).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("two sword damages on a policy with two swords → each damage gets its own deductible", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "sword" }] },
      incident: {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      },
    });
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array contains more entries of a type than the policy covers → claim is rejected with an error", () => {
    expect(() =>
      claim({
        policy: { items: [{ type: "sword" }] },
        incident: {
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
      }),
    ).toThrow();
  });
});

describe("MHPCO error cases", () => {
  it("quote with item of unknown type (e.g. broomstick) throws/returns error", () => {
    expect(() =>
      quote({
        customer: { yearsWithMHPCO: 0, isFollowUpContract: false },
        items: [{ type: "broomstick" } as any],
      }),
    ).toThrow();
  });
  it("claim references a damage entry whose item is not part of the policy → throws/returns error", () => {
    expect(() =>
      claim({
        policy: { items: [{ type: "sword" }] },
        incident: { damages: [{ itemType: "amulet", amount: 200 }] },
      }),
    ).toThrow();
  });
  it("claim contains a damage entry with a negative amount → throws/returns error", () => {
    expect(() =>
      claim({
        policy: { items: [{ type: "sword" }] },
        incident: { damages: [{ itemType: "sword", amount: -200 }] },
      }),
    ).toThrow();
  });
});
