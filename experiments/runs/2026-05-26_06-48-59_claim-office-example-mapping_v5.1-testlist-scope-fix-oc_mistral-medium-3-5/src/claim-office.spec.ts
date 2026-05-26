import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office Kata", () => {
  // ========== BASE PREMIUMS ==========
  describe("Base premiums for main items", () => {
    it("should return 115 G for a plain sword (100 base + 10 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 71 G for a plain amulet (60 base + 6 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("should return 93 G for a plain staff (80 base + 8 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });
    it("should return 49 G for a plain potion (40 base + 4 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(49);
    });
  });

  describe("Base premiums for components", () => {
    it("should return 33 G for a single rune (25 base + 2.5 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(33);
    });
    it("should return 33 G for a single moonstone (25 base + 2.5 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "moonstone" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(33);
    });
    it("should return 60 G for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });
  });

  // ========== BUILDING BLOCKS ==========
  describe("Building block of 3 alike components", () => {
    it("should return 60 G for 2 runes (50 base + 5 first insurance + 5 fee, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });
    it("should return 71 G for 3 runes (60 base + 6 first insurance + 5 fee, block applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });
    it("should return 115 G for 4 runes (100 base + 10 first insurance + 5 fee, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 198 G for 7 runes (175 base + 17.5 first insurance + 5 fee, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array(7).fill({ type: "rune" })
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(198);
    });
  });

  describe("Alike components - different types", () => {
    it("should return 88 G for 2 runes + 1 moonstone (75 base + 7.5 first insurance + 5 fee, no block - different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(88);
    });
    it("should return 137 G for 3 runes + 3 moonstones (120 base + 12 first insurance + 5 fee, two separate blocks)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
            ]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(137);
    });
  });

  // ========== MODIFIER SCOPE ==========
  describe("Modifier scope on multi-item policies", () => {
    it("should apply cursed surcharge only to cursed item: cursed sword (100) + plain amulet (60) = 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "amulet" }
            ]
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(231);
    });
  });

  // ========== MODIFIER THRESHOLDS ==========
  describe("Modifier thresholds", () => {
    it("should apply loyalty discount at exactly 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }]
          }
        ]
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance - 20 loyalty = 90, + 5 fee = 95
      expect(result.results[0].premium).toBe(95);
    });
    it("should apply high-enchantment surcharge at exactly enchantment 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5 }]
          }
        ]
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 30 high enchantment = 140, + 5 fee = 145
      expect(result.results[0].premium).toBe(145);
    });
    it("should apply both cursed and high-enchantment surcharge to same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }]
          }
        ]
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 50% curse + 30% high enchantment = 100 + 10 + 50 + 30 = 190, + 5 fee = 195
      expect(result.results[0].premium).toBe(195);
    });
    it("should not apply high-enchantment surcharge at enchantment 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 4 }]
          }
        ]
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 5 fee = 115 (no high enchantment surcharge)
      expect(result.results[0].premium).toBe(115);
    });
    it("should apply curse surcharge only if cursed", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: false }]
          }
        ]
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 5 fee = 115 (no curse surcharge)
      expect(result.results[0].premium).toBe(115);
    });
  });

  // ========== DEDUCTIBLE ==========
  describe("Deductible per damage event", () => {
    it("should apply 100 G deductible once per damaged item: sword (500) + amulet (300) = 600 G payout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(600);
    });
  });

  // ========== STANDARD REIMBURSEMENT ==========
  describe("Standard reimbursement", () => {
    it("should reimburse regular sword (steel, enchantment 3) damage 500 G as 400 G (full - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
    });
    it("should reimburse rune damage 200 G as 100 G (full - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "rune", amount: 200 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(100);
    });
  });

  // ========== SPECIAL CLAUSES ==========
  describe("Enchantment threshold vs dragon material", () => {
    it("should reimburse dragon-material sword enchantment 9 damage 1000 G as 400 G (50% rule wins, then deductible: 500-100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9 }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
    });
    it("should reimburse dragon-material sword enchantment 5 damage 800 G as 700 G (dragon clause: full - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 800 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(700);
    });
    it("should reimburse steel sword enchantment 9 damage 1000 G as 400 G (high-enchantment clause: 50% then -100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 1000 }
              ]
            }
          }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
    });
  });

  // ========== MULTIPLE ITEMS ==========
  describe("Multiple items of the same type", () => {
    it.todo("should calculate insurance sum 2000 G for two swords");
    it.todo("should calculate cap 4000 G for two swords");
    it.todo("should treat each damage entry as separate with its own deductible");
    it.todo("should exit with error if damages contains more entries than policy covers");
  });

  // ========== CAP EXHAUSTION ==========
  describe("Cap exhaustion", () => {
    it.todo("should calculate insurance sum 1600 G for sword + amulet");
    it.todo("should calculate cap 3200 G for sword + amulet");
    it.todo("should use unmodified insurance value for cap calculation (cursed sword = 2000 G cap)");
    it.todo("should not affect insurance sum by block discount (sword + 3 runes = 1750 G insurance sum)");
    it.todo("should handle successive claims: first claim 1500 G on sword (1000 sum, 2000 cap) -> payout 1400 G, cap remaining 600 G");
    it.todo("should handle successive claims: second claim 1500 G on sword -> payout 600 G, cap remaining 0 G");
  });

  // ========== ROUNDING ==========
  describe("Rounding in MHPCO's favor", () => {
    it.todo("should round up premium 197.5 G to 198 G");
    it.todo("should round down payout 350.5 G to 350 G");
    it.todo("should keep intermediate amounts as fractions, only round final result");
  });

  // ========== EDGE CASES ==========
  describe("Edge cases", () => {
    it.todo("should return 5 G premium for empty item list (only processing fee)");
    it.todo("should exit with error for unknown item type in quote");
    it.todo("should exit with error for claim referencing damage entry not in policy");
    it.todo("should exit with error for claim with unknown item type in damage");
    it.todo("should exit with error for claim with negative damage amount");
  });

  // ========== INTEGRATION EXAMPLES ==========
  describe("Integration examples", () => {
    describe("Newcomer with a cursed sword", () => {
      it("should calculate 165 G premium for cursed sword (0 years, no previous contract): 100 base + 50 curse + 10 first insurance + 5 fee", () => {
        const scenario = {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", cursed: true }]
            }
          ]
        };
        const result = processScenario(scenario);
        // Need to implement first insurance surcharge (10%)
        expect(result.results[0].premium).toBe(165);
      });
    });

    describe("Long-standing customer's second contract", () => {
      it.todo("should calculate 160 G premium for cursed sword (3 years, second quote, enchantment 7): 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee");
    });
  });

  // ========== CLI INPUT/OUTPUT ==========
  describe("CLI input/output format", () => {
    it.todo("should read JSON from stdin and write JSON to stdout");
    it.todo("should handle quote step and return premium");
    it.todo("should handle claim step and return payout and remainingCap");
    it.todo("should process steps sequentially");
    it.todo("should reference policy by zero-based step index");
  });

  // ========== COMPREHENSIVE SCENARIOS ==========
  describe("Comprehensive scenarios", () => {
    it.todo("should handle multi-step scenario with quote followed by claim");
    it.todo("should handle multiple quotes and claims in sequence");
    it.todo("should track remaining cap across multiple claims on same policy");
  });
});
