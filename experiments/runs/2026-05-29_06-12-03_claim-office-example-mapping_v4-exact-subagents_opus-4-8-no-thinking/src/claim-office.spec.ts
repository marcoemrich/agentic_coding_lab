import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Quote — base premiums for single main items", () => {
  it("should return premium 105 for a single plain sword (100 base + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword" }] })).toBe(105);
  });
  it("should return premium 65 for a single plain amulet (60 base + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "amulet" }] })).toBe(65);
  });
  it("should return premium 85 for a single plain staff (80 base + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "staff" }] })).toBe(85);
  });
  it("should return premium 45 for a single plain potion (40 base + 5 fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "potion" }] })).toBe(45);
  });
});

describe("Quote — component base premiums and building blocks", () => {
  it("should price a single rune at 25 base premium", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }] })).toBe(30);
  });
  it("should price 2 runes at 50 base premium (no block)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }] })).toBe(55);
  });
  it("should price exactly 3 runes at 60 base premium (block applies)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] })).toBe(65);
  });
  it("should price 4 runes at 100 base premium (no block — block requires exactly 3)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] })).toBe(105);
  });
  it("should price 7 runes at 175 base premium (no block — not exactly 3)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] })).toBe(180);
  });
  it("should price 2 runes + 1 moonstone at 75 base premium (no block: different types)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] })).toBe(80);
  });
  it("should price 3 runes + 3 moonstones at 120 base premium (two separate exactly-3 blocks)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      }),
    ).toBe(125);
  });
});

describe("Quote — item-specific modifiers", () => {
  it("should add 50% curse surcharge to a cursed sword's base premium", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword", cursed: true }] })).toBe(155);
  });
  it("should add 30% high-enchantment surcharge to a sword with enchantment exactly 5", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword", enchantment: 5 }] })).toBe(135);
  });
  it("should not add high-enchantment surcharge to a sword with enchantment 4", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword", enchantment: 4 }] })).toBe(105);
  });
  it("should apply both curse and high-enchantment surcharges to a cursed highly-enchanted sword", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword", cursed: true, enchantment: 5 }] })).toBe(185);
  });
});

describe("Quote — policy-wide modifiers", () => {
  it("should apply 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    expect(quote({ customer: { yearsWithMHPCO: 2 }, items: [{ type: "sword" }] })).toBe(85);
  });
  it("should not apply loyalty discount for a customer with fewer than 2 years", () => {
    expect(quote({ customer: { yearsWithMHPCO: 1 }, items: [{ type: "sword" }] })).toBe(105);
  });
  it("should apply 10% first-insurance surcharge to the policy base premium", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword" }], firstInsurance: true })).toBe(115);
  });
  it("should apply 15% follow-up discount on the customer's second quote in the scenario", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword" }], followUp: true })).toBe(90);
  });
});

describe("Quote — modifier scope on multi-item policies", () => {
  it("should apply curse surcharge only to the cursed item's base premium, not the policy total (cursed sword + plain amulet → 210 before fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "sword", cursed: true }, { type: "amulet" }] })).toBe(215);
  });
});

describe("Quote — rounding", () => {
  it("should round the final premium up to whole G in MHPCO's favor (217.5 → 218)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 2 },
        items: [
          { type: "sword", cursed: true, enchantment: 5 },
          { type: "rune", cursed: true, enchantment: 5 },
        ],
        firstInsurance: true,
      }),
    ).toBe(218);
  });
});

describe("Quote — integration examples", () => {
  it("should compute premium 165 for newcomer's cursed steel sword (enchantment 3, 0 years, first quote)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        firstInsurance: true,
      }),
    ).toBe(165);
  });
  it("should compute premium 160 for long-standing customer's second quote (cursed steel sword enchantment 7, 3 years)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 3 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        firstInsurance: true,
        followUp: true,
      }),
    ).toBe(160);
  });
});

describe("Quote — edge cases", () => {
  it("should return premium 5 for an empty item list (only the processing fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toBe(5);
  });
});

describe("Claim — standard reimbursement (no special clauses)", () => {
  it("should pay out 400 for a regular steel sword (enchantment 3) damaged 500 (damage minus 100 deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should pay out 100 for a rune damaged 200 (no special clause; damage minus deductible)", () => {
    const result = claim(
      { items: [{ type: "rune" }] },
      { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });
});

describe("Claim — high-enchantment and dragon-material clauses", () => {
  it("should pay out 400 for a steel sword enchantment 9 damaged 1000 (50% then deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should pay out 700 for a dragon-material sword enchantment 5 damaged 800 (full then deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
    );
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });
  it("should pay out 400 for a dragon-material sword enchantment 8 damaged 1000 (50% rule wins, then deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should pay out 400 for a dragon-material sword enchantment 9 damaged 1000 (50% rule wins over dragon)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
});

describe("Claim — deductible per damage event", () => {
  it("should apply the deductible once per damaged item (sword 500 + amulet 300 → 600)", () => {
    const result = claim(
      { items: [{ type: "sword" }, { type: "amulet" }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });
  it("should apply a separate deductible to each entry when two swords of the same type are damaged", () => {
    const result = claim(
      { items: [{ type: "sword" }, { type: "sword" }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] },
    );
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });
});

describe("Claim — payout cap", () => {
  it("should base the cap on unmodified insurance values (sword + amulet → cap 3200)", () => {
    const result = claim(
      { items: [{ type: "sword" }, { type: "amulet" }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(3100);
  });
  it("should base the cap on insurance values not block-discounted premium (sword + 3 runes → insurance sum 1750)", () => {
    const result = claim(
      { items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(3400);
  });
  it("should cap the first of two successive claims at the remaining cap (sword cap 2000, claim 1500 → payout 1400, remainingCap 600)", () => {
    const result = claim(
      { items: [{ type: "sword" }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    );
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("should reduce a later claim to the remaining cap (second claim 1500 → payout 600, remainingCap 0)", () => {
    const policy = { items: [{ type: "sword" }] };
    const first = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(
      policy,
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      first.remainingCap,
    );
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("Claim — error cases", () => {
  it("should reject a claim referencing a damage item not in the policy (e.g. amulet damaged when only a sword insured)", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword" }] },
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
      ),
    ).toThrow();
  });
  it("should reject a claim with more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword" }] },
        { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] },
      ),
    ).toThrow();
  });
  it("should reject a claim with an unknown damage item type", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword" }] },
        { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
      ),
    ).toThrow();
  });
  it("should reject a claim with a negative damage amount", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword" }] },
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
      ),
    ).toThrow();
  });
});

describe("Quote — error cases", () => {
  it("should reject a quote containing an item with an unknown type", () => {
    expect(() => quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "broomstick" }] })).toThrow();
  });
});
