import { describe, it, expect } from "vitest";
import { execSync } from "child_process";

const claimOffice = (input: string): string => {
  return execSync(`echo '${input.replace(/'/g, "'\\''")}' | pnpm tsx src/cli.ts`, {
    encoding: "utf-8",
    cwd: "/home/experimenter/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5-2",
  }).trim();
};

describe("CLI claim-office", () => {
  describe("Empty and edge cases", () => {
    it("should return premium 5 for empty item list", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(5);
    });
    it("should exit with error for unknown item type in quote", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(() => claimOffice(input)).toThrow();
    });
    it("should exit with error for claim referencing item not in policy", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(() => claimOffice(input)).toThrow();
    });
    it("should exit with error for claim with negative damage amount", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
      expect(() => claimOffice(input)).toThrow();
    });
    it("should exit with error for claim with more damage entries of a type than policy covers", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 300 }] } },
        ],
      });
      expect(() => claimOffice(input)).toThrow();
    });
  });

  describe("Quote - Item base premiums", () => {
    it("should return 115 for single sword (100 + 10 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 71 for single amulet (60 + 6 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(71);
    });
    it("should return 93 for single staff (80 + 8 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(93);
    });
    it("should return 49 for single potion (40 + 4 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(49);
    });
    it("should return 33 for single rune (25 + 3 first insurance rounded up + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(33);
    });
    it("should return 33 for single moonstone (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(33);
    });
  });

  describe("Quote - Component building blocks", () => {
    it("should return 60 for 2 runes (50 + 5 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(60);
    });
    it("should return 71 for 3 runes block (60 + 6 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(71);
    });
    it("should return 115 for 4 runes (100 + 10 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 198 for 7 runes (175 + 17.5 first insurance + 5 fee, rounded up)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(198);
    });
    it("should return 88 for 2 runes + 1 moonstone (75 + 7.5 first insurance + 5 fee, rounded up)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(88);
    });
    it("should return 137 for 3 runes + 3 moonstones (120 + 12 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(137);
    });
  });

  describe("Quote - Item-specific modifiers", () => {
    it("should return 165 for cursed sword (100 + 50 cursed + 10 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(165);
    });
    it("should return 145 for sword enchantment 5 (100 + 30 high enchant + 10 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(145);
    });
    it("should return 195 for cursed sword enchantment 5 (100 + 50 cursed + 30 high enchant + 10 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(195);
    });
    it("should return 115 for sword enchantment 4 (100 + 10 first insurance + 5 fee, no high enchant)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(115);
    });
    it("should return 101 for cursed amulet (60 + 30 cursed + 6 first insurance + 5 fee)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", cursed: true }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(101);
    });
  });

  describe("Quote - Policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with 2 years", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(95);
    });
    it("should apply 10% first insurance surcharge", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(115);
    });
    it("should apply 15% follow-up contract discount", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].premium).toBe(100);
    });
  });

  describe("Quote - Modifier scope", () => {
    it("should apply cursed surcharge only to cursed item in multi-item policy", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(231);
    });
  });

  describe("Quote - Rounding", () => {
    it("should round up 197.5 to 198", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(198);
    });
    it("should round down premium with fractional part", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(143);
    });
  });

  describe("Quote - Integration examples", () => {
    it("should compute 165 for newcomer with cursed sword", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(165);
    });
    it("should compute 160 for long-standing customer second contract with cursed sword enchantment 7", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("Claim - Basic", () => {
    it("should return payout 400 and remainingCap 1600 for sword damage 500", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should return payout 100 and remainingCap 400 for rune damage 200", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(400);
    });
  });

  describe("Claim - Deductible", () => {
    it("should apply 100 deductible per damage event", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(400);
    });
    it("should apply deductible once per damaged item", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(600);
    });
  });

  describe("Claim - Special clauses", () => {
    it("should reimburse 50% for enchantment >= 8", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(400);
    });
    it("should fully reimburse dragon material", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(700);
    });
    it("should prioritize 50% rule when both apply", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(400);
    });
  });

  describe("Claim - Cap exhaustion", () => {
    it("should cap payout at remaining cap and track across multiple claims", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
  });

  describe("Claim - Rounding", () => {
    it("should round down payout 400.5 to 400", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].payout).toBe(400);
    });
  });

  describe("Multi-step scenarios", () => {
    it("should process quote then claim in sequence", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });
    it("should track cap across multiple claims on same policy", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      const output = claimOffice(input);
      const result = JSON.parse(output);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
  });
});
