import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type ScenarioInput } from "./scenario.js";

function runCli(scenario: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function quotePremium(yearsWithMHPCO: number, items: unknown[]): number {
  const out = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }] as never,
  });
  return (out.results[0] as { premium: number }).premium;
}

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums and processing fee", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(quotePremium(0, [])).toBe(5);
    });
    it("plain sword for a newcomer -> premium 115 G (base 100 + 10 first insurance + 5 fee)", () => {
      expect(quotePremium(0, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toBe(115);
    });
    it("plain amulet for a newcomer -> premium 71 G (base 60 + 6 + 5)", () => {
      expect(quotePremium(0, [{ type: "amulet" }])).toBe(71);
    });
    it("plain staff for a newcomer -> premium 93 G (base 80 + 8 + 5)", () => {
      expect(quotePremium(0, [{ type: "staff" }])).toBe(93);
    });
    it("plain potion for a newcomer -> premium 49 G (base 40 + 4 + 5)", () => {
      expect(quotePremium(0, [{ type: "potion" }])).toBe(49);
    });
    it("single rune for a newcomer -> premium 33 G (component base 25 + 2.5 + 5, rounded up)", () => {
      expect(quotePremium(0, [{ type: "rune" }])).toBe(33);
    });
    it("single moonstone for a newcomer -> premium 33 G (components share the 250 G / 25 G entry)", () => {
      expect(quotePremium(0, [{ type: "moonstone" }])).toBe(33);
    });
  });

  describe("quote: building block of 3 alike components", () => {
    it("2 runes -> premium 60 G (base 50, no block)", () => {
      expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes -> premium 71 G (block base 60 + 6 + 5)", () => {
      expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes -> premium 115 G (base 100: block requires exactly 3)", () => {
      expect(quotePremium(0, Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
    });
    it("7 runes -> premium 198 G (base 175 + 17.5 + 5 = 197.5, rounded up in MHPCO's favor)", () => {
      expect(quotePremium(0, Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    });
    it("2 runes + 1 moonstone -> premium 88 G (base 75, no block across different types; 87.5 rounds up)", () => {
      expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones -> premium 137 G (two separate blocks, base 120)", () => {
      expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(137);
    });
  });

  describe("quote: risk surcharges and discounts", () => {
    it("cursed sword (0 years) -> premium 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
      expect(quotePremium(0, [{ type: "sword", cursed: true }])).toBe(165);
    });
    it("sword with enchantment exactly 5 -> premium 145 G (high-enchantment surcharge applies at threshold)", () => {
      expect(quotePremium(0, [{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 4 -> premium 165 G (no high-enchantment surcharge below threshold)", () => {
      expect(quotePremium(0, [{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
      expect(quotePremium(0, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years quoting a plain sword -> premium 95 G (loyalty discount applies at threshold)", () => {
      expect(quotePremium(2, [{ type: "sword" }])).toBe(95);
    });
    it("customer with 1 year quoting a plain sword -> premium 115 G (no loyalty discount below threshold)", () => {
      expect(quotePremium(1, [{ type: "sword" }])).toBe(115);
    });
    it("second quote of a plain sword -> premium 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect((out.results[1] as { premium: number }).premium).toBe(100);
    });
    it("long-standing customer (3 years), second quote, cursed sword enchantment 7 -> premium 160 G", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] },
        ],
      });
      expect((out.results[1] as { premium: number }).premium).toBe(160);
    });
    it("cursed sword + plain amulet (0 years) -> premium 231 G (curse on the cursed item only; first insurance on 160 G base)", () => {
      expect(quotePremium(0, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("claim: reimbursement and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500 -> payout 400, remainingCap 1600", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune, damage 200 -> payout 100, remainingCap 400 (cap 500)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "mishap", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon-material sword enchantment 5, damage 800 -> payout 700, remainingCap 1300 (dragon material fully reimbursed)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "wear", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword enchantment 9, damage 1000 -> payout 400 (50% reimbursement: 500 - 100)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (both clauses apply, the 50% rule wins)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment exactly 8, damage 1000 -> payout 400 (high-enchantment clause applies at threshold)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon attack damaging sword (500) and amulet (300) -> payout 600 (deductible once per damaged item)", () => {
      const out = runScenario({
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
      expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("payout 350.5 rounds down to 350: steel sword enchantment 9, damage 901 -> payout 350, remainingCap 1650", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 901 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim: policy cap", () => {
    it("sword policy, claim 1500 then claim 1500 -> 1400/600 then 600/0 (cap 2000 exhausts)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("policy with two swords: both damaged 500 each -> payout 800, remainingCap 3200 (insurance sum 2000, cap 4000)", () => {
      const out = runScenario({
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
      expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("policy with sword and 3 runes (block): rune damaged 200 -> payout 100, remainingCap 3400 (insurance sum 1750)", () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "mishap", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
  });

  describe("rejections (observable contract: CLI exits non-zero, error on stderr, no results on stdout; domain layer throws Error)", () => {
    it("quote with unknown item type (broomstick) -> non-zero exit, stderr describes the error, no results written", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
      expect(cli.stdout).not.toContain("results");
    });
    it("claim damaging an item not part of the policy (amulet damaged, only sword insured) -> non-zero exit, stderr describes the error", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
      expect(cli.stdout).not.toContain("results");
    });
    it("claim damaging an unknown item type -> non-zero exit, stderr describes the error", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
    });
    it("claim with damage amount -200 -> non-zero exit, stderr describes the error", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
    });
    it("two sword damages but only one sword insured -> non-zero exit: the whole claim is rejected", () => {
      const cli = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
      expect(cli.stdout).not.toContain("results");
    });
  });

  describe("integration (schema example)", () => {
    it("customer 5 years, amulet silver enchantment 2 quote -> premium 59; fire claim amulet 200 -> payout 100, remainingCap 1100", () => {
      const scenario: ScenarioInput = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const out = runScenario(scenario);
      expect(out.results[0]).toEqual({ premium: 59 });
      expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
      const cli = runCli(scenario);
      expect(cli.status).toBe(0);
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
  });
});
