import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quote(customer: { yearsWithMHPCO: number }, items: Record<string, unknown>[], stepIndex = 0) {
  const steps: Record<string, unknown>[] = [];
  for (let i = 0; i <= stepIndex; i++) {
    if (i === stepIndex) {
      steps.push({ op: "quote" as const, items });
    } else {
      steps.push({ op: "quote" as const, items: [] });
    }
  }
  const result = processScenario({ customer, steps });
  return result.results[stepIndex] as { premium: number };
}

describe("Claim Office", () => {
  describe("Quote - base premium", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, []).premium).toBe(5);
    });

    it("computes premium for a single sword", () => {
      // 100 base + 10 first insurance + 5 fee = 115
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]).premium).toBe(115);
    });

    it("computes premium for a single amulet", () => {
      // 60 base + 6 first insurance + 5 fee = 71
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }]).premium).toBe(71);
    });

    it("computes premium for a single staff", () => {
      // 80 base + 8 first insurance + 5 fee = 93
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }]).premium).toBe(93);
    });

    it("computes premium for a single potion", () => {
      // 40 base + 4 first insurance + 5 fee = 49
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }]).premium).toBe(49);
    });

    it("computes premium for a single rune", () => {
      // 25 base + 2.5 first insurance + 5 fee = 32.5 → ceil = 33
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }]).premium).toBe(33);
    });

    it("computes premium for multiple different items", () => {
      // sword 100 + amulet 60 = 160 base
      // first insurance: 160 * 0.1 = 16
      // 160 + 16 + 5 = 181
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword" },
        { type: "amulet" },
      ]).premium).toBe(181);
    });
  });

  describe("Quote - components", () => {
    it("computes premium for 2 runes", () => {
      // 50 base + 5 first insurance + 5 fee = 60
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" },
      ]).premium).toBe(60);
    });

    it("applies building block discount for exactly 3 alike runes", () => {
      // 60 base (block) + 6 first insurance + 5 fee = 71
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ]).premium).toBe(71);
    });

    it("does not apply block for 4 runes", () => {
      // 4 * 25 = 100 base + 10 first insurance + 5 fee = 115
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ]).premium).toBe(115);
    });

    it("does not apply block for 2 runes and 1 moonstone (different types)", () => {
      // 2*25 + 1*25 = 75 base + 7.5 first insurance + 5 fee = 87.5 → 88
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ]).premium).toBe(88);
    });

    it("applies two separate blocks for 3 runes and 3 moonstones", () => {
      // 60 + 60 = 120 base + 12 first insurance + 5 fee = 137
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]).premium).toBe(137);
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% curse surcharge on the cursed item only", () => {
      // sword base: 100, curse surcharge: 50
      // policy base: 100, first insurance: 10
      // 100 + 50 + 10 + 5 = 165
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
      ]).premium).toBe(165);
    });

    it("adds 30% high enchantment surcharge for enchantment >= 5", () => {
      // sword base: 100, enchantment surcharge: 30
      // policy base: 100, first insurance: 10
      // 100 + 30 + 10 + 5 = 145
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 5 },
      ]).premium).toBe(145);
    });

    it("does not add high enchantment surcharge for enchantment 4", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 4 },
      ]).premium).toBe(115);
    });

    it("applies both curse and high enchantment surcharges", () => {
      // sword base: 100, curse: 50, enchantment: 30
      // policy base: 100, first insurance: 10
      // 100 + 50 + 30 + 10 + 5 = 195
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true, enchantment: 5 },
      ]).premium).toBe(195);
    });

    it("applies item-specific modifier only to affected item in multi-item policy", () => {
      // cursed sword base: 100, surcharge: 50
      // amulet base: 60
      // policy base: 160, first insurance: 16
      // 160 + 50 + 16 + 5 = 231
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]).premium).toBe(231);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      // sword: 100 base
      // loyalty: -20 (100 * 0.2)
      // first insurance: +10 (100 * 0.1)
      // 100 - 20 + 10 + 5 = 95
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }]).premium).toBe(95);
    });

    it("does not apply loyalty discount for customer with less than 2 years", () => {
      // sword: 100 base + 10 first insurance + 5 fee = 115
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }]).premium).toBe(115);
    });

    it("applies 10% first insurance surcharge (always applies)", () => {
      // Already tested implicitly; test explicitly with empty modifiers
      // sword: 100 base + 10 first insurance + 5 fee = 115
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", enchantment: 0, cursed: false },
      ]).premium).toBe(115);
    });

    it("applies 15% follow-up discount on second quote step", () => {
      // second quote (stepIndex=1): sword 100 base
      // first insurance: +10
      // follow-up: -15
      // 100 + 10 - 15 + 5 = 100
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1).premium).toBe(100);
    });

    it("does not apply follow-up discount on first quote step", () => {
      // first quote (stepIndex=0): sword 100 base + 10 first insurance + 5 = 115
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0).premium).toBe(115);
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword pays 165 G", () => {
      // 0 years, first contract
      // sword: 100 base + 50 curse = 150
      // first insurance: 150 * 0.1 = 15
      // 150 + 15 + 5 = 170
      // Wait - spec says 165: (100 base + 50 curse + 10 first insurance = 160 + 5 fee)
      // First insurance is 10% of 100 (the base premium of the item, not the modified premium)?
      // Re-reading: "policy-wide modifiers apply to the policy base premium (the sum of all item base premiums)"
      // So policy base premium = sum of item BASE premiums = 100 (not including surcharges)
      // Item surcharges are added separately
      // Total = item base premiums + item surcharges + policy-wide modifiers on base + fee
      // = 100 + 50(curse) + 10(first ins on 100 base) + 5 = 165
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      });
      expect((result.results[0] as { premium: number }).premium).toBe(165);
    });

    it("long-standing customer second contract pays 160 G", () => {
      // 3 years, second quote
      // sword: 100 base + 50 curse + 30 high ench = 180 item total
      // policy base = 100
      // loyalty: -20 (100 * 0.2)
      // first insurance: +10 (100 * 0.1)
      // follow-up: -15 (100 * 0.15)
      // Total = 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote" as const, items: [] },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect((result.results[1] as { premium: number }).premium).toBe(160);
    });

    it("rounds premium up in MHPCO favor", () => {
      // rune: 25 base
      // first insurance: 25 * 0.1 = 2.5
      // 25 + 2.5 + 5 = 32.5 → ceil = 33
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }]).premium).toBe(33);
    });
  });

  describe("Claim - basic payout", () => {
    it("fully reimburses standard item damage minus deductible", () => {
      // steel sword, ench 3, damage 500 → payout 400
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(400);
    });

    it("reimburses damage to a rune minus deductible", () => {
      // rune, damage 200 → payout 100
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "rune" }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(100);
    });

    it("applies deductible per damaged item", () => {
      // sword 500 + amulet 300, each with 100 deductible
      // payout = (500-100) + (300-100) = 600
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0 },
              { type: "amulet", material: "silver", enchantment: 0 },
            ],
          },
          {
            op: "claim" as const, policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(600);
    });
  });

  describe("Claim - special clauses", () => {
    it("reimburses at 50% for enchantment >= 8 then deductible", () => {
      // steel sword, ench 9, damage 1000 → 500 * 0.5 = 500, then -100 = 400
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(400);
    });

    it("fully reimburses dragon material then deductible", () => {
      // dragon sword, ench 5, damage 800 → 800 - 100 = 700
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(700);
    });

    it("applies 50% rule when both enchantment >= 8 and dragon material", () => {
      // dragon sword, ench 9, damage 1000 → 1000*0.5 = 500, then -100 = 400
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(400);
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at 2x insurance sum", () => {
      // sword insured (1000 value, cap 2000)
      // claim 1: damage 1500 → payout 1400 (1500-100), remaining cap 600
      // claim 2: damage 1500 → payout would be 1400, but cap remaining is 600 → payout 600, remaining 0
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      const claim1 = result.results[1] as { payout: number; remainingCap: number };
      const claim2 = result.results[2] as { payout: number; remainingCap: number };
      expect(claim1.payout).toBe(1400);
      expect(claim1.remainingCap).toBe(600);
      expect(claim2.payout).toBe(600);
      expect(claim2.remainingCap).toBe(0);
    });

    it("tracks remaining cap correctly", () => {
      // sword + amulet: insurance sum = 1600, cap = 3200
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0 },
              { type: "amulet", material: "silver", enchantment: 0 },
            ],
          },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(400);
      expect(claim.remainingCap).toBe(2800);
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO favor", () => {
      // dragon sword ench 8, damage 1001 → 1001*0.5 = 500.5 - 100 = 400.5 → floor = 400
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1001 }] },
          },
        ],
      });
      const claim = result.results[1] as { payout: number; remainingCap: number };
      expect(claim.payout).toBe(400);
    });
  });

  describe("Claim - validation", () => {
    it("throws when damage item type is not in the policy", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      })).toThrow();
    });

    it("throws when damage entries exceed insured count", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const, policy: 0,
            incident: {
              cause: "accident",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });

    it("throws when damage amount is negative", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const, policy: 0,
            incident: { cause: "accident", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })).toThrow();
    });
  });

  describe("Quote - validation", () => {
    it("throws for unknown item type", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
      })).toThrow();
    });
  });
});
