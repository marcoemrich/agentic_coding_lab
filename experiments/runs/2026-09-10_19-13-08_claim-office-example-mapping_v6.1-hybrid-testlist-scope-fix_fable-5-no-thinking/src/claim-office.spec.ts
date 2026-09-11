import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(output).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword → premium 115 G (100 base + 10% first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("single amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("single staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 93 }] });
    });
    it("single potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 49 }] });
    });
    it("single rune → premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 33 }] });
    });
    it("2 runes → premium 60 G (base 50, no block)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → premium 71 G (base 60, block of 3 alike applies)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → premium 115 G (base 100, no block — block requires exactly 3)", () => {
      const output = runScenario({
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
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → premium 198 G (base 175 → 192.5 + 5 = 197.5, rounded up in MHPCO's favor)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array(7).fill({ type: "rune" }) },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → premium 88 G (base 75, no block: different types)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → premium 137 G (base 120, two separate blocks)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array(3).fill({ type: "rune" }),
              ...Array(3).fill({ type: "moonstone" }),
            ],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed sword → premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with exactly enchantment 5 → premium 145 G (100 base + 30 high-enchantment + 10 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 5 }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → premium 115 G (no high-enchantment surcharge)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 4 }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 → premium 195 G (100 base + 50 curse + 30 high-enchantment + 10 first insurance + 5 fee)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years → premium 95 G for a sword (loyalty discount applies)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year → premium 115 G for a sword (no loyalty discount)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword + plain amulet → premium 231 G (curse surcharge on the sword's base only; policy-wide modifiers on the 160 G policy base)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "amulet", cursed: false },
            ],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 231 }] });
    });
    it("second quote in a scenario → 15% follow-up discount on the policy base (sword: 100 + 10 − 15 + 5 = 100 G)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G (integration example)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 41 }, { premium: 160 }],
      });
    });
  });

  describe("claim — reimbursement rules", () => {
    it("regular sword (steel, enchantment 3), damage 500 → payout 400, remainingCap 1600 (full minus 100 deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 → payout 100, remainingCap 400 (no special clause for components; cap 2×250)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "chipped",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("steel sword enchantment 9, damage 1000 → payout 400 (50% clause, then deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword enchantment 5, damage 800 → payout 700 (dragon clause: full reimbursement, then deductible)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon sword enchantment 9, damage 1000 → payout 400 (both clauses apply; 50% rule wins)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword exactly enchantment 8, damage 1000 → payout 400 (high-enchantment clause applies at threshold)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon attack damages sword 500 and amulet 300 → payout 600 (100 G deductible once per damaged item)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
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
      });
      expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("payout of 350.5 is rounded down to 350 (steel sword enchantment 9, damage 901)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("two swords → insurance sum 2000, cap 4000; both damaged as separate entries with own deductibles", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("sword + amulet → insurance sum 1600, cap 3200", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 200, remainingCap: 3000 });
    });
    it("cursed sword → cap 2000 (based on unmodified insurance value; premium modifiers do not raise the cap)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output.results).toEqual([
        { premium: 165 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("sword + 3 runes → insurance sum 1750, cap 3500 (block discount affects premium only)", () => {
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "chipped",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("cap exhaustion: sword with two successive 1500 claims → first payout 1400 (remaining 600), second payout 600 (remaining 0)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "battle",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const output = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
      });
      expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI", () => {
    const runCli = (input: unknown) =>
      spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
        input: JSON.stringify(input),
        encoding: "utf8" as const,
      });

    it("end-to-end: quote amulet (5 years customer) then claim 200 → results [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
      const result = runCli({
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
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("quote with unknown item type (broomstick) → non-zero exit, error on stderr, no results on stdout", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("claim for an item not in the policy (amulet damaged, only sword insured) → non-zero exit, error on stderr", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("claim with unknown damage itemType → non-zero exit, error on stderr", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "mystery",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("more damage entries of a type than insured (two sword damages, one sword) → non-zero exit, claim rejected", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("damage entry with amount -200 → non-zero exit, error on stderr", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
  });
});
