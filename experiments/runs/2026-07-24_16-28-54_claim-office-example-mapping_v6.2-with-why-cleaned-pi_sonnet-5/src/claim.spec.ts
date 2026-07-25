import { describe, it, expect } from "vitest";
import { computeClaim, computeInsuranceCap } from "./claim.js";

describe("Claim - Payout Calculation", () => {
  // --- Standard reimbursement (no special clauses) ---
  it(
    "regular sword (steel, enchantment 3), damage 500 G -> payout 400 G " +
      "(full reimbursement minus 100 G deductible; no special clause applies)",
    () => {
      const result = computeClaim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [{ itemType: "sword", amount: 500 }],
        2000
      );
      expect(result.payout).toBe(400);
    }
  );
  it(
    "damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G " +
      "(full reimbursement minus 100 G deductible; runes have no enchantment level or material)",
    () => {
      const result = computeClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }], 500);
      expect(result.payout).toBe(100);
    }
  );

  // --- Deductible per damage event ---
  it(
    "dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G " +
      "(100 G deductible applies once per damaged item)",
    () => {
      const result = computeClaim(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
        3200
      );
      expect(result.payout).toBe(600);
    }
  );

  // --- High enchantment clause (>= 8) ---
  it(
    "steel sword, enchantment 9, damage 1000 G -> payout 400 G " +
      "(only high-enchantment clause applies: 50% first, then deductible: 500 - 100)",
    () => {
      const result = computeClaim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
        2000
      );
      expect(result.payout).toBe(400);
    }
  );

  // --- Dragon material clause ---
  it(
    "dragon-material sword, enchantment 5, damage 800 G -> payout 700 G " +
      "(only dragon-material clause applies: full reimbursement, then deductible: 800 - 100)",
    () => {
      const result = computeClaim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }],
        2000
      );
      expect(result.payout).toBe(700);
    }
  );

  // --- Both clauses together (dragon-material wins) ---
  it(
    "dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G " +
      "(both clauses apply; 50% rule wins, then deductible: 500 - 100)",
    () => {
      const result = computeClaim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
        2000
      );
      expect(result.payout).toBe(400);
    }
  );
  it(
    "dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G " +
      "(high-enchantment clause applies at exact threshold, then deductible)",
    () => {
      const result = computeClaim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }],
        2000
      );
      expect(result.payout).toBe(400);
    }
  );

  // --- Multiple items of the same type ---
  it(
    "policy covers two swords, dragon attack damages both (two separate {itemType: 'sword'} damage entries) " +
      "-> each entry treated as a separate damage with its own deductible",
    () => {
      const result = computeClaim(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
        4000
      );
      // (500-100) + (300-100) = 400 + 200 = 600
      expect(result.payout).toBe(600);
    }
  );
  it(
    "damages array contains more entries of a given type than the policy covers " +
      "(e.g. two sword damages but only one sword insured) -> throws an error",
    () => {
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
    }
  );

  // --- Cap exhaustion ---
  it("policy covers a sword and an amulet -> insurance sum 1600 G (1000+600), cap 3200 G", () => {
    const cap = computeInsuranceCap([{ type: "sword" }, { type: "amulet" }]);
    expect(cap).toBe(3200);
  });
  it(
    "cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G " +
      "(based on unmodified insurance value; premium modifiers do not raise the cap)",
    () => {
      const cap = computeInsuranceCap([{ type: "sword", cursed: true }]);
      expect(cap).toBe(2000);
    }
  );
  it(
    "policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (1000 + 3x250); " +
      "block discount affects premium only, not insurance sum",
    () => {
      const cap = computeInsuranceCap([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      // insurance sum 1750, cap 3500
      expect(cap).toBe(3500);
    }
  );
  it(
    "sword insured (insurance sum 1000 G, cap 2000 G); two successive claims of 1500 G each: " +
      "first claim -> payout 1400 G, cap remaining 600 G",
    () => {
      const result = computeClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], 2000);
      // desired payout: 1500 - 100 = 1400; within cap 2000, so full amount applies
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    }
  );
  it(
    "sword insured (insurance sum 1000 G, cap 2000 G); two successive claims of 1500 G each: " +
      "second claim -> payout 600 G, cap remaining 0 G (desired 1400 G reduced to remaining cap)",
    () => {
      // After the first claim, remaining cap is 600 G. Desired payout is again 1400 G,
      // but must be clamped to the 600 G remaining on the cap.
      const result = computeClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], 600);
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    }
  );

  // --- Rounding in the MHPCO's favor ---
  it("payout calculation yielding 350.5 G rounds down to 350 G", () => {
    const result = computeClaim(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
      2000
    );
    // reimbursed = 901 * 0.5 = 450.5, - 100 deductible = 350.5, rounds down to 350
    expect(result.payout).toBe(350);
  });

  // --- Error cases ---
  it(
    "claim references a damage entry whose item is not part of the policy " +
      "(e.g. an amulet damaged when only a sword is insured) -> throws an error",
    () => {
      expect(() =>
        computeClaim([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }], 2000)
      ).toThrow();
    }
  );
  it("claim references a damage entry with an unknown item type -> throws an error", () => {
    expect(() =>
      computeClaim([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }], 2000)
    ).toThrow();
  });
  it("claim contains a damage entry with amount: -200 -> throws an error", () => {
    expect(() =>
      computeClaim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }], 2000)
    ).toThrow();
  });
});
