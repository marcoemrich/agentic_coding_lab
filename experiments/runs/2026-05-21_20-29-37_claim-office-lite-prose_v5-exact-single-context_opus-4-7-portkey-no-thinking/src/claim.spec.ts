import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";

describe("process claim", () => {
  it("returns 0 payout when total damage is below or equal to the deductible", () => {
    const result = claim({
      policyItems: [{ type: "sword" }],
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 50 }],
      },
    });
    expect(result).toBe(0);
  });
  it("subtracts the 100 G deductible from a regular damage amount", () => {
    const result = claim({
      policyItems: [{ type: "sword" }],
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 300 }],
      },
    });
    expect(result).toBe(200);
  });
  it("reimburses dragon-material damage in full (before deductible)", () => {
    const result = claim({
      policyItems: [{ type: "sword", material: "dragon" }],
      incident: {
        cause: "claw",
        damages: [{ itemType: "sword", amount: 500 }],
      },
    });
    // Full reimbursement (interpreted: no deductible cuts in)
    expect(result).toBe(500);
  });
  it("reimburses high-enchantment (>= 8) damage at 50%", () => {
    const result = claim({
      policyItems: [{ type: "amulet", enchantment: 8 }],
      incident: {
        cause: "curse",
        damages: [{ itemType: "amulet", amount: 400 }],
      },
    });
    // 400 * 50% = 200; minus deductible 100 = 100
    expect(result).toBe(100);
  });
  it("sums multiple damages within a single incident, then applies one deductible", () => {
    const result = claim({
      policyItems: [{ type: "sword" }, { type: "amulet" }],
      incident: {
        cause: "fire",
        damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "amulet", amount: 150 },
        ],
      },
    });
    // 200 + 150 = 350 - 100 = 250
    expect(result).toBe(250);
  });
});
