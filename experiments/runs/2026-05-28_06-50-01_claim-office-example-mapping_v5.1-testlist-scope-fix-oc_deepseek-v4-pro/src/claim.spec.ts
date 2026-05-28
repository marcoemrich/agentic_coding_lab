import { describe, it, expect } from "vitest";
import { calculatePayout } from "./claim.js";

describe("Claim Payout Calculation", () => {
  it("regular sword (steel, enchantment 3), damage 500 → payout 400 G (500 - 100 deductible)", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("rune damage 200 (no enchantment/material special clauses) → payout 100 G (200 - 100 deductible)", () => {
    const result = calculatePayout(
      [{ type: "rune" }],
      [{ itemType: "rune", amount: 200 }],
      250,
      500,
    );
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  it("dragon material sword enchantment 5, damage 800 → payout 700 G (full reimbursement, then deductible: 800 - 100)", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(700);
  });

  it("steel sword enchantment 9, damage 1000 → payout 400 G (50% rule applies, then deductible: 500 - 100)", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(400);
  });

  it("dragon material sword enchantment 9, damage 1000 → payout 400 G (both clauses, 50% rule wins: 500 - 100)", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(400);
  });

  it("dragon material sword enchantment 8, damage 1000 → payout 400 G (high enchant clause applies, then deductible)", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(400);
  });

  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item: 400 + 200)", () => {
    const result = calculatePayout(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
      1600,
      3200,
    );
    expect(result.payout).toBe(600);
  });

  it("two swords insured, dragon damages both → each has own deductible", () => {
    const result = calculatePayout(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "sword", material: "steel", enchantment: 3 },
      ],
      [
        { itemType: "sword", amount: 300 },
        { itemType: "sword", amount: 300 },
      ],
      2000,
      4000,
    );
    expect(result.payout).toBe(400);
  });

  it("two swords insured but three sword damages claimed → error (more damages than policy covers for that type)", () => {
    expect(() =>
      calculatePayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ],
        [
          { itemType: "sword", amount: 300 },
          { itemType: "sword", amount: 300 },
          { itemType: "sword", amount: 300 },
        ],
        2000,
        4000,
      ),
    ).toThrow();
  });

  it("policy cap: sword insured (cap 2000), two successive claims of 1500 each → first: 1400, cap: 600; second: 600, cap: 0", () => {
    const result1 = calculatePayout(
      [{ type: "sword", enchantment: 3 }],
      [{ itemType: "sword", amount: 1500 }],
      1000,
      2000,
    );
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    const result2 = calculatePayout(
      [{ type: "sword", enchantment: 3 }],
      [{ itemType: "sword", amount: 1500 }],
      1000,
      600,
    );
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });

  it("payout rounding down: 350.5 G → 350 G", () => {
    const result = calculatePayout(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
      1000,
      2000,
    );
    expect(result.payout).toBe(350);
  });
});