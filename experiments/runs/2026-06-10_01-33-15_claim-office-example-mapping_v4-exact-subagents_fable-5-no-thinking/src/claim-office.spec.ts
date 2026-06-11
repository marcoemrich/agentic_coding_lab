// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Premium calculation (quote)", () => {
    it("should return premium 5 for an empty item list (processing fee only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result.results[0].premium).toBe(5);
    });
    it("should quote a single sword at base premium 100 (plus first-insurance surcharge and fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results[0].premium).toBe(115);
    });
    it("should use base premiums amulet 60, staff 80, potion 40", () => {
      const amuletResult = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      const staffResult = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      const potionResult = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(amuletResult.results[0].premium).toBe(71);
      expect(staffResult.results[0].premium).toBe(93);
      expect(potionResult.results[0].premium).toBe(49);
    });
    it("should charge 25 per component: 2 runes give base premium 50", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result.results[0].premium).toBe(60);
    });
    it("should apply the block premium 60 for exactly 3 alike components: 3 runes give base premium 60", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      expect(result.results[0].premium).toBe(71);
    });
    it("should not apply the block to 4 alike components: 4 runes give base premium 100", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results[0].premium).toBe(115);
    });
    it("should price 7 runes at base premium 175", () => {
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
              { type: "rune" },
            ],
          },
        ],
      });

      expect(result.results[0].premium).toBe(198);
    });
    it("should not form a block from different component types: 2 runes + 1 moonstone give base premium 75", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });

      expect(result.results[0].premium).toBe(88);
    });
    it("should form one block per component type: 3 runes + 3 moonstones give base premium 120", () => {
      const result = runScenario({
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

      expect(result.results[0].premium).toBe(137);
    });
    it("should add 50% of the item base premium for a cursed item", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", cursed: true }] }],
      });

      expect(result.results[0].premium).toBe(101);
    });
    it("should add 30% of the item base premium for enchantment level exactly 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      expect(result.results[0].premium).toBe(145);
    });
    it("should not add the enchantment surcharge for enchantment level 4", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      expect(result.results[0].premium).toBe(115);
    });
    it("should stack curse and enchantment surcharges on one item", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] },
        ],
      });

      expect(result.results[0].premium).toBe(195);
    });
    it("should apply the cursed surcharge only to the cursed item's base premium: cursed sword + plain amulet give 210 before policy modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
        ],
      });

      expect(result.results[0].premium).toBe(231);
    });
    it("should apply the 20% loyalty discount for yearsWithMHPCO exactly 2", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results[0].premium).toBe(95);
    });
    it("should apply the 10% first-insurance surcharge to every quote", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result.results.length).toBe(2);
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].premium).toBe(100);
    });
    it("should apply the 15% follow-up discount to each quote after the first", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });

      expect(result.results.map((r) => r.premium)).toEqual([71, 62, 62]);
    });
    it("should round the final premium up to whole gold (197.5 becomes 198)", () => {
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
              { type: "rune" },
            ],
          },
        ],
      });

      expect(result.results[0].premium).toBe(198);
    });
    it("should quote 165 for a newcomer (0 years) with a cursed steel sword of enchantment 3", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result.results[0].premium).toBe(165);
    });
    it("should quote 160 for a 3-year customer's second quote with a cursed sword of enchantment 7", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      });

      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("Claim payout", () => {
    it("should subtract the 100 deductible from the damage amount: regular sword (enchantment 3) damaged 500 pays out 400", () => {
      const result = runScenario({
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

      expect(result.results[1].payout).toBe(400);
    });
    it("should apply the deductible per damaged item, not per incident: sword 500 + amulet 300 pay out 600", () => {
      const result = runScenario({
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

      expect(result.results[1].payout).toBe(600);
    });
    it("should reimburse 50% of the damage for enchantment level 9 or higher than 8 (steel sword enchantment 9), before the deductible", () => {
      const result = runScenario({
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
              cause: "duel",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(400);
    });
    it("should reimburse dragon-material items in full: dragon sword enchantment 5 gets full reimbursement", () => {
      const result = runScenario({
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

      expect(result.results[1].payout).toBe(700);
    });
    it("should let the 50% rule win when dragon material and enchantment 8 combine: dragon sword enchantment exactly 8, damage 1000 pays out 400", () => {
      const result = runScenario({
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

      expect(result.results[1].payout).toBe(400);
    });
    it("should treat components as having no enchantment or material: rune damaged 200 pays out 100", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "mishap",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(100);
    });
    it("should return remainingCap as 2x the insurance sum minus payouts: sword + amulet have insurance sum 1600 and cap 3200", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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

      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(2800);
    });
    it("should keep the insurance sum unmodified by the block discount: sword + 3 runes have insurance sum 1750", () => {
      const result = runScenario({
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
              cause: "mishap",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(3400);
    });
    it("should sum same-type items into the insurance sum: two swords have insurance sum 2000 and cap 4000", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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

      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(3600);
    });
    it("should consume the cap across successive claims: sword (cap 2000) with two claims of 1500 pays 1400 then 600", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
    it("should round the final payout down to whole gold (350.5 becomes 350)", () => {
      const result = runScenario({
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
              cause: "duel",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(350);
    });
    it("should apply a separate deductible per damage entry for two insured swords", () => {
      const result = runScenario({
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result.results[1].payout).toBe(600);
      expect(result.results[1].remainingCap).toBe(3400);
    });
  });

  describe("Errors", () => {
    it("should reject a quote containing an unknown item type (broomstick)", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
    it("should reject a claim damage entry whose item type is not in the policy (amulet damaged, only sword insured)", () => {
      expect(() =>
        runScenario({
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
        }),
      ).toThrow();
    });
    it("should reject a claim with more damage entries of a type than items insured (two sword damages, one sword insured)", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
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
        }),
      ).toThrow();
    });
    it("should reject a claim damage entry with an unknown item type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "broomstick", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("should reject a negative damage amount", () => {
      expect(() =>
        runScenario({
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
        }),
      ).toThrow();
    });
  });

  describe("CLI", () => {
    it(
      "should read a JSON scenario from stdin and write {results: [...]} to stdout with exit code 0",
      () => {
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

        const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
          input: JSON.stringify(scenario),
          encoding: "utf8",
        });

        expect(result.status).toBe(0);
        expect(JSON.parse(result.stdout)).toEqual({
          results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
        });
      },
      30000,
    );
    it(
      "should exit non-zero with the error on stderr and no results on stdout for an invalid scenario",
      () => {
        const scenario = {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        };

        const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
          input: JSON.stringify(scenario),
          encoding: "utf8",
        });

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain("broomstick");
        expect(result.stdout).not.toContain("results");
      },
      30000,
    );
  });
});
