import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Claim Office - quote (premium)", () => {
  // Fee-only baseline
  it("should charge 5 G (fee only) for an empty item list", () => {
    expect(quote([], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(5);
  });

  // Single main item base premiums + fee
  it("should quote a single sword at 115 G (100 base + 10 first + 5 fee)", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(115);
  });
  it("should quote a single amulet at 71 G (60 base + 6 first + 5 fee)", () => {
    expect(quote([{ type: "amulet" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(71);
  });
  it("should quote a single staff at 93 G (80 base + 8 first + 5 fee)", () => {
    expect(quote([{ type: "staff" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(93);
  });
  it("should quote a single potion at 49 G (40 base + 4 first + 5 fee)", () => {
    expect(quote([{ type: "potion" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(49);
  });

  // Multiple main items sum their base premiums
  it("should sum base premiums for a sword and an amulet to 181 G (160 base + 16 first + 5 fee)", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(181);
  });

  // Component base premiums
  it("should quote a single rune at 33 G (25 base + 2.5 first + 5 fee, rounded up)", () => {
    expect(quote([{ type: "rune" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(33);
  });
  it("should quote 2 runes at 60 G (50 base + 5 first + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(60);
  });

  // Building block of 3 alike components
  it("should quote 3 runes as a block at 71 G (60 base + 6 first + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(71);
  });
  it("should quote 4 runes at 115 G (no block, 100 base + 10 first + 5 fee)", () => {
    expect(
      quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0, isFollowUp: false })
    ).toBe(115);
  });
  it("should quote 7 runes at 198 G (175 base + 17.5 first + 5 fee, rounded up)", () => {
    expect(
      quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { yearsWithMHPCO: 0, isFollowUp: false }
      )
    ).toBe(198);
  });

  // Alike = same type only
  it("should not form a block for 2 runes + 1 moonstone (75 base + 7.5 first + 5 fee = 88 G, rounded up)", () => {
    expect(
      quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], { yearsWithMHPCO: 0, isFollowUp: false })
    ).toBe(88);
  });
  it("should form two separate blocks for 3 runes + 3 moonstones (120 base + 12 first + 5 fee = 137 G)", () => {
    expect(
      quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        { yearsWithMHPCO: 0, isFollowUp: false }
      )
    ).toBe(137);
  });

  // Item-specific modifiers
  it("should add 50% curse surcharge to the cursed item's base premium", () => {
    expect(quote([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(165);
  });
  it("should add 30% high-enchantment surcharge for enchantment >= 5", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(145);
  });
  it("should not add high-enchantment surcharge for enchantment 4", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(115);
  });
  it("should apply both curse and high-enchantment surcharges to a cursed enchantment-5 item", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(195);
  });

  // Modifier scope on multi-item policies
  it("should apply the curse surcharge only to the cursed item, not the whole policy (cursed sword + plain amulet = 210 base before policy modifiers)", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(231);
  });

  // Policy-wide modifiers
  it("should apply 20% loyalty discount for a customer with exactly 2 years", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2, isFollowUp: false })).toBe(95);
  });
  it("should apply 10% first-insurance surcharge to the policy base premium", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(115);
  });
  it("should apply 15% follow-up discount on quotes after the customer's first quote", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0, isFollowUp: true })).toBe(100);
  });

  // Rounding up in MHPCO's favor
  it("should round the final premium up (197.5 G becomes 198 G)", () => {
    expect(
      quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { yearsWithMHPCO: 0, isFollowUp: false }
      )
    ).toBe(198);
  });

  // Integration examples
  it("should quote a newcomer's cursed steel sword (enchantment 3) at 165 G", () => {
    expect(
      quote([{ type: "sword", cursed: true, material: "steel", enchantment: 3 }], { yearsWithMHPCO: 0, isFollowUp: false })
    ).toBe(165);
  });
  it("should quote a 3-year customer's second-quote cursed steel sword (enchantment 7) at 160 G", () => {
    expect(
      quote([{ type: "sword", cursed: true, material: "steel", enchantment: 7 }], { yearsWithMHPCO: 3, isFollowUp: true })
    ).toBe(160);
  });

  // Error case
  it("should reject a quote containing an item with an unknown type", () => {
    expect(() => quote([{ type: "broomstick" }], { yearsWithMHPCO: 0, isFollowUp: false })).toThrow();
  });
});

describe("Claim Office - claim (payout)", () => {
  // Standard reimbursement minus deductible
  it("should pay full damage minus 100 G deductible for a regular item (sword, enchantment 3, damage 500 -> 400)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should pay full damage minus 100 G deductible for a component (rune, damage 200 -> 100)", () => {
    const result = claim(
      [{ type: "rune" }],
      { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] }
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // High-enchantment clause
  it("should reimburse 50% then deduct 100 G for enchantment >= 8 (steel sword, enchantment 9, damage 1000 -> 400)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // Dragon-material clause
  it("should fully reimburse then deduct 100 G for dragon material (dragon sword, enchantment 5, damage 800 -> 700)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] }
    );
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  // Conflict: 50% rule wins over dragon
  it("should apply the 50% rule (not full) when both high-enchantment >= 8 and dragon apply (dragon sword, enchantment 9, damage 1000 -> 400)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // Threshold confirmation
  it("should treat enchantment exactly 8 as high-enchantment (dragon sword, enchantment 8, damage 1000 -> 400)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] }
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // Deductible per damage event
  it("should apply the 100 G deductible once per damaged item (sword 500 + amulet 300 -> 600)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 3 }, { type: "amulet" }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] }
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  // Cap behaviour
  it("should cap total payout at twice the insurance sum", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 3 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 3000 }] }
    );
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });
  it("should share the cap across successive claims and reduce payout to the remaining cap", () => {
    const r1 = claim(
      [{ type: "sword", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
    );
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);

    const r2 = claim(
      [{ type: "sword", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      r1.remainingCap
    );
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  // Rounding down in MHPCO's favor
  it("should round the final payout down (350.5 G becomes 350 G)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] }
    );
    expect(result.payout).toBe(350);
    expect(result.remainingCap).toBe(1650);
  });

  // Error cases
  it("should reject a claim whose damage entry references an item not in the policy", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }
      )
    ).toThrow();
  });
  it("should reject a claim with more damage entries of a type than the policy covers", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 3 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] }
      )
    ).toThrow();
  });
  it("should reject a claim with a negative damage amount", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }
      )
    ).toThrow();
  });
});
