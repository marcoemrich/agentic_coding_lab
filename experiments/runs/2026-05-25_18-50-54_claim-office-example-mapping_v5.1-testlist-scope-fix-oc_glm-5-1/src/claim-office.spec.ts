import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote - base premiums", () => {
    it("empty item list → premium 5 G (only processing fee, no items to insure)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("single sword (new customer, first contract) → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("single amulet (new customer, first contract) → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("single staff (new customer, first contract) → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("single potion (new customer, first contract) → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("single rune (new customer, first contract) → premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 → 33 rounded up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("single moonstone (new customer, first contract) → premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 → 33 rounded up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("quote - building blocks of alike components", () => {
    it("2 runes → premium 60 G (50 base + 5 first insurance + 5 fee, no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("3 runes (building block) → premium 71 G (60 base + 6 first insurance + 5 fee, block applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("4 runes → premium 115 G (100 base + 10 first insurance + 5 fee, no block — block requires exactly 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("7 runes → premium 198 G (175 base + 17.5 first insurance + 5 fee = 197.5 → 198 rounded up)", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: runes }],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone → premium 88 G (75 base + 7.5 first insurance + 5 fee = 87.5 → 88 rounded up, no block: different types)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones → premium 137 G (120 base + 12 first insurance + 5 fee, two separate blocks)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("quote - item-specific modifiers", () => {
    it("cursed sword with enchantment 3 (new customer, first contract) → premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("highly enchanted sword level 5 (new customer, first contract) → premium 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("cursed sword with enchantment 5 (new customer, first contract) → premium 195 G (100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("sword with enchantment 4 (new customer, first contract) → premium 115 G (no high-enchantment surcharge)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("cursed sword with enchantment 4 (new customer, first contract) → premium 165 G (only curse surcharge applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → loyalty discount applies, sword premium 95 G (100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("follow-up contract: second quote in scenario with sword → first quote 115 G, second quote 100 G (100 base + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("quote - multi-item modifier scope", () => {
    it("cursed sword + plain amulet (new customer, first contract) → premium 231 G (160 policy base + 50 curse on sword only + 16 first insurance on policy base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ] }],
      });
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("quote - integration examples", () => {
    it("newcomer with cursed sword (0 years, first contract, steel, enchantment 3) → premium 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract (3 years, cursed sword steel enchantment 7, second quote in scenario) → premium 160 G (100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 59 });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote - edge cases", () => {
    it("unknown item type → throws error (no results returned)", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })).toThrow();
    });
  });

  describe("claim - standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G (full reimbursement minus 100 G deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune, damage 200 G → payout 100 G, remainingCap 400 G (full reimbursement minus 100 G deductible, no enchantment or material)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim - high enchantment reimbursement", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G, remainingCap 1600 G (50% then deductible: 500 - 100)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G, remainingCap 1600 G (high-enchantment clause applies: 500 - 100)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - dragon material reimbursement", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G, remainingCap 1300 G (full reimbursement then deductible: 800 - 100)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("claim - enchantment vs dragon material", () => {
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G, remainingCap 1600 G (both clauses apply, 50% rule wins: 500 - 100)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G, remainingCap 2600 G (100 G deductible per damaged item: 400 + 200)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim - cap and insurance sum", () => {
    it("sword + amulet policy → cap 3200 G (insurance sum 1600, verified via claim remainingCap)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value (not affected by premium modifiers)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G (block discount affects premium only, not insurance sum)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
  });

  describe("claim - cap exhaustion", () => {
    it("sword insured (cap 2000 G), first claim damage 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword insured (cap 2000 G), second claim damage 1500 G → payout 600 G, remainingCap 0 G (desired 1400 reduced to remaining cap)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim - multiple items of same type", () => {
    it("two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("both swords damaged (2 damage entries) → each treated as separate damage with own 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("more sword damage entries than swords insured → throws error (claim rejected)", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      })).toThrow();
    });
  });

  describe("claim - edge cases", () => {
    it("claim references item type not in policy (amulet damage when only sword insured) → throws error", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      })).toThrow();
    });
    it("damage entry with negative amount → throws error", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })).toThrow();
    });
    it("claim with unknown item type in damage → throws error", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      })).toThrow();
    });
  });

  describe("claim - rounding", () => {
    it("payout of 350.5 G → rounded down to 350 G (steel sword enchantment 9, damage 901: 450.5 - 100 = 350.5 → 350)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });
});
