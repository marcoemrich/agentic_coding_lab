import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (input: unknown) => {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
};

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums (with 5 G fee, newcomer first-insurance surcharge for non-empty)", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single plain sword for a newcomer -> 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("single plain amulet for a newcomer -> 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("single plain staff for a newcomer -> 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("single plain potion for a newcomer -> 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("Component pricing and building blocks", () => {
    it("2 runes -> 50 G base premium (no block); full premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes -> 60 G base premium (block applies); full 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes -> 100 G base premium (no block - block requires exactly 3); full 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes -> 175 G base premium (no block, 7 single components); full 198 G", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items }],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone -> 75 G base premium (no block: different types); full 88 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "moonstone" },
        ] }],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks); full 137 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ] }],
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Premium modifiers - item-specific", () => {
    it("cursed sword (newcomer) -> 100 + 50 curse + 10 first ins = 160 + 5 fee = 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment exactly 5 -> high-ench surcharge (100 + 30 + 10 + 5 = 145)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 -> no high-ench surcharge (115 G as plain)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword ench 5 -> both: 100 + 50 + 30 + 10 + 5 = 195", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
  });

  describe("Premium modifiers - policy-wide", () => {
    it("long-standing customer (3 years), plain sword -> 100 - 20 loyalty + 10 first-ins + 5 fee = 95", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with exactly 2 years -> loyalty discount applies (sword: 95 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("first quote of scenario -> no follow-up discount (newcomer sword: 115)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("second quote of scenario -> 15% follow-up discount (newcomer sword: 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet (newcomer): base 160, +50 curse, +16 first ins, +5 fee = 231 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ] }],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Rounding (in MHPCO favor)", () => {
    it("premium 197.5 G -> 198 G (rounded up): 7 runes for newcomer = 192.5 + 5 -> 198", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items }],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("payout 350.5 G -> 350 G (rounded down): ench 8 sword, damage 901 -> 450.5 - 100 = 350.5 -> 350", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 901 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Integration examples", () => {
    it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
        ] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer's second contract: cursed sword ench 7, 3 years -> premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim - basic reimbursement", () => {
    it("regular sword (steel, ench 3), damage 500 G -> payout 400 G (500 - 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (ins value 250), damage 200 G -> payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "rune", amount: 200 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - high-enchantment clause", () => {
    it("steel sword ench 9, damage 1000 -> payout 400 (50% then 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "blast", damages: [
            { itemType: "sword", amount: 1000 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword ench 8, damage 1000 -> payout 400 (high-ench wins, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 1000 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword ench 9, damage 1000 -> payout 400 (50% wins, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 1000 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - dragon material clause", () => {
    it("dragon-material sword ench 5, damage 800 -> payout 700 (full, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 800 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - deductible per damage event", () => {
    it("dragon attack: sword 500 + amulet 300 -> payout 600 (deductible per item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ] } },
        ],
      });
      // insurance sum = 1600, cap = 3200; payout 600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - multiple items of same type", () => {
    it("policy with two swords: insurance sum 2000 G, cap 4000 G (verified via tiny claim)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 200 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("dragon attack damages both swords as two entries -> each separate deductible", () => {
      const result = runScenario({
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
    it("damages array has more entries of a type than policy covers -> runScenario throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            { op: "claim", policy: 0, incident: { cause: "x", damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ] } },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim - cap exhaustion", () => {
    it("policy sword + amulet: insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 200 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("cursed sword (ins value 1000) -> cap 2000 G (unmodified)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 200 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("policy sword + 3 runes (block): insurance sum 1750 G, cap 3500 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [
            { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          ] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 200 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("sword (cap 2000): two claims of 1500 G -> 1400 then 600 (cap exhausted)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 1500 },
          ] } },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 1500 },
          ] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI error cases", () => {
    it("quote with unknown item type -> CLI exits non-zero with error to stderr", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("claim references damage for item not in policy -> CLI exits non-zero", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "amulet", amount: 100 },
          ] } },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("claim with damage amount -200 -> CLI exits non-zero", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: -200 },
          ] } },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
  });

  describe("CLI happy path (stdin/stdout JSON)", () => {
    it("schema example: quote amulet then claim 200 G via CLI", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "amulet", amount: 200 },
          ] } },
        ],
      });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      // amulet: base 60, -20% loyalty + 10% first-ins = -10% of 60 = -6; 60-6=54, +5 fee = 59
      expect(output.results[0]).toEqual({ premium: 59 });
      expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });
});
