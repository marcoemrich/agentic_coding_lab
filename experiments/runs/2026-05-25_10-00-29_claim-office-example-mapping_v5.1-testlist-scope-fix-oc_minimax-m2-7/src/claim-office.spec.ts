import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - Base Premiums", () => {
    it("should return 5 G for empty item list (only processing fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }]
      });
      expect(result.results[0].premium).toBe(5);
    });
    it("should return 100 G base premium for a sword (final: 115 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      });
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 60 G base premium for an amulet (final: 71 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }]
      });
      expect(result.results[0].premium).toBe(71);
    });
    it("should return 80 G base premium for a staff (final: 93 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }]
      });
      expect(result.results[0].premium).toBe(93);
    });
    it("should return 40 G base premium for a potion (final: 49 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }]
      });
      expect(result.results[0].premium).toBe(49);
    });
    it("should return 25 G base premium per individual component (rune) (final: 33 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }]
      });
      expect(result.results[0].premium).toBe(33);
    });
    it("should return 25 G base premium per individual component (moonstone) (final: 33 with 10% surcharge + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
      });
      expect(result.results[0].premium).toBe(33);
    });
  });

  describe("Quote - Component Block Discount", () => {
    it("should return 50 G for 2 runes (no block) -- final: 60 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
      });
      expect(result.results[0].premium).toBe(60);
    });
    it("should return 60 G for 3 runes (block applies) -- final: 88 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
      });
      expect(result.results[0].premium).toBe(88);
    });
    it("should return 100 G for 4 runes (no block - block requires exactly 3) -- final: 115 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
      });
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 175 G for 7 runes (no block on remainder) -- final: 198 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
      });
      expect(result.results[0].premium).toBe(198);
    });
    it("should return 75 G for 2 runes + 1 moonstone (different types, no block) -- final: 88 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
      });
      expect(result.results[0].premium).toBe(88);
    });
    it("should return 120 G for 3 runes + 3 moonstones (two separate blocks) -- final: 170 with surcharge+fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }]
      });
      expect(result.results[0].premium).toBe(170);
    });
  });

  describe("Quote - Item-Specific Modifiers", () => {
    it("should add 50% cursed surcharge to sword base premium -- 100 + 50 = 150, then 10% of 100 = 10, + 5 fee = 165", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
      });
      expect(result.results[0].premium).toBe(165);
    });
    it("should add 30% high-enchantment surcharge when enchantment >= 5 -- 100 + 30 = 130, then 10% of 100 = 10, + 5 fee = 145", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
      });
      expect(result.results[0].premium).toBe(145);
    });
    it("should add both cursed and high-enchantment surcharges when applicable (sword, enchantment 5, cursed) -- 100 + 50 + 30 = 180, then 10% of 100 = 10, + 5 fee = 195", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }]
      });
      expect(result.results[0].premium).toBe(195);
    });
  });

  describe("Quote - Policy-Wide Modifiers", () => {
    it("should add 10% first-insurance surcharge to policy base premium -- 100 + 10% + 5 = 115", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      });
      expect(result.results[0].premium).toBe(115);
    });
    it("should apply loyalty discount (20%) for customer with >= 2 years -- 100 - 20% + 10% + 5 = 95", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      });
      expect(result.results[0].premium).toBe(95);
    });
    it("should apply follow-up contract discount (15%) for second quote -- 100 + 10% - 15% + 5 = 100", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] }
        ]
      });
      expect(result.results[1].premium).toBe(100);
    });
    it("should apply first-insurance surcharge to each item in quote regardless of customer history -- loyalty customer but new item still gets 10% surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] }
        ]
      });
      expect(result.results[0].premium).toBe(95);
      expect(result.results[1].premium).toBe(80);
    });
  });

  describe("Quote - Modifier Scope", () => {
    it("should apply cursed surcharge only to cursed item's base premium, not whole policy -- cursed sword 150 + plain amulet 60 = 210, then 10% of 160 = 16, + 5 = 231", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
      });
      expect(result.results[0].premium).toBe(231);
    });
    it("should sum item base premiums before applying policy-wide modifiers", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }]
      });
      expect(result.results[0].premium).toBe(181);
    });
  });

  describe("Quote - Integration Examples", () => {
    it("should return 165 G premium for newcomer with cursed sword (0 years, no previous contract) -- 100 base + 50 curse + 10 first-insurance + 5 fee = 165", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
      });
      expect(result.results[0].premium).toBe(165);
    });
    it("should return 160 G premium for long-standing customer's second contract with cursed sword (enchantment 7) -- 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
        ]
      });
      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("Quote - Rounding", () => {
    it.todo("should round premium up in MHPCO's favor (197.5 G -> 198 G)");
  });

  describe("Quote - Error Cases", () => {
    it("should exit with non-zero status when quote includes unknown item type");
  });

  describe("Claim - Standard Reimbursement", () => {
    it("should return 400 G payout for regular sword (steel, enchantment 3) with 500 G damage -- full reimbursement minus 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(400);
    });
    it("should return 100 G payout for rune with 200 G damage -- full reimbursement minus 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(100);
    });
  });

  describe("Claim - Deductible", () => {
    it("should apply 100 G deductible per damaged item (dragon attack damages sword 500 G and amulet 300 G -> payout 600 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(600);
    });
    it("should apply 100 G deductible per damage event, not per policy");
  });

  describe("Claim - Enchantment >= 8 Clause", () => {
    it("should reimburse at 50% for enchantment >= 8 items before deductible (dragon-material sword, enchantment 8, damage 1000 G -> 400 G payout)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(400);
    });
    it("should apply 50% rule then deductible for enchantment >= 8 (steel sword, enchantment 9, damage 1000 G -> 400 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(400);
    });
    it("should apply 50% rule (enchantment >= 8) even when item is dragon material (dragon-material sword, enchantment 9, damage 1000 G -> 400 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(400);
    });
  });

  describe("Claim - Dragon Material Clause", () => {
    it("should fully reimburse dragon-material items (dragon-material sword, enchantment 5, damage 800 G -> 700 G after deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(700);
    });
    it("should apply dragon material clause before deductible");
  });

  describe("Claim - Cap", () => {
    it("should cap payout at 2x insurance sum for the policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(3200);
    });
    it("should reduce cap after each claim (sword insured, cap 2000 G; first claim 1500 G -> payout 1400 G, cap remaining 600 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
    });
    it("should reduce cap to 0 and limit payout when cap exhausted (second claim 1500 G -> payout 600 G, cap remaining 0 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
        ]
      });
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
  });

  describe("Claim - Cap Exhaustion", () => {
    it.todo("should calculate insurance sum as sum of item insurance values (sword 1000 + amulet 600 = 1600 G)");
    it.todo("should set cap based on unmodified insurance value (cursed sword 1000 G -> cap 2000 G)");
    it.todo("should not raise cap based on premium modifiers");
  });

  describe("Claim - Multiple Items", () => {
    it.todo("should treat each damage entry separately with its own deductible");
    it.todo("should reject claim if damages array contains more entries of a type than insured (exit non-zero)");
  });

  describe("Claim - Rounding", () => {
    it.todo("should round payout down in MHPCO's favor (350.5 G -> 350 G)");
    it.todo("should keep intermediate amounts as fractions; only final payout is rounded");
  });

  describe("Claim - Error Cases", () => {
    it.todo("should exit with non-zero status when claim references item not in policy");
    it.todo("should exit with non-zero status when claim references unknown item type");
    it.todo("should exit with non-zero status when damage amount is negative");
  });

  describe("Full Scenario", () => {
    it.todo("should process multi-step scenario with quote followed by claim");
    it.todo("should track cap remaining across multiple claims on same policy");
  });
});