import { describe, it, expect } from "vitest";
import { calculatePayout } from "./claim.js";

describe("Claim payout calculation", () => {
  it("standard reimbursement: regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const result = calculatePayout({
      policy: {
        items: [{ type: "sword", material: "steel", enchantment: 3, insuranceValue: 1000 }],
      },
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  it("standard reimbursement: rune (insurance value 250 G), damage 200 G -> payout 100 G (runes have no enchantment/material, no special clause)", () => {
    const result = calculatePayout({
      policy: { items: [{ type: "rune", insuranceValue: 250 }] },
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  it("high-enchantment clause: steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% reimbursement first, then deductible: 500 - 100)", () => {
    const result = calculatePayout({
      policy: {
        items: [{ type: "sword", material: "steel", enchantment: 9, insuranceValue: 1000 }],
      },
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("dragon-material clause: dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible: 800 - 100)", () => {
    const result = calculatePayout({
      policy: {
        items: [{ type: "sword", material: "dragon", enchantment: 5, insuranceValue: 1000 }],
      },
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  it("enchantment threshold vs dragon material: dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule wins over full reimbursement, then deductible: 500 - 100)", () => {
    const result = calculatePayout({
      policy: {
        items: [{ type: "sword", material: "dragon", enchantment: 9, insuranceValue: 1000 }],
      },
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (threshold >= 8 applies the high-enchantment clause, not dragon override at this boundary)", () => {
    const result = calculatePayout({
      policy: {
        items: [{ type: "sword", material: "dragon", enchantment: 8, insuranceValue: 1000 }],
      },
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("deductible per damage event: dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> total payout 600 G (100 G deductible applies once per damaged item)", () => {
    const result = calculatePayout({
      policy: {
        items: [
          { type: "sword", insuranceValue: 1000 },
          { type: "amulet", insuranceValue: 600 },
        ],
      },
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  it("multiple items of same type: two swords insured, dragon attack damages both (two separate damage entries for sword) -> each entry treated as separate damage with its own deductible", () => {
    const result = calculatePayout({
      policy: {
        items: [
          { type: "sword", insuranceValue: 1000 },
          { type: "sword", insuranceValue: 1000 },
        ],
      },
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  it("cap exhaustion: sword insured (insurance sum 1000 G, cap 2000 G), two successive claims of 1500 G each -> first claim payout 1400 G remaining cap 600 G, second claim payout 600 G remaining cap 0 G", () => {
    const policy = { items: [{ type: "sword", insuranceValue: 1000 }] };
    const firstClaim = calculatePayout({
      policy,
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(firstClaim.payout).toBe(1400);
    expect(firstClaim.remainingCap).toBe(600);

    const secondClaim = calculatePayout(
      { policy, damages: [{ itemType: "sword", amount: 1500 }] },
      { capAlreadyUsed: 1400 }
    );
    expect(secondClaim.payout).toBe(600);
    expect(secondClaim.remainingCap).toBe(0);
  });

  it("cap based on unmodified insurance value: cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = calculatePayout({
      policy: { items: [{ type: "sword", cursed: true, insuranceValue: 1000 }] },
      damages: [{ itemType: "sword", amount: 5000 }],
    });
    expect(result.payout + result.remainingCap).toBe(2000);
  });

  it("insurance sum with components: policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (1000 + 3x250), cap 3500 G (block discount affects premium only, not insurance sum)", () => {
    const result = calculatePayout({
      policy: {
        items: [
          { type: "sword", insuranceValue: 1000 },
          { type: "rune", insuranceValue: 250 },
          { type: "rune", insuranceValue: 250 },
          { type: "rune", insuranceValue: 250 },
        ],
      },
      damages: [{ itemType: "sword", amount: 10000 }],
    });
    expect(result.payout + result.remainingCap).toBe(3500);
  });

  it("rounding in the MHPCO's favor for payouts: a payout calculation that yields 350.5 G -> final payout 350 G (rounded down)", () => {
    const result = calculatePayout({
      policy: { items: [{ type: "sword", enchantment: 8, insuranceValue: 1000 }] },
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});
