import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";

describe("MHPCO claim processing", () => {
  it("returns zero payout when damage is less than or equal to the 100 G deductible", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 80 }],
      }
    );
    expect(result.payout).toBe(0);
  });
  it("pays out damage minus 100 G deductible for ordinary damage", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 300 }],
      }
    );
    expect(result.payout).toBe(200);
  });
  it("reimburses 50% of damage for items with enchantment >= 8, then deducts", () => {
    const result = claim(
      { items: [{ type: "staff", material: "oak", enchantment: 9, cursed: false }] },
      {
        cause: "fire",
        damages: [{ itemType: "staff", amount: 600 }],
      }
    );
    expect(result.payout).toBe(200);
  });
  it("fully reimburses damage to items made of dragon material, then deducts", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }] },
      {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }
    );
    expect(result.payout).toBe(400);
  });
  it("sums multiple damage entries into one event with one deductible", () => {
    const result = claim(
      {
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      },
      {
        cause: "fire",
        damages: [
          { itemType: "sword", amount: 150 },
          { itemType: "amulet", amount: 100 },
        ],
      }
    );
    expect(result.payout).toBe(150);
  });
});
