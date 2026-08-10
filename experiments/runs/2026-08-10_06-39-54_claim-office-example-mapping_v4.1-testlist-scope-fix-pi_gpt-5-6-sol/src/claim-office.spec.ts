import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  addProcessingFee,
  calculateBasePremium,
  calculateClaimPayout,
  calculateClaimPayoutUnrounded,
  calculateCursedSurcharge,
  calculateFirstInsuranceSurcharge,
  calculateFollowUpDiscount,
  calculateHighEnchantmentSurcharge,
  calculateInsuranceValue,
  calculateLoyaltyDiscount,
  calculatePremiumBeforePolicyModifiers,
  calculatePremium,
  calculatePremiumUnrounded,
  calculatePolicyCap,
  createClaimResult,
  createQuoteResult,
  processScenario,
  processStepsInOrder,
  roundClaimPayout,
  roundPremium,
  resolveClaimPolicy,
  validateScenario,
  validateScenarioTypes,
  validateDamageMultiplicity,
} from "./claim-office.js";

// Test-list phase only. The imports above document the intended domain seam;
// CLI contract tests will exercise src/cli.ts through a child process.
void expect;
void calculateBasePremium;
void processScenario;
void validateScenario;
void validateDamageMultiplicity;

describe("MHPCO Claim Office", () => {
  describe("base premiums and insurance values", () => {
    it("should price an empty item list at 0 G base premium and quote it at 5 G including only the processing fee", () => {
      expect(calculateBasePremium([])).toBe(0);
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [] }],
        }),
      ).toEqual({ results: [{ premium: 5 }] });
    });
    it("should assign sword a 100 G base premium and 1000 G insurance value", () => {
      const items = [{ type: "sword" }];

      expect(calculateBasePremium(items)).toBe(100);
      expect(calculateInsuranceValue(items)).toBe(1000);
    });
    it("should assign amulet a 60 G base premium and 600 G insurance value", () => {
      const items = [{ type: "amulet" }];

      expect(calculateBasePremium(items)).toBe(60);
      expect(calculateInsuranceValue(items)).toBe(600);
    });
    it("should assign staff an 80 G base premium and 800 G insurance value", () => {
      const items = [{ type: "staff" }];

      expect(calculateBasePremium(items)).toBe(80);
      expect(calculateInsuranceValue(items)).toBe(800);
    });
    it("should assign potion a 40 G base premium and 400 G insurance value", () => {
      const items = [{ type: "potion" }];

      expect(calculateBasePremium(items)).toBe(40);
      expect(calculateInsuranceValue(items)).toBe(400);
    });
    it("should assign each rune or moonstone a 25 G base premium and 250 G insurance value", () => {
      for (const type of ["rune", "moonstone"]) {
        const items = [{ type }];

        expect(calculateBasePremium(items)).toBe(25);
        expect(calculateInsuranceValue(items)).toBe(250);
      }
    });
  });

  describe("component building blocks", () => {
    it("should calculate 2 runes as 50 G base premium", () => {
      expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
    });
    it("should calculate exactly 3 runes as one building block with 60 G base premium", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(60);
    });
    it("should calculate 4 runes as 100 G base premium because the block requires exactly 3 alike components", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(100);
    });
    it("should calculate 7 runes as 175 G base premium without extracting a block from a larger same-type quantity", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(175);
    });
    it("should calculate 2 runes plus 1 moonstone as 75 G base premium because alike means exactly the same component type", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ]),
      ).toBe(75);
    });
    it("should calculate 3 runes plus 3 moonstones as two separate same-type blocks totaling 120 G base premium", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      ).toBe(120);
    });
  });

  describe("premium modifiers", () => {
    it("should add a 50% item-specific surcharge to a cursed item", () => {
      expect(calculateCursedSurcharge({ type: "sword", cursed: true })).toBe(50);
    });
    it("should apply the 30% high-enchantment surcharge at exactly enchantment 5", () => {
      expect(
        calculateHighEnchantmentSurcharge({ type: "sword", enchantment: 5 }),
      ).toBe(30);
    });
    it("should not apply the high-enchantment surcharge at enchantment 4", () => {
      expect(
        calculateHighEnchantmentSurcharge({ type: "sword", enchantment: 4 }),
      ).toBe(0);
    });
    it("should apply the 20% policy-wide loyalty discount at exactly 2 years with MHPCO", () => {
      expect(calculateLoyaltyDiscount(100, 2)).toBe(20);
    });
    it("should add a 10% first-insurance surcharge to every newly quoted item regardless of customer contract history", () => {
      expect(calculateFirstInsuranceSurcharge(100, 0)).toBe(10);
      expect(calculateFirstInsuranceSurcharge(100, 5)).toBe(10);
    });
    it("should apply a 15% policy-wide follow-up discount to each quote after the customer's first quote in the scenario", () => {
      expect(calculateFollowUpDiscount(100, 0)).toBe(0);
      expect(calculateFollowUpDiscount(100, 1)).toBe(15);
      expect(calculateFollowUpDiscount(100, 2)).toBe(15);
    });
    it("should add the 5 G processing fee after all premium modifiers", () => {
      expect(addProcessingFee(160)).toBe(165);
    });
    it("should charge 210 G before policy-wide modifiers and fee for a cursed sword and plain amulet: 160 G policy base plus 50 G curse on only the sword", () => {
      expect(
        calculatePremiumBeforePolicyModifiers([
          { type: "sword", cursed: true },
          { type: "amulet" },
        ]),
      ).toBe(210);
    });
    it("should stack curse and high-enchantment item surcharges at enchantment 5 rather than choosing one", () => {
      expect(
        calculatePremiumBeforePolicyModifiers([
          { type: "sword", cursed: true, enchantment: 5 },
        ]),
      ).toBe(180);
    });
    it("should keep policy-wide loyalty, first-insurance, and follow-up percentages based on the summed policy base while item modifiers use only each affected item's base", () => {
      expect(
        calculatePremium(
          [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
          2,
          1,
        ),
      ).toBe(175);
    });
    it("should quote a newcomer’s first cursed steel sword at enchantment 3 for 165 G: 100 base + 50 curse + 10 first-insurance + 5 fee", () => {
      expect(
        calculatePremium(
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          0,
          0,
        ),
      ).toBe(165);
    });
    it("should quote a 3-year customer's second quote containing a new cursed enchantment-7 sword for 160 G: 100 + 50 + 30 - 20 + 10 - 15 + 5", () => {
      expect(
        calculatePremium(
          [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          3,
          1,
        ),
      ).toBe(160);
    });
  });

  describe("premium rounding", () => {
    it("should round a final premium of 197.5 G up to 198 G in MHPCO's favor", () => {
      expect(roundPremium(197.5)).toBe(198);
    });
    it("should preserve fractional intermediate premium amounts and round up only the final total after the 5 G fee", () => {
      const items = [{ type: "rune" }];

      expect(calculatePremiumUnrounded(items, 0, 0)).toBe(32.5);
      expect(calculatePremium(items, 0, 0)).toBe(33);
    });
  });

  describe("claim reimbursement", () => {
    it("should reimburse a regular steel enchantment-3 sword damaged for 500 G at 400 G after one 100 G deductible", () => {
      expect(
        calculateClaimPayout(
          [{ type: "sword", material: "steel", enchantment: 3 }],
          [{ itemType: "sword", amount: 500 }],
        ),
      ).toBe(400);
    });
    it("should reimburse a rune damaged for 200 G at 100 G because components have no material or enchantment special clause", () => {
      expect(
        calculateClaimPayout(
          [{ type: "rune" }],
          [{ itemType: "rune", amount: 200 }],
        ),
      ).toBe(100);
    });
    it("should reimburse a dragon-material enchantment-5 sword damaged for 800 G at 700 G: full reimbursement then 100 G deductible", () => {
      expect(
        calculateClaimPayout(
          [{ type: "sword", material: "dragon", enchantment: 5 }],
          [{ itemType: "sword", amount: 800 }],
        ),
      ).toBe(700);
    });
    it("should reimburse a steel enchantment-9 sword damaged for 1000 G at 400 G: 50% reimbursement then 100 G deductible", () => {
      expect(
        calculateClaimPayout(
          [{ type: "sword", material: "steel", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toBe(400);
    });
    it("should reimburse a dragon-material sword at exactly enchantment 8 damaged for 1000 G at 400 G because the 50% enchantment clause wins, then the deductible applies", () => {
      expect(
        calculateClaimPayout(
          [{ type: "sword", material: "dragon", enchantment: 8 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toBe(400);
    });
    it("should reimburse a dragon-material enchantment-9 sword damaged for 1000 G at 400 G because the 50% enchantment clause overrides full dragon reimbursement", () => {
      expect(
        calculateClaimPayout(
          [{ type: "sword", material: "dragon", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toBe(400);
    });
    it("should apply the 100 G deductible separately to sword damage of 500 G and amulet damage of 300 G, paying 600 G total", () => {
      expect(
        calculateClaimPayout(
          [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet" },
          ],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toBe(600);
    });
    it("should treat two same-type damage entries as separate events with separate deductibles when two matching items are insured", () => {
      expect(
        calculateClaimPayout(
          [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "sword", material: "steel", enchantment: 3 },
          ],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toBe(600);
    });
    it("should round a final payout of 350.5 G down to 350 G in MHPCO's favor", () => {
      expect(roundClaimPayout(350.5)).toBe(350);
    });
    it("should preserve fractional intermediate payout amounts and round down only the final claim payout", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 8 }];
      const damages = [{ itemType: "sword", amount: 901 }];

      expect(calculateClaimPayoutUnrounded(items, damages)).toBe(350.5);
      expect(calculateClaimPayout(items, damages)).toBe(350);
    });
  });

  describe("policy sums, caps, and sequential claims", () => {
    it("should create a 3200 G cap for a sword-and-amulet policy from the 1600 G summed insurance value", () => {
      expect(calculatePolicyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    });
    it("should create a 2000 G cap for a cursed sword from its unmodified 1000 G insurance value even when its premium is 165 G", () => {
      expect(calculatePolicyCap([{ type: "sword", cursed: true }])).toBe(2000);
    });
    it("should create a 3500 G cap for a sword and 3-rune block from the 1750 G insurance sum, unaffected by the block premium discount", () => {
      expect(
        calculatePolicyCap([
          { type: "sword" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(3500);
    });
    it("should create a 4000 G cap for a two-sword policy from its 2000 G insurance sum", () => {
      expect(calculatePolicyCap([{ type: "sword" }, { type: "sword" }])).toBe(
        4000,
      );
    });
    it("should process the first 1500 G damage claim on a sword policy as a 1400 G payout with 600 G remaining cap", () => {
      const scenarioResult = processScenario({
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
        ],
      });

      expect(scenarioResult.results[1]).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("should process two successive independent 1500 G claims on one sword policy as payouts of 1400 G then 600 G, leaving 0 G cap", () => {
      const scenarioResult = processScenario({
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
              cause: "ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(scenarioResult.results).toEqual([
        { premium: 165 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("should return 0 G payout and 0 G remaining cap for further otherwise-payable claims after the policy cap is exhausted", () => {
      const scenarioResult = processScenario({
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
              cause: "ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "siege",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(scenarioResult.results[3]).toEqual({
        payout: 0,
        remainingCap: 0,
      });
    });
    it("should maintain separate remaining caps for policies created by different earlier quote-step indices", () => {
      const scenarioResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
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
            policy: 1,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 700 }],
            },
          },
        ],
      });

      expect(scenarioResult.results).toEqual([
        { premium: 165 },
        { premium: 160 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 600 },
      ]);
    });
  });

  describe("scenario sequencing and exact result contract", () => {
    it("should process steps in input order and return one result per step in the same order", () => {
      expect(
        processStepsInOrder({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [] },
            { op: "quote", items: [{ type: "sword" }] },
            { op: "quote", items: [{ type: "amulet" }] },
          ],
        }),
      ).toEqual([{ premium: 5 }, { premium: 165 }, { premium: 160 }]);
    });
    it("should return each quote result with exactly the integer field {premium}", () => {
      expect(createQuoteResult(59)).toEqual({ premium: 59 });
    });
    it("should return each claim result with exactly the integer fields {payout, remainingCap}", () => {
      expect(createClaimResult(100, 1100)).toEqual({
        payout: 100,
        remainingCap: 1100,
      });
    });
    it("should resolve a claim's zero-based policy field to the earlier quote step that created that policy", () => {
      const steps = [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ];

      expect(resolveClaimPolicy(steps, 2)).toEqual({
        items: [{ type: "sword" }],
      });
    });
    it("should process the normative 5-year-customer schema example as exactly {results:[{premium:59},{payout:100,remainingCap:1100}]}", () => {
      expect(
        processScenario({
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
        }),
      ).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    });
  });

  describe("CLI JSON I/O and validation", () => {
    it("should have src/cli.ts read one scenario JSON document from stdin and write only the exact {results:[...]} JSON document to stdout", () => {
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

      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify(scenario),
          encoding: "utf8",
        },
      );

      expect(result.status).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toBe(
        JSON.stringify({
          results: [
            { premium: 59 },
            { payout: 100, remainingCap: 1100 },
          ],
        }),
      );
    });
    it("should reject a quote item of unknown type broomstick with non-zero status, an error description on stderr, and no results on stdout", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject a claim for an amulet when its referenced policy insures only a sword, with non-zero status and an error description on stderr", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
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
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject a claim damage entry with an unknown item type with non-zero status and an error description on stderr", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [
              { op: "quote", items: [{ type: "sword" }] },
              {
                op: "claim",
                policy: 0,
                incident: {
                  cause: "battle",
                  damages: [{ itemType: "broomstick", amount: 200 }],
                },
              },
            ],
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject amount -200 with non-zero status and an error description on stderr", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [
              { op: "quote", items: [{ type: "sword" }] },
              {
                op: "claim",
                policy: 0,
                incident: {
                  cause: "battle",
                  damages: [{ itemType: "sword", amount: -200 }],
                },
              },
            ],
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("should reject two sword damage entries when only one sword is insured, with non-zero status and the whole claim rejected", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [
              { op: "quote", items: [{ type: "sword" }] },
              {
                op: "claim",
                policy: 0,
                incident: {
                  cause: "battle",
                  damages: [
                    { itemType: "sword", amount: 200 },
                    { itemType: "sword", amount: 300 },
                  ],
                },
              },
            ],
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject any damage-type multiplicity exceeding the count of that type on the policy, even when other damage entries are valid", () => {
      expect(() =>
        validateDamageMultiplicity({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword" }, { type: "amulet" }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "battle",
                damages: [
                  { itemType: "amulet", amount: 200 },
                  { itemType: "sword", amount: 200 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("should reject a policy index that does not identify an earlier quote step with non-zero status and an error description on stderr", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [
              { op: "quote", items: [{ type: "sword" }] },
              {
                op: "claim",
                policy: 1,
                incident: {
                  cause: "battle",
                  damages: [{ itemType: "sword", amount: 200 }],
                },
              },
            ],
          }),
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject malformed JSON with non-zero status, an error description on stderr, and no results JSON on stdout", () => {
      const result = spawnSync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts"],
        {
          input: "{malformed JSON",
          encoding: "utf8",
        },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject input violating the normative required customer, yearsWithMHPCO, steps, operation, items, policy, incident, cause, damages, itemType, or amount fields", () => {
      const invalidScenarios: unknown[] = [
        { steps: [] },
        { customer: {}, steps: [] },
        { customer: { yearsWithMHPCO: 0 } },
        { customer: { yearsWithMHPCO: 0 }, steps: [{}] },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote" }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{}] }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "claim", incident: { cause: "fire", damages: [] } }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "claim", policy: 0 }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "claim", policy: 0, incident: { damages: [] } }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "claim", policy: 0, incident: { cause: "fire" } }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ amount: 200 }] },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword" }] },
            },
          ],
        },
      ];

      for (const scenario of invalidScenarios) {
        expect(() => validateScenario(scenario)).toThrow();
      }
    });
    it("should reject normative schema type violations, non-integer yearsWithMHPCO, policy, enchantment, or amount values, and unsupported op values", () => {
      const invalidScenarios: unknown[] = [
        { customer: { yearsWithMHPCO: "5" }, steps: [] },
        { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
        { customer: { yearsWithMHPCO: 0 }, steps: "not-an-array" },
        { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "renew" }] },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", enchantment: 2.5 }] }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0.5,
              incident: {
                cause: "battle",
                damages: [{ itemType: "sword", amount: 200 }],
              },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "battle",
                damages: [{ itemType: "sword", amount: 200.5 }],
              },
            },
          ],
        },
      ];

      for (const scenario of invalidScenarios) {
        expect(() => validateScenarioTypes(scenario)).toThrow();
      }
    });
  });
});
