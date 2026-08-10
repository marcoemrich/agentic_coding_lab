import { describe, expect, it } from "vitest";
import {
  isSupportedOperation,
  runClaimOfficeCli,
  runClaimOfficeCliProcess,
} from "./cli.js";
import {
  addProcessingFee,
  calculateBasePremium,
  calculateClaimPayout,
  calculatePolicyCap,
  calculatePremium,
  getNormativeFieldNames,
  processClaim,
  processNormativeSchemaExample,
  roundPremiumInFavor,
  roundPayoutInFavor,
  processScenario,
  processScenarioResults,
  processScenarioWithIndependentPolicyCaps,
} from "./claim-office.js";

// Test-list phase only. CLI cases exercise src/cli.ts through a child process once activated.
void expect;
void processScenario;

describe("MHPCO Claim Office", () => {
  describe("quotes and base premiums", () => {
    it("should quote an empty item list at 5 G — 0 G premium plus the 5 G processing fee", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [] }],
        }),
      ).toEqual({ results: [{ premium: 5 }] });
    });
    it("should use the sword price-list values — 1000 G insurance value and 100 G base premium (115 G newcomer quote including 10 G first-insurance surcharge and 5 G fee)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword" }] }],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    it("should use the amulet price-list values — 600 G insurance value and 60 G base premium (71 G newcomer quote including 6 G first-insurance surcharge and 5 G fee)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "amulet" }] }],
        }),
      ).toEqual({ results: [{ premium: 71 }] });
    });
    it("should use the staff price-list values — 800 G insurance value and 80 G base premium (93 G newcomer quote including 8 G first-insurance surcharge and 5 G fee)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "staff" }] }],
        }),
      ).toEqual({ results: [{ premium: 93 }] });
    });
    it("should use the potion price-list values — 400 G insurance value and 40 G base premium (49 G newcomer quote including 4 G first-insurance surcharge and 5 G fee)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "potion" }] }],
        }),
      ).toEqual({ results: [{ premium: 49 }] });
    });
    it("should insure one component at 250 G with a 25 G base premium — 33 G newcomer quote after 2.5 G first-insurance surcharge, 5 G fee, and final ceiling", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "rune" }] }],
        }),
      ).toEqual({ results: [{ premium: 33 }] });
    });
    it("should price 2 runes without a block — 50 G base premium", () => {
      expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
    });
    it("should apply the exact block offer to 3 runes — 60 G base premium instead of 75 G", () => {
      expect(
        calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
      ).toBe(60);
    });
    it("should not apply a block to 4 runes because the block requires exactly 3 — 100 G base premium", () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(100);
    });
    it("should not decompose 7 runes into blocks — 175 G base premium", () => {
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
    it("should treat component types as unlike — 2 runes plus 1 moonstone cost 75 G base premium with no block", () => {
      expect(
        calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      ).toBe(75);
    });
    it("should form blocks separately by exact component type — 3 runes plus 3 moonstones cost 120 G base premium", () => {
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
    it("should add a cursed surcharge only to the affected item — cursed sword plus plain amulet has 160 G policy base and 50 G curse surcharge, totaling 210 G before policy modifiers and fee (231 G newcomer quote)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", cursed: true }, { type: "amulet" }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 231 }] });
    });
    it("should apply the high-enchantment surcharge at exactly enchantment 5 — plain sword adds 30 G and produces a 145 G newcomer premium", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
        }),
      ).toEqual({ results: [{ premium: 145 }] });
    });
    it("should not apply the high-enchantment surcharge at enchantment 4 — a plain sword produces a 115 G newcomer premium", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    it("should stack curse and high-enchantment surcharges at enchantment 5 — 100 G base + 50 G curse + 30 G enchantment + 10 G first insurance + 5 G fee = 195 G", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", cursed: true, enchantment: 5 }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 195 }] });
    });
    it("should apply only the curse surcharge to a cursed enchantment-4 sword — 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", cursed: true, enchantment: 4 }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 165 }] });
    });
    it("should apply the 20% loyalty discount at exactly 2 years to the policy base — plain sword premium is 95 G (100 - 20 + 10 + 5)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 2 },
          steps: [{ op: "quote", items: [{ type: "sword" }] }],
        }),
      ).toEqual({ results: [{ premium: 95 }] });
    });
    it("should not apply the loyalty discount below 2 years — a 1-year customer's plain sword premium is 115 G (100 + 10 + 5)", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 1 },
          steps: [{ op: "quote", items: [{ type: "sword" }] }],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    it("should add the 10% first-insurance surcharge to every quoted item's policy base regardless of customer contract history — a long-standing customer's newly quoted plain sword includes +10 G", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 5 },
          steps: [{ op: "quote", items: [{ type: "sword" }] }],
        }),
      ).toEqual({ results: [{ premium: 95 }] });
    });
    it("should discount every quote after the customer's first contract by 15% of policy base — a 0-year customer's second plain-sword quote is 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("should add the fixed 5 G processing fee after all percentage modifiers — the fee is exactly 5 G and is not itself surcharged or discounted", () => {
      expect(addProcessingFee(90)).toBe(95);
    });
    it("should quote a newcomer's cursed steel enchantment-3 sword at 165 G — 100 base + 50 curse + 10 first insurance + 5 fee", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: true },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 165 }] });
    });
    it("should sequentially quote a 3-year customer's cursed enchantment-7 sword on their second contract at 160 G — 100 + 50 + 30 - 20 + 10 - 15 + 5", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 3 },
          steps: [
            { op: "quote", items: [] },
            {
              op: "quote",
              items: [{ type: "sword", cursed: true, enchantment: 7 }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
    });
  });

  describe("claims", () => {
    it("should fully reimburse ordinary damage before one 100 G deductible — steel enchantment-3 sword damage of 500 G pays 400 G", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "steel", enchantment: 3 },
          500,
        ),
      ).toBe(400);
    });
    it("should treat components as having no enchantment or material clause — rune damage of 200 G pays 100 G after the deductible", () => {
      expect(calculateClaimPayout({ type: "rune" }, 200)).toBe(100);
    });
    it("should never produce a negative payout when damage does not exceed the deductible — ordinary damage of 100 G pays 0 G", () => {
      expect(calculateClaimPayout({ type: "sword" }, 100)).toBe(0);
    });
    it("should apply the high-enchantment clause at exactly enchantment 8 before the deductible even for dragon material — 1000 G damage pays 400 G (500 - 100)", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "dragon", enchantment: 8 },
          1000,
        ),
      ).toBe(400);
    });
    it("should let the 50% high-enchantment rule win when a dragon-material enchantment-9 sword is damaged — 1000 G damage pays 400 G (500 - 100)", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "dragon", enchantment: 9 },
          1000,
        ),
      ).toBe(400);
    });
    it("should fully reimburse dragon material below enchantment 8 before the deductible — enchantment-5 dragon sword damage of 800 G pays 700 G", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "dragon", enchantment: 5 },
          800,
        ),
      ).toBe(700);
    });
    it("should reimburse a non-dragon enchantment-9 sword at 50% before the deductible — 1000 G damage pays 400 G (500 - 100)", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "steel", enchantment: 9 },
          1000,
        ),
      ).toBe(400);
    });
    it("should apply the 100 G deductible separately to each damage entry — sword damage 500 G plus amulet damage 300 G pays 600 G (400 + 200), leaving 2600 G of a 3200 G cap", () => {
      expect(
        processClaim(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
          3200,
        ),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should match repeated item types by occurrence — two insured swords may receive two 500 G damage entries, paying 800 G with two deductibles and leaving 3200 G of the 4000 G cap", () => {
      expect(
        processClaim(
          [{ type: "sword" }, { type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
          4000,
        ),
      ).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("insurance sums, caps, and sequential policy state", () => {
    it("should sum duplicate insured items independently — two swords have a 2000 G insurance sum and a 4000 G payout cap", () => {
      expect(calculatePolicyCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
    });
    it("should base a sword-and-amulet cap on their 1600 G insurance sum — cap is 3200 G", () => {
      expect(calculatePolicyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    });
    it("should ignore premium modifiers when calculating the cap — a cursed sword premium is 165 G but its 1000 G insurance value yields a 2000 G cap", () => {
      expect(calculatePolicyCap([{ type: "sword", cursed: true }])).toBe(2000);
    });
    it("should ignore a component block discount when calculating insurance sum — sword plus 3 runes has a 1750 G insurance sum and a 3500 G cap", () => {
      expect(
        calculatePolicyCap([
          { type: "sword" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(3500);
    });
    it("should preserve a policy's remaining cap across claims — on a sword policy, successive 1500 G claims pay 1400 G then 600 G, with remaining caps 600 G then 0 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "first accident",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "second accident",
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
    it("should return 0 G after a policy cap is exhausted — a later otherwise-payable claim leaves the cap at 0 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "first accident",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "second accident",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "third accident",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(result.results[3]).toEqual({ payout: 0, remainingCap: 0 });
    });
    it("should resolve a claim's policy by the earlier quote step's zero-based index — policy 0 produces a claim result while preserving step result order", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "accident",
                damages: [{ itemType: "sword", amount: 500 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("should maintain independent caps for policies created by different quote-step indices — exhausting policy 0 leaves policy 1's full cap unchanged", () => {
      const result = processScenarioWithIndependentPolicyCaps({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "exhaust sword policy",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "claim against untouched amulet policy",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { premium: 71 },
        { payout: 2000, remainingCap: 0 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
  });

  describe("rounding", () => {
    it("should round a final premium of 197.5 G upward in MHPCO's favor — premium is 198 G", () => {
      expect(roundPremiumInFavor(197.5)).toBe(198);
    });
    it("should round a final payout of 350.5 G downward in MHPCO's favor — payout is 350 G", () => {
      expect(roundPayoutInFavor(350.5)).toBe(350);
    });
    it("should retain fractional intermediate premium amounts and round only the final total — no modifier subtotal is independently rounded", () => {
      expect(calculatePremium([{ type: "rune" }], 2, true)).toBe(24);
    });
    it("should retain fractional intermediate payout amounts and round only the final payout — enchantment-8 damage of 901 G yields 450.5 - 100 = 350.5 and pays 350 G", () => {
      expect(
        calculateClaimPayout(
          { type: "sword", material: "steel", enchantment: 8 },
          901,
        ),
      ).toBe(350);
    });
  });

  describe("validation", () => {
    it("should reject an unknown quoted item type such as broomstick — CLI exits non-zero, writes an error to stderr, and writes no results to stdout", () => {
      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject damage to a known but uninsured item type — amulet damage on a sword-only policy exits non-zero and writes an error to stderr", () => {
      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "amulet damage",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject an unknown damaged item type — claim exits non-zero and writes an error to stderr", () => {
      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "unknown item damage",
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject more damage entries of a type than the policy covers — two sword damages on a one-sword policy reject the whole claim with a non-zero exit", () => {
      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "two damages to one insured sword",
                damages: [
                  { itemType: "sword", amount: 200 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject a negative damage amount — amount -200 exits non-zero and writes an error to stderr", () => {
      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "negative damage",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject a claim policy index that does not identify an earlier quote step — an out-of-range, future, or claim-step index exits non-zero with an error", () => {
      const invalidPolicyScenarios = [
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 99,
              incident: {
                cause: "out-of-range policy",
                damages: [{ itemType: "sword", amount: 200 }],
              },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 1,
              incident: {
                cause: "future policy",
                damages: [{ itemType: "sword", amount: 200 }],
              },
            },
            { op: "quote", items: [{ type: "sword" }] },
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
                cause: "first claim",
                damages: [{ itemType: "sword", amount: 200 }],
              },
            },
            {
              op: "claim",
              policy: 1,
              incident: {
                cause: "claim-step policy",
                damages: [{ itemType: "sword", amount: 200 }],
              },
            },
          ],
        },
      ];

      for (const scenario of invalidPolicyScenarios) {
        const result = runClaimOfficeCli(JSON.stringify(scenario));
        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }
    });
    it("should reject malformed JSON input — CLI exits non-zero, reports an error on stderr, and emits no results object", () => {
      const result = runClaimOfficeCli("{");

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should require the top-level customer object with integer yearsWithMHPCO and the steps array — schema violations exit non-zero with an error", () => {
      const invalidScenarios = [
        { steps: [] },
        { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
        { customer: { yearsWithMHPCO: 0 } },
      ];

      for (const scenario of invalidScenarios) {
        const result = runClaimOfficeCli(JSON.stringify(scenario));
        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }
    });
    it("should require every quote to use op 'quote' and an items array whose objects have string type — missing or wrongly typed binding fields exit non-zero", () => {
      const invalidScenarios = [
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ items: [] }],
        },
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
          steps: [{ op: "quote", items: [{ type: 42 }] }],
        },
      ];

      for (const scenario of invalidScenarios) {
        const result = runClaimOfficeCli(JSON.stringify(scenario));
        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }
    });
    it("should validate optional quote fields by their binding types — material must be string, enchantment integer, and cursed boolean when present", () => {
      const invalidScenarios = [
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", material: 42 }] }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", enchantment: 1.5 }] }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "sword", cursed: "yes" }] }],
        },
      ];

      for (const scenario of invalidScenarios) {
        const result = runClaimOfficeCli(JSON.stringify(scenario));
        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }

      const validResult = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: true },
              ],
            },
          ],
        }),
      );
      expect(validResult.status).toBe(0);
    });
    it("should require every claim to use op 'claim', an integer policy, and an incident object containing string cause and damages array — schema violations exit non-zero", () => {
      const invalidScenarios = [
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              policy: 0,
              incident: { cause: "accident", damages: [] },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0.5,
              incident: { cause: "accident", damages: [] },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "claim", policy: 0 }],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0,
              incident: { cause: 42, damages: [] },
            },
          ],
        },
        {
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0,
              incident: { cause: "accident" },
            },
          ],
        },
      ];

      for (const scenario of invalidScenarios) {
        const result = runClaimOfficeCli(JSON.stringify(scenario));
        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }
    });
    it("should require every damage object to contain string itemType and integer amount — missing or wrongly typed binding fields exit non-zero", () => {
      const invalidDamages = [
        { amount: 200 },
        { itemType: 42, amount: 200 },
        { itemType: "sword" },
        { itemType: "sword", amount: 1.5 },
      ];

      for (const damage of invalidDamages) {
        const result = runClaimOfficeCli(
          JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [
              { op: "quote", items: [{ type: "sword" }] },
              {
                op: "claim",
                policy: 0,
                incident: { cause: "invalid damage", damages: [damage] },
              },
            ],
          }),
        );

        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
        expect(result.stdout).toBe("");
      }
    });
    it("should reject an operation other than quote or claim — CLI exits non-zero and reports an error on stderr", () => {
      expect(isSupportedOperation("refund")).toBe(false);

      const result = runClaimOfficeCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "refund", items: [] }],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
  });

  describe("CLI schema and integration", () => {
    it("should read one scenario JSON document from stdin and write only one JSON document to stdout from src/cli.ts", () => {
      const result = runClaimOfficeCliProcess(
        JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }),
      );

      expect(result.status).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toBe(JSON.stringify({ results: [] }));
    });
    it("should emit a results array with exactly the same length and order as input steps — quote results contain integer premium and claim results contain integer payout and remainingCap", () => {
      const result = processScenarioResults({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 200, remainingCap: 1800 },
      ]);
      expect(result.results).toHaveLength(2);
      expect(Number.isInteger(result.results[0].premium)).toBe(true);
      expect(Number.isInteger(result.results[1].payout)).toBe(true);
      expect(Number.isInteger(result.results[1].remainingCap)).toBe(true);
    });
    it("should preserve the normative field names exactly — customer.yearsWithMHPCO, steps, op, items, type, material, enchantment, cursed, policy, incident.cause, damages, itemType, amount, results, premium, payout, and remainingCap", () => {
      expect(getNormativeFieldNames()).toEqual([
        "customer.yearsWithMHPCO",
        "steps",
        "op",
        "items",
        "type",
        "material",
        "enchantment",
        "cursed",
        "policy",
        "incident.cause",
        "damages",
        "itemType",
        "amount",
        "results",
        "premium",
        "payout",
        "remainingCap",
      ]);
    });
    it("should process the normative schema example sequentially — a 5-year customer's amulet quote is 59 G, then 200 G damage pays 100 G and leaves 1100 G cap, yielding results [{premium:59},{payout:100,remainingCap:1100}]", () => {
      expect(
        processNormativeSchemaExample({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            { op: "quote", items: [{ type: "amulet" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "damage",
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
});
