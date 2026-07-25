import { describe, it, expect } from "vitest";
import {
  quote,
  claim,
  basePremiumForItems,
  policyBasePremiumWithModifiers,
  createPolicy,
} from "./claim-office.js";

describe("Claim Office - Quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = quote({ yearsWithMHPCO: 0 }, []);
    expect(result.premium).toBe(5);
  });

  // Building block of 3 alike components (raw base premium, no fee/modifiers)
  it("basePremiumForItems: 2 runes -> 50 G", () => {
    const result = basePremiumForItems([{ type: "rune" }, { type: "rune" }]);
    expect(result).toBe(50);
  });
  it("basePremiumForItems: 3 runes -> 60 G (block applies)", () => {
    const result = basePremiumForItems([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result).toBe(60);
  });
  it("basePremiumForItems: 4 runes -> 100 G (no block - requires exactly 3)", () => {
    const result = basePremiumForItems([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result).toBe(100);
  });
  it("basePremiumForItems: 7 runes -> 175 G", () => {
    const result = basePremiumForItems(
      Array.from({ length: 7 }, () => ({ type: "rune" }))
    );
    expect(result).toBe(175);
  });

  // "Alike" components
  it("basePremiumForItems: 2 runes + 1 moonstone -> 75 G (no block: different types)", () => {
    const result = basePremiumForItems([
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ]);
    expect(result).toBe(75);
  });
  it("basePremiumForItems: 3 runes + 3 moonstones -> 120 G (two separate blocks)", () => {
    const result = basePremiumForItems([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ]);
    expect(result).toBe(120);
  });

  // Modifier scope on multi-item policies
  it("policyBasePremiumWithModifiers: cursed sword + plain amulet -> 210 G (item-scoped cursed surcharge)", () => {
    // policy base premium 160 G (100 sword + 60 amulet); cursed surcharge 50 G
    // (50% of the cursed sword's base premium, not of the policy total) -> 210 G
    // before further modifiers and fee.
    const result = policyBasePremiumWithModifiers([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ]);
    expect(result).toBe(210);
  });

  // Modifier thresholds
  it("quote: customer with exactly 2 years with MHPCO -> loyalty discount applies", () => {
    // amulet base 60 G, no curse/enchantment -> policy base premium 60 G
    // loyalty discount -20% of 60 = -12 G; first insurance surcharge +10% of 60 = +6 G
    // (no follow-up discount: this is the customer's first quote)
    // 60 - 12 + 6 = 54 G + 5 G fee = 59 G
    const result = quote({ yearsWithMHPCO: 2 }, [{ type: "amulet" }]);
    expect(result.premium).toBe(59);
  });
  it("policyBasePremiumWithModifiers: sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    // 100 G base + 30% high-enchantment surcharge = 130 G
    const result = policyBasePremiumWithModifiers([
      { type: "sword", enchantment: 5 },
    ]);
    expect(result).toBe(130);
  });
  it("policyBasePremiumWithModifiers: sword with exactly enchantment 5 and cursed -> both surcharges apply", () => {
    // 100 G base + 50% cursed (50) + 30% high-enchantment (30) = 180 G
    const result = policyBasePremiumWithModifiers([
      { type: "sword", enchantment: 5, cursed: true },
    ]);
    expect(result).toBe(180);
  });
  it("policyBasePremiumWithModifiers: sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = policyBasePremiumWithModifiers([
      { type: "sword", enchantment: 4 },
    ]);
    expect(result).toBe(100);
  });
  it("policyBasePremiumWithModifiers: sword with enchantment 4 and cursed -> only curse surcharge applies", () => {
    // 100 G base + 50% cursed (50) = 150 G, no high-enchantment surcharge
    const result = policyBasePremiumWithModifiers([
      { type: "sword", enchantment: 4, cursed: true },
    ]);
    expect(result).toBe(150);
  });

  // Rounding
  it("quote: premium calculation yielding a fractional value -> rounded up (e.g. 27.5 -> 28)", () => {
    // rune base 25; no item modifiers -> policyBase 25
    // loyalty discount (2+ years) -5 (20% of 25); first insurance +2.5 (10% of 25)
    // 25 - 5 + 2.5 + 5 fee = 27.5 -> rounded up to 28
    const result = quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }]);
    expect(result.premium).toBe(28);
  });

  // Edge case: unknown item type
  it("quote: unknown item type -> throws", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])
    ).toThrow();
  });

  // Integration examples
  it("quote: newcomer with cursed sword (0 years, first contract) -> premium 165 G", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    const result = quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ]);
    expect(result.premium).toBe(165);
  });
  it("quote: long-standing customer's second contract with cursed sword (enchantment 7) -> premium 160 G", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    const result = quote(
      { yearsWithMHPCO: 3 },
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      { isFollowUpContract: true }
    );
    expect(result.premium).toBe(160);
  });
});

describe("Claim Office - Claim", () => {
  // Standard reimbursement
  it("claim: regular sword (steel, enchantment 3), damage 500 G -> payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim: damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  // Enchantment threshold vs dragon material
  it("claim: dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule wins, then deductible)", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim: dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause)", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 5 },
    ]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
  it("claim: steel sword, enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 9 },
    ]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim: dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 8 },
    ]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("claim: dragon attack damages insured sword (500 G) and insured amulet (300 G) -> payout 600 G (deductible once per item)", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // Multiple items of the same type
  it("claim: policy covers two swords, two sword damage entries -> each treated as separate damage with own deductible", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
  it("claim: damages array has more entries of a type than policy covers -> claim rejected (throws)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      })
    ).toThrow();
  });

  // Cap exhaustion
  it("createPolicy: cursed sword (insurance value 1000 G) -> cap 2000 G based on unmodified insurance value", () => {
    const policy = createPolicy([{ type: "sword", cursed: true }]);
    expect(policy.cap).toBe(2000);
  });
  it("createPolicy: sword and 3 runes (block) -> insurance sum 1750 G, cap 3500 G (block discount does not affect insurance sum)", () => {
    const policy = createPolicy([
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.cap).toBe(3500);
  });
  it("claim: sword insured (cap 2000 G), two successive claims of 1500 G each -> first 1400/600, second 600/0", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const first = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Rounding
  it("claim: payout calculation yielding a fractional value -> rounded down (e.g. 349.5 -> 349)", () => {
    // dragon-material sword, enchantment 9 -> full reimbursement (rate 1, dragon material doesn't
    // currently alter rate but the high-enchantment 50% clause does not apply here since we
    // need a fractional value from the 50% rate: damage 899 * 0.5 = 449.5, minus 100 deductible = 349.5
    const policy = createPolicy([{ type: "sword", enchantment: 9 }]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 899 }],
    });
    expect(result.payout).toBe(349);
  });

  // Edge cases
  it("claim: damage entry whose item is not part of the policy -> rejected (throws)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      })
    ).toThrow();
  });
  it("claim: damage entry with amount: -200 -> rejected (throws)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      })
    ).toThrow();
  });
});
