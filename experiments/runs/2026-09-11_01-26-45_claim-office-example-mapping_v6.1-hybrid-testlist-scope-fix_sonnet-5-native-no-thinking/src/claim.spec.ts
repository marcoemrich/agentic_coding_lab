import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";

describe("Claim", () => {
  // Simplest cases / standard reimbursement (no special clauses)
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible; no special clause applies)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
      0
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (full reimbursement minus 100 G deductible; runes have no enchantment level or material, so no special clause applies)", () => {
    const result = claim(
      [{ type: "rune" }],
      [{ itemType: "rune", amount: 200 }],
      0
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // Reimbursement clauses in isolation
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only the high-enchantment clause applies: 50% first, then deductible: 500 - 100)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      0
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only the dragon-material clause applies: full reimbursement, then deductible: 800 - 100)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
      0
    );
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  // Clause combination / thresholds
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
      0
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50% rule wins, then deductible: 500 - 100)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      0
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // Deductible per damage event
  it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G); payout = 600 G (the 100 G deductible applies once per damaged item)", () => {
    const result = claim(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
      0
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  // Multiple items of the same type
  it("policy covers two swords → insurance sum 2000 G (= 2x1000), cap 4000 G", () => {
    const result = claim(
      [{ type: "sword" }, { type: "sword" }],
      [],
      0
    );
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(4000);
  });
  it("dragon attack damages both swords; damages contains two {itemType: 'sword', ...} entries → each entry is treated as a separate damage with its own deductible", () => {
    const result = claim(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
      0
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(3400);
  });
  it("damages array contains more entries of a given type than the policy actually covers (e.g. two sword damages but only one sword insured) → claim is rejected (throws)", () => {
    expect(() =>
      claim(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
        0
      )
    ).toThrow();
  });

  // Cap exhaustion
  it("policy covers a sword and an amulet → insurance sum 1600 G (=1000+600), cap 3200 G", () => {
    const result = claim([{ type: "sword" }, { type: "amulet" }], [], 0);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(3200);
  });
  it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) → cap 2000 G (based on the unmodified insurance value; premium modifiers do not raise the cap)", () => {
    const result = claim([{ type: "sword", cursed: true }], [], 0);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });
  it("policy covers a sword and 3 runes (a block) → insurance sum 1750 G (=1000 + 3x250); the block discount affects the premium only, not the insurance sum", () => {
    const result = claim(
      [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      [],
      0
    );
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(3500);
  });
  it("sword insured (insurance sum 1000 G, cap 2000 G); first claim of 1500 G → payout 1400 G, cap remaining 600 G", () => {
    const result = claim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 1500 }],
      0
    );
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("same sword policy, second successive claim of 1500 G → payout 600 G, cap remaining 0 G (the desired 1400 G is reduced to the remaining cap)", () => {
    const result = claim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 1500 }],
      1400
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // Rounding
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
      0
    );
    expect(result.payout).toBe(350);
    expect(result.remainingCap).toBe(1650);
  });

  // Edge cases / validation
  it("claim references a damage entry whose item is not part of the policy (e.g. an amulet damaged when only a sword is insured) → claim is rejected (throws)", () => {
    expect(() =>
      claim([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }], 0)
    ).toThrow();
  });
  it("claim references a damage entry with an unknown item type → claim is rejected (throws)", () => {
    expect(() =>
      claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 100 }], 0)
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 → claim is rejected (throws)", () => {
    expect(() =>
      claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }], 0)
    ).toThrow();
  });
});
