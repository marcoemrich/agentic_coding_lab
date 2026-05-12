import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums", () => {
    it("empty item list yields premium of 5 G (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("single sword for newcomer yields premium of 115 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("single amulet for newcomer yields premium of 71 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", cursed: false, enchantment: 2 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("single staff for newcomer yields premium of 93 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff", cursed: false, enchantment: 2 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("single potion for newcomer yields premium of 49 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion", cursed: false, enchantment: 0 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("sword and amulet for newcomer yields combined premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: false, enchantment: 3 },
              { type: "amulet", cursed: false, enchantment: 2 },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("quote - component pricing", () => {
    it("two runes yield base premium of 50 G (2 × 25 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("three alike runes yield base premium of 60 G (block of 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("four runes yield base premium of 100 G (no block — not exactly 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("three runes and three moonstones yield two separate blocks (120 G base)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
    it("two runes and one moonstone yield no block (75 G base, different types)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" }, { type: "rune" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
  });

  describe("quote - item-level surcharges", () => {
    it("cursed sword adds 50 % surcharge on sword base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("sword with enchantment 5 adds 30 % high-enchantment surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 5 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("sword with enchantment 4 has no high-enchantment surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 4 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("cursed sword with enchantment 5 applies both surcharges", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("cursed surcharge on multi-item policy applies only to cursed item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true, enchantment: 3 },
              { type: "amulet", cursed: false, enchantment: 2 },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("quote - policy-level modifiers", () => {
    it("customer with exactly 2 years receives 20 % loyalty discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("customer with fewer than 2 years receives no loyalty discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("second quote receives 15 % follow-up discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("first insurance surcharge of 10 % always applies regardless of customer history", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] }],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("long-standing customer second contract stacks loyalty and follow-up discounts", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote - rounding", () => {
    it("final premium rounds up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune", cursed: true }] }],
      });
      expect(result.results[0]).toEqual({ premium: 73 });
    });
  });

  describe("claim - standard reimbursement", () => {
    it("plain sword damage reimburses full amount minus 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage reimburses full amount minus 100 G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("deductible applies once per damaged item in an incident", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: false, enchantment: 3 },
              { type: "amulet", cursed: false, enchantment: 2 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim - special reimbursement clauses", () => {
    it("damage to item with enchantment >= 8 is reimbursed at 50 % before deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to dragon-material item is fully reimbursed (minus deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon material with enchantment >= 8 uses 50 % rule (not full reimbursement)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with enchantment 5 uses only dragon-material clause", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword with enchantment 9 uses only the 50 % clause", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - cap exhaustion", () => {
    it("payout cap equals twice the total insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: false, enchantment: 3 },
              { type: "amulet", cursed: false, enchantment: 2 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("payout is capped when claim exceeds remaining cap", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("remaining cap decreases across successive claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: false, enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("cap is based on unmodified insurance values, not premium modifiers", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: false, enchantment: 3 },
              { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
  });
});
