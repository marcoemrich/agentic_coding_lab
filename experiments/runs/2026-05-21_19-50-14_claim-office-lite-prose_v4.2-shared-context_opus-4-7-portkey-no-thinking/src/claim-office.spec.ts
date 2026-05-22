import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

describe("MHPCO Claim Office", () => {
  describe("Quote operation", () => {
    it("should price a single plain sword (enchantment 3) for a new customer's first contract as 115G (100 base * 1.1 first + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should price a single plain amulet for a new customer's first contract as 71G (60 base * 1.1 first + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should price a single plain staff for a new customer's first contract as 93G (80 base * 1.1 first + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should price a single plain potion for a new customer's first contract as 49G (40 base * 1.1 first + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should price a single rune (component) for a new customer's first contract as 33G (25 base * 1.1 first = 27.5 round up 28 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should price a single moonstone (component) for a new customer's first contract as 33G (same as rune)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should add a 50% risk surcharge for a cursed sword: 170G (100 * 1.5 * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add a 30% surcharge for a highly enchanted sword (enchantment=5): 148G (100 * 1.3 * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("should NOT add the highly-enchanted surcharge when enchantment=4 (boundary): sword stays at 115G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply a 20% loyalty discount for a customer with yearsWithMHPCO=2: sword becomes 93G (100 * 0.8 * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should NOT apply the loyalty discount when yearsWithMHPCO=1 (boundary): sword stays at 115G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply the +10% first-insurance surcharge to the first quote (115G) and a -15% after-first discount to the second quote (90G = 100 * 0.85 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
    it("should price three runes as one building block at 60G (instead of 75G): 71G (60 * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should price two runes individually (no block): 60G (50 * 1.1 + 5 fee)", () => {
      const result = runScenario({
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
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("should price four runes as one block + one individual: 99G ((60+25) * 1.1 = 93.5 round up 94 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 99 }] });
    });
    it("should price six runes as two blocks: 137G (120 * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
    it("should NOT combine 2 runes + 1 moonstone into a block (alike = same type): 88G (75 * 1.1 = 82.5 round up 83 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("should stack cursed AND highly enchanted surcharges multiplicatively on a sword: 220G (100 * 1.5 * 1.3 * 1.1 = 214.5 round up 215 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 220 }] });
    });
    it("should combine cursed + highly enchanted + loyalty + first surcharges on a sword: 177G (100 * 1.5 * 1.3 * 0.8 * 1.1 = 171.6 round up 172 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 177 }] });
    });
    it("should sum multiple items in a single quote then apply customer modifiers: sword + amulet for new customer first = 181G ((100+60) * 1.1 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("should round UP in MHPCO's favor (non-integer): staff with loyalty + first = 76G (80 * 0.8 * 1.1 = 70.4 round up 71 + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 76 }] });
    });
    it("should default missing optional fields (cursed absent => false, enchantment absent => 0): plain sword first contract = 115G", () => {
      const result = runScenario({
        customer: {},
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Claim operation", () => {
    it("should fully reimburse damage to a dragon-material item minus the 100G deductible: dragon sword 500G damage => 400G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { payout: 400 }] });
    });
    it("should reimburse damage to a highly enchanted item (enchantment=8) at 50%, minus deductible: sword 500G damage => 150G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }, { payout: 150 }] });
    });
    it("should NOT reimburse damage when enchantment=7 and material is not dragon (boundary): 0G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }, { payout: 0 }] });
    });
    it("should reimburse at boundary enchantment=8: amulet 400G damage => 100G payout (200 reimbursable - 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "amulet", amount: 400 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 91 }, { payout: 100 }] });
    });
    it("should pay 0G when item is neither dragon nor highly enchanted: amulet enchantment=2 damage 200G => 0G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
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
              damages: [
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }, { payout: 0 }] });
    });
    it("should fully reimburse dragon items regardless of enchantment level: dragon staff enchantment=1 damage 300G => 200G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "dragon", enchantment: 1, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "staff", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }, { payout: 200 }] });
    });
    it("should apply a single deductible per damage event even with multiple damages: two dragon items damaged 200G each => 300G payout (400 - 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 0, cursed: false },
              { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 181 }, { payout: 300 }] });
    });
    it("should clamp payout to 0 when damage is below the deductible: dragon sword 50G damage => 0G payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 50 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { payout: 0 }] });
    });
    it("should handle mixed eligibility within one claim: dragon sword 300G + plain amulet 200G => 200G payout (300 reimbursable - 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 181 }, { payout: 200 }] });
    });
    it("should take the better rate when item qualifies under both rules: dragon sword enchantment=9 damage 400G => 300G payout (100% rate, not 50%)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }, { payout: 300 }] });
    });
  });

  describe("Scenario / sequencing", () => {
    it("should process steps sequentially and return a results array of the same length and order (one quote => one result with premium)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should process a quote followed by a claim referencing policy=0: amulet enchantment=2 (yearsWithMHPCO=5) => premium 58, then 200G amulet damage => payout 0", () => {
      const result = runScenario({
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
              damages: [
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 58 }, { payout: 0 }] });
    });
    it("should return an empty results array for an empty steps array", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [],
      });
      expect(result).toEqual({ results: [] });
    });
  });
});

describe("MHPCO Claim Office CLI", () => {
  it("should read a JSON scenario from stdin and write the results JSON to stdout (schema example 1: single sword => premium 115)", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should handle a quote followed by a claim from stdin (schema example 2 => premium 58, payout 0)", () => {
    const { stdout, status } = runCli({
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
            damages: [
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 58 }, { payout: 0 }] });
  });
  it("should write an empty results array when input has no steps", () => {
    const { stdout, status } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [] });
  });
});
