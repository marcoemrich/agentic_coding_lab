import { describe, it, expect } from "vitest";
import { quote, claim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  // Quote tests - base functionality
  it("should return 5 G for empty item list (processing fee only)", () => {
    const result = quote({ yearsWithMHPCO: 0 }, []);
    expect(result).toBe(5);
  });
  it("should calculate quote for single sword", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    expect(result).toBe(105);
  });
  it("should calculate quote for single amulet", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]);
    expect(result).toBe(65);
  });
  it("should calculate quote for single rune component", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }]);
    expect(result).toBe(30);
  });
  it("should calculate quote for multiple different items", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false }
    ]);
    expect(result).toBe(165);
  });
  it("should apply building block discount for exactly 3 alike components", () => {
    const result = quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" }
    ]);
    expect(result).toBe(65);
  });

  // Claim tests - base functionality
  it("should calculate basic payout with 100G deductible", () => {
    const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim({ yearsWithMHPCO: 0 }, 0, {
      damages: [{ itemType: "sword", amount: 500 }]
    });
    expect(result.payout).toBe(400);
  });
  it("should cap payout at twice the insurance sum", () => {
    const result = claim({ yearsWithMHPCO: 0 }, 0, {
      damages: [{ itemType: "sword", amount: 2500 }]
    });
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });
});
