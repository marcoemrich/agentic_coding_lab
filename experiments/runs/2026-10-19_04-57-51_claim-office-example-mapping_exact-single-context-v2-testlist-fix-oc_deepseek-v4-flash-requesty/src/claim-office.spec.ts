import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Step } from "./claim-office.js";

const years = (yearsWithMHPCO: number, steps: Step[]) => ({ customer: { yearsWithMHPCO }, steps });

const cliArgs = ["exec", "tsx", "src/cli.ts"];

function runCli(json: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("pnpm", cliArgs, { input: json, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("Claim Office Kata", () => {
  describe("quote - base premiums", () => {
    it("empty item list yields premium 5 G (only processing fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    });

    it("a single sword yields premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });

    it("a single amulet yields premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "amulet" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });

    it("a single staff yields premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "staff" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });

    it("a single potion yields premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "potion" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
    });

    it("a single rune yields premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });

    it("a single moonstone yields premium 33 G (25 base + 2.5 first insurance + 5 fee)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "moonstone" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote - components and blocks", () => {
    it("2 runes yield base premium 50 G (+ first insurance + fee = 60 G)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
    });

    it("3 runes yield base premium 60 G block (+ first insurance + fee = 71 G)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });

    it("4 runes yield base premium 100 G, no block (+ first insurance + fee = 115 G)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });

    it("7 runes yield base premium 175 G, no block (+ first insurance + fee = 198 G)", () => {
      const scenario = years(0, [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    });

    it("2 runes + 1 moonstone yield base premium 75 G, no block (+ first insurance + fee = 88 G)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });

    it("3 runes + 3 moonstones yield base premium 120 G, two blocks (+ first insurance + fee = 137 G)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote - modifiers", () => {
    it("a cursed sword adds 50% on the item's base (newcomer, first quote): 100+50+10 → 165 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", cursed: true }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });

    it("a high-enchantment sword (enchantment 5) adds 30% on the item's base: 100+30+10 → 145 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    });

    it("a sword with enchantment 4 gets no high-enchantment surcharge: 100+10 → 115 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });

    it("a cursed enchantment-9 sword applies both surcharges: 100+50+30+10 → 195 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 9 }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
    });

    it("cursed surcharge applies to the item's base, not policy total: cursed sword + plain amulet → 231 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
    });

    it("a customer with exactly 2 years gets a 20% loyalty discount: sword → 95 G (100 - 20 + 10 + 5)", () => {
      const scenario = years(2, [{ op: "quote", items: [{ type: "sword" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    });

    it("first insurance adds 10% initial assessment surcharge to every quote: sword → 115 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });

    it("a follow-up contract (second quote) gets a 15% discount: sword → 100 G (100 + 10 - 15 + 5)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  describe("quote - integration examples", () => {
    it("newcomer with a cursed sword (0y, first contract) → premium 165 G", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });

    it("long-standing customer's second contract, cursed enchantment-7 sword → premium 160 G", () => {
      const scenario = years(3, [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
    });

    it("policy base premium is the sum of all item base premiums (cursed sword 100 + amulet 60 = 160 base)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote - rounding in MHPCO's favor", () => {
    it("a premium that calculates to 197.5 G is rounded up to 198 G", () => {
      const scenario = years(0, [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    });

    it("intermediate amounts are kept as fractions; only the final premium is rounded (rune → 32.5 → 33)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "rune" }] }]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("claim - standard reimbursement", () => {
    it("regular steel sword (enchantment 3), damage 500 → payout 400 (full minus 100 deductible)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
    });

    it("rune damage 200 → payout 100 (full minus 100 deductible, no special clause)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
    });

    it("dragon-material sword (enchantment 5), damage 800 → payout 700 (full reimbursement, then deductible)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
    });

    it("steel sword (enchantment 9), damage 1000 → payout 400 (50% first, then deductible: 500 - 100)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
    });

    it("dragon-material sword (enchantment 8), damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
    });

    it("dragon-material sword (enchantment 9), damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
    });
  });

  describe("claim - multiple items and deductible", () => {
    it("dragon attack damaging sword 500 and amulet 300 → payout 600 (deductible 100 applies per item)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
    });

    it("two sword damage entries are each a separate damage with its own deductible", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }, { itemType: "sword", amount: 1500 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 225 }, { payout: 2800, remainingCap: 1200 }] });
    });
  });

  describe("claim - insurance sum and cap", () => {
    it("a policy covering a sword and an amulet has insurance sum 1600, cap 3200", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 3200, remainingCap: 0 }] });
    });

    it("a cursed sword has cap 2000 based on unmodified insurance value (1000), modifiers do not raise it", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }] });
    });

    it("a policy with a sword and a 3-rune block has insurance sum 1750, cap 3500 (block affects premium only)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 3500, remainingCap: 0 }] });
    });
  });

  describe("claim - cap exhaustion", () => {
    it("sword insured (cap 2000); first claim of 1500 → payout 1400, remaining cap 600", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }] });
    });

    it("second claim of 1500 → payout 600, remaining cap 0 (reduced to remaining cap)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
    });
  });

  describe("claim - rounding in MHPCO's favor", () => {
    it("a payout that calculates to 350.5 G is rounded down to 350 G", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ]);
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
    });
  });

  describe("claim - errors", () => {
    it("claim referencing an item not in the policy causes an error (thrown)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ]);
      expect(() => runScenario(scenario)).toThrow();
    });

    it("claim with an unknown item type causes an error (thrown)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ]);
      expect(() => runScenario(scenario)).toThrow();
    });

    it("claim with a negative damage amount causes an error (thrown)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ]);
      expect(() => runScenario(scenario)).toThrow();
    });

    it("more damage entries of a type than the policy covers causes an error (thrown)", () => {
      const scenario = years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ]);
      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("quote - errors", () => {
    it("an unknown item type in a quote causes an error (thrown)", () => {
      const scenario = years(0, [{ op: "quote", items: [{ type: "broomstick" }] }]);
      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("reads a scenario from stdin and writes results JSON to stdout for a quote and a claim", () => {
      const json = JSON.stringify(years(5, [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ]));
      const { status, stdout } = runCli(json);
      expect(status).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });

    it("exits non-zero with an error on stderr and no results for an unknown quote item type", () => {
      const json = JSON.stringify(years(0, [{ op: "quote", items: [{ type: "broomstick" }] }]));
      const { status, stdout, stderr } = runCli(json);
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr).toMatch(/Unknown item type/);
    });

    it("exits non-zero with an error on stderr for a claim on an item not in the policy", () => {
      const json = JSON.stringify(years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ]));
      const { status, stdout, stderr } = runCli(json);
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr).toMatch(/not in policy/);
    });

    it("exits non-zero with an error on stderr for a negative damage amount", () => {
      const json = JSON.stringify(years(0, [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ]));
      const { status, stdout, stderr } = runCli(json);
      expect(status).not.toBe(0);
      expect(stdout).toBe("");
      expect(stderr).toMatch(/negative/);
    });
  });
});