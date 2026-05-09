import { describe, it, expect } from "vitest";
import { processClaim } from "./claim.js";
import { Policy } from "./types.js";

function makePolicy(insuranceSum: number): Policy {
  return {
    items: [],
    insuranceSum,
    remainingCap: 2 * insuranceSum,
  };
}

describe("processClaim", () => {
  describe("deductible", () => {
    it("subtracts 100 G deductible from payout", () => {
      const policy = makePolicy(600);
      const result = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 300 }],
      });
      // 300 - 100 = 200
      expect(result.payout).toBe(200);
    });

    it("returns 0 payout when damage is at or below deductible", () => {
      const policy = makePolicy(600);
      const result = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 100 }],
      });
      expect(result.payout).toBe(0);
    });

    it("returns 0 payout when damage is below deductible", () => {
      const policy = makePolicy(600);
      const result = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 50 }],
      });
      expect(result.payout).toBe(0);
    });
  });

  describe("reimbursement rates", () => {
    it("fully reimburses regular item damage", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "theft",
        damages: [{ itemType: "sword", amount: 500, enchantment: 3, material: "steel" }],
      });
      // 500 × 1.0 - 100 = 400
      expect(result.payout).toBe(400);
    });

    it("reimburses dragon material at 100%", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "battle",
        damages: [{ itemType: "sword", amount: 500, enchantment: 3, material: "dragon" }],
      });
      // dragon → 100%, 500 - 100 = 400
      expect(result.payout).toBe(400);
    });

    it("reimburses high enchantment (≥8) at 50%", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "miscast",
        damages: [{ itemType: "staff", amount: 400, enchantment: 8, material: "oak" }],
      });
      // 400 × 0.5 = 200, 200 - 100 = 100
      expect(result.payout).toBe(100);
    });

    it("applies full reimbursement below enchantment threshold (7)", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "miscast",
        damages: [{ itemType: "staff", amount: 400, enchantment: 7, material: "oak" }],
      });
      // 400 × 1.0 - 100 = 300
      expect(result.payout).toBe(300);
    });

    it("dragon material overrides high enchantment reduction", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "combat",
        damages: [{ itemType: "sword", amount: 400, enchantment: 9, material: "dragon" }],
      });
      // dragon → 100%, 400 - 100 = 300
      expect(result.payout).toBe(300);
    });

    it("handles multiple damage items in one claim", () => {
      const policy = makePolicy(2000);
      const result = processClaim(policy, {
        cause: "disaster",
        damages: [
          { itemType: "sword", amount: 300, enchantment: 3, material: "steel" },
          { itemType: "amulet", amount: 200, enchantment: 0, material: "silver" },
        ],
      });
      // 300 + 200 = 500, 500 - 100 = 400
      expect(result.payout).toBe(400);
    });

    it("defaults to 0 enchantment and empty material when not specified", () => {
      const policy = makePolicy(600);
      const result = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      });
      // default: enchantment=0, material="" → 100%, 200 - 100 = 100
      expect(result.payout).toBe(100);
    });
  });

  describe("policy cap", () => {
    it("caps payout at twice the insurance sum", () => {
      const policy = makePolicy(100);
      // cap = 200
      const result = processClaim(policy, {
        cause: "catastrophe",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      // 500 - 100 = 400, capped at 200
      expect(result.payout).toBe(200);
      expect(result.remainingCap).toBe(0);
    });

    it("reduces remaining cap after each claim", () => {
      const policy = makePolicy(600);
      // cap = 1200
      const first = processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      });
      // 200 - 100 = 100
      expect(first.payout).toBe(100);
      expect(first.remainingCap).toBe(1100);

      const second = processClaim(policy, {
        cause: "spell mishap",
        damages: [{ itemType: "amulet", amount: 250 }],
      });
      // 250 - 100 = 150, remaining cap = 1100
      expect(second.payout).toBe(150);
      expect(second.remainingCap).toBe(950);
    });

    it("caps second claim to remaining cap", () => {
      const policy = makePolicy(200);
      // cap = 400
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 350 }],
      });
      // first: 350 - 100 = 250, capped at 400 → 250, remaining = 150

      const second = processClaim(policy, {
        cause: "theft",
        damages: [{ itemType: "amulet", amount: 400 }],
      });
      // second: 400 - 100 = 300, capped at 150 → 150, remaining = 0
      expect(second.payout).toBe(150);
      expect(second.remainingCap).toBe(0);
    });
  });

  describe("rounding", () => {
    it("rounds payout down in MHPCO's favor for high enchantment fractional amounts", () => {
      const policy = makePolicy(1000);
      const result = processClaim(policy, {
        cause: "miscast",
        damages: [{ itemType: "staff", amount: 401, enchantment: 8, material: "oak" }],
      });
      // 401 × 0.5 = 200.5, 200.5 - 100 = 100.5, floor = 100
      expect(result.payout).toBe(100);
    });
  });
});
