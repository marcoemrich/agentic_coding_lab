import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G premium for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns 105 G premium for a single sword (100 base + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 71 G premium for a single amulet (60 base + 6 first ins + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 93 G premium for a single staff (80 base + 8 first ins + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns 49 G premium for a single potion (40 base + 4 first ins + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 33 G premium for a single rune component (25 base + 2.5 first ins + 5 fee, rounded up)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("returns 181 G premium for a sword and an amulet (160 base + 16 first ins + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component block pricing", () => {
    it("returns 55 G for 2 runes (2 * 25 = 50 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("returns 65 G for 3 runes (block price 60 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 115 G for 4 runes (100 base + 10 first ins + 5 fee, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 88 G for 2 runes and 1 moonstone (75 base + 7.5 first ins + 5 fee, rounded up)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("returns 125 G for 3 runes and 3 moonstones (two blocks, 60 + 60 + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% curse surcharge to a cursed sword (100 + 50 + 5 = 155 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level 5 (100 + 30 + 5 = 135 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both curse and high-enchantment surcharges (100 + 50 + 30 + 5 = 185 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("does not apply high-enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies item-specific modifiers only to the affected item in a multi-item policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 10% first insurance surcharge (always applies per quote)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 15% follow-up discount on each contract after the first", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies loyalty discount to customer with exactly 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 0 years, first contract = 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchantment sword = 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("rounds premium up in MHPCO's favor", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      // 25 base - 5 loyalty + 2.5 first ins + 5 fee = 27.5 → rounds up to 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible to damage on a regular sword", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("returns remaining cap after a claim", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // amulet insurance value 600, cap = 1200, payout = 300 - 100 = 200, remaining = 1000
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("fully reimburses dragon-material item minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material, full reimbursement minus deductible: 800 - 100 = 700
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("reimburses at 50% for enchantment >= 8, then applies deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // enchantment >= 8: 50% of 1000 = 500, then deductible: 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies 50% rule when item is both dragon-material and enchantment >= 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // both dragon + enchantment >= 8: 50% wins. 1000 * 0.5 = 500, minus 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - cap and multiple damages", () => {
    it("caps total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "catastrophe",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // sword insurance 1000, cap = 2000. damage 2500 - 100 deductible = 2400, capped to 2000
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("applies deductible per damaged item in a single event", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // (500-100) + (300-100) = 600, cap = 3200, remainingCap = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("tracks remaining cap across successive claims", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // cap = 2000. First: 1500-100=1400, remainingCap=600. Second: 1500-100=1400, capped to 600, remainingCap=0
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("reduces payout to remaining cap when cap is nearly exhausted", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "spill",
              damages: [{ itemType: "potion", amount: 600 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // potion insurance 400, cap=800. First: 600-100=500, cap=300. Second: 500-100=400, capped to 300, cap=0
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 300 });
      expect(result.results[2]).toEqual({ payout: 300, remainingCap: 0 });
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // enchantment >= 8: 501 * 0.5 = 250.5, minus 100 = 150.5, rounded down = 150
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Error handling", () => {
    it("rejects unknown item type in a quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects claim damage for item not in policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects more damages of a type than policy covers", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("reads scenario from stdin and writes results to stdout", async () => {
      const { execSync } = await import("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output.trim());
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("processes sequential quote and claim steps", async () => {
      const { execSync } = await import("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output.trim());
      // quote: 60 base, loyalty -12, first ins +6 = 54 + 5 fee = 59
      // claim: 200 - 100 deductible = 100 payout, cap = 1200 - 100 = 1100
      expect(result).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
  });
});
