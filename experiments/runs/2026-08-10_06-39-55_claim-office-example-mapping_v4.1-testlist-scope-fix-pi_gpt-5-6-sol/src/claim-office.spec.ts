import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { addProcessingFee, claimPayout, claimPayoutForPolicy, componentBasePremium, componentPrice, insuranceSum, loyaltyAdjustedPremium, mainItemPrice, policyAdjustedPremium, policyBasePremium, policyPayoutCap, processClaim, processScenario, quote, roundPayout, roundPremium } from "./claim-office.js";

function runClaimOfficeCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    cwd: process.cwd(),
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO Claim Office", () => {
  describe("quote price list and component blocks", () => {
    it("should quote an empty item list at 5 G — 0 G premium plus the 5 G processing fee", () => {
      expect(quote([])).toBe(5);
    });
    it("should use the main-item price list — sword 1000 G value/100 G base, amulet 600 G/60 G, staff 800 G/80 G, and potion 400 G/40 G", () => {
      expect(mainItemPrice("sword")).toEqual({ insuranceValue: 1000, basePremium: 100 });
      expect(mainItemPrice("amulet")).toEqual({ insuranceValue: 600, basePremium: 60 });
      expect(mainItemPrice("staff")).toEqual({ insuranceValue: 800, basePremium: 80 });
      expect(mainItemPrice("potion")).toEqual({ insuranceValue: 400, basePremium: 40 });
    });
    it("should use 250 G insurance value and 25 G base premium for each rune or moonstone component", () => {
      expect(componentPrice("rune")).toEqual({ insuranceValue: 250, basePremium: 25 });
      expect(componentPrice("moonstone")).toEqual({ insuranceValue: 250, basePremium: 25 });
    });
    it("should calculate 2 runes as 50 G base premium — no three-component block", () => {
      expect(componentBasePremium(["rune", "rune"])).toBe(50);
    });
    it("should calculate exactly 3 runes as 60 G base premium — one block of 3 alike components", () => {
      expect(componentBasePremium(["rune", "rune", "rune"])).toBe(60);
    });
    it("should calculate 4 runes as 100 G base premium — the block requires exactly 3, so no partial block applies", () => {
      expect(componentBasePremium(["rune", "rune", "rune", "rune"])).toBe(100);
    });
    it("should calculate 7 runes as 175 G base premium — blocks do not apply within a larger quantity", () => {
      expect(componentBasePremium(["rune", "rune", "rune", "rune", "rune", "rune", "rune"])).toBe(175);
    });
    it("should calculate 2 runes plus 1 moonstone as 75 G base premium — alike means exactly the same component type", () => {
      expect(componentBasePremium(["rune", "rune", "moonstone"])).toBe(75);
    });
    it("should calculate 3 runes plus 3 moonstones as 120 G base premium — two separate 60 G blocks", () => {
      expect(componentBasePremium(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toBe(120);
    });
  });

  describe("quote modifiers", () => {
    it("should add a 50% cursed surcharge only to the affected item base — cursed sword 100 G plus plain amulet 60 G becomes 210 G before policy modifiers and fee", () => {
      expect(policyBasePremium([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ])).toBe(210);
    });
    it("should not apply the high-enchantment surcharge at enchantment 4, while still adding the 50 G curse surcharge to a cursed 100 G sword", () => {
      expect(policyBasePremium([
        { type: "sword", material: "steel", enchantment: 4, cursed: true },
      ])).toBe(150);
    });
    it("should apply the 30% high-enchantment surcharge at exactly enchantment 5 and stack it with a curse — a cursed sword adds 30 G plus 50 G", () => {
      expect(policyBasePremium([
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ])).toBe(180);
    });
    it("should apply the 20% loyalty discount at exactly 2 years to the whole policy base premium", () => {
      expect(loyaltyAdjustedPremium(210, 2)).toBe(168);
    });
    it("should apply item-specific curse and enchantment modifiers per affected item, but calculate loyalty, first-insurance, and follow-up modifiers from the summed policy base", () => {
      expect(policyAdjustedPremium(210, {
        applyLoyaltyDiscount: true,
        applyFirstInsuranceSurcharge: true,
        applyFollowUpDiscount: true,
      })).toBe(157.5);
    });
    it("should add exactly one 5 G processing fee after every other premium modifier", () => {
      expect(addProcessingFee(policyAdjustedPremium(210, {
        applyLoyaltyDiscount: true,
        applyFirstInsuranceSurcharge: true,
        applyFollowUpDiscount: true,
      }))).toBe(162.5);
    });
    it("should quote a newcomer's first cursed steel sword at 165 G — 100 base + 50 curse + 10 first-insurance + 5 fee", () => {
      expect(quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(165);
    });
    it("should treat first insurance as applying to every item in a quote regardless of customer contract history", () => {
      expect(quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ], { yearsWithMHPCO: 5, previousContracts: 3 })).toBe(185);
    });
    it("should quote a 3-year customer's cursed enchantment-7 sword on their second contract at 160 G — 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee", () => {
      expect(quote([
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ], { yearsWithMHPCO: 3, previousContracts: 1 })).toBe(160);
    });
    it("should apply the 15% follow-up discount to every quote after the customer's first quote, based on sequential scenario history", () => {
      expect(processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      })).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("should round a final premium of 197.5 G up to 198 G in MHPCO's favor", () => {
      expect(roundPremium(197.5)).toBe(198);
    });
    it("should retain fractional intermediate premium amounts and round up only the final total after the 5 G fee", () => {
      expect(quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ], { yearsWithMHPCO: 2, previousContracts: 1 })).toBe(163);
    });
  });

  describe("claim reimbursement", () => {
    it("should pay 400 G for 500 G damage to a regular steel enchantment-3 sword — full reimbursement minus one 100 G deductible", () => {
      expect(claimPayout({
        type: "sword",
        material: "steel",
        enchantment: 3,
        cursed: false,
      }, 500)).toBe(400);
    });
    it("should pay 100 G for 200 G damage to a rune — components have no material or enchantment clause, then one 100 G deductible applies", () => {
      expect(claimPayout({ type: "rune" }, 200)).toBe(100);
    });
    it("should pay 400 G for 1000 G damage to a dragon sword at exactly enchantment 8 — the 50% enchantment rule wins, then the 100 G deductible", () => {
      expect(claimPayout({
        type: "sword",
        material: "dragon",
        enchantment: 8,
        cursed: false,
      }, 1000)).toBe(400);
    });
    it("should pay 400 G for 1000 G damage to a dragon sword at enchantment 9 — 50% reimbursement wins over full dragon reimbursement, then 100 G deductible", () => {
      expect(claimPayout({
        type: "sword",
        material: "dragon",
        enchantment: 9,
        cursed: false,
      }, 1000)).toBe(400);
    });
    it("should pay 700 G for 800 G damage to a dragon sword at enchantment 5 — full dragon reimbursement then the 100 G deductible", () => {
      expect(claimPayout({
        type: "sword",
        material: "dragon",
        enchantment: 5,
        cursed: false,
      }, 800)).toBe(700);
    });
    it("should pay 400 G for 1000 G damage to a steel sword at enchantment 9 — 50% reimbursement then the 100 G deductible", () => {
      expect(claimPayout({
        type: "sword",
        material: "steel",
        enchantment: 9,
        cursed: false,
      }, 1000)).toBe(400);
    });
    it("should pay 600 G for one incident damaging a sword by 500 G and an amulet by 300 G — a separate 100 G deductible applies to each damage entry", () => {
      expect(claimPayout([
        {
          item: { type: "sword", material: "steel", enchantment: 3, cursed: false },
          damageAmount: 500,
        },
        {
          item: { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          damageAmount: 300,
        },
      ])).toBe(600);
    });
    it("should treat two same-type damage entries as separate damaged copies with separate 100 G deductibles when two copies are insured", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const damages = [
        { item: insuredItems[0], damageAmount: 500 },
        { item: insuredItems[1], damageAmount: 300 },
      ];

      expect(claimPayoutForPolicy(insuredItems, damages)).toBe(600);
    });
    it("should round a final payout of 350.5 G down to 350 G in MHPCO's favor", () => {
      expect(roundPayout(350.5)).toBe(350);
    });
    it("should retain fractional intermediate payout amounts and round down only the final payout", () => {
      const highEnchantmentSword = {
        type: "sword",
        material: "steel",
        enchantment: 9,
        cursed: false,
      };

      expect(claimPayout([
        { item: highEnchantmentSword, damageAmount: 501 },
        { item: highEnchantmentSword, damageAmount: 501 },
        { item: highEnchantmentSword, damageAmount: 501 },
      ])).toBe(451);
    });
  });

  describe("insurance sums and policy caps", () => {
    it("should give a two-sword policy a 2000 G insurance sum and 4000 G payout cap", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];

      expect(insuranceSum(insuredItems)).toBe(2000);
      expect(policyPayoutCap(insuredItems)).toBe(4000);
    });
    it("should give a sword-and-amulet policy a 1600 G insurance sum and 3200 G payout cap", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];

      expect(insuranceSum(insuredItems)).toBe(1600);
      expect(policyPayoutCap(insuredItems)).toBe(3200);
    });
    it("should keep a cursed sword's cap at 2000 G from its unmodified 1000 G value even when its premium is 165 G", () => {
      const cursedSword = {
        type: "sword",
        material: "steel",
        enchantment: 3,
        cursed: true,
      };

      expect(quote([cursedSword], { yearsWithMHPCO: 0, previousContracts: 0 })).toBe(165);
      expect(policyPayoutCap([cursedSword])).toBe(2000);
    });
    it("should give a sword plus a 3-rune block a 1750 G insurance sum — 1000 + 3×250 — because the premium block does not reduce insured value", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ];

      expect(insuranceSum(insuredItems)).toBe(1750);
    });
    it("should process the first 1500 G sword claim at 1400 G and leave 600 G of the 2000 G policy cap", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];

      expect(processClaim(insuredItems, [{ item: insuredItems[0], damageAmount: 1500 }], 2000)).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("should process a second successive 1500 G sword claim at only 600 G and leave 0 G cap — the desired 1400 G payout is capped by the remainder", () => {
      const insuredItems = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ];
      const firstClaim = processClaim(
        insuredItems,
        [{ item: insuredItems[0], damageAmount: 1500 }],
        2000,
      );

      expect(processClaim(
        insuredItems,
        [{ item: insuredItems[0], damageAmount: 1500 }],
        firstClaim.remainingCap,
      )).toEqual({
        payout: 600,
        remainingCap: 0,
      });
    });
  });

  describe("sequential scenario and CLI contract", () => {
    it("should process steps in input order and let a claim policy field reference an earlier quote by its zero-based step index", () => {
      expect(processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      })).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("should return one result per step in the same order, using {premium: integer} for quotes and {payout: integer, remainingCap: integer} for claims", () => {
      expect(processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      })).toEqual({
        results: [
          { premium: 115 },
          { premium: 100 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("should process the normative 5-year-customer schema scenario as [{premium: 59}, {payout: 100, remainingCap: 1100}] for an amulet quote followed by 200 G fire damage", () => {
      expect(processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
      })).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    });
    it("should expose src/cli.ts as the claim-office command, read one JSON scenario from stdin, and write only the JSON results document to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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

      const command = runClaimOfficeCli(scenario);

      expect(command.status).toBe(0);
      expect(command.stderr).toBe("");
      expect(command.stdout).toBe(`${JSON.stringify({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      })}\n`);
    });
  });

  describe("CLI validation and rejection", () => {
    it("should reject a quote containing unknown type broomstick with non-zero exit status, an error on stderr, and no results on stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
          },
        ],
      };

      const command = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
        cwd: process.cwd(),
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });

      expect(command.status).not.toBe(0);
      expect(command.stderr).not.toBe("");
      expect(command.stdout).toBe("");
    });
    it("should reject a claim for an amulet when its referenced policy covers only a sword, with non-zero exit status and an error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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

      const command = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
        cwd: process.cwd(),
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });

      expect(command.status).not.toBe(0);
      expect(command.stderr).not.toBe("");
      expect(command.stdout).toBe("");
    });
    it("should reject a claim damage entry with an unknown item type, with non-zero exit status and an error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
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

      const command = runClaimOfficeCli(scenario);

      expect(command.status).not.toBe(0);
      expect(command.stderr).not.toBe("");
      expect(command.stdout).toBe("");
    });
    it("should reject an entire claim when same-type damages outnumber insured copies — two sword damages against one insured sword produce non-zero exit status and no payout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
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
      };

      const command = runClaimOfficeCli(scenario);

      expect(command.status).not.toBe(0);
      expect(command.stderr).not.toBe("");
      expect(command.stdout).toBe("");
    });
    it("should reject a claim damage amount of -200 G with non-zero exit status and an error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };

      const command = runClaimOfficeCli(scenario);

      expect(command.status).not.toBe(0);
      expect(command.stderr).not.toBe("");
      expect(command.stdout).toBe("");
    });
  });
});
