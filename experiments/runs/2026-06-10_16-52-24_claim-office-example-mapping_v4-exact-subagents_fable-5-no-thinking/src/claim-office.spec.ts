// claim-office.spec.ts
//
// Test list for the MHPCO Claim Office kata (see prompt.md).
// Core logic is tested through the exported processScenario function,
// which takes a scenario ({ customer, steps }) and returns { results }.
// CLI behavior (stdin/stdout/exit codes) is tested by running src/cli.ts
// (e.g. via tsx with execFile from node:child_process).
//
// Unless stated otherwise, quote scenarios assume a newcomer
// (yearsWithMHPCO: 0) and the customer's first quote in the scenario,
// so every quoted premium includes the 10 % first-insurance surcharge
// (computed on the policy base premium) and the 5 G processing fee.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

const execFileAsync = promisify(execFile);

describe("MHPCO Claim Office", () => {
  describe("Quote: base premiums", () => {
    it("should quote 5 G for an empty item list (only the processing fee)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(results[0].premium).toBe(5);
    });
    it("should quote 115 G for a single plain sword (base 100 + 10 first insurance + 5 fee)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(results[0].premium).toBe(115);
    });
    it("should quote 71 G for a single plain amulet (base 60 + 6 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(results[0].premium).toBe(71);
    });
    it("should quote 93 G for a single plain staff (base 80 + 8 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(results[0].premium).toBe(93);
    });
    it("should quote 49 G for a single plain potion (base 40 + 4 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(results[0].premium).toBe(49);
    });
  });

  describe("Quote: component blocks", () => {
    it("should quote 60 G for 2 runes (base 50, no block)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(results[0].premium).toBe(60);
    });
    it("should quote 71 G for 3 runes (block base 60 instead of 75)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(results[0].premium).toBe(71);
    });
    it("should quote 115 G for 4 runes (base 100 — block requires exactly 3)", () => {
      const { results } = processScenario({
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

      expect(results[0].premium).toBe(115);
    });
    it("should quote 198 G for 7 runes (base 175, total 197.5 rounded up)", () => {
      const { results } = processScenario({
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
              { type: "rune" },
            ],
          },
        ],
      });

      expect(results[0].premium).toBe(198);
    });
    it("should quote 88 G for 2 runes + 1 moonstone (base 75 — no block across different types)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(results[0].premium).toBe(88);
    });
    it("should quote 137 G for 3 runes + 3 moonstones (base 120 — two separate blocks)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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
      });

      expect(results[0].premium).toBe(137);
    });
  });

  describe("Quote: premium modifiers", () => {
    it("should apply the curse surcharge only to the cursed item's base premium: cursed sword + plain amulet quotes 231 G (base 160 + 50 curse + 16 first insurance + 5 fee)", () => {
      const { results } = processScenario({
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

      expect(results[0].premium).toBe(231);
    });
    it("should apply the 20 % loyalty discount at exactly 2 years: plain sword quotes 95 G (100 - 20 + 10 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(results[0].premium).toBe(95);
    });
    it("should apply the high-enchantment surcharge at exactly enchantment 5: sword quotes 145 G (100 + 30 + 10 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      expect(results[0].premium).toBe(145);
    });
    it("should stack curse and high-enchantment surcharges: cursed sword with enchantment 5 quotes 195 G (100 + 30 + 50 + 10 + 5)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      });

      expect(results[0].premium).toBe(195);
    });
    it("should not apply the high-enchantment surcharge at enchantment 4: plain sword quotes 115 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      expect(results[0].premium).toBe(115);
    });
    it("should apply only the curse surcharge to a cursed sword with enchantment 4: quotes 165 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 4 }],
          },
        ],
      });

      expect(results[0].premium).toBe(165);
    });
  });

  describe("Quote: integration examples", () => {
    it("should quote 165 G for a newcomer with a cursed steel sword, enchantment 3 (100 + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
      const { results } = processScenario({
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

      expect(results[0].premium).toBe(165);
    });
    it("should quote 160 G for a 3-year customer's second quote with a cursed steel sword, enchantment 7 (100 + 50 + 30 - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee)", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });

      expect(results[1].premium).toBe(160);
    });
  });

  describe("Claim: standard reimbursement", () => {
    it("should pay 400 G for 500 G damage to a regular steel sword, enchantment 3 (full reimbursement minus 100 G deductible), remainingCap 1600 G", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 100 G for 200 G damage to a rune (no special clause applies), remainingCap 400 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim: special clauses", () => {
    it("should pay 400 G for 1000 G damage to a dragon-material sword with exactly enchantment 8 (50 % clause, then deductible)", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(results[1].payout).toBe(400);
    });
    it("should pay 400 G for 1000 G damage to a dragon-material sword with enchantment 9 (both clauses apply, the 50 % rule wins: 500 - 100)", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(results[1].payout).toBe(400);
    });
    it("should pay 700 G for 800 G damage to a dragon-material sword with enchantment 5 (full reimbursement, then deductible: 800 - 100)", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });

      expect(results[1].payout).toBe(700);
    });
    it("should pay 400 G for 1000 G damage to a steel sword with enchantment 9 (50 % first, then deductible: 500 - 100)", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(results[1].payout).toBe(400);
    });
  });

  describe("Claim: deductible per damage entry", () => {
    it("should apply the 100 G deductible once per damaged item: sword damaged 500 G and amulet damaged 300 G pays 600 G, remainingCap 2600 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim: multiple items of the same type", () => {
    it("should treat each damage entry as a separate damage with its own deductible: policy with two swords (cap 4000 G), two sword damages of 500 G each pay 800 G, remainingCap 3200 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("Claim: payout cap", () => {
    it("should cap the first of two 1500 G claims on a single insured sword at full reimbursement: payout 1400 G, remainingCap 600 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("should reduce the second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should base the cap on the unmodified insurance value: cursed sword (cap 2000 G), 2500 G damage pays 2000 G, remainingCap 0 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should exclude the block discount from the insurance sum: sword + 3 runes (cap 3500 G), 4000 G sword damage pays 3500 G, remainingCap 0 G", () => {
      const { results } = processScenario({
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
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 4000 }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
  });

  describe("Rounding in the MHPCO's favor", () => {
    it("should round the final premium up: a quote yielding 197.5 G results in 198 G", () => {
      const { results } = processScenario({
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
              { type: "rune" },
            ],
          },
        ],
      });

      expect(results[0].premium).toBe(198);
    });
    it("should round the final payout down: 901 G damage to a steel sword with enchantment 9 yields 350.5 G and pays 350 G", () => {
      const { results } = processScenario({
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
              cause: "dragon fire",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      expect(results[1].payout).toBe(350);
    });
  });

  describe("CLI", () => {
    it("should read a scenario from stdin and write results to stdout: schema example (5 years, amulet quote then 200 G fire damage) outputs premium 59, payout 100, remainingCap 1100 and exits with code 0", async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
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
      };

      const pending = execFileAsync("node_modules/.bin/tsx", ["src/cli.ts"]);
      pending.child.stdin?.end(JSON.stringify(scenario));
      const { stdout } = await pending;

      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    }, 15000);
    it("should exit non-zero with an error on stderr and no results on stdout for a quote with an unknown item type (broomstick)", async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const pending = execFileAsync("node_modules/.bin/tsx", ["src/cli.ts"]);
      pending.child.stdin?.end(JSON.stringify(scenario));
      const error = await pending.then(
        () => undefined,
        (failure) => failure as Error & { stdout: string; stderr: string },
      );

      expect(error).toBeDefined();
      expect(error?.stderr).not.toBe("");
      expect(error?.stdout).toBe("");
    }, 15000);
    it("should exit non-zero with an error on stderr for a claim damaging an item not in the policy (amulet damaged, only sword insured)", async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      };

      const pending = execFileAsync("node_modules/.bin/tsx", ["src/cli.ts"]);
      pending.child.stdin?.end(JSON.stringify(scenario));
      const error = await pending.then(
        () => undefined,
        (failure) => failure as Error & { stdout: string; stderr: string },
      );

      expect(error).toBeDefined();
      expect(error?.stderr).not.toBe("");
    }, 15000);
    it("should exit non-zero with an error on stderr for a claim with a damage entry of unknown item type", async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      };

      const pending = execFileAsync("node_modules/.bin/tsx", ["src/cli.ts"]);
      pending.child.stdin?.end(JSON.stringify(scenario));
      const error = await pending.then(
        () => undefined,
        (failure) => failure as Error & { stdout: string; stderr: string },
      );

      expect(error).toBeDefined();
      expect(error?.stderr).not.toBe("");
    }, 15000);
    it("should exit non-zero with an error on stderr when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", async () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      };

      const pending = execFileAsync("node_modules/.bin/tsx", ["src/cli.ts"]);
      pending.child.stdin?.end(JSON.stringify(scenario));
      const error = await pending.then(
        () => undefined,
        (failure) => failure as Error & { stdout: string; stderr: string },
      );

      expect(error).toBeDefined();
      expect(error?.stderr).not.toBe("");
    }, 15000);
    it.todo("should exit non-zero with an error on stderr for a damage entry with a negative amount (-200)");
  });
});
