import { describe, it, expect } from "vitest";
import { computeClaim } from "./claim.js";

describe("Claim", () => {
  // --- Standard reimbursement (no special clauses), simplest first ---
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const result = computeClaim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
      2000
    );
    expect(result.payout).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus deductible; no enchantment/material)", () => {
    const result = computeClaim(
      [{ type: "rune" }],
      [{ itemType: "rune", amount: 200 }],
      500
    );
    expect(result.payout).toBe(100);
  });

  // --- Deductible per damage event ---
  it("dragon attack damages insured sword (500 G) and insured amulet (300 G) -> payout 600 G (100 G deductible applies once per damaged item)", () => {
    const result = computeClaim(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
      2000
    );
    expect(result.payout).toBe(600);
  });

  // --- Enchantment threshold vs. dragon material ---
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule wins over full reimbursement, then deductible: 500-100)", () => {
    const result = computeClaim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      2000
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause: full reimbursement, then deductible: 800-100)", () => {
    const result = computeClaim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
      2000
    );
    expect(result.payout).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause: 50% first, then deductible: 500-100)", () => {
    const result = computeClaim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
      2000
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies at threshold, then deductible)", () => {
    const result = computeClaim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
      2000
    );
    expect(result.payout).toBe(400);
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords, dragon attack damages both (two separate damage entries of itemType sword) -> each treated as separate damage with its own deductible", () => {
    const result = computeClaim(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
      4000
    );
    expect(result.payout).toBe(600);
  });
  it("damages array contains more entries of a given type than policy covers (e.g. two sword damages but only one sword insured) -> rejected with error", () => {
    expect(() =>
      computeClaim(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
        2000
      )
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword insured (insurance sum 1000 G, cap 2000 G); two successive claims of 1500 G each -> first payout 1400 G, remaining cap 600 G", () => {
    const result = computeClaim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 1500 }],
      2000
    );
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second successive 1500 G claim after first claim's cap reduction -> payout 600 G, remaining cap 0 G (desired 1400 G reduced to remaining cap)", () => {
    const result = computeClaim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 1500 }],
      600
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // --- Rounding in the MHPCO's favor ---
  it("payout calculation yielding 350.5 G -> rounds down to 350 G", () => {
    const result = computeClaim(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
      2000
    );
    expect(result.payout).toBe(350);
  });

  // --- Error cases ---
  it("claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only sword insured) -> rejected with error", () => {
    expect(() =>
      computeClaim(
        [{ type: "sword" }],
        [{ itemType: "amulet", amount: 200 }],
        2000
      )
    ).toThrow();
  });
  it("claim references a damage entry with unknown item type -> rejected with error", () => {
    expect(() =>
      computeClaim(
        [{ type: "sword" }],
        [{ itemType: "broomstick", amount: 200 }],
        2000
      )
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 -> rejected with error", () => {
    expect(() =>
      computeClaim(
        [{ type: "sword" }],
        [{ itemType: "sword", amount: -200 }],
        2000
      )
    ).toThrow();
  });
});
