import { describe, it, expect } from "vitest";
import { calculatePremium } from "./premium.js";
import { calculatePayout } from "./claim.js";

describe("Premium calculation", () => {
  // Edge cases — simplest
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(calculatePremium({ yearsWithMHPCO: 0 }, [], true)).toBe(5);
  });

  // Base premiums for main items (newcomer, no modifiers except first-insurance+fee)
  it("single sword (newcomer) → base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "sword" }], true),
    ).toBe(115);
  });
  it("single amulet (newcomer) → base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], true),
    ).toBe(71);
  });
  it("single staff (newcomer) → base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "staff" }], true),
    ).toBe(93);
  });
  it("single potion (newcomer) → base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    expect(
      calculatePremium({ yearsWithMHPCO: 0 }, [{ type: "potion" }], true),
    ).toBe(49);
  });

  // Component building block base premiums (isolated, before fee/modifiers) —
  // verified via newcomer quotes so we can check the final integer premium
  it("2 runes (newcomer) → base premium 50 G (no block)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }],
        true,
      ),
    ).toBe(60);
  });
  it("3 runes (newcomer) → base premium 60 G (block applies)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        true,
      ),
    ).toBe(71);
  });
  it("4 runes (newcomer) → base premium 100 G (no block — requires exactly 3)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        true,
      ),
    ).toBe(115);
  });
  it("7 runes (newcomer) → base premium 175 G, final premium rounds up to 198 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        Array(7).fill({ type: "rune" }),
        true,
      ),
    ).toBe(198);
  });
  it("2 runes + 1 moonstone (newcomer) → base premium 75 G (no block: different types)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        true,
      ),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones (newcomer) → base premium 120 G (two separate blocks)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        true,
      ),
    ).toBe(137);
  });

  // Item-specific modifiers: cursed, high enchantment
  it("cursed sword (newcomer) → base 100 G + 50 G curse surcharge + 10 G first insurance + 5 G fee = 165 G (newcomer with cursed sword example)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        true,
      ),
    ).toBe(165);
  });
  it("sword with enchantment exactly 5 (newcomer) → high-enchantment surcharge applies: 100 + 30 + 10 + 5 = 145 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", enchantment: 5 }],
        true,
      ),
    ).toBe(145);
  });
  it("sword with enchantment exactly 5, cursed (newcomer) → both surcharges apply: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", enchantment: 5, cursed: true }],
        true,
      ),
    ).toBe(195);
  });
  it("sword with enchantment 4 (newcomer, not cursed) → no high-enchantment surcharge: 100 + 10 + 5 = 115 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", enchantment: 4 }],
        true,
      ),
    ).toBe(115);
  });
  it("sword with enchantment 4, cursed (newcomer) → curse surcharge only: 100 + 50 + 10 + 5 = 165 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", enchantment: 4, cursed: true }],
        true,
      ),
    ).toBe(165);
  });

  // Policy-wide modifier scope on multi-item policies
  it("policy with cursed sword + plain amulet (newcomer) → policy base 160 G, curse surcharge 50 G (on sword's base only, not the policy total), first-insurance 16 G on the 160 G policy base, fee 5 G = 231 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        true,
      ),
    ).toBe(231);
  });

  // Loyalty discount threshold
  it("customer with exactly 2 years with MHPCO, single sword (first contract) → loyalty discount applies: (100 - 20) + 10 first-insurance + 5 fee = 95 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 2 },
        [{ type: "sword" }],
        true,
      ),
    ).toBe(95);
  });

  // Follow-up contract discount + first-insurance-per-item clarification
  it("long-standing customer's second contract: 3 years, cursed sword enchantment 7 → premium 160 G (100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        false,
      ),
    ).toBe(160);
  });

  // Rounding
  it("premium calculation yielding 197.5 G → rounds up to 198 G", () => {
    expect(
      calculatePremium(
        { yearsWithMHPCO: 0 },
        Array(7).fill({ type: "rune" }),
        true,
      ),
    ).toBe(198);
  });

  // Error cases for unknown item type and CLI schema example are covered
  // in cli.spec.ts, since they require process-level stdin/stdout/exit-code behavior.
  it("quote with unknown item type (e.g. broomstick) → throws", () => {
    expect(() =>
      calculatePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "broomstick" }],
        true,
      ),
    ).toThrow();
  });
});

describe("Claim processing", () => {
  // Simplest / standard reimbursement
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 500 }]);
    expect(result.payout).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (full reimbursement minus deductible; no special clause)", () => {
    const policy = [{ type: "rune" }];
    const result = calculatePayout(policy, [{ itemType: "rune", amount: 200 }]);
    expect(result.payout).toBe(100);
  });

  // Special clauses
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause: 50% then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins, then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause: full reimbursement, then deductible)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 800 }]);
    expect(result.payout).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause: 50% then deductible)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages insured sword (500 G) and insured amulet (300 G) → payout 600 G (100 G deductible applies once per damaged item)", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const result = calculatePayout(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  // Multiple items of same type
  it("policy covers two swords; damages array has two sword entries → each treated as separate damage with its own deductible", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    const result = calculatePayout(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });
  it("damages array has more entries of a type than policy covers (e.g. two sword damages but only one sword insured) → throws", () => {
    const policy = [{ type: "sword" }];
    expect(() =>
      calculatePayout(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ]),
    ).toThrow();
  });

  // Cap exhaustion
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 100 }]);
    expect(result.remainingCap).toBe(3200 - 0);
  });
  it("cursed sword (insurance value 1000 G, premium 165 G with modifiers) → cap 2000 G (based on unmodified insurance value)", () => {
    const policy = [{ type: "sword", cursed: true }];
    const result = calculatePayout(policy, []);
    expect(result.remainingCap).toBe(2000);
  });
  it("policy covers sword + 3 runes (a block) → insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    const policy = [
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const result = calculatePayout(policy, []);
    expect(result.remainingCap).toBe(3500);
  });
  it("sword insured (cap 2000 G); two successive claims of 1500 G each → first payout 1400 G, cap remaining 600 G; second payout 600 G, cap remaining 0 G", () => {
    const policy = [{ type: "sword" }];
    const first = calculatePayout(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = calculatePayout(
      policy,
      [{ itemType: "sword", amount: 1500 }],
      first.remainingCap,
    );
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Rounding
  it("payout calculation yielding 350.5 G → rounds down to final payout 350 G", () => {
    const policy = [{ type: "sword", enchantment: 8 }];
    const result = calculatePayout(policy, [{ itemType: "sword", amount: 901 }]);
    expect(result.payout).toBe(350);
  });

  // Error cases for claim
  it("claim references damage entry whose item is not part of the policy (e.g. amulet damaged when only sword insured) → throws", () => {
    const policy = [{ type: "sword" }];
    expect(() =>
      calculatePayout(policy, [{ itemType: "amulet", amount: 200 }]),
    ).toThrow();
  });
  it("claim references damage entry with unknown item type → throws", () => {
    const policy = [{ type: "sword" }];
    expect(() =>
      calculatePayout(policy, [{ itemType: "broomstick", amount: 200 }]),
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 → throws", () => {
    const policy = [{ type: "sword" }];
    expect(() =>
      calculatePayout(policy, [{ itemType: "sword", amount: -200 }]),
    ).toThrow();
  });
});
